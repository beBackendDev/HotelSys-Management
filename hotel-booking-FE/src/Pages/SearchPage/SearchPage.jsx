import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeLayout from "../../core/layout/HomeLayout";
import HotelDesc from "../../components/HotelDesc/HotelDesc";
import useQuery from "../../core/hooks/useQuery";
import qs from "query-string";
import { Content } from "antd/lib/layout/layout";
import Filter from "../../components/Filter/Filter";
import styles from "./styles.module.scss";
import { Col, Pagination, Row } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SearchPage = () => {
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hotels, setHotels] = useState([]);
  const [totalHotels, setTotalHotels] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  const location = useLocation();
  const query = useQuery();
  const history = useHistory();

  useEffect(() => {
    const pageFromQuery = parseInt(query.pageNo) || 1;
    const sizeFromQuery = parseInt(query.pageSize) || 5;
    setCurrPage(pageFromQuery);
    setPageSize(sizeFromQuery);

    const fetchHotels = async () => {
      setLoading(true);
      try {
        console.log("location-search(SearchPage): ", location?.search);

        const res = await fetch(
          `http://localhost:8080/api/user/public/hotels/filter${location?.search}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error("Fetch thất bại");
        const data = await res.json();
        console.log("SearchPage) search-hotel:", data);

        setHotels(data?.content || []);
        setTotalHotels(data?.totalElements || 0);
      } catch (err) {
        console.error("Lỗi khi tải danh sách khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [location.search]);

  const onShowSizeChange = (pageNo, pageSize) => {
    setCurrPage(pageNo);
    setPageSize(pageSize);

    const currentParams = qs.parse(location.search);
    const newParams = {
      ...currentParams,
      pageNo: pageNo,
      pageSize: pageSize,
    };

    history.push({
      pathname: "/hotel/search",
      search: qs.stringify(newParams),
    });
  };

  const toggleFilter = () => setShowFilter(!showFilter);
  const handleFilterChange = (filters) => {
    history.push({
      pathname: "/hotel/search",
      search: qs.stringify({ ...filters, page: 1, size: pageSize }),
    });
  };

  return (
    <HomeLayout>
      <Content className={styles.pageWrapper}>
        <Row gutter={[16, 16]} className={styles.mainRow}>
          {/* ===== FILTER ===== */}
          {showFilter && (
            <Col span={6} className={styles.filterCol}>
              <Filter
                toggleFilter={toggleFilter}
                showFilter={showFilter}
                onFilterChange={handleFilterChange}
              />
            </Col>
          )}

          {/* ===== HOTEL LIST ===== */}
          <Col
            span={showFilter ? 18 : 24}
            className={styles.listCol}
          >
            {/* Toggle filter button */}
            <div className={styles.filterToggleWrapper}>
              {!showFilter && (
                <button
                  onClick={toggleFilter}
                  className={styles.filterToggleBtn}
                >
                  Hiện bộ lọc
                </button>
              )}
            </div>

            {/* Hotel list */}
            <Row>
              <div className={styles.listContainer}>
                <h2 className={styles.listTitle}>Danh sách khách sạn</h2>

                {loading ? (
                  <p className={styles.loadingText}>Đang tải dữ liệu...</p>
                ) : hotels.length > 0 ? (
                  <div className={styles.hotelList}>
                    {hotels.map((hotel) => (
                      <Col span={24} key={hotel.hotelId}>
                        <HotelDesc hotelInfo={hotel} />
                      </Col>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>
                    Không tìm thấy khách sạn nào.
                  </p>
                )}
              </div>
            </Row>

            {/* Pagination */}
            <Row>
              <div className={styles.paginationWrapper}>
                <Pagination
                  current={currPage}
                  pageSize={pageSize}
                  total={totalHotels}
                  onChange={onShowSizeChange}
                  onShowSizeChange={onShowSizeChange}
                  showSizeChanger
                  pageSizeOptions={[10, 20, 50]}
                  showTotal={(total) => `Tổng cộng ${total} khách sạn`}
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