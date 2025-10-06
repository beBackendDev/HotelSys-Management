import http from "../utils/http";
export const hotelApi = {
  searchHotel(config) {
    // return http.get("/hotel/search", config);
    return http.post("/api/user/public/hotels/filter", config);

  },
  updateProfileHotel(data) {
    return http.put("/hotel", data);
  },
};
