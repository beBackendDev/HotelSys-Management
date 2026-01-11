package com.thoaidev.bookinghotel.model.voucher.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.exceptions.BadRequestException;
import com.thoaidev.bookinghotel.model.room.entity.Room;
import com.thoaidev.bookinghotel.model.room.repository.RoomRepository;
import com.thoaidev.bookinghotel.model.voucher.dto.VoucherValidateRequest;
import com.thoaidev.bookinghotel.model.voucher.dto.VoucherValidateResponse;
import com.thoaidev.bookinghotel.model.voucher.entity.Voucher;
import com.thoaidev.bookinghotel.model.voucher.enums.VoucherStatus;
import com.thoaidev.bookinghotel.model.voucher.enums.VoucherType;
import com.thoaidev.bookinghotel.model.voucher.repository.VoucherRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherSerImple implements VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;
    @Autowired
    private RoomRepository roomRepository;

    @Override
    public Voucher validateVoucher(String code, BigDecimal totalAmount) {
        Voucher voucher = voucherRepository
                .findByCodeAndStatus(code, VoucherStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        LocalDateTime now = LocalDateTime.now();

        if (voucher.getStartDate().isAfter(now)
                || voucher.getEndDate().isBefore(now)) {
            throw new RuntimeException("Voucher Expired");
        }

        if (voucher.getUsedCount() >= voucher.getQuantity()) {
            throw new RuntimeException("Voucher has no remaining uses");
        }

        if (totalAmount.compareTo(voucher.getMinOrderAmount()) < 0) {
            throw new RuntimeException("Insufficient amount to apply voucher");
        }

        return voucher;
    }

    @Override
    public BigDecimal calculateDiscount(Voucher voucher, BigDecimal totalAmount) {
        BigDecimal discount;

        if (voucher.getType() == VoucherType.PERCENT) {
            discount = totalAmount
                    .multiply(voucher.getValue())
                    .divide(BigDecimal.valueOf(100));
        } else {
            discount = voucher.getValue();
        }

        if (voucher.getMaxDiscount() != null) {
            discount = discount.min(voucher.getMaxDiscount());
        }

        return discount.min(totalAmount);

    }

    @Override
    public VoucherValidateResponse validateVoucher(VoucherValidateRequest req) {
        Voucher voucher = voucherRepository
                .findByCode(req.getVoucherCode())
                .orElseThrow(()
                        -> new BadRequestException("Voucher không tồn tại")
                );

        // Check trạng thái
        if (!voucher.getStatus().equals(VoucherStatus.ACTIVE)) {
            throw new BadRequestException("Voucher đã bị vô hiệu hóa");
        }

        if (voucher.getUsedCount() >= voucher.getQuantity()) {
            throw new BadRequestException("Voucher đã hết hạn");
        }

        //  Check phòng
        Room room = roomRepository.findById(req.getRoomId())
                .orElseThrow(()
                        -> new BadRequestException("Không tìm thấy phòng")
                );

        //  Check hotel match
        if (!room.getHotel().getHotelId().equals(req.getHotelId())) {
            throw new BadRequestException("Voucher không áp dụng cho khách sạn này");
        }

        //  Tính số đêm
        long nights = ChronoUnit.DAYS.between(
                req.getCheckIn(),
                req.getCheckOut()
        );

        if (nights <= 0) {
            throw new BadRequestException("Ngày ở không hợp lệ");
        }

        BigDecimal originalAmount = BigDecimal.valueOf(nights).multiply(room.getRoomPricePerNight());

        //  Điều kiện tối thiểu
        if (originalAmount.compareTo(voucher.getMinOrderAmount()) < 0) {
            throw new BadRequestException(
                    "Đơn hàng chưa đạt giá trị tối thiểu"
            );
        }

        //  Tính giảm giá
        BigDecimal discountAmount;

        if (voucher.getType() == VoucherType.PERCENT) {
            discountAmount = originalAmount.multiply(voucher.getValue()).divide(BigDecimal.valueOf(100));
            discountAmount = discountAmount.min(voucher.getMaxDiscount());
        } else {
            discountAmount = voucher.getValue();
        }

        BigDecimal finalAmount = originalAmount.subtract(discountAmount);

        return new VoucherValidateResponse(
                voucher.getCode(),
                discountAmount,
                finalAmount
        );
    }
}
