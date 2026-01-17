import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { formatMoney, formatDate } from "../../utils/helper";
import DashboardLayout from "../../core/layout/Dashboard";

const RoomDetailAdmin = () => {
    const { hotelId, roomId } = useParams();
    const history = useHistory();
    const [room, setRoom] = useState({});
    const [hotel, setHotel] = useState({});
    const [openGallery, setOpenGallery] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("accessToken");
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken.role;
                const discountConvert = {
                    OWNER_PROMOTION: "Chiết khấu chủ sở hữu",
                    MEMBER: "Chào mừng thành viên mới",
                    VOUCHER: "Voucher ưu đãi",
                    FLASH_SALE: "Deal chớp nhoáng",
                    NONE: "Không có khuyến mãi",
                };
    const getUrlByRole = (role) => {
        switch (role) {
            case "ADMIN":
                return "admin";
            case "OWNER":
                return "owner";
            default:
                return "user";
        }
    };

    const formatNumber = (num) => {
        return num?.toLocaleString('vi-VN') || '0';
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    const images = room.roomImageUrls || [];
    
    const extraImages = Math.max(0, images.length - 4);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${hotelId}/rooms/${roomId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch room");
                const data = await res.json();
                console.log("room detail: ", data);
                setRoom(data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        const fetchHotel = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/dashboard/admin/hotels/${hotelId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch hotel");
                const data = await res.json();
                setHotel(data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
        fetchHotel();
    }, [hotelId, roomId, token, role]);

    if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;


    return (
        <DashboardLayout>
            <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                {/* Header Section */}
                <div style={{ backgroundColor: '#fff', padding: '24px', marginBottom: '24px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <button
                            onClick={() => history.goBack()}
                            style={{
                                marginBottom: 16,
                                padding: '8px 16px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            ← Quay lại
                        </button>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#000' }}>
                                    {room.roomName}
                                </h1>
                                <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#666' }}>
                                    🏠 {hotel.hotelName}
                                </p>
                            </div>
        
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 24px' }}>
                    {/* Quick Info Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        {/* Room Type Card */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>🛏️</div>
                            <p style={{ margin: 0, fontSize: 12, color: '#666', marginBottom: 8 }}>Loại phòng</p>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#000' }}>{room.roomType}</p>
                        </div>

                        {/* Occupancy Card */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>👥</div>
                            <p style={{ margin: 0, fontSize: 12, color: '#666', marginBottom: 8 }}>Sức chứa</p>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#000' }}>{room.roomOccupancy} người</p>
                        </div>

                        {/* Price Card */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>💰</div>
                            <p style={{ margin: 0, fontSize: 12, color: '#666', marginBottom: 8 }}>Giá / đêm</p>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#000' }}>
                                {formatNumber(room.roomPricePerNight)} VND
                            </p>
                        </div>

                        {/* Status Card */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>
                                {room.roomStatus === 'AVAILABLE' ? '✅' : '❌'}
                            </div>
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                backgroundColor: room.roomStatus === 'AVAILABLE' ? '#f6ffed' : '#fff1f0',
                                color: room.roomStatus === 'AVAILABLE' ? '#52c41a' : '#ff4d4f',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 600,
                                marginBottom: 12,
                            }}>
                                {room.roomStatus}
                            </div>
                            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Trạng thái</p>
                        </div>
                    </div>

                    {/* Detailed Information */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        marginBottom: 24,
                    }}>
                       
                    </div>

                    {/* Pricing & Discount Information */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        marginBottom: 24,
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Thông tin giá & Chiết khấu</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                            <div>
                                <div style={{ marginBottom: 24 }}>
                                    <p style={{ margin: 0, fontSize: 12, color: '#666', marginBottom: 8 }}>Giá gốc / Đêm</p>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: 16, color: '#000' }}>
                                        💵 {formatNumber(room.roomPricePerNight)} VND
                                    </p>
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <p style={{ margin: 0, fontSize: 12, color: '#666', marginBottom: 8 }}>Giá sau chiết khấu</p>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: 16, color: '#52c41a' }}>
                                        ✨ {formatNumber(room.finalPrice)} VND
                                    </p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 12, color: '#666', marginBottom: 8 }}>Mức chiết khấu</p>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#000' }}>
                                        📊 {room.discountPercent}% {(discountConvert[room.discountType])}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div style={{ marginBottom: 24 }}>
                                    <p style={{ margin: 0, fontSize: 12, color: '#666', marginBottom: 8 }}>Ngày bắt đầu chiết khấu</p>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#000' }}>
                                        🚀 {formatDateTime(room.discountStart)}
                                    </p>
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <p style={{ margin: 0, fontSize: 12, color: '#666', marginBottom: 8 }}>Ngày kết thúc chiết khấu</p>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#000' }}>
                                        ⏰ {formatDateTime(room.discountEnd)}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 12, color: '#666', marginBottom: 8 }}>Trạng thái chiết khấu</p>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        backgroundColor: room.active ? '#f6ffed' : '#fff1f0',
                                        color: room.active ? '#52c41a' : '#ff4d4f',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                    }}>
                                        {room.active ? 'Đang áp dụng' : 'Không áp dụng'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Room Images */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        marginBottom: 24,
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Hình ảnh phòng</h3>
                        {images.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                                gap: '12px',
                            }}>
                                {images[0] && (
                                    <img
                                        src={`http://localhost:8080${images[0]}`}
                                        alt="Main room view"
                                        onClick={() => {
                                            setActiveIndex(0);
                                            setOpenGallery(true);
                                        }}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                        }}
                                    />
                                )}
                                {images.slice(1, 5).map((url, i) => {
                                    const realIndex = i + 1;
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                position: 'relative',
                                                overflow: 'hidden',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <img
                                                src={`http://localhost:8080${url}`}
                                                alt={`Room view ${realIndex}`}
                                                onClick={() => {
                                                    setActiveIndex(realIndex);
                                                    setOpenGallery(true);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            {i === 3 && extraImages > 0 && (
                                                <div
                                                    onClick={() => {
                                                        setActiveIndex(realIndex);
                                                        setOpenGallery(true);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                                                        +{extraImages} ảnh
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{ color: '#999' }}>Phòng này chưa có hình ảnh.</p>
                        )}
                    </div>

                    {/* Room Facilities */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        marginBottom: 24,
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Tiện ích phòng</h3>
                        {room.roomFacilities?.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {room.roomFacilities.map((f, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: '4px 12px',
                                            backgroundColor: '#e6f7ff',
                                            color: '#1890ff',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {f.name}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#999' }}>Phòng này chưa có tiện ích.</p>
                        )}
                    </div>
                </div>

                {/* Gallery Modal */}
                {openGallery && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1000,
                        }}
                        onClick={() => setOpenGallery(false)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', color: 'white' }}>
                            <h3>Hình ảnh phòng ({activeIndex + 1}/{images.length})</h3>
                            <button
                                onClick={() => setOpenGallery(false)}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'auto',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={`http://localhost:8080${images[activeIndex]}`}
                                alt={`Gallery ${activeIndex + 1}`}
                                style={{
                                    maxWidth: '90%',
                                    maxHeight: '90%',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                        <div
                            style={{
                                padding: '24px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                gap: '8px',
                                overflowY: 'auto',
                                maxHeight: '150px',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {images.map((url, i) => (
                                <img
                                    key={i}
                                    src={`http://localhost:8080${url}`}
                                    alt={`Thumbnail ${i + 1}`}
                                    onClick={() => setActiveIndex(i)}
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        border: activeIndex === i ? '3px solid white' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default RoomDetailAdmin;