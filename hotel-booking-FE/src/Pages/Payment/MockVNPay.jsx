import { useLocation, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDate, formatMoney } from "../../utils/helper";
import VNPayLogo from "../../assets/images/VNPayLogo.png";

const MockVNPay = () => {
    const location = useLocation();
    const history = useHistory();

    const query = new URLSearchParams(location.search);

    const txnRef = query.get("txnRef");
    const bookingId = query.get("bookingId");
    const amount = query.get("amount");
    const [bankCode, setBankCode] = useState("NCB");
    const [result, setResult] = useState("SUCCESS");
    const [loading, setLoading] = useState(false);


    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [promoCode, setPromoCode] = useState('');

    const handleSubmit = () => {
        alert('Thanh toán thành công! (Mock)');
    };
    const VN_PAY_TEST_CASES = [
        {
            cardNumber: "9704198526191432198",
            cardName: "NGUYEN VAN A",
            expiryDate: "07/15",
            result: "SUCCESS",
            responseCode: "00"
        },
        {
            cardNumber: "9704195798459170488",
            cardName: "NGUYEN VAN B",
            expiryDate: "07/15",
            result: "MONEYOUT",
            responseCode: "51" // Không đủ số dư
        },
        {
            cardNumber: "9704193370791314",
            cardName: "NGUYEN VAN C",
            expiryDate: "07/15",
            result: "LOCKED",
            responseCode: "99" //Thẻ bị khóa
        },
        {
            cardNumber: "9704192181368742",
            cardName: "NGUYEN VAN A",
            expiryDate: "07/15",
            result: "FAILED",
            responseCode: "01" //Thẻ chưa kích hoạt
        }
    ];
    //validate card
    const validateVNPayMock = () => {
        if (!cardNumber || !cardName || !expiryDate) {
            return {
                result: "FAILED",
                responseCode: "01", // Thiếu thông tin
            };
        }

        const normalizedName = cardName.trim().toUpperCase();

        const matchedCase = VN_PAY_TEST_CASES.find(
            (tc) =>
                tc.cardNumber === cardNumber &&
                tc.cardName === normalizedName &&
                tc.expiryDate === expiryDate
        );

        if (!matchedCase) {
            return {
                result: "FAILED",
                responseCode: "04", // Thông tin thẻ không hợp lệ
            };
        }
        console.log("result mock:", matchedCase);

        return matchedCase;
    };

    const styles = {
        container: {
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            //   fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px',
            borderBottom: '1px solid #d0d0d0',
            backgroundColor: '#ffffff',
        },
        logoSection: {
            display: 'flex',
            alignItems: 'center',
        },
        vnpayLogo: {
            height: '40px',
            fontWeight: '700',
            color: '#0066cc',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        logoBadge: {
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #ee0000 0%, #0066cc 100%)',
            borderRadius: '4px',
            marginRight: '8px',
        },
        bankSection: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
        },
        bankLogo: {
            fontSize: '18px',
            fontWeight: '700',
            color: '#ee0000',
        },
        timer: {
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px',
        },
        timerItems: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
        },
        timerItem: {
            backgroundColor: '#333333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '700',
            minWidth: '40px',
            textAlign: 'center',
        },
        timerLabel: {
            fontSize: '12px',
            color: '#666666',
            margin: '0',
        },
        content: {
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '32px',
            padding: '32px',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        leftSection: {
            display: 'flex',
            flexDirection: 'column',
        },
        orderCard: {
            backgroundColor: '#f5f5f5',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
        orderTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#333333',
            margin: '0 0 24px 0',
            paddingBottom: '16px',
            borderBottom: '1px solid #d0d0d0',
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            fontSize: '14px',
        },
        infoLabel: {
            color: '#666666',
            fontWeight: '500',
        },
        infoValue: {
            color: '#333333',
            fontWeight: '600',
        },
        amount: {
            fontSize: '18px',
            color: '#0066cc',
            fontWeight: '700',
        },
        currency: {
            fontSize: '12px',
            marginLeft: '2px',
            color: '#0066cc',
        },
        code: {
            //   fontFamily: "'Courier New', monospace",
            letterSpacing: '1px',
        },
        divider: {
            height: '1px',
            backgroundColor: '#d0d0d0',
            margin: '16px 0',
        },
        rightSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        },
        formTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#333333',
            margin: '0 0 16px 0',
            paddingBottom: '16px',
            borderBottom: '3px solid #0066cc',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        label: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#333333',
        },
        inputWrapper: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #d0d0d0',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#333333',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
        },
        inputFocus: {
            borderColor: '#0066cc',
            boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.1)',
        },
        ncbLogo: {
            position: 'absolute',
            right: '16px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#0066cc',
            backgroundColor: '#f0f0f0',
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #d0d0d0',
            pointerEvents: 'none',
        },
        promoSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        promoWrapper: {
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '8px',
            alignItems: 'center',
        },
        selectBtn: {
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            border: '1px solid #d0d0d0',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#666666',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
        },
        selectBtnHover: {
            backgroundColor: '#f5f5f5',
            borderColor: '#0066cc',
            color: '#0066cc',
        },
        termsLink: {
            margin: '8px 0',
        },
        termsA: {
            color: '#0066cc',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        buttonGroup: {
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '16px',
            marginTop: '16px',
        },
        cancelBtn: {
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            border: '1px solid #d0d0d0',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#666666',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        cancelBtnHover: {
            backgroundColor: '#f5f5f5',
            borderColor: '#666666',
        },
        submitBtn: {
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #0b5394 0%, #0066cc 100%)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        submitBtnHover: {
            boxShadow: '0 4px 12px rgba(11, 83, 148, 0.3)',
            transform: 'translateY(-2px)',
        },
        securitySection: {
            display: 'flex',
            gap: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #d0d0d0',
            marginTop: '16px',
        },
        securityIcons: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#666666',
        },
        icon: {
            fontSize: '18px',
        },
        footer: {
            padding: '24px',
            borderTop: '1px solid #d0d0d0',
            backgroundColor: '#f5f5f5',
            textAlign: 'center',
        },
        footerLink: {
            color: '#0066cc',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
    };

    const [selectBtnHover, setSelectBtnHover] = useState(false);
    const [cancelBtnHover, setCancelBtnHover] = useState(false);
    const [submitBtnHover, setSubmitBtnHover] = useState(false);
    //handle callback
    const handlePay = () => {
        setLoading(true);

        const paymentResult = validateVNPayMock();

        setTimeout(() => {
            const callbackUrl =
                `/mock-vnpay/callback` +
                `?status=${paymentResult.result.toLowerCase()}` +
                `&bookingId=${bookingId}` +
                `&txnRef=${txnRef}` +
                `&amount=${amount}` +
                `&responseCode=${paymentResult.responseCode}` +
                `&bankCode=${bankCode}` +
                `&paymentMethod=VNPay`;

            history.push(callbackUrl);
        }, 1500);
    };

    useEffect(() => {
        if (!txnRef || !bookingId || !amount) {
            alert("Thiếu thông tin giao dịch!");
            history.push("/");
        }
    }, [txnRef, bookingId, amount, history]);
    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.logoSection}>
                    {/* <div style={styles.logoBadge}></div> */}
                    <img
                        style={styles.vnpayLogo}
                        src={VNPayLogo}
                        alt="VNPay"
                    />
                </div>
   
                <div style={styles.timer}>
                    <div style={styles.timerItems}>
                        <span style={styles.timerItem}>14</span>
                        <span style={{ fontWeight: '700', color: '#333333' }}>:</span>
                        <span style={styles.timerItem}>11</span>
                    </div>
                    <p style={styles.timerLabel}>Giao dịch hết hạn sau</p>
                </div>
            </div>

            <div style={styles.content}>
                {/* Left Section - Order Info */}
                <div style={styles.leftSection}>
                    <div style={styles.orderCard}>
                        <h3 style={styles.orderTitle}>Thông tin đơn hàng (Test)</h3>

                        <div style={styles.infoRow}>
                            <label style={styles.infoLabel}>Số tiền thanh toán</label>
                            <span style={styles.amount}>
                                {formatMoney(amount)}<span style={styles.currency}>VNĐ</span>
                            </span>
                        </div>

                        <div style={styles.infoRow}>
                            <label style={styles.infoLabel}>Giá trị đơn hàng</label>
                            <span style={styles.infoValue}>
                                {formatMoney(amount)}<span style={styles.currency}>VNĐ</span>
                            </span>
                        </div>

                        <div style={styles.infoRow}>
                            <label style={styles.infoLabel}>Phí giao dịch</label>
                            <span style={styles.infoValue}>
                                0<span style={styles.currency}>VNĐ</span>
                            </span>
                        </div>

                        <div style={styles.divider}></div>

                        <div style={styles.infoRow}>
                            <label style={styles.infoLabel}>Mã đơn hàng</label>
                            <span style={{ ...styles.code, ...styles.infoValue }}>{txnRef}</span>
                        </div>

                        <div style={styles.infoRow}>
                            <label style={styles.infoLabel}>Nhà cung cấp</label>
                            <span style={styles.infoValue}>MC CTT VNPAY</span>
                        </div>
                    </div>
                </div>

                {/* Right Section - Payment Form */}
                <div style={styles.rightSection}>
                    <h2 style={styles.formTitle}>Thanh toán qua Ngân hàng NCB</h2>

                    <div style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Thẻ nội địa</label>
                            <div style={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Nhập số thẻ"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    style={styles.input}
                                />
                                <div style={styles.ncbLogo}>NCB</div>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Tên chủ thẻ</label>
                            <input
                                type="text"
                                placeholder="Nhập tên chủ thẻ (không dấu)"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Ngày phát hành</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.promoSection}>
                            <label style={styles.label}>Mã khuyến mại</label>
                            <div style={styles.promoWrapper}>
                                <input
                                    type="text"
                                    placeholder="Nhập mã khuyến mại"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    style={styles.input}
                                />
                                <button
                                    style={{
                                        ...styles.selectBtn,
                                        ...(selectBtnHover ? styles.selectBtnHover : {}),
                                    }}
                                    onMouseEnter={() => setSelectBtnHover(true)}
                                    onMouseLeave={() => setSelectBtnHover(false)}
                                    onClick={() => { }}
                                >
                                    Chọn hoặc nhập mã
                                </button>
                            </div>
                        </div>

                        <div style={styles.termsLink}>
                            <a style={styles.termsA} href="#terms">
                                📋 Điều kiện sử dụng dịch vụ
                            </a>
                        </div>

                        <div style={styles.buttonGroup}>
                            <button
                                style={{
                                    ...styles.cancelBtn,
                                    ...(cancelBtnHover ? styles.cancelBtnHover : {}),
                                }}
                                onMouseEnter={() => setCancelBtnHover(true)}
                                onMouseLeave={() => setCancelBtnHover(false)}
                                onClick={() => alert('Hủy thanh toán')}
                            >
                                Hủy thanh toán
                            </button>
                            <button
                                style={{
                                    ...styles.submitBtn,
                                    ...(submitBtnHover ? styles.submitBtnHover : {}),
                                }}
                                onMouseEnter={() => setSubmitBtnHover(true)}
                                onMouseLeave={() => setSubmitBtnHover(false)}
                                onClick={handlePay}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div style={styles.securitySection}>
                        <div style={styles.securityIcons}>
                            <span style={styles.icon}>🔒</span>
                            <span>secure</span>
                        </div>
                        <div style={styles.securityIcons}>
                            <span>Payment Certified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <a style={styles.footerLink} href="mailto:hotrovnpay@vnpay.vn">
                    📧 hotrovnpay@vnpay.vn
                </a>
            </div>
        </div>
    );
};

export default MockVNPay;