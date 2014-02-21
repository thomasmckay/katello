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

module Katello
  class Api::V2::RbacsController < Api::V2::ApiController

    before_filter :authorize

    def rules
      {
        :index => lambda {true}
      }
    end

    def index
      results = ::Role.search_for(*search_options).paginate(paginate_options).collect

      roles = {
        :results => results,
        :subtotal => results.count,
        :total => results.count,
        :page => 1,
        :per_page => results.count
      }

      respond_for_index(:collection => roles)
    end

  end
end
