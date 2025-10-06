package com.thoaidev.bookinghotel.model.review.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.booking.repository.BookingRepo;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.entity.HotelReview;
import com.thoaidev.bookinghotel.model.hotel.entity.HotelReviewDTO;
import com.thoaidev.bookinghotel.model.hotel.repository.HotelRepository;
import com.thoaidev.bookinghotel.model.review.dto.ReviewResponse;
import com.thoaidev.bookinghotel.model.review.mapper.ReviewMapper;
import com.thoaidev.bookinghotel.model.review.repo.ReviewRepository;
import com.thoaidev.bookinghotel.security.jwt.CustomUserDetail;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewSerImpl implements ReviewSer {

    private final ReviewRepository reviewRepository;
    private final BookingRepo bookingRepo;
    private final HotelRepository hotelRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public void createReview(HotelReviewDTO hotelReviewDTO) {
        // Lấy user từ token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetail userDetails = (CustomUserDetail) authentication.getPrincipal();
        Integer userId = userDetails.getId();//UserId trong CustomUsserDetail
        Integer hotelId = hotelReviewDTO.getHotelId();
        LocalDate now = LocalDate.now();

        // Kiểm tra tính khả thi của người dùng khi viết Review
        List<Booking> bookings = bookingRepo.findEligibleBookingsForReview(userId, hotelId, now);
        if (bookings.isEmpty()) {
            throw new RuntimeException("Bạn chưa có quyền đánh giá khách sạn này");
        }
//Thuc hien luu thong tin nhan xet vao table HotelReview 
        HotelReview review = new HotelReview();
        review.setHotel(bookings.get(0).getHotel());
        review.setUser(bookings.get(0).getUser());
        review.setRatingPoint(hotelReviewDTO.getRatingPoint());
        review.setComment(hotelReviewDTO.getComment());
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);
//
        // Cập nhật rating trung bình và tổng số review
        Double avgRating = reviewRepository.getAverageRatingByHotelId(hotelId);
        Integer totalReviews = reviewRepository.countByHotel_HotelId(hotelId);

        Hotel hotel = bookings.get(0).getHotel();
        hotel.setRatingPoint(avgRating);
        hotel.setTotalReview(totalReviews);

        hotelRepository.save(hotel);
    }

    @Override
    public ReviewResponse getReviewsByHotelId(Integer hotelId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<HotelReview> reviews = reviewRepository.findByHotel_HotelId(hotelId, pageable);

        List<HotelReviewDTO> content = reviewMapper.toDTOList(reviews.getContent());

        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setContent(content);
        reviewResponse.setPageNo(reviews.getNumber());
        reviewResponse.setPageSize(reviews.getSize());
        reviewResponse.setTotalElements(reviews.getTotalElements());
        reviewResponse.setTotalPage(reviews.getTotalPages());
        reviewResponse.setLast(reviews.isLast());

        return reviewResponse;
    }

    @Override
    public ReviewResponse getReviewsByUserId(Integer userId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<HotelReview> reviews = reviewRepository.findByUser_UserId(userId, pageable);

        List<HotelReviewDTO> content = reviewMapper.toDTOList(reviews.getContent());

        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setContent(content);
        reviewResponse.setPageNo(reviews.getNumber());
        reviewResponse.setPageSize(reviews.getSize());
        reviewResponse.setTotalElements(reviews.getTotalElements());
        reviewResponse.setTotalPage(reviews.getTotalPages());
        reviewResponse.setLast(reviews.isLast());

        return reviewResponse;
    }
}
