module Actions
  module Katello
    module Repository
      class AddDockerTag < Actions::EntryAction
        def plan(meta_docker_tag)
          meta_docker_tag.save!
          action_subject(meta_docker_tag)
        end
      end
    end
  end
end
