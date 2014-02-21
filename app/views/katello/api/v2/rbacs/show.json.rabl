object @role

attributes :id, :name

attributes :resource_types => @resource_types

child :filters => :filters do
  extends 'katello/api/v2/rbacs/filter'
end