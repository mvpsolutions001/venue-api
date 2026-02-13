import { exec } from "child_process";

import express from "express";
import bodyParser from "body-parser";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

import { mapEventToFlat, upsertEvent } from "./services/vc_event.js";
import { seedEvent } from "./services/vc_seed.js";

import {
  all,
  APP_ENV,
  APP_PORT,
  APP_TOKEN,
  APP_URL_PREFIX,
  CORS_DOMAIN,
  MONGO_DB_ENDPOINT,
  OTP_GENERATE_HOST,
  SMTP_RECEIVER_EMAIL,
} from "./db/conn.js";
import {
  dbAddActivityLogs,
  dbAddDownload,
  dbAddUser,
  dbEditUser,
  dbForgotPassword,
  dbListActivityLogs,
  dbListRoles,
  dbListUsers,
  dbLogin,
  dbLogout,
  dbPreLogin,
  dbSessionUserGetRole,
  dbUpdateRoleMatrix,
  dbValidateResetToken,
  dbValidateResetTokenAndSave,
  dbValidateToken,
  dbViewRole,
  downloadCounts,
  initDB,
  initRolesDB,
  loadLogActivitySessionUser,
  logActivitySessionUser,
  merchantCounts,
} from "./db/control.js";
import cors from "cors";
import { sendPasswordResetEmailNotificationTest } from "./services/notifications.js";
import axios from "axios";
import mongoose from "mongoose";
import { authenticate } from "./middleware/auth.js";
import { requestOTPTest } from "./services/otp.js";
import { Event, TabSession } from "./db/schema.js";

var app = express();
var jsonParser = bodyParser.json({ limit: "300mb" });
var appPort = APP_PORT;

var allowedOrigins = [CORS_DOMAIN];

if (["local", "dev"].includes(APP_ENV)) {
  allowedOrigins = [CORS_DOMAIN, "http://localhost:3032"];
}

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("origin");
      console.log(origin);
      console.log(allowedOrigins);
      console.log(allowedOrigins.includes(origin));
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

//
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Server Error"));
//       }
//     },
//   }),
// );
//

app.use(cookieParser());

app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mongoSanitize());

app.set("trust proxy", true);

const wrapUrl = (slug) => {
  return [APP_URL_PREFIX, slug].join("");
};

let isConnected = false;

export const connectDbMain = async () => {
  if (isConnected) return;

  let mongoDBSource = MONGO_DB_ENDPOINT;

  await mongoose.connect(mongoDBSource);

  isConnected = true;
  console.log("✅ MongoDB connected");
};

await connectDbMain();

app.get("/", function (request, response) {
  response.send("venue api proper");
});

app.get("/v1", function (request, response) {
  response.send("venue api v1 ");
});

app.get(APP_URL_PREFIX, async function (request, response) {
  response.send({
    code: 200,
    message: "venue service index",
  });
});

app.get(`${APP_URL_PREFIX}/init`, async function (request, response) {
  initDB();
  initRolesDB();
  response.send({
    code: 200,
    message: "venue service init",
  });
});

app.get(`${APP_URL_PREFIX}/healthcheck`, async function (request, response) {
  response.send("OK");
});
app.get(`${APP_URL_PREFIX}/show`, async function (request, response) {
  response.send(all);
});

//// new ------------------------------------------------------------------------

// update options
app.put(
  wrapUrl("/event/update/:event_date/options/:option_id"),
  async (req, res) => {
    try {
      const { event_date, option_id } = req.params;
      const { availed_qty, availed_total, negotiated_total } = req.body;

      // Try updating an existing option first
      let updatedEvent = await Event.findOneAndUpdate(
        { event_date: event_date, "event_options.option_id": option_id },
        {
          $set: {
            "event_options.$.availed_qty": availed_qty,
            "event_options.$.availed_total": availed_total,
            "event_options.$.negotiated_total": negotiated_total,
          },
        },
        { new: true },
      );

      // If event exists but option not found → push new option
      if (!updatedEvent) {
        updatedEvent = await Event.findOneAndUpdate(
          { event_date: event_date },
          {
            $push: {
              event_options: {
                option_id,
                availed_qty,
                availed_total,
                negotiated_total,
              },
            },
          },
          { new: true, upsert: true }, // upsert will create event if it doesn’t exist
        );
      }

      res.json(updatedEvent);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

app.delete(
  wrapUrl("/event/update/:event_date/options/:option_id"),
  async (req, res) => {
    const { event_date, option_id } = req.params;
    try {
      const event = await Event.findOneAndUpdate(
        { event_date: event_date },
        { $pull: { event_options: { option_id: option_id } } },
        { new: true },
      );

      if (!event)
        return res
          .status(404)
          .json({ error: "Event not found or option not found" });
      res.json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

// update payment details
app.put(
  wrapUrl("/event/update/:event_date/payment-details/:term_code"),
  async (req, res) => {
    try {
      const { term_code, event_date } = req.params;
      const {
        payment_reference,
        date_due,
        date_due_adjusted,
        date_paid,
        details,
        amount,
        received_by,
        attachment,
        attachment2,
        attachment3,
        ar_no,
        rank,
        term_description,
      } = req.body;

      // First, try to update existing payment detail
      let updatedEvent = await Event.findOneAndUpdate(
        { event_date: event_date, "payment_details.term_code": term_code },
        {
          $set: {
            "payment_details.$.term_code": term_code,
            "payment_details.$.payment_reference": payment_reference,
            "payment_details.$.date_due": date_due,
            "payment_details.$.date_due_adjusted": date_due_adjusted,
            "payment_details.$.date_paid": date_paid,
            "payment_details.$.details": details,
            "payment_details.$.amount": amount,
            "payment_details.$.received_by": received_by,
            "payment_details.$.attachment": attachment,
            "payment_details.$.attachment2": attachment2,
            "payment_details.$.attachment3": attachment3,
            "payment_details.$.ar_no": ar_no,
            "payment_details.$.rank": rank,
            "payment_details.$.term_description": term_description,
          },
        },
        { new: true },
      );

      // If not found, push new payment detail (create if event doesn’t exist)
      if (!updatedEvent) {
        updatedEvent = await Event.findOneAndUpdate(
          { event_date: event_date },
          {
            $push: {
              payment_details: {
                term_code,
                payment_reference,
                date_due,
                date_due_adjusted,
                date_paid,
                details,
                amount,
                received_by,
                attachment,
                attachment2,
                attachment3,
                ar_no,
                rank,
                term_description,
              },
            },
          },
          { new: true, upsert: true },
        );
      }

      res.json(updatedEvent);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

app.delete(
  wrapUrl("/event/update/:event_date/payment-details/:term_code"),
  async (req, res) => {
    const { event_date, term_code } = req.params;
    try {
      const event = await Event.findOneAndUpdate(
        { event_date: event_date },
        {
          $pull: {
            payment_details: { term_code: term_code },
          },
        },
        { new: true },
      );

      if (!event)
        return res
          .status(404)
          .json({ error: "Event not found or payment not found" });
      res.json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

//// new ------------------------------------------------------------------------

app.post(
  `${APP_URL_PREFIX}/events/calendar`,
  authenticate,
  async (req, res) => {
    try {
      const events = await Event.find().select("event_date event_type client");

      const formattedEvents = events.map((event) => {
        const { event_date, event_type, client } = event;

        return {
          title: `${client.client_name} (${event_type})`,
          start: event_date,
          display: "background",
          color: "#c5b358",
        };
      });

      res.json(formattedEvents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);
app.post(
  `${APP_URL_PREFIX}/events/calendar-overdue`,
  authenticate,
  async (req, res) => {
    try {
      const events = await Event.find().select("event_date event_type client");

      const formattedEvents = events.map((event) => {
        const { event_date, event_type, client } = event;

        return {
          title: `${client.client_name} (${event_type})`,
          start: event_date,
          display: "background",
          color: "red",
        };
      });

      res.json(formattedEvents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

app.get(
  `${APP_URL_PREFIX}/events/tab/:session_id/:user_id`,
  async (req, res) => {
    try {
      const { session_id, user_id } = req.params;
      console.log("session_id");
      console.log(session_id);
      let tabSession = await TabSession.findOne({ session_id, user_id });
      console.log("tabSession");
      console.log(tabSession);

      if (!tabSession) {
        tabSession = await TabSession.create({ user_id, dates: [] });
      }

      res.json(tabSession);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  },
);

app.post(
  wrapUrl("/events/tab/:session_id/:user_id/add-date"),
  async (req, res) => {
    try {
      const { session_id, user_id } = req.params;
      const { event_date } = req.body; // expect YYYY-MM-DD string

      let tabSession = await TabSession.findOneAndUpdate(
        { session_id, user_id },
        { $addToSet: { dates: event_date } }, // prevents duplicates
        { new: true, upsert: true },
      );

      res.json(tabSession);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

/**
 * Remove date from tab session
 */
app.post(
  wrapUrl("/events/tab/:session_id/:user_id/remove-date"),
  async (req, res) => {
    try {
      const { session_id, user_id } = req.params;
      const { event_date } = req.body;

      let tabSession = await TabSession.findOneAndUpdate(
        { session_id, user_id },
        { $pull: { dates: event_date } },
        { new: true },
      );

      res.json(tabSession);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

app.post(`${APP_URL_PREFIX}/events/list`, authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // default pagination
    var events = await Event.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    events = events.map((event, i) => mapEventToFlat(event, i));

    res.json({
      status: 200,
      data: events,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post(`${APP_URL_PREFIX}/vc-events/load`, upsertEvent);
app.post(`${APP_URL_PREFIX}/vc-events/seed`, seedEvent);

app.post(
  "/v1/venu/service/dashboard/view",
  authenticate,
  async function (request, response) {
    response.send({
      code: 200,
      data: [],
    });
  },
);
app.post("/v1/venu/service/smtp/test", async function (request, response) {
  let result = await sendPasswordResetEmailNotificationTest();

  response.send({
    code: 200,
    data: result,
  });
});
app.post("/v1/venu/service/otp/test", async function (request, response) {
  let result = await requestOTPTest(SMTP_RECEIVER_EMAIL, "Test User");

  response.send({
    code: 200,
    data: result,
  });
});

app.post(
  "/v1/venu/service/notifications/list",
  async function (request, response) {
    let result = {};

    response.send({
      code: 200,
      data: result,
    });
  },
);
app.post(
  "/v1/venu/service/dashboard/mini-view",
  authenticate,
  async function (request, response) {
    let result = {};

    response.send({
      code: 200,
      data: result,
    });
  },
);
app.post("/v1/venu/service/user/login", async function (request, response) {
  let data = request.body;
  let result = await dbLogin(data, request);

  if (result.code === 200) {
    if (APP_ENV === "local") {
      response.cookie(APP_TOKEN, result.token, {
        httpOnly: true,
        secure: APP_ENV === "local" ? false : true,
        sameSite: APP_ENV === "local" ? "lax" : "none", //lax for local
        maxAge: 60 * 60 * 1000,
      });
    } else {
      response.cookie(APP_TOKEN, result.token, {
        httpOnly: true,
        secure: APP_ENV === "local" ? false : true,
        sameSite: APP_ENV === "local" ? "lax" : "none", //lax for local
        maxAge: 60 * 60 * 1000,
        domain: ".thechandeliereventsplace.com",
      });
    }
  }

  response.send(result);
});
app.post(
  "/v1/venu/service/user/logout",
  authenticate,
  async function (request, response) {
    const token = request.cookies[APP_TOKEN];

    console.log("token");
    console.log(token);

    if (token && token !== "") {
      await dbLogout(token);
    }
    response.send(true);
  },
);
app.post("/v1/venu/service/user/pre-login", async function (request, response) {
  let data = request.body;
  let result = await dbPreLogin(data);

  response.send(result);
});
app.post(
  "/v1/venu/service/user/forgot-password",
  async function (request, response) {
    let data = request.body;
    let result = await dbForgotPassword(data);
    response.send(result);
  },
);
app.post("/v1/venu/service/user/reset", async function (request, response) {
  let data = request.body;
  let result = await dbValidateResetTokenAndSave(data);
  response.send(result);
});
app.post(
  "/v1/venu/service/user/validate-token",
  async function (request, response) {
    const token = request.cookies[APP_TOKEN];
    // response.send(token);

    let data = request.body;
    let result = await dbValidateToken(token, request);

    if (result.data && result.data.role) {
      result.data = {
        ...result.data.toObject(),
        access: await dbViewRole(result.data.role),
      };
    }
    response.send(result);
  },
);
app.post(
  "/v1/venu/service/user/validate-reset-token",
  async function (request, response) {
    let data = request.body;
    let result = await dbValidateResetToken(data.token);
    response.send(result);
  },
);
app.post(
  "/v1/venu/service/user/list",
  authenticate,
  async function (request, response) {
    let data = request.body;
    let filters = data.filters;
    let result = await dbListUsers(filters);
    response.send({
      code: 200,
      data: result,
    });
  },
);

app.post(
  "/v1/venu/service/user/add",
  authenticate,
  async function (request, response) {
    let data = request.body;

    const uid = request.user.uid;

    let result = await dbAddUser(data);
    await loadLogActivitySessionUser(
      uid,
      "user_add",
      `Added user  ${data.email}`,
    );
    response.send(result);
  },
);
app.post(
  "/v1/venu/service/user/add-direct",
  async function (request, response) {
    let data = request.body;

    let result = await dbAddUser(data);

    response.send(result);
  },
);
app.post(
  "/v1/venu/service/user/edit",
  authenticate,
  async function (request, response) {
    let data = request.body;
    const uid = request.user.uid;

    let thisUser = await dbSessionUserGetRole(uid);
    let result;
    if (thisUser.role === "admin") {
      const { role, email, ...dataNew } = data;
      result = await dbEditUser(dataNew);
    } else {
      const { role, email, ...dataNew } = data;
      if (role === "admin") {
        result = await dbEditUser(dataNew);
      } else {
        const { email, ...dataNew } = data;
        result = await dbEditUser(dataNew);
      }
    }

    let changeLogs = data.change_logs;

    await loadLogActivitySessionUser(
      uid,
      "user_edit",
      `Edited User ${data.email} | ${changeLogs}`,
    );

    response.send({
      code: 200,
      data: result,
    });
  },
);
app.post("/v1/venu/service/user/session", async function (request, response) {
  let data = request.body;
  // let result = await dbEditUser(data);
  response.send({
    code: 200,
    data: {},
  });
});
app.post(
  "/v1/venu/service/user-roles/list",
  authenticate,
  async function (request, response) {
    let result = await dbListRoles();
    response.send({
      code: 200,
      data: result,
    });
  },
);

app.post(
  "/v1/venu/service/user-roles/update",
  authenticate,
  async function (request, response) {
    let data = request.body;
    const uid = request.user.uid;
    let result = await dbUpdateRoleMatrix(data, uid);
    response.send({
      code: 200,
      data: result,
    });
  },
);
app.post(
  "/v1/venu/service/user-logs/list",
  authenticate,
  async function (request, response) {
    const uid = request.user.uid;
    let user = await dbSessionUserGetRole(uid);

    let data = request.body;
    let result = await dbListActivityLogs(data, user);
    response.send({
      code: 200,
      data: result,
    });
  },
);
app.post(
  "/v1/venu/service/user-logs/add",
  authenticate,
  async function (request, response) {
    let data = request.body;
    let result = await dbAddActivityLogs(data);
    response.send({
      code: 200,
      data: result,
    });
  },
);

app.post(
  "/v1/venu/service/download/add",
  authenticate,
  async function (request, response) {
    let data = request.body;
    let result = await dbAddDownload(data);

    await loadLogActivitySessionUser(
      data.uid,
      "download_or",
      `OR # ${data.order_num} Downloaded`,
    );

    response.send({
      code: 200,
      data: result,
    });
  },
);
app.post(
  "/v1/venu/service/download/count",
  authenticate,
  async function (request, response) {
    let data = request.body;
    let result = await downloadCounts(data);

    response.send({
      code: 200,
      data: result,
    });
  },
);
app.post(
  "/v1/venu/service/merchant/count",
  authenticate,
  async function (request, response) {
    let data = request.body;
    let result = await merchantCounts(data);
    response.send({
      code: 200,
      data: result,
    });
  },
);

var port = process.env.PORT || appPort;

app.listen(port, function () {
  console.log("Venu API Server listening on " + port);
});

const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Closing resources...`);

  if (signal === "SIGUSR2") {
    // Nodemon-specific restart signal — don't exit, just restart
    process.kill(process.pid, "SIGUSR2");
  } else {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

process.once("SIGINT", () => gracefulShutdown("SIGINT")); // Ctrl+C
process.once("SIGTERM", () => gracefulShutdown("SIGTERM")); // External kill
process.once("SIGUSR2", () => gracefulShutdown("SIGUSR2")); // Nodemon restart
