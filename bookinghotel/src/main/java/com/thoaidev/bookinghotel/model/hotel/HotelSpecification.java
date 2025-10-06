package com.thoaidev.bookinghotel.model.hotel;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;

import jakarta.persistence.criteria.Predicate;

public class HotelSpecification {
     public static Specification<Hotel> filter(FilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Lọc theo giá tối thiểu
            if (filter.getMinPrice() != null) {
                predicates.add(cb.ge(root.get("hotelAveragePrice"), filter.getMinPrice()));
            }

            // Lọc theo giá tối đa
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.le(root.get("hotelAveragePrice"), filter.getMaxPrice()));
            }

            // Lọc theo tiện nghi
            if (filter.getFacility() != null && !filter.getFacility().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("hotelFacility")), "%" + filter.getFacility().toLowerCase() + "%"));
            }

            // Lọc theo đánh giá
            if (filter.getRating() != null) {
                predicates.add(cb.ge(root.get("hotelRating"), filter.getRating()));
            }

            // Lọc theo thành phố
            if (filter.getLocation() != null && !filter.getLocation().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("hotelAddress")), "%" + filter.getLocation().toLowerCase() + "%"));
            }
            // Lọc theo tên
            if (filter.getName() != null && !filter.getName().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("hotelName")), "%" + filter.getName().toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
