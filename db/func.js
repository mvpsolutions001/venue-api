import dayjs from "dayjs";

import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// Add the plugins
dayjs.extend(utc);

function parseName(name = "") {
  const [last, rest] = name.split(",");
  const parts = (rest || "").trim().split(" ");

  return {
    lname: last?.trim() || "",
    fname: parts[0] || "",
    mname: parts.slice(1).join(" ") || "",
  };
}

function formatDetails(summary = []) {
  return summary
    .map((item) => `${item.description}: ${item.amount}`)
    .join(", ");
}

export const transformEntry = (entry, rowIndex = 0) => {
  const nameParts = parseName(entry.client?.name || "");

  return {
    id: entry.request_id || "", // fallback if _id is not provided
    row_number: rowIndex + 1, // optional index for row tracking
    request_id: entry.request_id || "",
    or_number: entry.order_num || "",
    field_office: entry.office?.field || "",
    tin: entry.office?.tin || "",
    or_date: dayjs(entry.parsedDate).utc().format("YYYY-MM-DD") || "",
    fname: nameParts.fname,
    lname: nameParts.lname,
    mname: nameParts.mname,
    tin_or: entry.client?.tin || "",
    lto_client_id: entry.client?.id || "",
    address: entry.client?.address || "",
    details: formatDetails(entry.payment_summary),
    amount: entry.amount_paid || "",
    merchant_id: entry.merchant?.id || entry.merchant_id || "",
    merchant_name: entry.merchant?.name || "",
    pchannel: entry.pchannel || "",
    creation_date: dayjs(entry.parsedDate).utc().format("YYYY-MM-DD") || "",
    qr_data: entry.qr_data || "",
    uid: entry.merchant?.id || entry.merchant_id || "",
  };
};

export const flattenObject = (obj, prefix = "", result = {}) => {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    if (key === "_id") continue;

    const value = obj[key];
    const prefixedKey = prefix ? `${prefix}_${key}` : key;

    // Skip flattening payment_summary
    if (key === "payment_summary") {
      result[prefixedKey] = value; // Keep as original array
      continue;
    }

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      flattenObject(value, prefixedKey, result);
    } else {
      result[prefixedKey] = value;
    }
  }

  return result;
};

export const processProjections = (err, data) => {
  if (err) {
    console.log("err");
    console.log(err);
    return [];
  }

  const plainProductsArray = data.map((data) => data.toObject());
  console.log(plainProductsArray);
};
export function getTimestamp() {
  const today = new Date();

  const dateObj = new Date(
    today.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
  );

  var dateTime = dateObj.getTime();

  var timestamp = Math.floor(dateTime / 1000);

  return timestamp;
}

export function getTimestring() {
  const today = new Date();

  const dateObj = new Date(
    today.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
  );

  return dateObj.getTime();
}

function makeidAlphaUpperNumeric(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function makeidAlphaUpperLowerNumeric(length) {
  var result = "";
  var characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjklmnpqrstuvwxyz23456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export const generateId = (prefix, id) => {
  return prefix + ("000" + id + getTimestring()) + makeidAlphaUpperNumeric(4);
};

export const formatDateTime = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months start at 0
  const dd = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} | ${formattedHours}:${minutes} ${ampm}`;
};

export function formatDate(dateString) {
  if (!dateString || dateString === "") return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
