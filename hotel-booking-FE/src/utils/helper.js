import moment from "moment";

export const isEmail = () =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const payloadCreator = (asyncFunc) => async (arg, thunkAPI) => {
  try {
    const res = await asyncFunc(arg);
    return res;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
};

export const formatMoney = (value, character = ".") =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/g, character);

export function humanDate(date, opts = {}) {
  if (!date) return "-";
  const { withTime = false, locale = "vi-VN" } = opts;
  let d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return "-";
  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  const dfDate = new Intl.DateTimeFormat(locale, dateOptions).format(d);
  if (withTime) {
    const dfTime = new Intl.DateTimeFormat(locale, timeOptions).format(d);
    return `${dfDate} ${dfTime}`;
  }
  return dfDate;
}

export const formatDate = (date) =>
  moment(date).format("YYYY-MM-DD").toString();

export const getDayOfBooking = (date) => moment(date).format("DD").toString();
