import { Col, Progress, Row, Select, Typography, Spin, Alert } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import OverviewCard from "../../components/OverviewCard/OverviewCard";
import DashboardLayout from "../../core/layout/Dashboard";
import { formatMoney } from "../../utils/helper";
import ChartView from "../ChartView";

const Overview = () => {
  const profile = useSelector((state) => state.auth.profile);
  const hotelsFromProfile =
    profile?.hotels || (profile?.hotel ? [profile.hotel] : []);
  const isAdminMultiple =
    Array.isArray(hotelsFromProfile) && hotelsFromProfile.length > 1;

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalRooms: 0,
    occupancyRate: 0,
    cancelledBookings: 0,
  });

  const [stats, setStats] = useState({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedHotelId, setSelectedHotelId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveHotelId = useMemo(
    () =>
      selectedHotelId && selectedHotelId !== "all"
        ? selectedHotelId
        : undefined,
    [selectedHotelId]
  );

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");

        const query = new URLSearchParams({
          month,
          ...(effectiveHotelId && { hotelId: effectiveHotelId }),
        }).toString();

        const response = await fetch(
          `http://localhost:8080/api/dashboard/owner/summary?${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard summary");
        }

        const data = await response.json();
        setSummary(data);

      } catch (e) {
        setError("Không thể tải dữ liệu tổng quan");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [month, effectiveHotelId]);

  return (
    <DashboardLayout>
      <Content className="max-w-6xl min-h-screen mx-auto mt-5">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Select
              value={month}
              onChange={setMonth}
              style={{ width: 140 }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <Select.Option value={m} key={m}>
                  Tháng {m}
                </Select.Option>
              ))}
            </Select>

            {isAdminMultiple && (
              <Select
                value={selectedHotelId}
                onChange={setSelectedHotelId}
                style={{ width: 220 }}
              >
                <Select.Option value="all">
                  Tất cả khách sạn
                </Select.Option>
                {hotelsFromProfile.map((h) => (
                  <Select.Option key={h.id} value={h.id}>
                    {h.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>

          <Typography.Title level={4} className="mb-0">
            Tổng quan
          </Typography.Title>
        </div>

        {error && <Alert type="error" message={error} showIcon />}

        <Spin spinning={loading}>
          {/* SUMMARY */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <OverviewCard
                label="Tổng booking"
                number={summary.totalBookings}
              />
            </Col>

            <Col xs={24} md={6}>
              <OverviewCard
                label="Doanh thu"
                number={`${formatMoney(summary.totalRevenue)} VND`}
              />
            </Col>

            <Col xs={24} md={6}>
              <OverviewCard
                label="Tổng phòng"
                number={summary.totalRooms}
              />
            </Col>

            <Col xs={24} md={6}>
              <div
                style={{ background: "#fe843d30" }}
                className="rounded-xl shadow-lg h-48 flex justify-center items-center"
              >
                <div className="flex flex-col items-center">
                  <Progress
                    type="circle"
                    percent={summary.occupancyRate}
                    strokeColor="#fe843d"
                  />
                  <Typography.Text className="mt-2 font-semibold text-center">
                    Tỉ lệ đặt phòng
                  </Typography.Text>
                </div>
              </div>
            </Col>
          </Row>

          {/* CHART */}
          <div className="mt-8">
            <ChartView
              stats={stats}
              month={month}
              hotelId={effectiveHotelId}
            />
          </div>
        </Spin>
      </Content>
    </DashboardLayout>
  );
};

export default Overview;
