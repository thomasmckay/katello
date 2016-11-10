object @organization

extends "api/v2/taxonomies/show"

attributes :task_id, :label, :owner_details, :redhat_repository_url, :docker_unrestricted

attributes :service_levels, :service_level if ::SETTINGS[:katello][:use_cp]

node :default_content_view_id do |org|
  org.default_content_view.id
end

node :library_id do |org|
  org.library.id
end
