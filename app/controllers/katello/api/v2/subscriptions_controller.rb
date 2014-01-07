#
# Copyright 2013 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Katello
class Api::V2::SubscriptionsController < Api::V2::ApiController
  include ConsumersControllerLogic

  before_filter :find_activation_key
  before_filter :find_system
  before_filter :find_organization, :only => [:index, :show, :upload]
  before_filter :find_subscription, :only => [:show]
  before_filter :find_provider
  before_filter :authorize

  before_filter :load_search_service, :only => [:index, :available]

  resource_description do
    description "Subscriptions management."
    param :system_id, :identifier, :desc => "System uuid", :required => true

    api_version 'v2'
  end

  def rules
    read_test = lambda do
      return @system.readable? if @system
      return ActivationKey.readable?(@activation_key.organization) if @activation_key
      @provider.readable?
    end
    available_test = lambda { Organization.any_readable? }
    system_modification_test = lambda { @system.editable? }
    edit_test = lambda { @provider.editable? }

    {
      :index => read_test,
      :show => read_test,
      :create => system_modification_test,
      :destroy => system_modification_test,
      :destroy_all => system_modification_test,
      :available => available_test,
      :upload => edit_test
    }
  end

  api :GET, "/systems/:system_id/subscriptions", "List a system's subscriptions"
  api :GET, "/organization/:organization_id/subscriptions", "List organization subscriptions"
  api :GET, "/activation_keys/:activation_key_id/subscriptions", "List an activation key's subscriptions"
  param :system_id, String, :desc => "UUID of the system", :required => false
  param :activation_key_id, String, :desc => "Activation key ID", :required => false
  param :organization_id, :identifier, :desc => "Organization ID", :required => false
  # rubocop:disable SymbolName
  def index
    filters = []

    if @system
      subs = @system.consumed_entitlements
      subscriptions = {
          :subscriptions => subs,
          :subtotal => subs.count,
          :total => subs.count
      }
      # TODO: just get subs like act key does below
      respond(:collection => subscriptions) and return
    elsif @activation_key
      @organization = @activation_key.organization
      subscriptions = activation_key_subscriptions(@activation_key.get_key_pools)
      filters << {:terms => {:cp_id => subscriptions.collect(&:cp_id)}}
    end

    # Limit subscriptions to current org and Red Hat provider
    filters << {:term => {:org => [@organization.label]}}
    filters << {:term => {:provider_id => [@organization.redhat_provider.id]}}

    options = {
        :filters => filters,
        :load_records? => false,
        :default_field => :productName
    }

    # TODO: remove this fragile logic
    # Without any search terms, reindex all subscriptions in elasticsearch. This is to ensure
    # that the latest information is searchable.
    if params[:offset].to_i == 0 && params[:search].blank?
      @organization.redhat_provider.index_subscriptions
    end

    subscriptions = item_search(Pool, params, options)

    respond(:collection => subscriptions)
  end

  api :GET, "/organizations/:organization_id/subscriptions/:id", "Show a subscription"
  param :organization_id, :number, :desc => "Organization identifier", :required => true
  param :id, :number, :desc => "Subscription identifier", :required => true
  def show
    respond :resource => @subscription
  end

  api :GET, "/systems/:system_id/subscriptions/available", "List available subscriptions"
  param :system_id, String, :desc => "UUID of the system", :required => true
  param :match_system, :bool, :desc => "Return subscriptions that match system"
  param :match_installed, :bool, :desc => "Return subscriptions that match installed"
  param :no_overlap, :bool, :desc => "Return subscriptions that don't overlap"
  def available
    filters = []

    if @system
      params[:match_system] = params[:match_system].to_bool if params[:match_system]
      params[:match_installed] = params[:match_installed].to_bool if params[:match_installed]
      params[:no_overlap] = params[:no_overlap].to_bool if params[:no_overlap]
      pools = @system.filtered_pools(params[:match_system], params[:match_installed],
                                     params[:no_overlap])
      available = available_subscriptions(pools, @system.organization)

      collection = {
          :results => available,
          :subtotal => available.count,
          :total => available.count
      }

      # TODO: fall through to below instead
      respond_for_index(:collection => collection, :template => :index) and return
    elsif @activation_key
      @organization = @activation_key.organization
      subscriptions = activation_key_subscriptions(@activation_key.get_pools)
      filters << {:terms => {:cp_id => subscriptions.collect(&:cp_id)}}
    else
      # TODO: perhaps /organizations/:organization_id/available to return just subs w/ unused quantity?
      # TODO: or just those w/ repos enabled?  (eg. sub-mgr list --available)
    end

    # Limit subscriptions to current org and Red Hat provider
    filters << {:term => {:org => [@organization.label]}}
    filters << {:term => {:provider_id => [@organization.redhat_provider.id]}}

    options = {
        :filters => filters,
        :load_records? => false,
        :default_field => :productName
    }

    # TODO: remove this fragile logic
    # Without any search terms, reindex all subscriptions in elasticsearch. This is to ensure
    # that the latest information is searchable.
    if params[:offset].to_i == 0 && params[:search].blank?
      @organization.redhat_provider.index_subscriptions
    end

    subscriptions = item_search(Pool, params, options)

    respond_for_index(:collection => subscriptions, :template => 'index')
  end

  api :POST, "/systems/:system_id/subscriptions", "Create a subscription"
  param :system_id, String, :desc => "UUID of the system", :required => true
  param :subscription, Hash, :required => true, :action_aware => true do
    param :pool, String, :desc => "Subscription Pool uuid", :required => true
    param :quantity, :number, :desc => "Number of subscription to use", :required => true
  end
  def create
    expected_params = params.slice(:pool, :quantity)
    fail HttpErrors::BadRequest, _("Please provide pool and quantity") if expected_params.count != 2
    @system.subscribe(expected_params[:pool], expected_params[:quantity])
    respond :resource => @system
  end

  api :DELETE, "/systems/:system_id/subscriptions/:id", "Delete a subscription"
  param :id, :number, :desc => "Entitlement id"
  param :system_id, String, :desc => "UUID of the system", :required => true
  def destroy
    expected_params = params.slice(:id)
    fail HttpErrors::BadRequest, _("Please provide subscription ID") if expected_params.count != 1
    @system.unsubscribe(expected_params[:id])
    respond_for_show :resource => @system
  end

  api :DELETE, "/systems/:system_id/subscriptions", "Delete all system subscriptions"
  param :system_id, String, :desc => "UUID of the system", :required => true
  def destroy_all
    @system.unsubscribe_all
    respond_for_show :resource => @system
  end

  api :POST, "/organizations/:organization_id/subscriptions/upload", "Upload a subscription manifest"
  param :organization_id, :identifier, :desc => "Organization id", :required => true
  def upload
    begin
      # candlepin requires that the file has a zip file extension
      temp_file = File.new(File.join("#{Rails.root}/tmp", "import_#{SecureRandom.hex(10)}.zip"), 'wb+', 0600)
      temp_file.write params[:content].read
    ensure
      temp_file.close
    end

    @provider.import_manifest(File.expand_path(temp_file.path), :force => false,
                              :async => false, :notify => false)

    collection = {
      :results => @organization.pools,
      :subtotal => @organization.pools.count,
      :total => @organization.pools.count
    }
    respond_for_index(:collection => collection, :template => :index)
  end

  protected

  def find_system
    @system = System.find_by_uuid!(params[:system_id]) if params[:system_id]
  end

  def find_activation_key
    @activation_key = ActivationKey.find_by_id!(params[:activation_key_id]) if params[:activation_key_id]
  end

  def find_provider
    @provider = @organization.redhat_provider if @organization
  end

  def find_subscription
    @subscription = Pool.find_by_organization_and_id!(@organization, params[:id])
  end

  def activation_key_subscriptions(cp_pools)

    all_subscriptions = {}

    if cp_pools
      pools = cp_pools.collect{|cp_pool| Pool.find_pool(cp_pool['id'], cp_pool)}

      subscriptions = pools.collect do |pool|
        product = Product.where(:cp_id => pool.product_id).first
        next if product.nil?
        pool.provider_id = product.provider_id
        pool
      end
      subscriptions.compact!
    else
      subscriptions = []
    end

    return subscriptions

    # TODO
    subscriptions.each do |subscription|
      all_subscriptions[subscription.cp_id] = subscription if !all_subscriptions.include? subscription
    end

    all_subscriptions
  end

end
end
