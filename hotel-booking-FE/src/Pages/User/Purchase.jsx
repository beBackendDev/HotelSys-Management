import { Col, Row, Typography, Pagination } from "antd";
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
        `http://localhost:8080/api/user/hotels/booking-management?pageNo=${pageNo - 1}&pageSize=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("_getPurchase: ", data);

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

  // fetch lần đầu khi component mount
  useEffect(() => {
    fetchPurchase(pagination.pageNo, pagination.pageSize);
  }, []);

  const handlePageChange = (page, pageSize) => {
    fetchPurchase(page, pageSize);
  };

  return (
    <User>
      <div className="px-8 bg-white min-h-screen rounded py-12">
        <Typography.Title level={3} className="pt-5">
          Đơn đã đặt
        </Typography.Title>

        <Row gutter={[24, 24]} className="bg-orange-200 p-4">
          <Col sm={8}>
            <Typography.Text className="font-bold">Khách sạn</Typography.Text>
          </Col>
          <Col sm={3}>
            <Typography.Text className="font-bold">Phòng</Typography.Text>
          </Col>
          <Col sm={3}>
            <Typography.Text className="font-bold">Ngày nhận</Typography.Text>
          </Col>
          <Col sm={3}>
            <Typography.Text className="font-bold">Ngày trả</Typography.Text>
          </Col>
          <Col sm={4}>
            <Typography.Text className="font-bold">Tình trạng</Typography.Text>
          </Col>
          <Col sm={3}>
            <Typography.Text className="font-bold">Giá (VNĐ)</Typography.Text>
          </Col>
        </Row>

        {purchaseList?.map((purchase) => (
          <PurchaseCard
            purchase={purchase}
            key={purchase.id}
          />
        ))}

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
