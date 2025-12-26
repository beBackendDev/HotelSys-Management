import { Typography, Pagination, Empty } from "antd";
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
    totalElements: 0,
  });

  const token = localStorage.getItem("accessToken");

  const fetchPurchase = async (pageNo, pageSize) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/user/hotels/booking-management?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
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
      <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen bg-gray-50">

        {/* Title */}
        <Typography.Title level={3} className="mb-6 text-gray-800">
          Đơn đã đặt
        </Typography.Title>

        {/* List */}
        {purchaseList.length > 0 ? (
          <div className="flex flex-col gap-4">
            {purchaseList.map((purchase) => (
              <PurchaseCard
                key={purchase.bookingId}
                purchase={purchase}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center mt-20">
            <Empty
              description="Bạn chưa có đơn đặt phòng nào"
            />
          </div>
        )}

        {/* Pagination */}
        {pagination.totalElements > pagination.pageSize && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={pagination.pageNo}
              pageSize={pagination.pageSize}
              total={pagination.totalElements}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}

      </div>
    </User>
  );
};

export default Purchase;
