object @activation_key

extends 'katello/api/v2/common/identifier'

extends 'katello/api/v2/common/org_reference'

attributes :content_view, :content_view_id
child :environment => :environment do
  extends 'katello/api/v2/environments/show'
end
attributes :environment_id

attributes :usage_count, :user_id, :usage_limit, :pools, :system_template_id

node :permissions do |activation_key|
  {
    :edit => User.current.can?(:edit_activation_keys, activation_key),
    :delete => User.current.can?(:delete_activation_keys, activation_key),
    :create => User.current.can?(:create_activation_keys, activation_key)
  }
end

extends 'katello/api/v2/common/timestamps'
