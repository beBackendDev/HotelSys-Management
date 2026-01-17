import { Col, Progress, Row, Select, Typography, Spin, Alert, Card, Tag } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import OverviewCard from "../../components/OverviewCard/OverviewCard";
import DashboardLayout from "../../core/layout/Dashboard";
import { formatMoney } from "../../utils/helper";
import ChartView from "../ChartView";
import TrendingRoomCard from "./Overview/TrendingRoomCard";
import DailyRevenueChart from "./Overview/DailyRevenueChart";
import moment from "moment";

const Overview = () => {
  const profile = useSelector((state) => state.auth.profile);
  const user = profile?.user;
  const role = (user?.role || "").toUpperCase();
  const isAdmin = role === "ADMIN";
  const isOwner = role === "OWNER";

  const hotelsFromProfile =
    profile?.hotels || (profile?.hotel ? [profile.hotel] : []);
  const isAdminMultiple =
    Array.isArray(hotelsFromProfile) && hotelsFromProfile.length > 1;

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalRooms: 0,
    totalHotels: 0,
    totalUsers: 0,
    totalOwners: 0,
    occupancyRate: 0,
    revenueGrowthRate: 0,
    cancelledBookings: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedHotelId, setSelectedHotelId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine API base path based on role
  const apiBasePath = useMemo(() => {
    return isAdmin ? "/api/dashboard/admin" : "/api/dashboard/owner";
  }, [isAdmin]);

  // Format chart data
  const formattedData = Array.isArray(chartData)
    ? chartData.map((item) => ({
        date: moment(item.date).format("DD/MM"),
        revenue: item.revenue || item.totalRevenue || 0,
        booking: item.bookingCount || item.totalBooking || 0,
      }))
    : [];

  const effectiveHotelId = useMemo(
    () =>
      !isAdmin && selectedHotelId && selectedHotelId !== "all"
        ? selectedHotelId
        : undefined,
    [selectedHotelId, isAdmin]
  );

  // Fetch daily revenue
  useEffect(() => {
    const fetchDailyRevenue = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const query = new URLSearchParams({
          month,
          year,
          ...(effectiveHotelId && { hotelId: effectiveHotelId }),
        }).toString();

        const res = await fetch(
          `http://localhost:8080${apiBasePath}/daily-revenue?${query}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch daily revenue");
        const data = await res.json();
        setChartData(data);
      } catch (e) {
        console.error(e);
        setError("Không thể tải dữ liệu chart");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyRevenue();
  }, [month, year, effectiveHotelId, apiBasePath]);

  // Fetch summary
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const query = new URLSearchParams({
          month,
          year,
          ...(effectiveHotelId && { hotelId: effectiveHotelId }),
        }).toString();

        const res = await fetch(
          `http://localhost:8080${apiBasePath}/summary?${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch summary");
        const data = await res.json();
        console.log("summary: ", data);
        
        setSummary(data);
      } catch (e) {
        console.error(e);
        setError("Không thể tải dữ liệu tổng quan");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [month, effectiveHotelId, apiBasePath]);

  // Fetch trending data (rooms for owner, hotels for admin)
  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const endpoint = isAdmin ? "trending-hotels" : "trending-rooms";
        const query = new URLSearchParams({
          month,
          year,
          ...(effectiveHotelId && { hotelId: effectiveHotelId }),
          limit: 5,
        }).toString();

        const res = await fetch(
          `http://localhost:8080${apiBasePath}/${endpoint}?${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch trending data");
        const data = await res.json();
        setTrendingData(data);
      } catch (e) {
        console.error("Fetch trending data failed", e);
      }
    };

    fetchTrendingData();
  }, [month, effectiveHotelId, apiBasePath, isAdmin]);

  return (
    <DashboardLayout>
      <Content style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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

              <Select
                value={year}
                onChange={setYear}
                style={{ width: 140 }}
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <Select.Option value={y} key={y}>
                    Năm {y}
                  </Select.Option>
                ))}
              </Select>

              {!isAdmin && isAdminMultiple && (
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

            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "#000" }}>
              {isAdmin ? "Tổng quan hệ thống" : "Tổng quan khách sạn"}
            </h1>
          </div>

          {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 20 }} />}

          <Spin spinning={loading}>
            {/* SUMMARY CARDS */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {/* Doanh thu */}
              <Col xs={24} sm={12} md={6}>
                <OverviewCard
                  label="Tổng doanh thu"
                  number={`${formatMoney(summary.totalRevenue || 0)} VND`}
                  suffix={`${summary.revenueGrowthRate > 0 ? "↑" : "↓"} ${Math.abs(summary.revenueGrowthRate || 0).toFixed(2)}%`}
                  suffixColor={summary.revenueGrowthRate > 0 ? "#52c41a" : "#ff4d4f"}
                />
              </Col>

              {/* Booking */}
              <Col xs={24} sm={12} md={6}>
                <OverviewCard
                  label="Tổng booking"
                  number={summary.totalBookings || 0}
                />
              </Col>

              {/* Phòng */}
              <Col xs={24} sm={12} md={6}>
                <OverviewCard
                  label={isAdmin ? "Tổng phòng" : "Tổng phòng"}
                  number={summary.totalRooms || 0}
                />
              </Col>

              {/* Occupancy Rate */}
              <Col xs={24} sm={12} md={6}>
                <Card style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <Progress
                      type="circle"
                      percent={Math.round((summary.occupancyRate || 0) * 100) / 100}
                      strokeColor="#fe843d"
                    />
                    <Typography.Text style={{ display: "block", marginTop: 12, fontWeight: 600 }}>
                      Tỉ lệ đặt phòng
                    </Typography.Text>
                  </div>
                </Card>
              </Col>

              {/* Admin only stats */}
              {isAdmin && (
                <>
                  <Col xs={24} sm={12} md={6}>
                    <OverviewCard
                      label="Tổng khách sạn"
                      number={summary.totalHotels || 0}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6}>
                    <OverviewCard
                      label="Tổng người dùng"
                      number={summary.totalUsers || 0}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6}>
                    <OverviewCard
                      label="Chủ sở hữu"
                      number={summary.totalOwners || 0}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6}>
                    <OverviewCard
                      label="Booking bị hủy"
                      number={summary.cancelledBookings || 0}
                      numberColor="#ff4d4f"
                    />
                  </Col>
                </>
              )}

              {!isAdmin && (
                <Col xs={24} sm={12} md={6}>
                  <OverviewCard
                    label="Booking bị hủy"
                    number={summary.cancelledBookings || 0}
                    numberColor="#ff4d4f"
                  />
                </Col>
              )}
            </Row>

            {/* CHARTS & TRENDING */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {/* Daily Revenue Chart */}
              <Col xs={24} lg={16}>
                <DailyRevenueChart
                  data={formattedData}
                  month={month}
                  hotelId={effectiveHotelId}
                />
              </Col>

              {/* Trending Section */}
              <Col xs={24} lg={8}>
                <Card>
                  <h3 style={{ marginTop: 0, marginBottom: 16 }}>
                    🔥 {isAdmin ? "Khách sạn" : "Phòng"} được đặt nhiều nhất
                  </h3>

                  {trendingData.length === 0 ? (
                    <Typography.Text type="secondary">
                      Chưa có dữ liệu
                    </Typography.Text>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {trendingData.map((item, index) => (
                        <Card
                          key={isAdmin ? item.hotelId : item.roomId}
                          size="small"
                          style={{ backgroundColor: "#f9f9f9" }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                            <div>
                              <Tag color="blue" style={{ marginBottom: 8 }}>
                                #{item.rank || index + 1}
                              </Tag>
                              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                                {isAdmin ? item.hotelName : item.roomName}
                              </h4>
                              {isAdmin && (
                                <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#666" }}>
                                  Chủ: {item.ownerName}
                                </p>
                              )}
                              {!isAdmin && (
                                <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#666" }}>
                                  {item.hotelName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                            <div>
                              <span style={{ color: "#999" }}>Booking</span>
                              <p style={{ margin: "4px 0 0 0", fontWeight: 600 }}>
                                {item.bookingCount}
                              </p>
                            </div>
                            <div>
                              <span style={{ color: "#999" }}>Doanh thu</span>
                              <p style={{ margin: "4px 0 0 0", fontWeight: 600 }}>
                                {formatMoney(item.revenue || 0)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              </Col>
            </Row>

            {/* Additional Charts */}
            <ChartView
              month={month}
              year={year}
              hotelId={effectiveHotelId}
              isAdmin={isAdmin}
            />
          </Spin>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default Overview;