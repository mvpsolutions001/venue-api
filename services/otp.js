import axios from "axios";
import {
  OTP_GENERATE_HOST,
  OTP_PURPOSE,
  OTP_SERVICE_EXPIRY,
  OTP_SERVICE_NAME,
  OTP_VALIDATE_HOST,
} from "../db/conn.js";

export const requestOTPTest = (email = "", name = "") =>
  new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: OTP_GENERATE_HOST,
      data: {
        email: email,
        name: name,
        expiry: OTP_SERVICE_EXPIRY,
      },
      headers: {
        "Service-Name": OTP_SERVICE_NAME,
        Purpose: OTP_PURPOSE,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log(response);
        resolve({
          status: 200,
          data: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve({
          status: 400,
          data: error,
        });
      })
      .finally(function () {
        // always executed
      });
  });
export const requestOTP = (email = "", name = "") =>
  new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: OTP_GENERATE_HOST,
      data: {
        email: email,
        name: name,
        expiry: OTP_SERVICE_EXPIRY,
      },
      headers: {
        "Service-Name": OTP_SERVICE_NAME,
        Purpose: OTP_PURPOSE,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log(response);
        resolve({
          status: 200,
          data: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve({
          status: 400,
          data: null,
        });
      })
      .finally(function () {
        // always executed
      });
  });

export const validateOTP = (token = "", otp = "") =>
  new Promise((resolve, reject) => {
    let config = {
      headers: {
        "Service-Name": OTP_SERVICE_NAME,
        Token: token,
        "Content-Type": "application/json",
      },
    };

    axios({
      method: "post",
      url: OTP_VALIDATE_HOST,
      data: {
        otp: otp,
      },
      headers: {
        "Service-Name": OTP_SERVICE_NAME,
        Token: token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        resolve({
          status: 200,
          data: response,
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve({
          status: 400,
          data: null,
        });
      })
      .finally(function () {
        // always executed
      });
  });
