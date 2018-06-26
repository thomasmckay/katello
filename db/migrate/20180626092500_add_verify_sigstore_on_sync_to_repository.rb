class AddVerifySigstoreOnSyncToRepository < ActiveRecord::Migration[5.1]
  def up
    add_column :katello_repositories, :verify_sigstore_on_sync, :boolean, :null => false, :default => true
  end

  def down
    remove_column :katello_repositories, :verify_sigstore_on_sync
  end
end
