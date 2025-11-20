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
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
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

        //Kiểm tra người dùng đã từng review trước đó chưa
        boolean existReview = reviewRepository.existReview(userId, hotelId);
        Hotel hotel = bookings.get(0).getHotel();
        UserEntity user = bookings.get(0).getUser();
        System.out.println("Reviewed Boolean: " + existReview);
        if (existReview) {
            //Đưa ra option chho người dùng thực hiện chỉnh sửa thay vì log ra RuntimeException
            //
            HotelReview existingReview = reviewRepository
                    .findOptionalByUserIdAndHotelId(userId, hotelId)
                    .orElse(null);
            if (existingReview == null) {
                throw new RuntimeException("Không tìm thấy đánh giá cũ của người dùng này.");
            }
            if (hotelReviewDTO.getRatingPoint() != null) {
                existingReview.setRatingPoint(hotelReviewDTO.getRatingPoint());
            }
            if (hotelReviewDTO.getComment() != null) {
                existingReview.setComment(hotelReviewDTO.getComment());
            }
            if (hotelReviewDTO.getCreatedAt() != null) {
                existingReview.setCreatedAt(hotelReviewDTO.getCreatedAt());
            }
            reviewRepository.save(existingReview);

        } else {
            //Thuc hien luu thong tin nhan xet vao table HotelReview 
            HotelReview review = new HotelReview();
            review.setHotel(hotel);
            review.setUser(user);
            review.setRatingPoint(hotelReviewDTO.getRatingPoint());
            review.setComment(hotelReviewDTO.getComment());
            review.setCreatedAt(LocalDateTime.now());

            reviewRepository.save(review);
//
            // Cập nhật rating trung bình và tổng số review
            Double avgRating = reviewRepository.getAverageRatingByHotelId(hotelId);
            Integer totalReviews = reviewRepository.countByHotel_HotelId(hotelId);

            hotel.setRatingPoint(avgRating);
            hotel.setTotalReview(totalReviews);

            hotelRepository.save(hotel);
        }
    }

    @Override
    public ReviewResponse getReviewsByHotelId(Integer hotelId, int pageNo, int pageSize) {
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1; //XU li lech page
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
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
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1; //XU li lech page
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
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

    @Override
    public ReviewResponse getAllReviews(int pageNo, int pageSize) {
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1; //XU li lech page
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<HotelReview> reviews = reviewRepository.findAll(pageable);

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
