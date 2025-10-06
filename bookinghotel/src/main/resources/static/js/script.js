//  Initialize Navigation--Swiper 
var swiper = new Swiper(".swiper-container", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  loop: true,
  autoplay: {
    delay: 2000,
    disableOnInteration: false
  },
});
// Initialize Testimonitals--Swiper 
var swiper = new Swiper(".testimonitals-swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  slidesPerView: "3",
  loop: true,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: false,
  },
  pagination: {
    el: ".swiper-pagination",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  }
});

//Initialize ManagementTeam--Swiper
var swiper = new Swiper(".management-Swiper", {
  slidesPerView: 4,
  spaceBetween: 40,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 3,
    },
  }
});
//  room- swiper
var swiper = new Swiper(".room-swiper", {
  loop: true,
  pagination: {
    el: ".swiper-pagination",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 2000,
    disableOnInteration: false
  },
});
//List of Hotel
let hotels = [
  {
    id: 1,
    name: "Quy Nhon Center Hotel",
    image: "../../image/hotel/TSMHotel.jpg",
    location: "Quy Nhon city Center, Quy Nhon (Binh Dinh)",
    facilities: ["Wifi", "Hồ bơi", "AC", "Điều hòa"],
    rating: 5,
    price: "200.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 2,
    name: "Seaview Hotel",
    image: "../../image/hotel/hotel1.avif",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 3,
    name: "Quy Nhon Center Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Quy Nhon city Center, Quy Nhon (Binh Dinh)",
    facilities: ["Wifi", "Hồ bơi", "AC", "Điều hòa"],
    rating: 5,
    price: "200.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 4,
    name: "Seaview Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 4,
    name: "Seaview Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 4,
    name: "Seaview Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 5,
    name: "Seaview Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 6,
    name: "Seaview Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 7,
    name: "Seaview Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 8,
    name: "Seaview Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 9,
    name: "Seaview Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  },
  {
    id: 10,
    name: "Seaview Hotel",
    image: "../../image/hotel/QNCenter.jpg",
    location: "Seaside Road, Quy Nhon",
    facilities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đưa đón"],
    rating: 4,
    price: "300.000",
    bookingLink: "#",
    detailsLink: "../html/room.html"
  }
  // ... Thêm nhiều khách sạn khác
];
//List Room in Hotel
let rooms = [
  room_QNCenter = [
    {
      imgRoom: ["../../image/hotel/Quy Nhoncenterhotel_files/QNC1.jpg",
        "../../image/hotel/Quy Nhoncenterhotel_files/QNC11.jpg",
        "../../image/hotel/Quy Nhoncenterhotel_files/QNC111.jpg"],
      nameRoom: "Standard Twin Room",
      facilityRoom: ["2 giường đơn", "Diện tích phòng lớn", "Khu vực cấm hút thuốc", "Vòi sen"],
      matchWith: ["2 Người lớn và 1 trẻ em"],
      price: "200.000"
    },
    {
      imgRoom: ["../../image/hotel/Quy Nhoncenterhotel_files/QNC2.jpg",
        "../../image/hotel/Quy Nhoncenterhotel_files/QNC22.jpg",
        "../../image/hotel/Quy Nhoncenterhotel_files/QNC222.jpg"],
      nameRoom: "Deluxe Triple Room",
      facilityRoom: ["1 giường đơn", "1 giường đôi", "Diện tích phòng lớn", "Có ban công", "Vòi sen"],
      matchWith: ["3 Người lớn và 1 trẻ em"],
      price: "400.000"
    },
    {
      imgRoom:
        [
          "../../image/hotel/Quy Nhoncenterhotel_files/QNC3.jpg",
          "../../image/hotel/Quy Nhoncenterhotel_files/QNC33.jpg",
          "../../image/hotel/Quy Nhoncenterhotel_files/QNC333.jpg"
        ],
      nameRoom: "Superior Triple Room",
      facilityRoom: ["2 giường đơn", "Diện tích phòng lớn", "Khu vực cấm hút thuốc", "Vòi sen"],
      matchWith: ["2 Người lớn và 1 trẻ em"],
      price: "200.000"
    }
  ],
  room_TMSHotel = [
    {
      imgRoom: ["../../image/hotel/room_TMSHotel/1.webp",
        "../../image/hotel/room_TMSHotel/11.webp",
        "../../image/hotel/room_TMSHotel/111.webp"],
      nameRoom: "Sea View Studio",
      facilityRoom: ["2 giường đơn", "Diện tích phòng lớn", "Ban công đối diện biển", "Vòi sen"],
      matchWith: ["2 Người lớn và 1 trẻ em"],
      price: "666.000"
    },
    {
      imgRoom: ["../../image/hotel/room_TMSHotel/2.webp",
        "../../image/hotel/room_TMSHotel/22.webp",
        "../../image/hotel/room_TMSHotel/222.webp"],
      nameRoom: "Sea View Studio with Balcony",
      facilityRoom: ["2 giường đôi", "Diện tích phòng lớn", "Có ban công", "Vòi sen"],
      matchWith: ["3 Người lớn và 1 trẻ em"],
      price: "555.000"
    },
    {
      imgRoom: ["../../image/hotel/room_TMSHotel/3.webp",
        "../../image/hotel/room_TMSHotel/33.webp",
        "../../image/hotel/room_TMSHotel/333.webp"],
      nameRoom: "Sea View Studio with Balcony and Kitchenette",
      facilityRoom: ["2 giường đôi", "Phòng được thiết kế view biển", "Diện tích phòng lớn", "Khu vực cấm hút thuốc", "Vòi sen"],
      matchWith: ["2 Người lớn và 1 trẻ em"],
      price: "999.000"
    }
  ],
  room_FLCSeaTower = [
    {
      imgRoom: ["../../image/hotel/room_FLCSeaTower/1.webp",
        "../../image/hotel/room_FLCSeaTower/11.webp",
        "../../image/hotel/room_FLCSeaTower/111.webp"],
      nameRoom: "1-Bedroom Sea View Apartment",
      facilityRoom: ["1 giường lớn", "1 sofa", "2 giường đơn", "Diện tích phòng lớn", "Nhìn trực diện ra biển", "Khu vực cấm hút thuốc", "Hồ bơi"],
      matchWith: ["4 Người lớn và 1 trẻ em"],
      price: "1.555.000"
    },
    {
      imgRoom: ["../../image/hotel/room_FLCSeaTower/2.webp",
        "../../image/hotel/room_FLCSeaTower/22.webp",
        "../../image/hotel/room_FLCSeaTower/222.webp"],
      nameRoom: "Sea View Studio with Balcony",
      facilityRoom: ["1 giường lớn", "1 giường đôi", "1 sofa", "2 giường đơn", "Diện tích phòng lớn", "Nhìn trực diện ra biển", "Khu vực cấm hút thuốc", "Hồ bơi"],
      matchWith: ["4 Người lớn và 1 trẻ em"],
      price: "2.555.000"
    },
    {
      imgRoom: ["../../image/hotel/room_FLCSeaTower/3.webp",
        "../../image/hotel/room_FLCSeaTower/33.webp",
        "../../image/hotel/room_FLCSeaTower/333.webp"],
      nameRoom: "Three-Bedroom Ocean View Apartment",
      facilityRoom: ["3 giường lớn", "1 sofa", "2 giường đơn", "Diện tích phòng lớn", "Nhìn trực diện ra biển", "Khu vực cấm hút thuốc", "Hồ bơi"],
      matchWith: ["10 Người lớn và 1 trẻ em"],
      price: "3.555.000"
    }
  ]


];

//Load dữ liệu trang websit(render)
let currentPage = 1;
const itemsPerPage = 5;

// Hàm hiển thị danh sách khách sạn theo trang
function renderHotels(page) {
  const hotelListContainer = document.querySelector("#hotel-list .col-lg-9");
  hotelListContainer.innerHTML = ""; // Xóa nội dung cũ

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const hotelsToShow = hotels.slice(0, end); // Hiển thị đến trang hiện tại

  hotelsToShow.forEach((hotel) => {
    const facilitiesHtml = hotel.facilities.map(
      (facility) => `<span class="badge rounded-pill bg-light text-dark text-wrap">${facility}</span>`
    ).join("");

    const ratingStars = "★".repeat(hotel.rating) + "☆".repeat(5 - hotel.rating);

    hotelListContainer.innerHTML += `
            <div class="card mb-4 border-0 shadow">
                <div class="row g-0 p-3 align-items-center">
                    <div class="col-md-5 mb-lg-0 mb-md-0 mb-2">
                        <img src="${hotel.image}" class="img-fluid rounded mx-auto d-block">
                    </div>

                    <div class="col-md-5 px-lg-3 px-md-3 px-0">
                        <h4 class="mb-2 fw-bold">${hotel.name}</h4>

                        <div class="location mb-2">
                            <h6 class="mb-1">Vị trí</h6>
                            <span style="font-size: 10.5px;" class="fw-bold bg-light text-dark text-wrap">
                                <i class="bi bi-geo-fill"></i> ${hotel.location}
                            </span>
                        </div>

                        <div class="Facilities mb-2">
                            <h6 class="mb-1">Tiện ích</h6>
                            ${facilitiesHtml}
                        </div>

                        <div class="rating mb-2">
                            <h6 class="mb-1">Đánh giá</h6>
                            <span class="badge rounded-pill bg-light text-dark text-wrap">
                                ${ratingStars}
                            </span>
                        </div>
                    </div>

                    <div class="col-md-2 mt-lg-0 mt-md-0 mt-4 text-center">
                        <h6 class="mb-4">${hotel.price} vnđ/ đêm</h6>
                        <a href="#" class="btn btn-sm w-100 btn-info btn-outline-primary text-dark shadow-none mb-2 text-white">Đặt ngay</a>
                        <a href="../html/room.html" class="btn btn-sm w-100 btn-outline-info text-dark">Thông tin chi tiết</a>
                    </div>
                </div>
            </div>
        `;
  });

  // Kiểm tra nếu còn khách sạn chưa hiển thị thì hiển thị nút "Xem thêm"
  const loadMoreButton = document.querySelector("#btn-more");
  if (end < hotels.length) {
    loadMoreButton.style.display = "block";
  } else {
    loadMoreButton.style.display = "none";
  }
}

// Hàm tải thêm khách sạn khi nhấn "Xem thêm"
function loadMoreHotels() {
  currentPage++;
  renderHotels(currentPage);
}

// Gọi hàm khi trang web tải xong
document.addEventListener("DOMContentLoaded", () => {
  renderHotels(currentPage);
  document.querySelector("#btn-more").addEventListener("click", loadMoreHotels);
});


//Hiển thị từng phòng trong từng khách sạn

