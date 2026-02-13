import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  ACCOUNT_LOCK_TIME_IN_MINUTES,
  APP_ENV,
  AUTO_LOGOUT_MINUTES,
  DEFAULT_MERCHANT,
  FAILED_ATTEMPTS,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  MONGO_DB_ENDPOINT,
} from "./conn.js";

import {
  ActivityLog,
  Download,
  hashPassword,
  Role,
  RoleItem,
  RoleMatrix,
  RoleModule,
  RoleSubmodule,
  Token,
  User,
} from "./schema.js";
import {
  generateId,
  makeidAlphaUpperLowerNumeric,
  transformEntry,
} from "./func.js";
import {
  itemData,
  matrixData,
  moduleData,
  submoduleData,
} from "./initialData.js";
import { dashboardPipeline, roleListPipeLine } from "./pipelines.js";

import { pooldb } from "./pgdb.js";
import { generateResetToken } from "./utils/tokenUtils.js";
import {
  sendForgotPasswordResetEmailNotification,
  sendPasswordResetEmailNotification,
} from "../services/notifications.js";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { requestOTP, validateOTP } from "../services/otp.js";

// Add the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const THREE_MONTHS_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

const connectDb = async () => {
  // let connString = MONGO_DB_ENDPOINT;

  // await mongoose.connect(connString);
  return true;
};

export const initDB = async () => {
  await connectDb();
  let docsArray = [
    {
      rid: generateId("RL", 1),
      code: "admin",
      name: "Admin",
      description: "System administrator",
      rank: 1,
      is_active: 1,
    },
    {
      rid: generateId("RL", 2),
      code: "merchant_manager",
      name: "Merchant",
      description: "Merchant management",
      rank: 2,
      is_active: 1,
    },
    {
      rid: generateId("RL", 3),
      code: "user",
      name: "User",
      description: "User",
      rank: 3,
      is_active: 1,
    },
  ];
  await Role.insertMany(docsArray)
    .then(function () {
      console.log("Role Data inserted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
};

export const initRolesDB = async () => {
  await connectDb();

  await RoleModule.insertMany(moduleData);
  await RoleSubmodule.insertMany(submoduleData);
  await RoleItem.insertMany(itemData);
  await RoleMatrix.insertMany(matrixData);
};

export const dbListActivityLogs = async (params, user) => {
  await connectDb();
  let result;

  let pipelines = [];

  pipelines.push({
    $addFields: {
      formattedCreatedAt: {
        $dateToString: {
          date: "$createdAt",
          format: "%Y-%m-%d %H:%M:%S",
        },
      },
    },
  });

  if (
    params.filter &&
    params.filter.dateFrom &&
    params.filter.dateTo &&
    user.role === "admin"
  ) {
    pipelines.push({
      $match: {
        createdAt: {
          $gte: new Date([params.filter.dateFrom, "T00:00:00Z"].join("")),
          $lte: new Date([params.filter.dateTo, "T23:59:59Z"].join("")),
        },
      },
    });
  } else if (
    params.filter &&
    params.filter.dateFrom &&
    params.filter.dateTo &&
    user.role === "merchant_manager" &&
    user.merchant_id !== "default"
  ) {
    pipelines.push({
      $match: {
        mid: user.merchant_id,
        createdAt: {
          $gte: new Date([params.filter.dateFrom, "T00:00:00Z"].join("")),
          $lte: new Date([params.filter.dateTo, "T23:59:59Z"].join("")),
        },
      },
    });
  } else if (
    !params.filter &&
    !params.filter?.dateFrom &&
    !params.filter?.dateTo &&
    (user.role === "merchant_manager" || user.role === "user") &&
    user.merchant_id === "default"
  ) {
    pipelines.push({
      $match: {
        mid: "na",
      },
    });
  } else if (
    !params.filter &&
    !params.filter?.dateFrom &&
    !params.filter?.dateTo &&
    user.role === "merchant_manager" &&
    user.merchant_id !== "default"
  ) {
    pipelines.push({
      $match: {
        mid: user.merchant_id,
      },
    });
  }

  pipelines.push({
    $project: {
      _id: 1,
      log_action: 1, // your custom fields
      description: 1,
      ip_address: 1,
      uid: 1,
      mid: 1,
      mname: 1,
      uname: 1,
      createdAt: 1,
      formattedCreatedAt: 1,
    },
  });
  pipelines.push({
    $sort: { createdAt: -1 },
  });

  let logs = await ActivityLog.aggregate(pipelines);

  const formattedItems = logs.map((item) => {
    const { createdAt, formattedCreatedAt, ...rest } = item;

    return {
      ...rest,
      formattedCreatedAt: dayjs(createdAt)
        .tz("Asia/Manila")
        .format("YYYY-MM-DD | hh:mm a"),
    };
  });

  return formattedItems;
};

export const dbAddActivityLogs = async (params) => {
  await connectDb();

  let filter = {};

  const newParams = { ...params, creation_date: new Date() };

  const newLog = new ActivityLog(newParams);
  return await newLog.save();
};

export const dbViewRole = async (role) => {
  await connectDb();

  let filter = {};
  let matrixes = await RoleMatrix.find({
    role_code: role,
    is_active: 1,
  }).select("is_active item_code -_id");

  let matrixList = matrixes.map(function (matrix) {
    return matrix.item_code;
  });

  if (matrixList.includes("itm-04") || matrixList.includes("itm-05")) {
    matrixList.push("itm-045");
  }

  return matrixList;
};
export const dbListRoles = async () => {
  await connectDb();

  let filter = {};
  // return await Role.find();
  let roleMatrix = await Role.aggregate(roleListPipeLine);
  // return roleMatrix;
  var newMatrix = [];

  for (var m in roleMatrix) {
    newMatrix.push(...roleMatrix[m].matrix);
  }

  var finalMatrix = {};
  var copyMatrix = newMatrix;

  for (let i = 0; i < copyMatrix.length; i++) {
    if (finalMatrix[copyMatrix[i].module]) {
      if (finalMatrix[copyMatrix[i].module][copyMatrix[i].sub_module]) {
        if (
          finalMatrix[copyMatrix[i].module][copyMatrix[i].sub_module][
            copyMatrix[i].items
          ]
        ) {
          finalMatrix[copyMatrix[i].module][copyMatrix[i].sub_module][
            copyMatrix[i].items
          ][copyMatrix[i].role_code] = [
            copyMatrix[i].item_code,
            copyMatrix[i].is_active,
          ].join(":");
        } else {
          finalMatrix[copyMatrix[i].module][copyMatrix[i].sub_module][
            copyMatrix[i].items
          ] = {};
          i--;
        }
      } else {
        finalMatrix[copyMatrix[i].module][copyMatrix[i].sub_module] = {};
        i--;
      }
    } else {
      finalMatrix[copyMatrix[i].module] = {};
      i--;
    }
  }

  const result = [];

  const input = finalMatrix;

  for (const module in input) {
    const subModules = input[module];
    for (const subModule in subModules) {
      const items = subModules[subModule];
      for (const item in items) {
        const roles = items[item];
        result.push({
          module,
          sub_module:
            subModule === "Roles" ? "Roles and Permission" : subModule,
          items: item,
          admin: ["admin", roles.admin.toString()].join(":"),
          merchant_manager: [
            "merchant_manager",
            roles.merchant_manager.toString(),
          ].join(":"),
          user: ["user", roles.user.toString()].join(":"),
        });
      }
    }
  }

  return result;
};

export const dbUpdateRoleMatrix = async (params, uid) => {
  await connectDb();

  let filter = {};
  let result = await RoleMatrix.updateOne(
    { role_code: params.role_code, item_code: params.item_code },
    params,
  );
  await loadLogActivitySessionUser(uid, "role_update", params.logs);
  return result;
};
/* users */
export const dbValidateToken = async (token, req) => {
  await connectDb();

  const storedToken = await Token.findOne({ token });

  if (!storedToken) {
    return { code: 400, message: "Token not found" };
  }

  if (storedToken.revoked) {
    return { code: 400, message: "Token has been revoked" };
  }

  if (storedToken.expiresAt < new Date()) {
    return { code: 400, message: "Token has expired" };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // ✅ Load the user using ID from decoded token
    const user = await User.findOne({
      _id: decoded.id,
      status: 1,
    }).select(
      "uid first_name last_name email role merchant_id merchant_name status -_id",
    );

    if (!user) {
      return { code: 404, message: "User not found" };
    }

    let reVerifyTokenResult = user.verifyTokenContext(token, req);

    if (!reVerifyTokenResult.valid)
      return { code: 400, message: "Invalid token" };

    if (user.role !== "admin") {
      let merchantStatus = "";
      if (merchantStatus === "Inactive")
        return {
          code: 406,
          data: "Merchant Inactive",
        };
    }

    storedToken.lastActiveAt = new Date();
    await storedToken.save();

    return { code: 200, data: user };
    // return decoded;
  } catch (err) {
    console.log(err);
    return { code: 400, message: "Invalid token" };
  }
};

export const dbValidateResetToken = async (token) => {
  await connectDb();
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() }, // token must be in future
  });

  if (!user) {
    return {
      code: 404,
      data: "Invalid or expired reset token",
    };
  }

  return {
    code: 200,
    data: {
      resetToken: user.resetToken,
    },
  }; // Token is valid
};
export const dbValidateResetTokenAndSave = async (params) => {
  await connectDb();
  const user = await User.findOne({
    resetToken: params.token,
    resetTokenExpires: { $gt: Date.now() }, // token must be in future
  });

  if (!user) {
    return {
      code: 409,
      data: "invalid",
    };
  }

  const reused = user.password_history.some((entry) => {
    return (
      entry.changedAt >= THREE_MONTHS_AGO &&
      bcrypt.compareSync(params.password, entry.password)
    );
  });

  if (reused) {
    return {
      code: 409,
      data: "invalid",
    };
  }

  const uppercaseReg = /[A-Z]/;
  const lowercaseReg = /[a-z]/;
  const numberReg = /[0-9]/;
  const specialCharReg = /[!@#$%^&*(),.?":{}|<>]/;

  let newPassword = params.password;

  if (newPassword.length < 8 || newPassword.length > 20) {
    return {
      code: 409,
      data: "invalid",
    };
  } else if (!uppercaseReg.test(newPassword)) {
    return {
      code: 409,
      data: "invalid",
    };
  } else if (!lowercaseReg.test(newPassword)) {
    return {
      code: 409,
      data: "invalid",
    };
  } else if (!numberReg.test(newPassword)) {
    return {
      code: 409,
      data: "invalid",
    };
  } else if (!specialCharReg.test(newPassword)) {
    return {
      code: 409,
      data: "invalid",
    };
  }

  if (user.password) {
    user.password_history.push({
      password: user.password,
      changedAt: new Date(),
    });
  }

  user.password = params.password;
  user.is_reset_password = 0;
  user.resetToken = "";
  user.resetTokenExpires = null;
  await user.save({ validateBeforeSave: false });

  await directLogActivitySessionUser(
    user.uid,
    "user_reset",
    `User ${user.email} changed their password successfully.`,
    user.merchant_id,
    [user.first_name, user.last_name].join(" "),
  );

  return {
    code: 200,
    data: true,
  };
};
export const dbLogin = async (params, req) => {
  await connectDb();

  const user = await User.findOne({ email: params.email });

  if (!user || !user.password) {
    return {
      code: 404,
      data: "Invalid",
    };
  }

  // if (!user.otpTokenExpires || user.otpTokenExpires < new Date()) {
  //   return {
  //     code: 404,
  //     data: "Invalid",
  //   };
  // } else {
  //   //validate otp
  //   let otp = await validateOTP(user.otpToken, params.otp);

  //   if (otp && otp.data && otp.data.data.success) {
  //     // leave it
  //   } else {
  //     return {
  //       code: 404,
  //       data: "Invalid",
  //     };
  //   }
  // }

  if (user && user.status === "Inactive") {
    return {
      code: 405,
      data: "User Inactive",
    };
  }

  // Revoke Idle or Expired Tokens Before Login
  await Token.updateMany(
    {
      userId: user._id,
      revoked: false,
      $or: [
        { expiresAt: { $lt: new Date() } },
        { lastActiveAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) } },
      ],
    },
    {
      $set: { revoked: true },
    },
  );

  const now = new Date();
  const tenMinutesAgo = new Date(
    now.getTime() - AUTO_LOGOUT_MINUTES * 60 * 1000,
  );

  // 🔍 Check for any active token in the last 10 minutes
  const blockingToken = await Token.find({
    userId: user._id,
    revoked: false,
    expiresAt: { $gt: now },
    lastActiveAt: { $gte: tenMinutesAgo },
  });

  // return blockingToken;

  if (blockingToken && blockingToken.length > 0) {
    return {
      code: 407,
      message: "User is already logged in somewhere else.",
    };
  }

  // 🧹 Revoke old tokens that are still technically active but idle > 10 minutes
  await Token.updateMany(
    {
      userId: user._id,
      revoked: false,
      $or: [
        { expiresAt: { $lt: now } }, // expired
        { lastActiveAt: { $lt: tenMinutesAgo } }, // idle too long
      ],
    },
    {
      $set: { revoked: true },
    },
  );

  //check merchnat
  if (user.role !== "admin") {
    let merchantStatus = "";
    if (merchantStatus === "Inactive")
      return {
        code: 406,
        data: "Merchant Inactive",
      };
  }

  const isMatch = await user.comparePassword(params.password);

  if (!isMatch) {
    return {
      code: 400,
      data: "Invalid credentials",
    };
  }

  if (user.is_reset_password === 1) {
    const rtoken = generateResetToken();
    user.resetToken = rtoken;
    user.resetTokenExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save({ validateBeforeSave: false });

    return {
      code: 201,
      data: rtoken,
    };
  } else {
    const token = user.generateToken(req);
    await Token.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    await directLogActivitySessionUser(
      user.uid,
      "user_login",
      `User ${user.email} logged in successfully.`,
      user.merchant_id,
      [user.first_name, user.last_name].join(" "),
    );

    return {
      code: 200,
      data: "Valid Request",
      token: token,
    };
  }
};
export const dbLogout = async (tokenString) => {
  await connectDb();

  try {
    const result = await Token.findOneAndUpdate(
      { token: tokenString },
      { revoked: true },
      { new: true },
    );

    if (!result) {
      console.log("Token not found.");
    } else {
      console.log("Token revoked successfully.");
    }
  } catch (err) {
    console.error("Error revoking token:", err);
  }
};

export const dbPreLogin = async (params) => {
  await connectDb();

  const user = await User.findOne({ email: params.email });

  if (!user || !user.password) {
    return {
      code: 400,
      data: "Invalid credentials",
    };
  }
  if (user && user.status === "Inactive") {
    return {
      code: 405,
      data: "User Inactive. Please contact administrator for assistance",
    };
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const remainingMs = user.lockUntil - Date.now();
    const remainingMinutes = Math.floor(remainingMs / 60000);
    const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);

    let lockMessage = "Account locked. Try again in ";

    if (remainingMinutes > 0) {
      lockMessage += `${remainingMinutes}m `;
    }

    lockMessage += `${remainingSeconds}s.`;

    return {
      code: 405,
      data: lockMessage,
    };
  }

  // Revoke Idle or Expired Tokens Before Login
  await Token.updateMany(
    {
      userId: user._id,
      revoked: false,
      $or: [
        { expiresAt: { $lt: new Date() } },
        { lastActiveAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) } },
      ],
    },
    {
      $set: { revoked: true },
    },
  );

  const now = new Date();
  const tenMinutesAgo = new Date(
    now.getTime() - AUTO_LOGOUT_MINUTES * 60 * 1000,
  );

  // 🔍 Check for any active token in the last 10 minutes
  const blockingToken = await Token.find({
    userId: user._id,
    revoked: false,
    expiresAt: { $gt: now },
    lastActiveAt: { $gte: tenMinutesAgo },
  });

  // return blockingToken;

  if (blockingToken && blockingToken.length > 0) {
    return {
      code: 407,
      message: "User is already logged in somewhere else.",
    };
  }

  // 🧹 Revoke old tokens that are still technically active but idle > 10 minutes
  await Token.updateMany(
    {
      userId: user._id,
      revoked: false,
      $or: [
        { expiresAt: { $lt: now } }, // expired
        { lastActiveAt: { $lt: tenMinutesAgo } }, // idle too long
      ],
    },
    {
      $set: { revoked: true },
    },
  );

  //check merchnat
  if (user.role !== "admin") {
    let merchantStatus = "";
    if (merchantStatus === "Inactive")
      return {
        code: 406,
        data: "Merchant Inactive",
      };
  }

  const isMatch = await user.comparePassword(params.password);

  if (!isMatch) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= FAILED_ATTEMPTS) {
      user.lockCount += 1;
      if (user.lockCount < 3)
        user.lockUntil = new Date(
          Date.now() +
            ACCOUNT_LOCK_TIME_IN_MINUTES * user.lockCount * 60 * 1000,
        );
      else user.status = 0;
      user.failedLoginAttempts = 0;

      await directLogActivitySessionUser(
        user.uid,
        "user_lock",
        user.lockCount > 2
          ? `User deactivated for ${user.email} after multiple locks`
          : `User locked for ${user.email}`,
        user.merchant_id,
        [user.first_name, user.last_name].join(" "),
      );
    }

    await user.save({ validateBeforeSave: false });

    return {
      code: 400,
      data: "Invalid credentials",
    };
  } else {
    user.lockCount = 0;
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
  }

  //get otp
  let otp = await requestOTP(
    user.email,
    [user.first_name, user.last_name].join(" "),
  );

  user.otpToken = otp?.data.otp_token;
  user.otpTokenExpires = otp?.data.expiry_date;
  await user.save({ validateBeforeSave: false });

  return {
    code: 202,
    data: {
      name: [user.first_name, user.last_name].join(" "),
      email: user.email,
    },
  };
};
export const dbForgotPassword = async (params) => {
  await connectDb();

  const user = await User.findOne({ email: params.email });

  if (!user) {
    return {
      code: 200,
      data: "Success",
    };
  }

  let newInitialPassword = makeidAlphaUpperLowerNumeric(8);
  if (user.password) {
    user.password_history.push({
      password: user.password,
      changedAt: new Date(),
    });
  }
  user.password = newInitialPassword;
  user.initial_password = newInitialPassword;
  user.is_reset_password = 1;
  user.forgot_password_requested_date = Date.now();
  const rtoken = generateResetToken();
  user.resetToken = rtoken;
  user.resetTokenExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
  let newuser = await user.save({ validateBeforeSave: false });

  //send email
  await sendForgotPasswordResetEmailNotification(newuser);
  return {
    code: 200,
    data: "Success",
  };
};

export const dbListUsersV1 = async (params) => {
  await connectDb();

  let filter = {};
  let items = await User.find()
    .select(
      "uid first_name last_name email role merchant_id merchant_name status initial_password is_reset_password type createdAt updatedAt -_id",
    )
    .sort({ updatedAt: -1 });

  const formattedItems = items.map((item) => {
    const { createdAt, updatedAt, ...rest } = item.toObject();

    return {
      ...rest,
      createdAtFormatted: dayjs(createdAt)
        .tz("Asia/Manila")
        .format("YYYY-MM-DD | hh:mm a"),
      updatedAtFormatted: dayjs(updatedAt)
        .tz("Asia/Manila")
        .format("YYYY-MM-DD | hh:mm a"),
    };
  });

  return formattedItems;
};
export const dbListUsers = async (params) => {
  await connectDb();

  let filter = {};

  let pipeLine = [];

  pipeLine.push({
    $sort: {
      updatedAt: -1, // -1 for descending (latest first), 1 for ascending
    },
  });
  pipeLine.push({
    $project: {
      uid: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      role: 1,
      merchant_id: 1,
      merchant_name: 1,
      status: 1,
      type: 1,
      initial_password: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  });

  let itemsNew = await User.aggregate(pipeLine);

  const formattedItems = itemsNew.map((item) => {
    const {
      createdAt,
      updatedAt,
      status,
      merchant_id,
      merchant_name,
      ...rest
    } = item;

    return {
      ...rest,
      merchant_id: merchant_id === "default" ? DEFAULT_MERCHANT : merchant_id,
      merchant_name:
        merchant_id === "default" ? DEFAULT_MERCHANT : merchant_name,
      status: status === 1 ? "Active" : "Inactive",
      createdAtFormatted: dayjs(createdAt)
        .tz("Asia/Manila")
        .format("YYYY-MM-DD | hh:mm a"),
      updatedAtFormatted: dayjs(updatedAt)
        .tz("Asia/Manila")
        .format("YYYY-MM-DD | hh:mm a"),
    };
  });

  return formattedItems;
};

export const dbSessionUser = async (uid) => {
  await connectDb();
  const user = await User.findOne({ uid }).select("first_name last_name");

  if (!user) {
    return false;
  }

  return `${user.firstname} ${user.lastname}`;
};
export const dbSessionUserGetRole = async (uid) => {
  await connectDb();
  const user = await User.findOne({ uid: uid }).select("role merchant_id");

  if (!user) {
    return false;
  }

  return user;
};
export const logActivitySessionUser = async (
  uid,
  logAction,
  logDescription,
  mid,
) => {
  // await connectDb();
  const user = await User.findOne({ uid: uid }).select("first_name last_name");

  if (!user) {
    return false;
  }

  let params = {
    log_action: logAction,
    description: logDescription,
    uid: uid,
    uname: `${user.first_name} ${user.last_name}`,
  };

  new ActivityLog(params).save();

  return true;
};

export const directLogActivitySessionUser = async (
  uid,
  logAction,
  logDescription,
  mid,
  uname,
) => {
  let params = {};
  if (mid === "default" || !mid) {
    params = {
      log_action: logAction,
      description: logDescription,
      uid: uid,
      mid: DEFAULT_MERCHANT,
      mname: DEFAULT_MERCHANT,
      uname: uname,
    };
  } else {
    params = {
      log_action: logAction,
      description: logDescription,
      uid: uid,
      mid: mid,
      mname: "none",
      uname: uname,
    };
  }

  new ActivityLog(params).save();

  return true;
};
export const loadLogActivitySessionUser = async (
  uid,
  logAction,
  logDescription,
) => {
  const user = await User.findOne({ uid: uid }).select(
    "first_name last_name merchant_id",
  );

  if (!user) {
    return false;
  }

  let params = {};
  let mid = user.merchant_id;

  if (mid === "default" || !mid) {
    params = {
      log_action: logAction,
      description: logDescription,
      uid: uid,
      mid: DEFAULT_MERCHANT,
      mname: DEFAULT_MERCHANT,
      uname: [user.first_name, user.last_name].join(" "),
    };
  } else {
    params = {
      log_action: logAction,
      description: logDescription,
      uid: uid,
      mid: mid,
      mname: "none",
      uname: [user.first_name, user.last_name].join(" "),
    };
  }

  new ActivityLog(params).save();

  return true;
};

export const dbAddUser = async (params) => {
  await connectDb();

  let password = makeidAlphaUpperLowerNumeric(8);

  const rtoken = generateResetToken();

  const newParams = {
    ...params,
    creation_date: new Date(),
    password: password,
    initial_password: password,
    is_reset_password: 0,
    resetToken: rtoken,
    resetTokenExpires: Date.now() + 1000 * 60 * 15, // 15 minutes
  };

  try {
    const newUser = new User(newParams);
    let dataUser = await newUser.save();

    // await sendPasswordResetEmailNotification(dataUser);

    const { initial_password, password, password_history, ...resultUser } =
      dataUser;

    return {
      code: 200,
      data: resultUser,
    };
  } catch (errors) {
    return {
      code: 400,
      data: errors.errors,
    };
  }
};
export const dbEditUser = async (params) => {
  await connectDb();

  let filter = {};
  return await User.updateOne({ uid: params.uid }, params);
};

export const dbAddDownload = async (params) => {
  await connectDb();
  const newParams = {
    ...params,
    creation_date: new Date(),
  };

  // order_num,
  // uid
  try {
    const newDownload = new Download(newParams);
    await newDownload.save();
    return {
      code: 200,
      data: true,
    };
  } catch (errors) {
    return {
      code: 400,
      data: errors.errors,
    };
  }
};
export const downloadCounts = async (filter) => {
  await connectDb();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // order_num,
  // uid
  return await Download.countDocuments({
    uid: filter.uid,
    downloaded_at: { $gte: todayStart, $lte: todayEnd },
  });
};
export const merchantCounts = async (filter) => {
  await connectDb();

  // order_num,
  // uid
  return 0;
};
