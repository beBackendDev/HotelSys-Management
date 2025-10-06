import { Col, Row, Pagination } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../components/Filter/Filter";
import HotelDesc from "../components/HotelDesc/HotelDesc";
import LocalStorage from "../constant/localStorage";
import useQuery from "../core/hooks/useQuery";
import HomeLayout from "../core/layout/HomeLayout";
import { getHotels } from "../slices/hotel.slice";
import { useHistory } from "react-router-dom";

const SearchPage = () => {
  const hotelSearch = useSelector((state) => state.hotel.hotelData); // ✅ Lấy từ Redux
  const [currPage, setCurrPage] = useState(1);
  const query = useQuery();
  const dispatch = useDispatch();
  const history = useHistory();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const pageFromQuery = parseInt(query.page) || 1;
    setCurrPage(pageFromQuery);

    const params = {
      location: query.province_name || null,
      type_room_id: query.type_room_id || null,
      price: query.price || null,
      rating: query.rating || null,
      facility: query.facility || null,
      page: pageFromQuery,
    };
    Object.entries(params).forEach(([key, value]) => {
      console.log("-->Thông tin searchpage:", `${key}: ${value}`);
    });
    setFilters(params);
    localStorage.setItem(LocalStorage.filters, JSON.stringify(params));

    dispatch(getHotels(params)); // ✅ Không cần unwrapResult hay setState nữa
  }, [query, dispatch]);

  const onShowSizeChange = (page) => {
    setCurrPage(page);
    const updatedQuery = {
      ...query,
      page,
    };
    history.push({
      pathname: "/hotel/search",
      search: `?${new URLSearchParams(updatedQuery).toString()}`,
    });
  };

  const hotelList = Array.isArray(hotelSearch) ? hotelSearch : []; // fallback an toàn

  return (
    <HomeLayout>
      <Content className="max-w-6xl min-h-screen mx-auto mt-5">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Filter filters={filters} />
          </Col>
          <Col span={18}>
            <Row>
              {hotelList.length > 0 ? (
                hotelList.map((hotel) => (
                  <Col span={24} key={hotel.hotelId}>
                    <HotelDesc hotelInfo={hotel} />
                  </Col>
                ))
              ) : (
                <h1 className="h-screen mx-auto text-4xl text-orange-500">
                  Không tìm thấy khách sạn nào phù hợp
                </h1>
              )}
            </Row>
            <Row>
              <div className="flex w-full mt-8 items-center justify-center">
                <Pagination
                  defaultCurrent={1}
                  current={currPage}
                  total={hotelList.length || 1} // Hoặc cập nhật thêm `totalPage` nếu có từ API
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
