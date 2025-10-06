import { unwrapResult } from "@reduxjs/toolkit";
import { Col, Progress, Row, Select, Typography, Spin, Alert } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import OverviewCard from "../../components/OverviewCard/OverviewCard";
import DashboardLayout from "../../core/layout/Dashboard";
import { getStats } from "../../slices/booking.slice";
import { formatMoney } from "../../utils/helper";
import ChartView from "../ChartView";

const Overview = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);
  const hotelsFromProfile = profile?.hotels || (profile?.hotel ? [profile.hotel] : []);
  const isAdminMultiple = Array.isArray(hotelsFromProfile) && hotelsFromProfile.length > 1;

  const [stats, setStats] = useState({
    tickets: 0,
    paid: 0,
    totalprice: 0,
    // ... giả định backend trả thêm các trường cần cho ChartView
  });
  const [month, setMonth] = useState(new Date().getMonth() + 1); // mặc định tháng hiện tại
  const [selectedHotelId, setSelectedHotelId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveHotelId = useMemo(
    () => (selectedHotelId && selectedHotelId !== "all" ? selectedHotelId : undefined),
    [selectedHotelId]
  );

  useEffect(() => {
    const _getStats = async () => {
      setLoading(true);
      setError(null);
      const params = {
        month,
      };
      if (effectiveHotelId) {
        params.hotel_id = effectiveHotelId;
      }
      try {
        const _data = await dispatch(getStats({ params }));
        const res = unwrapResult(_data);
        // đảm bảo có fallback shape
        setStats({
          tickets: res.data.tickets ?? 0,
          paid: res.data.paid ?? 0,
          totalprice: res.data.totalprice ?? 0,
          ...res.data, // giữ lại các trường phụ nếu có (dành cho ChartView)
        });
      } catch (err) {
        setError("Không thể tải thống kê. Vui lòng thử lại."); // có thể trích chi tiết từ err nếu cần
      } finally {
        setLoading(false);
      }
    };
    _getStats();
  }, [month, effectiveHotelId, dispatch]);

  const handleMonthChange = (value) => {
    setMonth(value);
  };

  const handleHotelChange = (value) => {
    setSelectedHotelId(value);
  };

  const percentOfTicket =
    stats.tickets && stats.tickets > 0 ? (stats.paid / stats.tickets) * 100 : 0;

  return (
    <DashboardLayout>
      <Content className="max-w-6xl min-h-screen mx-auto mt-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <Select
                value={month}
                onChange={handleMonthChange}
                style={{ width: 140 }}
                placeholder={`Tháng ${month}`}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <Select.Option value={m} key={m}>
                    Tháng {m}
                  </Select.Option>
                ))}
              </Select>
            </div>
            {isAdminMultiple && (
              <div>
                <Select
                  value={selectedHotelId}
                  onChange={handleHotelChange}
                  style={{ width: 220 }}
                  placeholder="Chọn khách sạn"
                >
                  <Select.Option value="all">Tất cả khách sạn</Select.Option>
                  {hotelsFromProfile.map((h) => (
                    <Select.Option key={h.id} value={h.id}>
                      {h.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}
          </div>
          <div>
            <Typography.Title level={4} className="mb-0">
              Tổng quan {isAdminMultiple ? (selectedHotelId === "all" ? "(Tất cả khách sạn)" : "") : ""}
            </Typography.Title>
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} showIcon />
          </div>
        )}

        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <OverviewCard label="Vé được đặt" number={stats.tickets} />
            </Col>
            <Col xs={24} md={8}>
              <OverviewCard
                label="Doanh thu"
                number={`${formatMoney(stats.totalprice)} VND`}
              />
            </Col>
            <Col xs={24} md={8}>
              <div
                style={{ background: "#fe843d30" }}
                className="gutter-row rounded-xl shadow-lg h-48 items-center flex justify-center"
              >
                <div className="flex flex-col items-center">
                  <Progress
                    type="circle"
                    strokeColor="#fe843d"
                    percent={+percentOfTicket.toFixed(1)}
                  />
                  <Typography.Text className="mt-2 font-semibold text-xl">
                    Tỉ lệ phòng đặt thành công
                  </Typography.Text>
                </div>
              </div>
            </Col>
          </Row>

          <div className="mt-8">
            <ChartView stats={stats} month={month} hotelId={effectiveHotelId} />
          </div>
        </Spin>
      </Content>
    </DashboardLayout>
  );
};

export default Overview;
