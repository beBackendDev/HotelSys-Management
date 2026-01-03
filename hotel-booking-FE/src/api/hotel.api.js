import http from "../utils/http";
import qs from "query-string"; 
export const hotelApi = {
  searchHotel(params) {
    return http.get("/api/user/public/hotels/filter", {
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
  },
  updateProfileHotel(data) {
    return http.put("/hotel", data);
  },
};
