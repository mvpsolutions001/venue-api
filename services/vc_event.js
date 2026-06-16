import puppeteer from "puppeteer";
import fs from "fs";
import dayjs from "dayjs";
import {
  AddOptions,
  Corkages,
  Event,
  PaymentTerms,
  VenueType,
} from "../db/schema.js";
import { constructVRCHtml } from "./vrc_pdf_template/vrc.html.js";

function mapFlatToEvent(flat) {
  return {
    client: {
      client_reference: flat.client_reference,
      client_name: flat.client_name,
      primary_first_name: flat.primary_first_name,
      primary_middle_name: flat.primary_middle_name,
      primary_last_name: flat.primary_last_name,
      secondary_first_name: flat.secondary_first_name,
      secondary_middle_name: flat.secondary_middle_name,
      secondary_last_name: flat.secondary_last_name,
      contact_person: flat.contact_person,
      contact_no: flat.contact_no,
      address: flat.address,
      email: flat.email,
      bank_account_name: flat.bank_account_name,
      bank_account_number: flat.bank_account_number,
      bank_name: flat.bank_name,
      bank_account_name_secondary: flat.bank_account_name_secondary,
      bank_account_number_secondary: flat.bank_account_number_secondary,
      bank_name_secondary: flat.bank_name_secondary,
    },
    event_reference: flat.event_reference,
    event_type: flat.event_type,
    no_of_guests: flat.no_of_guests,
    event_date: flat.event_date,
    event_day: flat.event_day,
    selected_venue_type_code: flat.selected_venue_type_code,
    venue_type_code: flat.venue_type_code,
    event_time_tentative: flat.event_time_tentative,
    vip_room_time_tentative: flat.vip_room_time_tentative,
    ingress_time_tentative: flat.ingress_time_tentative,
    egress_time_tentative: flat.egress_time_tentative,
    override_rate: flat.override_rate,
    override_description: flat.override_description,
    event_options: flat.event_options || [],
    caterer: flat.caterer,
    coordinator: flat.coordinator,
    stylist: flat.stylist,
    host: flat.host,
    lights_and_sounds: flat.lights_and_sounds,
    band: flat.band,
    photo_or_video: flat.photo_or_video,
    others_first: flat.others_first,
    photoman_booth: flat.photoman_booth,
    others_second: flat.others_second,
    note_1: flat.note_1,
    note_2: flat.note_2,
    note_3: flat.note_3,
    note_4: flat.note_4,
    note_5: flat.note_5,
    note_6: flat.note_6,
    note_7: flat.note_7,
    payment_details: flat.payment_details || [],
    venue_base_amount: flat.venue_base_amount,
    venue_computed_amount: flat.venue_computed_amount,

    total_additional_amount: flat.total_additional_amount,

    subtotal: flat.subtotal,
    discount: flat.discount,
    grand_total: flat.grand_total,

    total_paid_amount: flat.total_paid_amount,
    balance_amount: flat.balance_amount,
  };
}

export function mapEventToFlat(eventDoc, i = 0) {
  const e = eventDoc.toObject();
  return {
    row_number: i + 1,
    client_reference: e.client?.client_reference || "",
    client_name: e.client?.client_name || "",
    primary_first_name: e.client?.primary_first_name || "",
    primary_middle_name: e.client?.primary_middle_name || "",
    primary_last_name: e.client?.primary_last_name || "",
    secondary_first_name: e.client?.secondary_first_name || "",
    secondary_middle_name: e.client?.secondary_middle_name || "",
    secondary_last_name: e.client?.secondary_last_name || "",
    contact_person: e.client?.contact_person || "",
    contact_no: e.client?.contact_no || "",
    address: e.client?.address || "",
    email: e.client?.email || "",
    bank_account_name: e.client?.bank_account_name || "",
    bank_account_number: e.client?.bank_account_number || "",
    bank_name: e.client?.bank_name || "",
    bank_account_name_secondary: e.client?.bank_account_name_secondary || "",
    bank_account_number_secondary:
      e.client?.bank_account_number_secondary || "",
    bank_name_secondary: e.client?.bank_name_secondary || "",
    event_type: e.event_type || "",
    event_reference: e.event_reference || "",
    no_of_guests: e.no_of_guests || 0,
    event_date: e.event_date || "",
    event_day: e.event_day || "",
    selected_venue_type_code: e.selected_venue_type_code || "",
    venue_type_code: e.venue_type_code || "",
    event_time_tentative: e.event_time_tentative || 0,
    vip_room_time_tentative: e.vip_room_time_tentative || 0,
    ingress_time_tentative: e.ingress_time_tentative || 0,
    egress_time_tentative: e.egress_time_tentative || 0,
    override_rate: e.override_rate || 0,
    override_description: e.override_description || "",

    event_options: e.event_options || [],

    caterer: e.caterer || "",
    coordinator: e.coordinator || "",
    stylist: e.stylist || "",
    host: e.host || "",
    lights_and_sounds: e.lights_and_sounds || "",
    band: e.band || "",
    photo_or_video: e.photo_or_video || "",
    others_first: e.others_first || "",
    photoman_booth: e.photoman_booth || "",
    others_second: e.others_second || "",

    note_1: e.note_1 || "",
    note_2: e.note_2 || "",
    note_3: e.note_3 || "",
    note_4: e.note_4 || "",
    note_5: e.note_5 || "",
    note_6: e.note_6 || "",
    note_7: e.note_7 || "",

    payment_details: e.payment_details || [],
    creation_date:
      dayjs(e.createdAt).tz("Asia/Manila").format("YYYY-MM-DD | hh:mm a") || "",
    modified_date:
      dayjs(e.updatedAt).tz("Asia/Manila").format("YYYY-MM-DD | hh:mm a") || "",
    venue_base_amount: e.venue_base_amount || 0,
    venue_computed_amount: e.venue_computed_amount || 0,

    total_additional_amount: e.total_additional_amount || 0,

    subtotal: e.subtotal || 0,
    discount: e.discount || 0,
    grand_total: e.grand_total || 0,

    total_paid_amount: e.total_paid_amount || 0,
    balance_amount: e.balance_amount || 0,
  };
}
export function mapEventToFlatForList(eventDoc, i = 0) {
  const e = eventDoc.toObject();
  return {
    row_number: i + 1,
    client_reference: e.client?.client_reference || "",
    client_name: e.client?.client_name || "",
    client_table_name:
      [e.client?.primary_last_name, e.client?.secondary_last_name].join("-") ||
      "",
    primary_first_name: e.client?.primary_first_name || "",
    primary_middle_name: e.client?.primary_middle_name || "",
    primary_last_name: e.client?.primary_last_name || "",
    secondary_first_name: e.client?.secondary_first_name || "",
    secondary_middle_name: e.client?.secondary_middle_name || "",
    secondary_last_name: e.client?.secondary_last_name || "",
    contact_person: e.client?.contact_person || "",
    contact_no: e.client?.contact_no || "",
    address: e.client?.address || "",
    email: e.client?.email || "",
    bank_account_name: e.client?.bank_account_name || "",
    bank_account_number: e.client?.bank_account_number || "",
    bank_name: e.client?.bank_name || "",
    bank_account_name_secondary: e.client?.bank_account_name_secondary || "",
    bank_account_number_secondary:
      e.client?.bank_account_number_secondary || "",
    bank_name_secondary: e.client?.bank_name_secondary || "",
    event_type: e.event_type || "",
    event_reference: e.event_reference || "",
    no_of_guests: e.no_of_guests || 0,
    event_date: e.event_date || "",
    event_day: e.event_day || "",
    selected_venue_type_code: e.selected_venue_type_code || "",
    venue_type_code: e.venue_type_code || "",
    event_time_tentative: e.event_time_tentative || 0,
    vip_room_time_tentative: e.vip_room_time_tentative || 0,
    ingress_time_tentative: e.ingress_time_tentative || 0,
    egress_time_tentative: e.egress_time_tentative || 0,
    override_rate: e.override_rate || 0,
    override_description: e.override_description || "",
    creation_date:
      dayjs(e.createdAt).tz("Asia/Manila").format("YYYY-MM-DD | hh:mm a") || "",
    modified_date:
      dayjs(e.updatedAt).tz("Asia/Manila").format("YYYY-MM-DD | hh:mm a") || "",
    venue_base_amount: e.venue_base_amount || 0,
    venue_computed_amount: e.venue_computed_amount || 0,

    total_additional_amount: e.total_additional_amount || 0,

    subtotal: e.subtotal || 0,
    discount: e.discount || 0,
    grand_total: e.grand_total || 0,

    total_paid_amount: e.total_paid_amount || 0,
    balance_amount: e.balance_amount || 0,
  };
}

export const upsertEvent = async (req, res) => {
  try {
    const flat = req.body;
    var mapped = mapFlatToEvent(flat);

    let eventDoc;
    if (
      flat.event_date &&
      (!flat.client_reference || flat.client_reference === "")
    ) {
      // Update existing
      eventDoc = await Event.findOne({ event_date: flat.event_date });

      if (!eventDoc) {
        console.log("entered ?");
        const eventDateObj = new Date(flat.event_date);

        // get day of week (0 = Sunday, 1 = Monday, ... 6 = Saturday)
        const dayIndex = eventDateObj.getDay();

        // optional: map to name
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayName = days[dayIndex];

        // Create new
        eventDoc = new Event({
          event_date: flat.event_date,
          event_day: dayName,
        });
        await eventDoc.save();
      }
    } else if (
      flat.event_date &&
      flat.client_reference &&
      flat.client_reference !== ""
    ) {
      eventDoc = await Event.findOne({ event_date: flat.event_date });
      let eventDocFlat = mapEventToFlat(eventDoc);
      const toUpdateFlat = { ...eventDocFlat, ...flat };
      const toUpdateObj = mapFlatToEvent(toUpdateFlat);
      eventDoc = await Event.findOneAndUpdate(
        { event_date: flat.event_date },
        { $set: toUpdateObj },
        { new: true, upsert: true },
      );
    }

    const venueTypes = await VenueType.find({}).sort({ rank: 1 });
    const addOptions = await AddOptions.find({}).sort({ rank: 1 });
    const paymentTerms = await PaymentTerms.find({}).sort({ rank: 1 });
    const corkages = await Corkages.find({}).sort({ rank: 1 });

    res.json({
      ...mapEventToFlat(eventDoc),
      venueTypes: venueTypes,
      addOptions: addOptions,
      paymentTerms: paymentTerms,
      corkages: corkages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const loadEvent = async (req, res) => {
  try {
    const flat = req.params;

    let eventDoc;
    if (flat.event_reference) {
      eventDoc = await Event.findOne({ event_reference: flat.event_reference });

      if (!eventDoc) {
        res.status(500).json({ error: "Event Not Found" });
      } else {
        const venueTypes = await VenueType.find({}).sort({ rank: 1 });
        const addOptions = await AddOptions.find({}).sort({ rank: 1 });
        const paymentTerms = await PaymentTerms.find({}).sort({ rank: 1 });
        const corkages = await Corkages.find({}).sort({ rank: 1 });

        let data = {
          ...mapEventToFlat(eventDoc),
          venueTypes: venueTypes,
          addOptions: addOptions,
          paymentTerms: paymentTerms,
          corkages: corkages,
        };

        const browser = await puppeteer.launch({
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        let htmlData = constructVRCHtml(data);

        fs.writeFileSync("debug.html", htmlData);

        // await page.setContent(htmlData, {
        //   waitUntil: "networkidle0",
        // });

        page.setDefaultNavigationTimeout(60000);
        page.setDefaultTimeout(60000);

        await page.setContent(htmlData, {
          waitUntil: "domcontentloaded",
        });

        page.on("console", (msg) => console.log("PAGE:", msg.text()));

        page.on("requestfailed", (req) => {
          console.log("FAILED", req.url(), req.failure());
        });

        let pageMargin = {
          top: "90px",
          bottom: "70px",
          left: "25px",
          right: "25px",
        };

        pageMargin = {
          top: "20px",
          bottom: "20px",
          left: "20px",
          right: "20px",
        };

        const pdf = await page.pdf({
          format: "Legal",
          landscape: false,
          printBackground: true,
          margin: pageMargin,
        });

        await browser.close();
        // return pdf;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=DCR.pdf");

        res.end(pdf);
      }
    } else {
      res.status(500).json({ error: "Event Not Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
