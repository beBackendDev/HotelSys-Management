import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeLayout from "../core/layout/HomeLayout";
import HotelDesc from "../components/HotelDesc/HotelDesc";
import useQuery from "../core/hooks/useQuery";
import { Content } from "antd/lib/layout/layout";
import Filter from "../components/Filter/Filter";
import { Col, Pagination, Row } from "antd";

const SearchPage = () => {
  const [currPage, setCurrPage] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = useQuery();

  useEffect(() => {
    const pageFromQuery = parseInt(query.page) || 1;
    setCurrPage(pageFromQuery);


    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/user/public/hotels/filter?${location.search}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Fetch thất bại");
        const data = await res.json();
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
    const updatedQuery = {
      ...query,
      page,
    };
  };
  return (
    <HomeLayout>
      <Content className="max-w-6xl min-h-screen mx-auto mt-5">
        <Row gutter={[16, 16]}>
          {/* filter col */}
          <Col span={6}>
            {/* <Filter filters={filters} /> */}
            <Filter />
          </Col>
          {/* hotels col */}
          <Col span={18}>
            <Row>
              <div className="max-w-6xl mx-auto py-10">
                <h2 className="text-2xl font-bold mb-6">Kết quả tìm kiếm</h2>
                {loading ? (
                  <p>Đang tải dữ liệu...</p>
                ) : hotels.length > 0 ? (
                  <div >
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
                  total={hotels?.length || 1} // Hoặc cập nhật thêm `totalPage` nếu có từ API
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
