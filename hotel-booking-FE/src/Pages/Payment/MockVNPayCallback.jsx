import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./vnpay.module.scss";
import { now } from "moment";
import { formatDate, formatMoney } from "../../utils/helper";
import VNPayLogo from "../../assets/images/VNPayLogo.png";

const MockVNPayCallback = () => {
    const query = new URLSearchParams(useLocation().search);

    const status = query.get("status"); // success | failed | timeout
    const txnRef = query.get("txnRef");
    const bookingId = query.get("bookingId");
    const amount = query.get("amount");
    const responseCode = query.get("responseCode");
    const paymentMethod = query.get("paymentMethod");
    const payDate = new Date();
    const token = localStorage.getItem("accessToken");

    const isSuccess = status === "success";
    const isTimeout = status === "timeout";
    const isLocked = status === "locked";
    const isNotMoney = status === "moneyout";
    const isInactive = status === "inactive";

    useEffect(() => {
        const sendCallbackToBackend = async () => {
            try {
                const res = await fetch(
                    "http://localhost:8080/api/user/Mock-VNPay/callback-payment",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            transactionId: txnRef,
                            bookingId: bookingId,
                            responseCode: responseCode,
                            amount: amount,
                            paymentMethod: paymentMethod,
                        }),
                    }
                );

                if (!res.ok) {
                    throw new Error("Callback failed");
                }

                const data = await res.json();
                console.log("Callback success:", data);
            } catch (error) {
                console.error("Callback error:", error);
            }
        };

        sendCallbackToBackend();
    }, [txnRef, responseCode, paymentMethod]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                {/* Header */}
                <div className={styles.header}>
                    <img
                        src={VNPayLogo}
                        alt="VNPay"
                        className={styles.logo}
                    />
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <div
                        className={`${styles.icon} ${isSuccess  ? styles.success : styles.error
                            }`}
                    >
                        {isSuccess ? "✓" : "!"}
                    </div>

                    <h2 className={styles.title}>
                        {isSuccess
                            ? "Thanh toán thành công"
                            : "Thông báo"}
                    </h2>

                    <p className={styles.message}>
                        {isSuccess
                            ? "Giao dịch của Quý khách đã được xử lý thành công."
                            : isTimeout
                                ? "Giao dịch quá thời gian chờ thanh toán. Quý khách vui lòng thực hiện lại giao dịch."
                                : isLocked
                                    ? "Thẻ của Quý khách đã bị khóa. Vui lòng liên hệ ngân hàng để được hỗ trợ."
                                    : isNotMoney
                                        ? "Số dư tài khoản không đủ để thực hiện giao dịch."
                                        : isInactive
                                            ? "Thẻ của Quý khách chưa được kích hoạt. Vui lòng kích hoạt thẻ trước khi thanh toán."
                                            : "Thanh toán không thành công. Vui lòng thử lại."
                        }
                    </p>


                    {/* Info box */}
                    <div className={styles.infoBox}>
                        <div className={styles.infoRow}>
                            <span>Mã tra cứu</span>
                            <b>{txnRef}</b>
                        </div>
                        <div className={styles.infoRow}>
                            <span>Thời gian giao dịch</span>
                            <b>{formatDate(payDate)}</b>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <a href="mailto:hotrovnpay@vnpay.vn">
                        hotrovnpay@vnpay.vn
                    </a>

                    <div className={styles.security}>
                        <span>🔒 Secure</span>
                    </div>
                </div>
            </div>

            <div className={styles.copyright}>
                Phát triển bởi VNPAY © 2026
            </div>
        </div>
    );
};

export default MockVNPayCallback;
