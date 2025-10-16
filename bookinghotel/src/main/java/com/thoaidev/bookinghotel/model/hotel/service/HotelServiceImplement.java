package com.thoaidev.bookinghotel.model.hotel.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thoaidev.bookinghotel.exceptions.NotFoundException;
import com.thoaidev.bookinghotel.model.common.HotelFacility;
import com.thoaidev.bookinghotel.model.common.HotelFacilityDTO;
import com.thoaidev.bookinghotel.model.enums.HotelStatus;
import com.thoaidev.bookinghotel.model.hotel.FilterRequest;
import com.thoaidev.bookinghotel.model.hotel.HotelSpecification;
import com.thoaidev.bookinghotel.model.hotel.dto.HotelDto;
import com.thoaidev.bookinghotel.model.hotel.dto.response.HotelResponse;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.mapper.HotelMapper;
import com.thoaidev.bookinghotel.model.hotel.repository.HotelRepository;
import com.thoaidev.bookinghotel.model.image.entity.Image;
import com.thoaidev.bookinghotel.model.image.service.ImageService;

@Service
public class HotelServiceImplement implements HotelService {

    @Autowired
    private HotelMapper hotelMapper;
    @Autowired
    private final HotelRepository hotelRepository;

    public HotelServiceImplement(HotelRepository hotelRepo) {
        this.hotelRepository = hotelRepo;
    }
    @Autowired
    private ImageService imageService;

    //User: TÌm toàn bộ danh sách các khách sạn
    @Override
    public HotelResponse getAllHotels(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Hotel> hotels = hotelRepository.findAll(pageable);
        List<Hotel> listOfHotels = hotels.getContent();

        List<HotelDto> content = listOfHotels.stream()
                .map(hotelMapper::mapToHotelDto)
                // .map((hotel) -> mapToHotelDto(hotel))
                .collect(Collectors.toList());

        HotelResponse hotelResponse = new HotelResponse();
        hotelResponse.setContent(content);
        hotelResponse.setPageNo(hotels.getNumber());
        hotelResponse.setPageSize(hotels.getSize());
        hotelResponse.setTotalElements(hotels.getTotalElements());
        hotelResponse.setTotalPage(hotels.getTotalPages());
        hotelResponse.setLast(hotels.isLast());
        return hotelResponse;
    }

    //User: lấy thông tin khách sạn theo ID
    @Override
    public HotelDto getHotelById(Integer id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Đối tượng Hotel không tồn tại"));
        return hotelMapper.mapToHotelDto(hotel);
    }

    @Override
    public HotelResponse getAllHotels(FilterRequest filter) {
        List<Hotel> hotels = hotelRepository.findAll(HotelSpecification.filter(filter));
        List<HotelDto> content = hotels.stream()
                .map(hotelMapper::mapToHotelDto)
                .collect(Collectors.toList());

        HotelResponse hotelResponse = new HotelResponse();
        hotelResponse.setContent(content); // Chỉ cần gán content

        return hotelResponse;
    }

    //
    @Override
    public List<Hotel> getHotelsByAddress(String location) {
        return hotelRepository.findByHotelAddressContainingIgnoreCase(location);  // Tìm khách sạn theo địa chỉ
    }

    @Override
    public List<Hotel> getHotelsByName(String name) {
        return hotelRepository.findByHotelNameContainingIgnoreCase(name);  // Tìm khách sạn theo địa chỉ
    }

    //Admin: tạo mởi khách sạn
    @Override
    public HotelDto createHotel(HotelDto hotelDto) {
        Hotel hotel = new Hotel();
        hotel.setHotelName(hotelDto.getHotelName());
        hotel.setHotelAddress(hotelDto.getHotelAddress());
        hotel.setHotelDescription(hotelDto.getHotelDescription());
        hotel.setRatingPoint(0.0);// mặc định khách sạn được tạo mới có điểm đánh giá 0.0 -> chưa đánh giá
        hotel.setTotalReview(0);// mặc định khách sạn được tạo mới có điểm đánh giá 0.0 -> chưa đánh giá
        hotel.setHotalStatus(HotelStatus.AVAILABLE);// AVAILABLE cho khách sạn tạo mới chưa được booked
        hotel.setHotelContactMail(hotelDto.getHotelContactMail());
        hotel.setHotelContactPhone(hotelDto.getHotelContactPhone());
        hotel.setHotelAveragePrice(hotelDto.getHotelAveragePrice());

        // Facilities (FacilityDto → Facility entity)
        if (hotelDto.getHotelFacilities() != null) {
            hotel.setFacilities(
                    hotelDto.getHotelFacilities().stream()
                            .map(f -> {
                                HotelFacility facility = new HotelFacility();
                                facility.setId(f.getId());
                                facility.setIcon(f.getIcon());
                                facility.setName(f.getName());
                                facility.setHotel(hotel); // Quan trọng: gán hotel cho facility
                                return facility;
                            })
                            .collect(Collectors.toList())
            );
        }

        List<Image> imageEntities = Optional.ofNullable(hotelDto.getHotelImageUrls())
                .orElse(Collections.emptyList())
                .stream()
                .map(url -> Image.builder()
                .url(url)
                .hotel(hotel)
                .build())
                .collect(Collectors.toList());

        hotel.setHotelImages(imageEntities);
        // Set thời gian tạo và cập nhật
        LocalDateTime now = LocalDateTime.now();
        hotel.setHotelCreatedAt(now);
        hotel.setHotelUpdatedAt(now);

        Hotel savedHotel = hotelRepository.save(hotel);//goị tới Repository để update lên DB
        return hotelMapper.mapToHotelDto(savedHotel);
    }

//Admin: Xóa khách sạn
    @Override
    public void deleteHotelById(Integer id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new NotFoundException("Đối tượng Hotel không tồn tại"));
        hotelRepository.delete(hotel);
    }
//Admin: Cập nhật khách sạn

    @Override
    public HotelDto updateHotel(HotelDto hotelDto, Integer id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new NotFoundException("Khách sạn không tồn tại"));

        if (hotelDto.getHotelName() != null) {
            hotel.setHotelName(hotelDto.getHotelName());
        }
        if (hotelDto.getHotelAddress() != null) {
            hotel.setHotelAddress(hotelDto.getHotelAddress());

        }
        if (hotelDto.getHotelDescription() != null) {
            hotel.setHotelDescription(hotelDto.getHotelDescription());

        }
// Facilities
        if (hotelDto.getHotelFacilities() != null) {
            // Lấy danh sách facility hiện tại từ entity
            List<HotelFacility> currentFacilities = hotel.getFacilities();

            for (HotelFacilityDTO fDto : hotelDto.getHotelFacilities()) {
                // Kiểm tra xem facility này đã tồn tại chưa
                boolean exists = currentFacilities.stream()
                        .anyMatch(f -> f.getName().equalsIgnoreCase(fDto.getName()));
                // hoặc so sánh theo id nếu DTO luôn gửi id

                if (!exists) {
                    HotelFacility newFacility = new HotelFacility();
                    newFacility.setIcon(fDto.getIcon());
                    newFacility.setName(fDto.getName());
                    newFacility.setHotel(hotel);
                    currentFacilities.add(newFacility);
                }
            }
        }

        if (hotelDto.getHotelAveragePrice() != null) {
            hotel.setHotelAveragePrice(hotelDto.getHotelAveragePrice());

        }
        if (hotelDto.getRatingPoint() != null) {
            hotel.setRatingPoint(hotelDto.getRatingPoint());

        }
        if (hotelDto.getTotalReview() != null) {
            hotel.setTotalReview(hotelDto.getTotalReview());

        }
        if (hotelDto.getHotelStatus() != null) {
            hotel.setHotalStatus(hotelDto.getHotelStatus());

        }
        if (hotelDto.getHotelContactPhone() != null) {
            hotel.setHotelContactPhone(hotelDto.getHotelContactPhone());

        }
        if (hotelDto.getHotelContactMail() != null) {
            hotel.setHotelContactMail(hotelDto.getHotelContactMail());

        }
//Images
        if (hotelDto.getHotelImageUrls() != null) {
            // Lấy danh sách facility hiện tại từ entity
            List<Image> currentHotelImages = hotel.getHotelImages();
            List<String> newHotelImagesUrls = hotelDto.getHotelImageUrls();

            //Lấy danh sách imgUls hiện tại từ DB
            Set<String> currentUrls = currentHotelImages.stream()
                    .map(Image::getUrl)
                    .collect(Collectors.toSet());

            // Xóa ảnh không còn trong DTO
            currentHotelImages.removeIf(img -> !newHotelImagesUrls.contains(img.getUrl()));

            // Thêm ảnh mới từ DTO
            for (String url : newHotelImagesUrls) {
                if (!currentUrls.contains(url)) {
                    Image newImage = Image.builder()
                            .url(url)
                            .hotel(hotel)
                            .build();
                    currentHotelImages.add(newImage);
                }
            }
        }

        Hotel updatedHotel = hotelRepository.save(hotel);
        return hotelMapper.mapToHotelDto(updatedHotel);
    }

    //IMAGE UPLOAD
    @Override
    public List<String> imgUpload(Integer hotelId, List<MultipartFile> files, String hotelName) {
        try {
            // throw lỗi khi input không chứa giá trị
            if (files == null || files.isEmpty()) {
                throw new IllegalArgumentException("Invalid Image File");
            }

            Hotel hotel = hotelRepository.findById(hotelId)
                    .orElseThrow(() -> new RuntimeException("Hotel didnt found"));

            // Tạo danh sách chứa tất cả url ảnh được up lên
            List<String> uploadedUrls = new ArrayList<>();

            for (MultipartFile file : files) {
                if (file.isEmpty() || file.getOriginalFilename() == null) {
                    continue; // Bỏ qua file lỗi
                }
                String safeHotelName = hotelName.replaceAll("[^a-zA-Z0-9-_]", "_");
                String imageUrl = imageService.upload(file, safeHotelName + "/hotels/" + hotelId);//trả về với url /uploads/hotelName/hotels/{hotelId}/image.jpeg
                System.out.println("HotelSer print ImageUrl: " + imageUrl);
                Image newImage = Image.builder()
                        .url(imageUrl)
                        .hotel(hotel)
                        .build();

                hotel.getHotelImages().add(newImage);
                uploadedUrls.add(imageUrl);
            }
            hotelRepository.save(hotel);
            return uploadedUrls.stream()
                    .map(url -> url)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi đọc file upload: " + e.getMessage(), e);
        }
    }

    @Override
    public List<HotelDto> fetchHotelsFromRapidAPI(LocalDate checkin, LocalDate checkout) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fetchHotelsFromRapidAPI'");
    }
}
