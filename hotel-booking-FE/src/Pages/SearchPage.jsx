import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeLayout from "../core/layout/HomeLayout";
import HotelDesc from "../components/HotelDesc/HotelDesc";
import useQuery from "../core/hooks/useQuery";
import qs from "query-string";
import { Content } from "antd/lib/layout/layout";
import Filter from "../components/Filter/Filter";
import { Col, Pagination, Row } from "antd";

const SearchPage = () => {
  const [currPage, setCurrPage] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(true); // 👈 thêm state hiển thị filter

  const location = useLocation();
  const query = useQuery();

  useEffect(() => {
    const pageFromQuery = parseInt(query.page) || 1;
    setCurrPage(pageFromQuery);

    const fetchHotels = async () => {
      setLoading(true);
      try {
        console.log("location-search(SearchPage): ", location?.search);

        const res = await fetch(
          `http://localhost:8080/api/user/public/hotels/filter?${location?.search}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error("Fetch thất bại");
        const data = await res.json();
        console.log("SearchPage) search-hotel:", data.content);

        setHotels(data?.content || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [location.search]);

  const onShowSizeChange = (page) => {
    setCurrPage(page);
  };

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleFilterChange = async (filters) => {
    const queryString = qs.stringify(filters);
    const res = await fetch(
      `http://localhost:8080/api/user/public/hotels/filter?${queryString}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();
    setHotels(data?.content || []);
  }
  return (
    <HomeLayout>
      <Content className="max-w-6xl min-h-screen mx-auto mt-10">
        <Row gutter={[16, 16]}>
          {/* FILTER */}
          {showFilter && (
            <Col span={6} className="transition-all duration-500 ease-in-out">
              <Filter toggleFilter={toggleFilter} showFilter={showFilter} 
                onFilterChange = {handleFilterChange}
              />
            </Col>
          )}

          {/* HOTEL LIST */}
          <Col
            span={showFilter ? 18 : 24}
            className="transition-all duration-500 ease-in-out"
          >
            <div className="flex justify-end mb-3 mt-10">
              {/* Nút ẩn/hiện filter */}
              {!showFilter && (
                <button
                  onClick={toggleFilter}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Hiện bộ lọc
                </button>
              )}
            </div>

            <Row>
              <div className="max-w-6xl mx-auto py-10">
                <h2 className="text-2xl font-bold mb-6">Danh sách khách sạn</h2>
                {loading ? (
                  <p>Đang tải dữ liệu...</p>
                ) : hotels.length > 0 ? (
                  <div>
                    {hotels.map((hotel) => (
                      <Col span={24} key={hotel.hotelId}>
                        <HotelDesc hotelInfo={hotel} />
                      </Col>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Không tìm thấy khách sạn nào.</p>
                )}
              </div>
            </Row>
            <Row>
              <div className="flex w-full mt-8 items-center justify-center">
                <Pagination
                  defaultCurrent={1}
                  current={currPage}
                  total={hotels?.length || 1}
                  onChange={onShowSizeChange}
                />
              </div>
            </Row>
          </Col>
        </Row>
      </Content>
    </HomeLayout>
  );
};

export default SearchPage;
