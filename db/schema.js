import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import { v7 as uuidv7 } from "uuid";
import { formatDateTime } from "./func.js";
import { APP_STATE, JWT_EXPIRES_IN, JWT_SECRET } from "./conn.js";

function validatePassword(password) {
  // Minimum 8 chars, at least one digit
  return typeof password === "string" && /^(?=.*\d).{8,}$/.test(password);
}

export const generateTableName = (name) => {
  return [APP_STATE, name].join("_");
};

export const hashPassword = (password) => {
  if (!password) return password;
  const saltRounds = 10;
  const isHashed = /^\$2[aby]\$/.test(password); // bcrypt hash pattern
  return isHashed ? password : bcrypt.hashSync(password, saltRounds);
};

const schemaSettings = {
  toJSON: { setters: true, getters: true },
  toObject: { setters: true, getters: true },
  timestamps: true,
};
// mongoose.set("debug", true);
const dateSettings = {
  type: Date,
  get: (date) => {
    if (date) {
      // Example: Format as "YYYY-MM-DD"
      // return date;
      return formatDateTime(date);
      // return date.toISOString().split("T")[0];
    }
    return null;
  },
};

// set: function (val) {
//   // Example: shift input date to UTC+8 (PH Standard Time)
//   const offsetMinutes = 8 * 60;
//   return new Date(new Date(val).getTime() + offsetMinutes * 60000);
// },

const uuidSettings = {
  type: String,
  default: () => uuidv7(),
};

const commonStringSettings = (field) => {
  return {
    type: String,
    required: [true, field.replace("_", " ") + " is required."],
  };
};
const uniqueStringSettings = (field) => {
  return {
    type: String,
    required: [true, field.replace("_", " ") + " is required."],
  };
};

const emailNoValidatioonSettings = {
  type: String,
  required: [true, "An email address is required."],
};
const emailSettings = {
  type: String,
  required: [true, "An email address is required."],
  validate: {
    validator: async function (email) {
      // Check if a user with this email already exists
      const user = await this.constructor.findOne({ email });
      // If a user is found, it means the email already exists
      if (user) {
        return false; // Validation fails
      }
      return true; // Validation passes
    },
    message: "Email address already registered.",
  },
};

// Define your schema and model using ES module syntax
const userSchema = new mongoose.Schema(
  {
    uid: uuidSettings,
    first_name: commonStringSettings("first_name"),
    last_name: commonStringSettings("last_name"),
    email: emailSettings,
    role: commonStringSettings("role"),
    registered_by_uid: String,
    merchant_id: String,
    merchant_name: String,
    resetToken: String,
    resetTokenExpires: Date,
    otpToken: String,
    otpTokenExpires: Date,
    initial_password: String,
    forgot_password_requested_date: Date,
    type: {
      type: String,
      default: "normal",
    },
    is_reset_password: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
      get: (val) => {
        return val === 1 ? "Active" : "Inactive";
      },
    },
    creation_date: dateSettings,
    password: {
      type: String,
      required: true,
      set: hashPassword, // 👈 Setter
      validate: {
        validator: validatePassword,
        message: (props) =>
          `Password must be at least 8 characters and contain a number`,
      },
    },
    password_history: {
      type: [
        {
          password: String,
          changedAt: Date,
        },
      ],
      default: [],
    },
    lockCount: {
      type: Number,
      default: 0,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  schemaSettings,
);

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },
  clientInfo: {
    ip: String,
    userAgent: String,
  },
});

const roleSchema = new mongoose.Schema({
  rid: uuidSettings,
  code: String,
  name: String,
  description: String,
  rank: Number,
  is_active: Number,
  creation_date: dateSettings,
});
const roleModuleSchema = new mongoose.Schema({
  rmid: uuidSettings,
  module_code: String,
  description: String,
  rank: Number,
  is_active: Number,
  creation_date: dateSettings,
});
const roleSubmoduleSchema = new mongoose.Schema({
  rsid: uuidSettings,
  module_code: String,
  submodule_code: String,
  description: String,
  rank: Number,
  is_active: Number,
  creation_date: dateSettings,
});
const roleItemSchema = new mongoose.Schema({
  riid: uuidSettings,
  module_code: String,
  submodule_code: String,
  item_code: String,
  description: String,
  rank: Number,
  is_active: Number,
  creation_date: dateSettings,
});
const roleMatrixSchema = new mongoose.Schema({
  rmtid: uuidSettings,
  role_code: String,
  item_code: String,
  is_active: Number,
  creation_date: dateSettings,
});
const activityLogsSchema = new mongoose.Schema(
  {
    aid: uuidSettings,
    log_action: String,
    description: String,
    ip_address: String,
    uid: String,
    mid: String,
    mname: String,
    uname: String,
    creation_date: dateSettings,
  },
  schemaSettings,
);

const downloadSchema = new mongoose.Schema(
  {
    aid: uuidSettings,
    order_num: String,
    uid: String,
    downloaded_at: dateSettings,
  },
  schemaSettings,
);

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = function (req) {
  return jwt.sign(
    {
      id: this._id,
      ip: req.ip,
      ua: req.headers["user-agent"],
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
};

userSchema.methods.verifyTokenContext = function (token, req) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const reqIp = req.ip;
    const reqUa = req.headers["user-agent"];

    const tokenIp = payload.ip;
    const tokenUa = payload.ua;

    const isIpMatch = tokenIp === reqIp;
    const isUaMatch = tokenUa === reqUa;

    if (!isIpMatch || !isUaMatch) {
      return { valid: false, reason: "invalid" };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, reason: "invalid" };
  }
};
// userSchema.methods.generateToken = function () {
//   return jwt.sign(
//     {
//       id: this._id,
//       email: this.email,
//     },
//     JWT_SECRET,
//     {
//       expiresIn: JWT_EXPIRES_IN,
//     },
//   );
// };
//
//

/*----------------------------------------------------------------------------- */

// --- Sub-schema: Event Options ---
const eventOptionSchema = new mongoose.Schema(
  {
    option_id: { type: String, required: false },
    availed_qty: { type: Number, default: 0 },
    availed_total: { type: Number, default: 0 },
    negotiated_total: { type: Number, default: 0 },
  },
  { _id: false, timestamps: true },
);

// --- Sub-schema: Payment Details ---
const paymentDetailSchema = new mongoose.Schema(
  {
    term_code: { type: String },
    term_description: { type: String },
    payment_reference: { type: String, default: () => `PAY-${uuidv7()}` },
    status: { type: String, default: `pending` },
    date_due: { type: Date },
    date_due_adjusted: { type: Date },
    date_paid: { type: Date },
    details: { type: String },
    amount: { type: mongoose.Schema.Types.Double, default: 0.0 },
    rank: { type: Number, default: 0 },
    received_by: { type: String },
    attachment: { type: String },
    attachment2: { type: String },
    attachment3: { type: String },
    ar_no: { type: String },
  },
  { _id: false, timestamps: true },
);

const venueRequirementSchema = new mongoose.Schema(
  {
    venue_type_code: { type: String, required: true }, // references VenueType.venue_type_code
    event_time_tentative: { type: Number, default: 0 },
    vip_room_time_tentative: { type: Number, default: 0 },
    ingress_time_tentative: { type: Number, default: 0 },
    egress_time_tentative: { type: Number, default: 0 },
    creation_date: { type: Date, default: Date.now },
    override_rate: { type: Number, default: 0 },
    override_description: { type: String },
  },
  { _id: false, timestamps: true },
);

const clientSchema = new mongoose.Schema(
  {
    client_reference: {
      type: String,
      default: () => `CLT-${uuidv7()}`,
      unique: true,
    },
    client_name: { type: String },
    primary_first_name: { type: String },
    primary_middle_name: { type: String },
    primary_last_name: { type: String },
    secondary_first_name: { type: String },
    secondary_middle_name: { type: String },
    secondary_last_name: { type: String },
    contact_person: { type: String },
    contact_no: { type: String },
    email: { type: String },
    address: { type: String },
    bank_account_name: { type: String },
    bank_account_number: { type: String },
    bank_name: { type: String },
    bank_account_name_secondary: { type: String },
    bank_account_number_secondary: { type: String },
    bank_name_secondary: { type: String },
  },
  { timestamps: true },
);

// --- Main Schema: Event ---
const eventSchema = new mongoose.Schema(
  {
    eid: { type: String, unique: true, default: () => uuidv7() }, // Auto UID
    uid: { type: String },
    event_reference: {
      type: String,
      unique: true,
      default: () => `EVT-${uuidv7()}`,
    },
    client: { type: clientSchema, default: {} },
    event_type: {
      type: String,
    },
    no_of_guests: { type: Number, min: 0 },
    event_date: { type: String, required: true, unique: true },
    event_day: { type: String },

    selected_venue_type_code: { type: String },
    venue_type_code: { type: String },
    event_time_tentative: { type: Number, min: 0 },
    vip_room_time_tentative: { type: Number, min: 0 },
    ingress_time_tentative: { type: Number, min: 0 },
    egress_time_tentative: { type: Number, min: 0 },
    override_rate: { type: Number, min: 0 },
    override_description: { type: String },

    venue_base_amount: { type: Number, min: 0 },
    venue_computed_amount: { type: Number, min: 0 },

    total_additional_amount: { type: Number, min: 0 },

    subtotal: { type: Number, min: 0 },
    discount: { type: Number, min: 0 },
    grand_total: { type: Number, min: 0 },

    total_paid_amount: { type: Number, min: 0 },
    balance_amount: { type: Number, min: 0 },

    venue_requirements: { type: [venueRequirementSchema], default: [] },
    event_options: { type: [eventOptionSchema], default: [] },
    payment_details: { type: [paymentDetailSchema], default: [] },
    caterer: { type: String },
    coordinator: { type: String },
    stylist: { type: String },
    host: { type: String },
    lights_and_sounds: { type: String },
    band: { type: String },
    photo_or_video: { type: String },
    photoman_booth: { type: String },
    others_first: { type: String },
    others_second: { type: String },
    note_1: { type: String },
    note_2: { type: String },
    note_3: { type: String },
    note_4: { type: String },
    note_5: { type: String },
    note_6: { type: String },
    note_7: { type: String },
  },
  {
    timestamps: true,
  },
);

const venueTypeSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true, default: () => uuidv7() }, // auto uid
    venue_type_code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    description_info: { type: String },
    rank: { type: Number, required: true },
    rate: { type: Number, required: true },
    unit: { type: String, enum: ["hour", "day"], required: true },
    unit_qty: { type: Number, required: true },
    event_time_minimum: { type: Number, required: true },
    vip_room_time_minimum: { type: Number, required: true },
    ingress_time_minimum: { type: Number, required: true },
    egress_time_minimum: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const additionalOptionRateSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true, default: () => uuidv7() }, // auto uid
    option_id: { type: String, required: true, unique: true },
    rank: { type: Number, required: true },
    description: { type: String, required: true },
    rate: { type: Number, required: true },
    unit: { type: String, enum: ["hour", "fixed"], required: true },
    unit_qty: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const corkageRateSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true, default: () => uuidv7() }, // auto uid
    option_id: { type: String, required: true, unique: true },
    rank: { type: Number, required: true },
    description: { type: String, required: true },
    rate: { type: Number, required: true },
    unit: { type: String, enum: ["hour", "fixed"], required: true },
    unit_qty: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const paymentDetailsTermsSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true, default: () => uuidv7() }, // auto uid
    term_code: { type: String, required: true, unique: true },
    rank: { type: Number, required: true },
    description: { type: String, required: true },
    schedule_description: { type: String, default: "" },
    pre_term_code: { type: String, default: null }, // can reference another term or "event_date"
    pre_term_unit: {
      type: String,
      enum: ["day", "week", "month", "year", null],
      default: null,
    },
    pre_term_period: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const tabSessionSchema = new mongoose.Schema(
  {
    session_id: { type: String, unique: true, default: () => uuidv7() }, // auto uid
    dates: { type: [String] },
    user_id: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

/*----------------------------------------------------------------------------- */
export const TabSession = mongoose.model(
  generateTableName("tabsession"),
  tabSessionSchema,
);
export const Client = mongoose.model(
  generateTableName("clients"),
  clientSchema,
);
export const PaymentTerms = mongoose.model(
  generateTableName("payment_terms"),
  paymentDetailsTermsSchema,
);
export const Corkages = mongoose.model(
  generateTableName("corkages"),
  corkageRateSchema,
);
export const AddOptions = mongoose.model(
  generateTableName("add_options"),
  additionalOptionRateSchema,
);
export const VenueType = mongoose.model(
  generateTableName("venue_type"),
  venueTypeSchema,
);
const VenueRequirement = mongoose.model(
  generateTableName("venue_requirement"),
  venueRequirementSchema,
);
export const Event = mongoose.model(generateTableName("events"), eventSchema);

export const User = mongoose.model(generateTableName("users"), userSchema);
export const Token = mongoose.model(generateTableName("token"), tokenSchema);

export const Role = mongoose.model(generateTableName("roles"), roleSchema);
export const RoleModule = mongoose.model(
  generateTableName("role_modules"),
  roleModuleSchema,
);
export const RoleSubmodule = mongoose.model(
  generateTableName("role_submodules"),
  roleSubmoduleSchema,
);
export const RoleItem = mongoose.model(
  generateTableName("role_item"),
  roleItemSchema,
);
export const RoleMatrix = mongoose.model(
  generateTableName("role_matrix"),
  roleMatrixSchema,
);
export const ActivityLog = mongoose.model(
  generateTableName("activity_logs"),
  activityLogsSchema,
);

export const Download = mongoose.model(
  generateTableName("downloads"),
  downloadSchema,
);
