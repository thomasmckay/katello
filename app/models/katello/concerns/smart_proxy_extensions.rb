module Katello
  module Concerns
    module SmartProxyExtensions
      extend ActiveSupport::Concern

      PULP_FEATURE = "Pulp".freeze
      PULP_NODE_FEATURE = "Pulp Node".freeze

      included do
        include ForemanTasks::Concerns::ActionSubject
        include LazyAccessor

        alias_method_chain :refresh, :puppet_path

        before_create :associate_organizations
        before_create :associate_default_location
        before_create :associate_lifecycle_environments

        lazy_accessor :pulp_repositories, :initializer => lambda { |_s| pulp_node.extensions.repository.retrieve_all }

        has_many :containers,
                 :class_name => "Container",
                 :foreign_key => :capsule_id,
                 :inverse_of => :capsule,
                 :dependent => :nullify

        has_many :capsule_lifecycle_environments,
                 :class_name  => "Katello::CapsuleLifecycleEnvironment",
                 :foreign_key => :capsule_id,
                 :dependent   => :destroy,
                 :inverse_of => :capsule

        has_many :lifecycle_environments,
                 :class_name => "Katello::KTEnvironment",
                 :through    => :capsule_lifecycle_environments,
                 :source     => :lifecycle_environment

        has_many :hosts,      :class_name => "::Host::Managed", :foreign_key => :content_source_id,
                              :inverse_of => :content_source
        has_many :hostgroups, :class_name => "::Hostgroup",     :foreign_key => :content_source_id,
                              :inverse_of => :content_source

        scope :with_content, -> { with_features(PULP_FEATURE, PULP_NODE_FEATURE) }

        def self.default_capsule
          with_features(PULP_FEATURE).first
        end
      end

      def puppet_path
        self[:puppet_path] || update_puppet_path
      end

      def update_puppet_path
        if has_feature?(PULP_FEATURE)
          path = ProxyAPI::Pulp.new(:url => self.url).capsule_puppet_path['puppet_content_dir']
        elsif has_feature?(PULP_NODE_FEATURE)
          path = ProxyAPI::PulpNode.new(:url => self.url).capsule_puppet_path['puppet_content_dir']
        end
        self.update_attribute(:puppet_path, path)
        path
      end

      def refresh_with_puppet_path
        errors = refresh_without_puppet_path
        update_puppet_path
        errors
      end

      def pulp_node
        @pulp_node ||= Katello::Pulp::Server.config(pulp_url, User.remote_user)
      end

      def pulp_url
        "#{url}/pulp/api/v2/"
      end

      def default_capsule?
        # use map instead of pluck in case the features aren't saved yet during create
        self.features.map(&:name).include?(PULP_FEATURE)
      end

      def associate_organizations
        self.organizations = Organization.all if self.default_capsule?
      end

      def associate_default_location
        if self.default_capsule?
          default_location = Location.default_location
          if default_location && !self.locations.include?(default_location)
            self.locations << default_location
          end
        end
      end

      def associate_lifecycle_environments
        self.lifecycle_environments = Katello::KTEnvironment.all if self.default_capsule?
      end
    end
  end
end

class ::SmartProxy::Jail < Safemode::Jail
  allow :hostname
end
