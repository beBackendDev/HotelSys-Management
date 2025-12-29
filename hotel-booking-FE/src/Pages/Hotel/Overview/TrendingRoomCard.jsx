import { Card, Typography, Tag } from "antd";
import { formatMoney } from "../../../utils/helper";

const { Text } = Typography;

const TrendingRoomCard = ({ room }) => {
  return (
    <Card className="rounded-xl shadow-sm mb-3">
      <div className="flex justify-between items-center">
        <div>
          <Text strong>
            #{room.rank} {room.roomName}
          </Text>
          <div className="text-gray-500 text-sm">
            {room.hotelName}
          </div>
        </div>

        <Tag color="orange">
          {formatMoney(room.revenue)} VND
        </Tag>
      </div>

      <div className="flex gap-4 mt-2 text-sm">
        <span>📌 {room.bookingCount} lượt đặt</span>
        <span>🌙 {room.bookedNights} đêm</span>
      </div>
    </Card>
  );
};

export default TrendingRoomCard;
