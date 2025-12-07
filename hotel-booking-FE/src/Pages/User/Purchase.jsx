import { Col, Row, Typography, Pagination, Card } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import User from "./User";
import PurchaseCard from "../../components/PurchaseCard/PurchaseCard";

const Purchase = () => {
  const { user } = useSelector((state) => state.auth.profile);
  const [purchaseList, setPurchaseList] = useState([]);

  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 5,
    totalPage: 1,
    totalElements: 0,
  });

  const token = localStorage.getItem("accessToken");

  const fetchPurchase = async (pageNo, pageSize) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/user/hotels/booking-management?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      setPurchaseList(data?.content || []);
      setPagination((prev) => ({
        ...prev,
        pageNo,
        pageSize,
        totalPage: data.totalPage,
        totalElements: data.totalElements,
      }));
    } catch (error) {
      console.error("Lỗi lấy đơn đặt:", error);
    }
  };

  useEffect(() => {
    fetchPurchase(pagination.pageNo, pagination.pageSize);
  }, []);

  const handlePageChange = (page, pageSize) => {
    fetchPurchase(page, pageSize);
  };

  return (
    <User>
      <div className="px-8 bg-white min-h-screen rounded py-10">

        {/* Title */}
        <Typography.Title level={3} className="text-gray-700 mb-6">
          Đơn đã đặt
        </Typography.Title>

        {/* Header Row */}
        <Card
          className="rounded-xl shadow-sm mb-3 bg-orange-50 border border-orange-200"
          bodyStyle={{ padding: "14px 20px" }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col sm={6}>
              <Typography.Text className="font-semibold text-gray-800">
                Khách sạn (Phòng)
              </Typography.Text>
            </Col>

            <Col sm={4}>
              <Typography.Text className="font-semibold text-gray-800">
                Ngày nhận
              </Typography.Text>
            </Col>

            <Col sm={4}>
              <Typography.Text className="font-semibold text-gray-800">
                Ngày trả
              </Typography.Text>
            </Col>

            <Col sm={4}>
              <Typography.Text className="font-semibold text-gray-800">
                Trạng thái
              </Typography.Text>
            </Col>

            <Col sm={4}>
              <Typography.Text className="font-semibold text-gray-800">
                Giá tiền
              </Typography.Text>
            </Col>
          </Row>
        </Card>

        {/* Purchase List */}
        {purchaseList?.map((purchase) => (
          <PurchaseCard purchase={purchase} key={purchase.id} />
        ))}

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination
            current={pagination.pageNo}
            pageSize={pagination.pageSize}
            total={pagination.totalElements}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>

      </div>
    </User>
  );
};

export default Purchase;
