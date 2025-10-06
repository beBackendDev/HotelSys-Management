//
export function safeJSONParse(key) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch (err) {
    console.error("Lỗi parse JSON:", err);
    return null;
  }
}
