object @role

attributes :id, :name

child :permissions => :permissions do
  extends 'katello/api/v2/rbacs/permission'
end