package com.thoaidev.bookinghotel.model.hotel;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.thoaidev.bookinghotel.model.common.HotelFacility;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public class HotelSpecification {

    public static Specification<Hotel> filter(String hotelName,
            String hotelAddress,
            BigDecimal hotelAveragePrice,
            List<String> hotelFacilities,
            Double ratingPoint,
            Integer ownerId) {

        //Specification là một Interface trong JavaSpring
        //root( Root<T>) tương đương với entity đang thao tác
        //query( CriteriaQuery<?>) tương đương với câu query trong sql
        //cb( CriteriaBuilder) tương đương trình tạo điều kiện 
        //predicate tương đương điều kiện lọc( mệnh đề quan hệ trong sql)
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Predicate predicate;
            // Lọc theo giá trung bình
            if (hotelAveragePrice != null) {
                predicate = cb.ge(root.get("hotelAveragePrice"), hotelAveragePrice);
                predicates.add(predicate);
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
//Cach1:
                //Lay danh sach facility( String)

                // List<String> facilityNames = hotelFacilities.stream()
                //     .map(String::toLowerCase)
                //     .toList();
                // //Tao Predicate: facility.name IN (:facilityNames)
                // predicates.add(facilityJoin.get("name").in(facilityNames));
// //Cach 2:
                List<Predicate> facilityPredicates = new ArrayList<>();
                for(String facility : hotelFacilities){
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

            // Lọc theo thành phố
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
}
