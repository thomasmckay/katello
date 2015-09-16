module Katello
  module Concerns
    module SubscriptionAspectHostExtensions
      extend ActiveSupport::Concern

      included do
        has_one :subscription_aspect, :class_name => '::Katello::Host::SubscriptionAspect', :foreign_key => :host_id, :inverse_of => :host, :dependent =>  :destroy
      end
    end
  end
end

class ::Host::Managed::Jail < Safemode::Jail
end
