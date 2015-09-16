module Katello
  module Candlepin
    class Consumer
      include LazyAccessor

      attr_accessor :uuid

      def initialize(uuid)
        self.uuid = uuid
      end

      def regenerate_identity_certificates
        Rails.logger.debug "Regenerating consumer identity certificates: #{name}"
        Resources::Candlepin::Consumer.regenerate_identity_certificates(self.uuid)
      rescue => e
        Rails.logger.debug e.backtrace.join("\n\t")
        raise e
      end

      def checkin(checkin_time)
        Resources::Candlepin::Consumer.checkin(self.uuid, checkin_time)
      end
    end
  end
end
