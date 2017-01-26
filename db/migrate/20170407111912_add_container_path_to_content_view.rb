class AddContainerPathToContentView < ActiveRecord::Migration
  def change
    add_column :katello_content_views, :container_path, :text
  end
end
