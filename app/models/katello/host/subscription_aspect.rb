module Katello
  module Host
    class SubscriptionAspect < Katello::Model
      self.table_name = 'katello_subscription_aspects'
      belongs_to :host, :inverse_of => :subscription_aspect, :class_name => "::Host::Managed"

      has_many :activation_keys, :through => :subscription_aspect_activation_keys, :class_name => "Katello::ActivationKey"
      has_many :subscription_aspect_activation_keys, :class_name => "Katello::SubscriptionAspectActivationKey", :dependent => :destroy, :inverse_of => :subscription_aspect

      def update_from_consumer_attributes(consumer_params)
        self.autoheal = consumer_params['autoheal'] unless consumer_params['autoheal'].blank?
        self.service_level = consumer_params['serviceLevel'] unless consumer_params['serviceLevel'].blank?
        self.release_version = consumer_params['releaseVer'] unless consumer_params['releaseVer'].blank?
        self.last_checkin = consumer_params['lastCheckin'] unless consumer_params['lastCheckin'].blank?
      end

      def consumer_attributes
        {
          :autoheal => autoheal,
          :serviceLevel => service_level,
          :release_version => release_version,
          :lastCheckin => last_checkin,
          :environment => {:id => self.candlepin_environment_id}
        }
      end

      def candlepin_environment_id
        if self.host.content_aspect
          self.host.content_aspect.content_view.cp_environment_id(self.host.content_aspect.lifecycle_environment)
        else
          self.host.organization.default_content_view.cp_environment_id(self.host.organization.library)
        end
      end
    end
  end
end
