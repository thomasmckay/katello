class AddOrganizationDockerUnrestricted < ActiveRecord::Migration
  def change
    add_column :taxonomies, :docker_unrestricted, :boolean, :default => false, :null => false
  end
end
