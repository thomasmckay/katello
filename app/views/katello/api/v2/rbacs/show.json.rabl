object @role

attributes :id, :name

node :resource_types do
     @resource_types
end

child :filters => :filters do
  extends 'katello/api/v2/rbacs/filter'
end