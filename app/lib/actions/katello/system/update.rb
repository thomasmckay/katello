module Actions
  module Katello
    module System
      class Update < Actions::EntryAction
        middleware.use ::Actions::Middleware::RemoteAction

        def plan(system, sys_params)
          system.disable_auto_reindex!
          action_subject system
          system.update_attributes!(sys_params)
          if system.foreman_host.content_aspect
            system.foreman_host.content_aspect.content_view = system.content_view
            system.foreman_host.content_aspect.lifecycle_environment = system.environment
          end

          if system.foreman_host.subscription_aspect
            system.foreman_host.subscription_aspect.service_level = system.serviceLevel
            system.foreman_host.subscription_aspect.autoheal = system.autoheal
          end

          plan_action(::Actions::Katello::Host::Update, system.foreman_host)
        end
      end
    end
  end
end
