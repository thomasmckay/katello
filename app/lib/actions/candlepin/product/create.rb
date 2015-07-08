module Actions
  module Candlepin
    module Product
      class Create < Candlepin::Abstract
        input_format do
          param :owner_key, String
          param :name, String
          param :multiplier
          param :attributes
        end

        def run
          output[:response] = ::Katello::Resources::Candlepin::Product.create(input[:owner_key],
              { :name => input[:name], :multiplier => input[:multiplier], :attributes => input[:attributes] })
        end
      end
    end
  end
end
