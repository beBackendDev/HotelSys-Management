package com.thoaidev.bookinghotel.model.payment.service;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.thoaidev.bookinghotel.config.VNPayConfig;
import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.booking.repository.BookingRepo;
import com.thoaidev.bookinghotel.model.booking.service.BookingSer;
import com.thoaidev.bookinghotel.model.enums.PaymentStatus;
import com.thoaidev.bookinghotel.model.payment.dto.request.PaymentInitRequest;
import com.thoaidev.bookinghotel.model.payment.dto.request.PaymentQueryRequest;
import com.thoaidev.bookinghotel.model.payment.entity.Payment;
import com.thoaidev.bookinghotel.model.payment.repository.PaymentRepository;
import com.thoaidev.bookinghotel.model.room.entity.Room;
import com.thoaidev.bookinghotel.model.room.repository.RoomRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VNPayService {
    
    private final PaymentRepository paymentRepository;
    
    private final BookingRepo bookingRepository;
    
    private final RoomRepository roomRepository;
    
    private final BookingSer bookingService;

    public String createOrder(PaymentInitRequest request, HttpServletRequest servletRequest) throws UnsupportedEncodingException {

        String orderType = "other";
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);// đây chính là giá trị được gán vào transactionId trong Pyament
        // Lấy bookingId từ request
        Integer bookingId = request.getBookingId();
        System.out.println("bookingId: "+ bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
                System.out.println("bookingId: "+ booking.getBookingId());
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String vnp_Amount = booking.getFinalAmount()
                .multiply(new BigDecimal("100")) // nhân 100
                .setScale(0, RoundingMode.HALF_UP) // làm tròn về số nguyên
                .toPlainString(); // chuyển sang String không có dấu phẩy
        String vnp_OrderInfo = request.getOrderInfo();


        // Tạo bản ghi Payment (PENDING)
        Payment payment = Payment.builder()
                .booking(booking)
                .transactionId(vnp_TxnRef)
                .paymentAmount(new BigDecimal(vnp_Amount))
                .status(PaymentStatus.PENDING)
                .paymentMethod("VNPAY")
                .createdAt(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VNPayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", VNPayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_BankCode", "NCB");//tùy chọn

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        // vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo + vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_Locale", "vn");
        // if (bankCode != null && !bankCode.isEmpty()) {
        //     vnp_Params.put("vnp_BankCode", bankCode);
        // }

        // String locate = req.getParameter("language");
        // if (locate != null && !locate.isEmpty()) {
        //     vnp_Params.put("vnp_Locale", locate);
        // } else {
        //     vnp_Params.put("vnp_Locale", "vn");
        // }
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try { //Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace(); // hoặc xử lý theo cách bạn muốn
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;
        return paymentUrl;
    }

    public int orderReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                fields.put(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII),
                        URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        String signValue = VNPayConfig.hashAllFields(fields);

        if (!signValue.equals(vnp_SecureHash)) {
            return -1; // Sai checksum
        }

        // --- Bắt đầu lấy dữ liệu và lưu vào DB ---
        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        String transactionStatus = request.getParameter("vnp_TransactionStatus"); // cũng là "00"
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalAmountStr = request.getParameter("vnp_Amount");
        BigDecimal paymentAmount = new BigDecimal(totalAmountStr)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        String payDate = request.getParameter("vnp_PayDate"); // yyyyMMddHHmmss
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        LocalDateTime paymentTime = LocalDateTime.parse(payDate, formatter);


        // Tìm payment theo vnp_TxnRef
        Payment payment = paymentRepository.findByTransactionId(vnp_TxnRef)
                .orElseThrow(() -> new RuntimeException("Payment not found with vnp_TxnRef"));

        // Cập nhật trạng thái và thông tin
        payment.setTransactionId(transactionId); // Ghi đè lại nếu cần
        payment.setPaymentAmount(paymentAmount);
        payment.setStatus("00".equals(transactionStatus) ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        payment.setCreatedAt(paymentTime);
        paymentRepository.save(payment);

        // Cập nhật booking nếu thanh toán thành công
        LocalDate today = LocalDate.now(); //thực hiện so sánh với ngày checkin
        Room room = new Room();
        if ("00".equals(transactionStatus)) {
            Booking booking = payment.getBooking();
            Integer roomId = booking.getRoom().getRoomId();
            room = roomRepository.getReferenceById(roomId);
            //Chỉ khi tới ngayf checkin (nếu tồn tại booking) thì mưới set phòng BOOKED
            if (booking.getCheckinDate() == today) {
                // room.setRoomStatus(RoomStatus.BOOKED);
                //thực hiện set ngày mà phòng available (checkout + 1)
                LocalDate checkoutDate = booking.getCheckoutDate();
                room.setDateAvailable(checkoutDate.plusDays(1));//thực hiện set ngày mà phòng available là checkout + 1
            }
            //Update trạng thái
            // booking.setStatus(BookingStatus.PAID);
            bookingService.confirmBooking(booking.getBookingId()); //gọi service để confirm booking
            payment.setStatus(PaymentStatus.SUCCESS);
            bookingRepository.save(booking);
            return 1;
        }
        // room.setRoomStatus(RoomStatus.AVAILABLE);
        return 0;
    }

    public JsonObject queryTransaction(PaymentQueryRequest req, String clientIp) throws IOException {
        String vnp_RequestId = VNPayConfig.getRandomNumber(8);
        String vnp_TxnRef = req.getOrderId();
        String vnp_OrderInfo = "Kiem tra ket qua GD OrderId:" + vnp_TxnRef;
        String vnp_TransDate = req.getTransDate();

        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss")
                .format(Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7")).getTime());

        // Chuẩn bị dữ liệu JSON gửi đi
        JsonObject vnp_Params = new JsonObject();
        vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
        vnp_Params.addProperty("vnp_Version", VNPayConfig.vnp_Version);
        vnp_Params.addProperty("vnp_Command", VNPayConfig.vnp_Command);
        vnp_Params.addProperty("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
        vnp_Params.addProperty("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.addProperty("vnp_TransactionDate", vnp_TransDate);
        vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.addProperty("vnp_IpAddr", clientIp);

        // Tạo chuỗi hash
        String hash_Data = String.join("|", vnp_RequestId, VNPayConfig.vnp_Version, VNPayConfig.vnp_Command, VNPayConfig.vnp_TmnCode,
                vnp_TxnRef, vnp_TransDate, vnp_CreateDate, clientIp, vnp_OrderInfo);
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hash_Data);
        vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

        // Gửi POST request đến VNPay
        URL url = new URL(VNPayConfig.vnp_apiUrl); // ví dụ: https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);

        try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
            wr.writeBytes(vnp_Params.toString());
            wr.flush();
        }

        int responseCode = con.getResponseCode();
        StringBuilder response = new StringBuilder();
        try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
        }

        // Trả về response JSON
        return new Gson().fromJson(response.toString(), JsonObject.class);
    }

}
