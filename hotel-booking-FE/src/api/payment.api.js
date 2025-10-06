import http from "../utils/http";

const paymentApi = {

  pay: (data) => {
    console.log("(payment.api.js )API call /api/user/public/create với:", data);
    return http.post("/api/user/public/create", data);
  }


};

export default paymentApi;
