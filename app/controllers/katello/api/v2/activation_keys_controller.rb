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
  class Api::V2::ActivationKeysController < Api::V2::ApiController

    before_filter :verify_presence_of_organization_or_environment, :only => [:index]
    before_filter :find_environment, :only => [:index, :create]
    before_filter :find_optional_organization, :only => [:index]
    before_filter :find_activation_key, :only => [:show]
    before_filter :authorize

    def rules
      read_test   = lambda do
        ActivationKey.readable?(@organization) ||
          (ActivationKey.readable?(@environment.organization) unless @environment.nil?)
      end
      manage_test = lambda do
        ActivationKey.manageable?(@organization) ||
          (ActivationKey.manageable?(@environment.organization) unless @environment.nil?)
      end
      {
        :index                => read_test,
        :show                 => read_test,
        :create               => manage_test
      }
    end


    api :GET, "/activation_keys", "List activation keys"
    api :GET, "/organizations/:organization_id/activation_keys"
    param_group :search, Api::V2::ApiController
    param :organization_id, :identifier, :desc => "organization identifier", :required => true
    param :name, String, :desc => "system group name to filter by"
    def index
      #filters = [:terms => {:id => SystemGroup.readable(@organization).pluck(:id)}]
      #filters = [:terms => {:id => ActivationKey.where(params.slice(:name, :organization_id,
      #                                                              :environment_id)).pluck(:id)}]
      filters = [:terms => {:id => ActivationKey.readable(@organization).pluck(:id)}]
      filters << {:term => {:name => params[:name].downcase}} if params[:name]

      options = {
          :filters       => filters,
          :load_records? => true
      }
      respond_for_index(:collection => item_search(ActivationKey, params, options))
    end

    api :POST, "/activation_keys", "Create an activation key"
    # TODO
    def create
      @activation_key = ActivationKey.create!(params[:activation_key]) do |activation_key|
        activation_key.environment = @environment
        activation_key.organization = @environment.organization
        activation_key.user = current_user
      end
      respond
    end

    api :GET, "/activation_keys/:id", "Show an activation key"
    # TODO
    def show
      respond
    end


    api :POST, "/activation_keys/:id/system_groups"
    def add_system_groups
      super
    end

    api :DELETE, "/activation_keys/:id/system_groups"
    def remove_system_groups
      super
    end

    private

    def find_environment
      return unless params.key?(:environment_id)

      @environment = KTEnvironment.find(params[:environment_id])
      fail HttpErrors::NotFound, _("Couldn't find environment '%s'") % params[:environment_id] if @environment.nil?
      @environment
    end

    def find_activation_key
      @activation_key = ActivationKey.find(params[:id])
      fail HttpErrors::NotFound, _("Couldn't find activation key '%s'") % params[:id] if @activation_key.nil?
      @activation_key
    end

    def find_pool
      @pool = Pool.find_by_organization_and_id(@activation_key.organization, params[:poolid])
    end

    def find_system_groups
      ids = params[:activation_key][:system_group_ids] if params[:activation_key]
      @system_groups = []
      if ids
        ids.each do |group_id|
          group = SystemGroup.find(group_id)
          fail HttpErrors::NotFound, _("Couldn't find system group '%s'") % group_id if group.nil?
          @system_groups << group
        end
      end
    end

    def verify_presence_of_organization_or_environment
      return if params.key?(:organization_id) || params.key?(:environment_id)
      fail HttpErrors::BadRequest, _("Either organization ID or environment ID needs to be specified")
    end
  end
end
