// import React, { useEffect, useState, useMemo } from "react";
// import { useLocation } from "react-router-dom";
// import HomeLayout from "../core/layout/HomeLayout";
// import HotelDesc from "../components/HotelDesc/HotelDesc";
// import useQuery from "../core/hooks/useQuery";
// import qs from "query-string";
// import { Content } from "antd/lib/layout/layout";
// import Filter from "../components/Filter/Filter";
// import {
//   Col,
//   Pagination,
//   Row,
//   Spin,
//   Empty,
//   Button,
//   Alert,
//   Typography,
// } from "antd";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import { FilterOutlined } from "@ant-design/icons";

// const SearchPage = () => {
//   const [filters, setFilters] = useState({
//     location: "",
//     minPrice: "",
//     maxPrice: "",
//     rating: "",
//     facility: "",
//     sort_by: "created_at",
//     order: "desc",
//     page: 1,
//     per_page: 5,
//   });

//   const [hotels, setHotels] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showFilter, setShowFilter] = useState(true);

//   const location = useLocation();
//   const query = useQuery();
//   const history = useHistory();

//   // Tính STT dựa trên page hiện tại và per_page
//   const hotelsWithStt = useMemo(() => {
//     return hotels.map((hotel, index) => ({
//       ...hotel,
//       __stt: (filters.page - 1) * filters.per_page + index + 1,
//     }));
//   }, [hotels, filters.page, filters.per_page]);

//   // Fetch hotels with pagination
//   const fetchHotels = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Build query params
//       const params = new URLSearchParams({
//         pageNo: filters.page, // Convert to 0-based for backend
//         pageSize: filters.per_page,
//         sort: `${filters.sort_by},${filters.order}`,
//       });

//       // Add optional filters
//       if (filters.location) params.append("hotelAddress", filters.location);
//       if (filters.minPrice) params.append("minPrice", filters.minPrice);
//       if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
//       if (filters.rating) params.append("ratingPoint", filters.rating);
//       if (filters.facility) params.append("facility", filters.facility);

//       const url = `http://localhost:8080/api/user/public/hotels/filter?${params}`;
//       console.log("Fetching from URL:", url);

//       const res = await fetch(url, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) throw new Error("Fetch thất bại");

//       const data = await res.json();
//       console.log("Search response:", {
//         content: data?.content?.length,
//         totalElements: data?.totalElements,
//         totalPages: data?.totalPage,
//         pageNo: data?.pageNo,
//         pageSize: data?.pageSize,
//       });

//       setHotels(data?.content || []);
//       setTotal(data?.totalElements || 0);
//     } catch (err) {
//       console.error("Lỗi khi tải danh sách khách sạn:", err);
//       setError("Tải danh sách khách sạn thất bại");
//       setHotels([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load hotels when filters or location search changes
//   useEffect(() => {
//     const pageFromQuery = parseInt(query.page) || 1;
//     const sizeFromQuery = parseInt(query.per_page) || 10;

//     // Parse location and other filters from URL
//     const updatedFilters = {
//       ...filters,
//       page: pageFromQuery,
//       per_page: sizeFromQuery,
//       location: query.location || "",
//       minPrice: query.minPrice || "",
//       maxPrice: query.maxPrice || "",
//       rating: query.rating || "",
//       facility: query.facility || "",
//     };

//     setFilters(updatedFilters);
    
//     // Fetch after state is updated (using the updated filters directly)
//     // We'll fetch in the next useEffect that depends on filters
//   }, [location.search]);

//   // Fetch when filters change
//   useEffect(() => {
//     fetchHotels();
//   }, [filters]);

//   // Handle pagination change
//   const handlePaginationChange = (page, pageSize) => {
//     const newParams = {
//       ...query,
//       page: page,
//       per_page: pageSize,
//     };

//     history.push({
//       pathname: "/hotel/search",
//       search: qs.stringify(newParams),
//     });
//   };

//   // Handle filter change from Filter component
//   const handleFilterChange = (filterObj) => {
//     // Reset to page 1 when filters change
//     const newParams = {
//       ...filterObj,
//       page: 1,
//       per_page: filters.per_page,
//     };

//     history.push({
//       pathname: "/hotel/search",
//       search: qs.stringify(newParams),
//     });
//   };

//   const toggleFilter = () => setShowFilter(!showFilter);

//   return (
//     <HomeLayout>
//       <Content className="max-w-6xl min-h-screen mx-auto mt-10">
//         <Row gutter={[16, 16]}>
//           {/* FILTER SIDEBAR */}
//           {showFilter && (
//             <Col
//               xs={24}
//               sm={24}
//               md={6}
//               className="transition-all duration-500 ease-in-out"
//             >
//               <Filter
//                 toggleFilter={toggleFilter}
//                 showFilter={showFilter}
//                 onFilterChange={handleFilterChange}
//               />
//             </Col>
//           )}

//           {/* HOTEL LIST */}
//           <Col
//             xs={24}
//             sm={24}
//             md={showFilter ? 18 : 24}
//             className="transition-all duration-500 ease-in-out"
//           >
//             {/* Header with title and toggle button */}
//             <div className="flex justify-between items-start md:items-center gap-4 mb-6 mt-10">
//               <div>
//                 <h2 className="text-2xl font-bold mb-2">Danh sách khách sạn</h2>
//                 {total > 0 && (
//                   <p className="text-gray-500">
//                     Tìm thấy{" "}
//                     <span className="font-semibold text-gray-700">
//                       {total}
//                     </span>{" "}
//                     khách sạn
//                   </p>
//                 )}
//               </div>

//               {!showFilter && (
//                 <Button
//                   icon={<FilterOutlined />}
//                   onClick={toggleFilter}
//                   size="large"
//                 >
//                   Hiện bộ lọc
//                 </Button>
//               )}
//             </div>

//             {/* Error Alert */}
//             {error && (
//               <Alert
//                 type="error"
//                 message={error}
//                 showIcon
//                 closable
//                 style={{ marginBottom: 16 }}
//               />
//             )}

//             {/* Loading State */}
//             {loading ? (
//               <div className="flex justify-center items-center py-20">
//                 <Spin tip="Đang tải dữ liệu..." size="large" />
//               </div>
//             ) : hotels.length > 0 ? (
//               <>
//                 {/* Hotels List */}
//                 <div className="space-y-4">
//                   {hotelsWithStt.map((hotel) => (
//                     <div key={hotel?.hotelId}>
//                       <HotelDesc hotelInfo={hotel} />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 <Row justify="center" style={{ marginTop: 40, marginBottom: 40 }}>
//                   <Pagination
//                     current={filters.page}
//                     pageSize={filters.per_page}
//                     total={total}
//                     onChange={handlePaginationChange}
//                     onShowSizeChange={handlePaginationChange}
//                     showSizeChanger
//                     pageSizeOptions={[10, 20, 50]}
//                     showTotal={(total) =>
//                       `Tổng cộng ${total} khách sạn`
//                     }
//                     size="large"
//                   />
//                 </Row>
//               </>
//             ) : (
//               <div className="flex justify-center items-center py-20">
//                 <Empty
//                   description="Không tìm thấy khách sạn nào"
//                   style={{ marginTop: 24 }}
//                 />
//               </div>
//             )}
//           </Col>
//         </Row>
//       </Content>
//     </HomeLayout>
//   );
// };

// export default SearchPage;