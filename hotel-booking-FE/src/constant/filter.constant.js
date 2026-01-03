// constants/filter.constant.js
export const PRICE_RANGES = [
  { value: "LT_500", label: "< 500.000đ / đêm" },
  { value: "500_1000", label: "500.000đ - 1.000.000đ" },
  { value: "GT_1000", label: "> 1.000.000đ" },
];

export const RATINGS = [
  { value: 5, stars: 5 },
  { value: 4, stars: 4 },
  { value: 3, stars: 3 },
  { value: 2, stars: 2 },
  { value: 1, stars: 1 },
];

export const FACILITIES = [
  { code: "WIFI", label: "Wifi miễn phí" },
  { code: "PARKING", label: "Bãi giữ xe miễn phí" },
  { code: "BALCONY", label: "Ban công" },
];
