#
# Copyright 2014 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Actions
  module Candlepin
    module Consumer
      class Create < Candlepin::Abstract
        input_format do
          param :cp_environment_id
          param :organization_label
          param :name
          param :cp_type
          param :facts
          param :installed_products
          param :autoheal
          param :release_ver
          param :service_level
          param :uuid
          param :capabilities
          param :activation_keys
        end

        def run
          output[:response] = @response
        end

        # In order to prevent creating content host activerecords that are not backed by candlepin
        # consumers, the creation in candlepin is done during the plan phase
        def plan(options)
          the_plan = super(options)
          @response = ::Katello::Resources::Candlepin::Consumer.
              create(options[:cp_environment_id],
                     options[:organization_label],
                     options[:name],
                     options[:cp_type],
                     options[:facts],
                     options[:installed_products],
                     options[:autoheal],
                     options[:release_ver],
                     options[:service_level],
                     options[:uuid],
                     options[:capabilities],
                     options[:activation_keys])
          the_plan
        end
      end
    end
  end
end
