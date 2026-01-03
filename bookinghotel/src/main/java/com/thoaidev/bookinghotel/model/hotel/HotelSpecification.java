package com.thoaidev.bookinghotel.model.hotel;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.thoaidev.bookinghotel.exceptions.BadRequestException;
import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.common.HotelFacility;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.room.entity.Room;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class HotelSpecification {

    public static Specification<Hotel> filter(
            String hotelName,
            String hotelAddress,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            List<String> hotelFacilities,
            Double ratingPoint) {

        //Specification là một Interface trong JavaSpring
        //root( Root<T>) tương đương với entity đang thao tác
        //query( CriteriaQuery<?>) tương đương với câu query trong sql
        //cb( CriteriaBuilder) tương đương trình tạo điều kiện 
        //predicate tương đương điều kiện lọc( mệnh đề quan hệ trong sql)
        return (root, query, cb) -> {
            //Khởi tạo một tập các điều kiện truy vấn (predicates)
            List<Predicate> predicates = new ArrayList<>();
            Predicate predicate;
            // Lọc theo khoảng giá
            if (minPrice != null || maxPrice != null) {
                if (minPrice != null) {
                    predicate = cb.ge(root.get("hotelAveragePrice"), minPrice);
                    predicates.add(predicate);
                }
                if (maxPrice != null) {
                    predicate = cb.le(root.get("hotelAveragePrice"), maxPrice);
                    predicates.add(predicate);
                }
            }
            // // Lọc theo giá tối thiểu
            // if (filter.getMinPrice() != null) {
            //     predicate =  cb.ge(root.get("hotelAveragePrice"), filter.getMinPrice());
            //     predicates.add(predicate);
            // }

            // // Lọc theo giá tối đa
            // if (filter.getMaxPrice() != null) {
            //     predicate =  cb.le(root.get("hotelAveragePrice"), filter.getMaxPrice());
            //     predicates.add(predicate);
            // }
            // Lọc theo tiện nghi
            if (hotelFacilities != null && !hotelFacilities.isEmpty()) {
                Join<Hotel, HotelFacility> facilityJoin = root.join("facilities", JoinType.INNER);

                List<Predicate> facilityPredicates = new ArrayList<>();
                for (String facility : hotelFacilities) {
                    String keyword = "%" + facility.toLowerCase() + "%";
                    facilityPredicates.add(
                            cb.like(cb.lower(facilityJoin.get("name")), keyword)
                    );
                }
                //Gop OR: (facility.name LIKE '%wifi%' OR facility.name LIKE '%pool%')
                predicates.add(cb.or(facilityPredicates.toArray(new Predicate[0])));
            }

            // Lọc theo đánh giá
            if (ratingPoint != null) {
                predicates.add(cb.ge(root.get("ratingPoint"), ratingPoint));
            }

            // Lọc theo address
            if (hotelAddress != null && !hotelAddress.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("hotelAddress")), "%" + hotelAddress.toLowerCase() + "%"));
            }
            // Lọc theo tên
            if (hotelName != null && !hotelName.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("hotelName")), "%" + hotelName.toLowerCase() + "%"));
            }
            Predicate predicated = cb.and(predicates.toArray(new Predicate[0]));
            System.out.println("Filter result: " + predicated);
            return predicated;
        };
    }

    //test
    public static Specification<Hotel> filterAll(
            String hotelName,
            String hotelAddress,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            List<String> hotelFacilities,
            Double ratingPoint,
            LocalDate checkin,
            LocalDate checkout) {

        //Specification là một Interface trong JavaSpring
        //root( Root<T>) tương đương với entity đang thao tác
        //query( CriteriaQuery<?>) tương đương với câu query trong sql
        //cb( CriteriaBuilder) tương đương trình tạo điều kiện 
        //predicate tương đương điều kiện lọc( mệnh đề quan hệ trong sql)
        return (root, query, cb) -> {
            //Khởi tạo một tập các điều kiện truy vấn (predicates)
            List<Predicate> predicates = new ArrayList<>();
            Predicate predicate;
                       // Lọc theo khoảng giá
            if (minPrice != null || maxPrice != null) {
                if (minPrice != null) {
                    predicate = cb.ge(root.get("hotelAveragePrice"), minPrice);
                    predicates.add(predicate);
                }
                if (maxPrice != null) {
                    predicate = cb.le(root.get("hotelAveragePrice"), maxPrice);
                    predicates.add(predicate);
                }
            }

            // Lọc theo tiện nghi
            if (hotelFacilities != null && !hotelFacilities.isEmpty()) {
                Join<Hotel, HotelFacility> facilityJoin = root.join("facilities", JoinType.INNER);

                List<Predicate> facilityPredicates = new ArrayList<>();
                for (String facility : hotelFacilities) {
                    String keyword = "%" + facility.toLowerCase() + "%";
                    facilityPredicates.add(
                            cb.like(cb.lower(facilityJoin.get("name")), keyword)
                    );
                }
                //Gop OR: (facility.name LIKE '%wifi%' OR facility.name LIKE '%pool%')
                predicates.add(cb.or(facilityPredicates.toArray(new Predicate[0])));
            }

            // Lọc theo đánh giá
            if (ratingPoint != null) {
                predicates.add(cb.ge(root.get("ratingPoint"), ratingPoint));
            }

            // Lọc theo address
            if (hotelAddress != null && !hotelAddress.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("hotelAddress")), "%" + hotelAddress.toLowerCase() + "%"));
            }
            // Lọc theo tên
            if (hotelName != null && !hotelName.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("hotelName")), "%" + hotelName.toLowerCase() + "%"));
            }

            //Lọc theo checkin checkout
            if (checkin != null && checkout != null) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Room> roomRoot = subquery.from(Room.class);
                Join<Room, Booking> bookingJoin = roomRoot.join("bookings", JoinType.INNER);

                subquery.select(roomRoot.get("hotel").get("hotelId"))
                        .where(
                                cb.equal(roomRoot.get("hotel").get("hotelId"), root.get("hotelId")),
                                cb.greaterThan(bookingJoin.get("checkoutDate"), checkin),
                                cb.lessThan(bookingJoin.get("checkinDate"), checkout),
                                bookingJoin.get("status").in("PAID", "PENDING")
                        );

                predicates.add(cb.not(cb.exists(subquery)));
            }
            Predicate predicated = cb.and(predicates.toArray(new Predicate[0]));
            System.out.println("Filter result: " + predicated);
            return predicated;
        };
    }

    public static Specification<Room> filter(LocalDate checkin, LocalDate checkout) {

        return (root, query, cb) -> {
            //tạo một query con
            Subquery<Long> sub = query.subquery(Long.class);
            Root<Booking> bookingRoot = sub.from(Booking.class);

            sub.select(bookingRoot.get("bookingId"))
                    .where(
                            cb.equal(bookingRoot.get("room").get("roomId"), root.get("roomId")),
                            cb.greaterThan(bookingRoot.get("checkoutDate"), checkin),
                            cb.lessThan(bookingRoot.get("checkinDate"), checkout),
                            bookingRoot.get("status").in("PAID", "PENDING")
                    );
            return cb.not(cb.exists(sub));
        };
    }
}
