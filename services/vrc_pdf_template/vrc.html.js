import fs from "fs";

export const headerBase64 = fs
  .readFileSync("services/vrc_pdf_template/header.png")
  .toString("base64");

export const footerBase64 = fs
  .readFileSync("services/vrc_pdf_template/image_794150301_0.jpg")
  .toString("base64");

export const styleInline = fs.readFileSync(
  "services/vrc_pdf_template/style_inline.css",
  "utf-8",
);

const formatAmount = (value) => {
  if (value == null) return "";

  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatDateCompact = (date) =>
  date ? new Date(date).toLocaleDateString("en-PH") : "";

export const constructVRCHtml = (data) => {
  const checkedOptions = new Set(data.event_options.map((o) => o.option_id));

  const renderCheck = (optionId) => {
    return checkedOptions.has(optionId)
      ? `[<span style="display:inline-block;width:10px;text-align:center;">✓</span>]`
      : `[<span style="display:inline-block;width:10px;text-align:center;"></span>]`;
  };

  const paymentMap = new Map(data.payment_details.map((p) => [p.term_code, p]));

  let htmlContent = `<body>
    <div class="ritz grid-container" dir="ltr">
        <table class="waffle" cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th class="row-header freezebar-origin-ltr"></th>

                <th style="width: 39px">A</th>
                <th style="width: 27px">B</th>
                <th style="width: 27px">C</th>
                <th style="width: 27px">D</th>
                <th style="width: 18px">E</th>
                <th style="width: 18px">F</th>
                <th style="width: 32px">G</th>
                <th style="width: 18px">H</th>
                <th style="width: 32px">I</th>
                <th style="width: 27px">J</th>
                <th style="width: 39px">K</th>
                <th style="width: 27px">L</th>
                <th style="width: 18px">M</th>
                <th style="width: 45px">N</th>
                <th style="width: 18px">O</th>
                <th style="width: 12px">P</th>
                <th style="width: 52px">Q</th>
                <th style="width: 12px">R</th>
                <th style="width: 32px">S</th>
                <th style="width: 72px">T</th>
                <th style="width: 39px">U</th>
                <th style="width: 32px">V</th>
                <th style="width: 39px">W</th>
                <th style="width: 6px">X</th>
                <th style="width: 66px">Y</th>
            </tr>
        </thead>
            <tbody>
                <tr style="height: 155px">
                    <th
                        id="794150301R0"
                        style="height: 155px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 155px"
                        >
                            1
                        </div>
                    </th>
                    <td class="s0" colspan="25">
                        <div
                            style="
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            "
                        >
                            <img
                            src="data:image/png;base64,${headerBase64}"
                                style="display: block"
                                height="auto"
                                width="657"
                            />
                        </div>
                    </td>
                    <td class="s0"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R1"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            2
                        </div>
                    </th>
                    <td class="s1" colspan="26">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >CLIENT INFORMATION</span
                        >
                    </td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R2"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            3
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td
                        class="s3"
                        colspan="4"
                        style="border-top: 1px SOLID #000000"
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Name of Client</span
                        >
                    </td>
                    <td
                        class="s4"
                        colspan="20"
                        style="border-top: 1px SOLID #000000"
                    >
                    ${[data.primary_first_name, data.primary_middle_name, data.primary_last_name, ",", data.secondary_first_name, data.secondary_middle_name, data.secondary_last_name].join(" ")}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R3"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            4
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Contact Person</span
                        >
                    </td>
                    <td class="s4" colspan="10">${data.contact_person}</td>
                    <td class="s3" colspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Contact No.</span
                        >
                    </td>
                    <td class="s4" colspan="7">
${data.contact_no}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R4"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            5
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Address</span
                        >
                    </td>
                    <td class="s4" colspan="20">
                        ${data.address}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R5"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            6
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Email</span
                        >
                    </td>
                    <td class="s4" colspan="20">
                      ${data.email}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R6"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            7
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s6" colspan="8" rowspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Client's Bank Details<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >for Security Deposit Refund</span
                        >
                    </td>
                    <td class="s3" colspan="16">
                        <span style="font-size: 8pt;font-family: Calibri, Arial;">Name: ${data.bank_name}</span>
                    </td>
                    <td class="s5">

                    </td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R7"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            8
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="16">
                        <span style="font-size: 8pt;font-family: Calibri, Arial;">
                            Bank: Acct. No.: ${data.bank_account_number}</span
                        >
                    </td>
                    <td class="s5">

                    </td>
                </tr>
                <tr style="height: 20px">
                    <th
                        id="794150301R8"
                        style="height: 20px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 20px"
                        >
                            9
                        </div>
                    </th>
                    <td class="s1" colspan="26">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >EVENT DETAILS</span
                        >
                    </td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R9"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            10
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td
                        class="s3"
                        colspan="4"
                        style="border-top: 1px SOLID #000000"
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Type of Event</span
                        >
                    </td>
                    <td
                        class="s4"
                        colspan="10"
                        style="border-top: 1px SOLID #000000"
                    >
                      ${data.event_type}
                    </td>
                    <td
                        class="s3"
                        colspan="3"
                        style="border-top: 1px SOLID #000000"
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >No. Of Guests</span
                        >
                    </td>
                    <td
                        class="s4"
                        colspan="7"
                        style="border-top: 1px SOLID #000000"
                    >
                    ${data.no_of_guests}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R10"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            11
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Event Date</span
                        >
                    </td>
                    <td class="s4" colspan="10">
                      ${data.event_date}
                    </td>
                    <td class="s3" colspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Event Day</span
                        >
                    </td>
                    <td class="s4" colspan="7">
                        ${data.event_day}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 22px">
                    <th
                        id="794150301R11"
                        style="height: 22px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 22px"
                        >
                            12
                        </div>
                    </th>
                    <td class="s0" colspan="16">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >VENUE REQUIREMENTS </span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-style: italic;
                            "
                            >(Please choose/check one &amp; indicate the
                            time)
                        </span>
                    </td>
                    <td
                        class="s0"
                        colspan="4"
                        style="text-align: center; vertical-align: bottom"
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >Tentative Time</span
                        >
                    </td>
                    <td
                        class="s0"
                        colspan="5"
                        style="text-align: center; vertical-align: bottom"
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >Final Time</span
                        >
                    </td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R12"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            13
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td
                        class="s7"
                        colspan="2"
                        rowspan="4"
                        style="border-top: 1px SOLID #000000; text-align:center; vertical-align:middle;"
                    >
                        ${data.venue_type_code === "VT001" ? "✔" : ""}
                    </td>
                    <td
                        class="s8"
                        colspan="7"
                        style="
                            text-align: center;
                            border-top: 1px SOLID #000000;
                        "
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >GRAND HALL</span
                        >
                    </td>
                    <td
                        class="s3"
                        colspan="6"
                        style="
                            border-top: 1px SOLID #000000;
                            text-align: center;
                        "
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Event Time (5 Hrs)</span
                        >
                    </td>
                    <td
                        class="s9"
                        colspan="4"
                        style="border-top: 1px SOLID #000000"
                    >
${data.venue_type_code === "VT001" ? data.event_time_tentative : ""}
                    </td>
                    <td
                        class="s9"
                        colspan="5"
                        style="border-top: 1px SOLID #000000"
                    ></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 18px">
                    <th
                        id="794150301R13"
                        style="height: 18px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 18px"
                        >
                            14
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s10" colspan="7" rowspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >Weekends/December/Holidays<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >(Fri - Sun) (All day in Dec.)<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >Php 140,000.00 / 5Hrs</span
                        >
                    </td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >VIP Rooms Time (5 Hrs)</span
                        >
                    </td>
                    <td class="s4" colspan="4">
${data.venue_type_code === "VT001" ? data.vip_room_time_tentative : ""}
                    </td>
                    <td class="s4" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R14"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            15
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Ingress (4 Hrs Free)</span
                        >
                    </td>
                    <td class="s4" colspan="4">
${data.venue_type_code === "VT001" ? data.ingress_time_tentative : ""}
                    </td>
                    <td class="s4" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R15"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            16
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Egress (2 Hrs Free)</span
                        >
                    </td>
                    <td class="s4" colspan="4">
${data.venue_type_code === "VT001" ? data.egress_time_tentative : ""}
                    </td>
                    <td class="s4" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 19px">
                    <th
                        id="794150301R16"
                        style="height: 19px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 19px"
                        >
                            17
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s7" colspan="2" rowspan="4" style="border-top: 1px SOLID #000000; text-align:center; vertical-align:middle;"
                >
                ${data.venue_type_code === "VT002" ? "✔" : ""}
                    </td>
                    <td class="s11" colspan="7" rowspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >GRAND HALL<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >Weekdays<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >(Mon - Thurs)<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >Php 100,000.00 / 5Hrs</span
                        >
                    </td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Event Time (5 Hrs)</span
                        >
                    </td>
                    <td class="s9" colspan="4">
${data.venue_type_code === "VT002" ? data.event_time_tentative : ""}
                    </td>
                    <td class="s9" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R17"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            18
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >VIP Rooms Time (5 Hrs)</span
                        >
                    </td>
                    <td class="s4" colspan="4">
                    ${data.venue_type_code === "VT002" ? data.vip_room_time_tentative : ""}
                    </td>
                    <td class="s4" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R18"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            19
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Ingress (4 Hrs Free)</span
                        >
                    </td>
                    <td class="s4" colspan="4">
                    ${data.venue_type_code === "VT002" ? data.ingress_time_tentative : ""}
                    </td>
                    <td class="s4" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R19"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            20
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Egress (2 Hrs Free)</span
                        >
                    </td>
                    <td class="s4" colspan="4">
${data.venue_type_code === "VT002" ? data.egress_time_tentative : ""}
                    </td>
                    <td class="s4" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 18px">
                    <th
                        id="794150301R20"
                        style="height: 18px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 18px"
                        >
                            21
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s7" colspan="2" rowspan="4" style="border-top: 1px SOLID #000000; text-align:center; vertical-align:middle;"
                >
                ${data.venue_type_code === "VT003" ? "✔" : ""}
                    </td>
                    <td class="s12" colspan="7" rowspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >HALF HALL (HALL A or B)<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >Weekdays<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >(Mon - Thurs)<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >Php 75,000.00 / 4Hrs</span
                        >
                    </td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Event Time (4 Hrs)</span
                        >
                    </td>
                    <td class="s9" colspan="4">
${data.venue_type_code === "VT003" ? data.event_time_tentative : ""}
                    </td>
                    <td class="s9" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R21"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            22
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >VIP Rooms Time (4 Hrs)</span
                        >
                    </td>
                    <td class="s4" colspan="4">
${data.venue_type_code === "VT003" ? data.vip_room_time_tentative : ""}
                    </td>
                    <td class="s4" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R22"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            23
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Ingress (3 Hrs Free)</span
                        >
                    </td>
                    <td class="s4" colspan="4">
${data.venue_type_code === "VT003" ? data.ingress_time_tentative : ""}
                    </td>
                    <td class="s4" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R23"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            24
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Egress (1 Hr Free)</span
                        >
                    </td>
                    <td class="s4" colspan="4">
                    ${data.venue_type_code === "VT003" ? data.egress_time_tentative : ""}
                    </td>
                    <td class="s4" colspan="5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 48px">
                    <th
                        id="794150301R24"
                        style="height: 48px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 48px"
                        >
                            25
                        </div>
                    </th>
                    <td class="s0" colspan="26">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-style: italic;
                            "
                            >Venue is inclusive of free use of Porch, Lanai,
                            Hallway, Master Suite &amp; Deluxe Room.<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-style: italic;
                            "
                            >The Garden is free to use as Cocktail / Grazing
                            Area. (Garden Ceremony &amp; Dining Setup in the
                            Garden are subject to additional charges.)<br /></span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >ADDITIONAL OPTIONS </span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-style: italic;
                            "
                            >(Please choose &amp; indicate the time)</span
                        >
                    </td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R25"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            26
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >
                            ${renderCheck("AOPT0001")}
                            </span>
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Additional Hours Extension on Event Time</span
                        >
                    </td>
                    <td class="s0" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: &quot;Times New Roman&quot;;
                                text-decoration: underline;
                                text-decoration-skip-ink: none;
                                -webkit-text-decoration-skip: none;
                            "
                            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Hrs @ 10,000.00 per hour</span
                        >
                    </td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R26"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            27
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >
                            ${renderCheck("AOPT0002")}
                            </span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Additional Supplier's Ingress Time</span
                        >
                    </td>
                    <td class="s0" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: &quot;Times New Roman&quot;;
                                text-decoration: underline;
                                text-decoration-skip-ink: none;
                                -webkit-text-decoration-skip: none;
                            "
                            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Hrs @ 2,500.00 per hour</span
                        >
                    </td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R27"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            28
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >${renderCheck("AOPT0003")}</span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Additional Supplier's Egress Time</span
                        >
                    </td>
                    <td class="s0" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: &quot;Times New Roman&quot;;
                                text-decoration: underline;
                                text-decoration-skip-ink: none;
                                -webkit-text-decoration-skip: none;
                            "
                            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Hrs @ 2,500.00 per hour</span
                        >
                    </td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R28"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            29
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >${renderCheck("AOPT0004")}</span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Additional Rental Hours on VIP Rooms</span
                        >
                    </td>
                    <td class="s0" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: &quot;Times New Roman&quot;;
                                text-decoration: underline;
                                text-decoration-skip-ink: none;
                                -webkit-text-decoration-skip: none;
                            "
                            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                        ><span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Hrs @ 2,000.00 per hour</span
                        >
                    </td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R29"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            30
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >${renderCheck("AOPT0005")}</span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s0" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >THE GARDEN rental (Garden Ceremony / Dining) </span
                        ><span
                            style="
                                font-size: 7pt;
                                font-family: Calibri, Arial;
                            "
                            >- Styling provided by others</span
                        >
                    </td>
                    <td class="s14" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >@ 25,000.00</span
                        >
                    </td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R30"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            31
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >${renderCheck("AOPT0006")}</span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Upgrade to 100 amps electricity</span
                        >
                    </td>
                    <td class="s14" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >@ 10,000.00</span
                        >
                    </td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R31"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            32
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >${renderCheck("AOPT0007")}</span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >TC Stage Rental 12 x 16 x 2ft</span
                        >
                    </td>
                    <td class="s14" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >@ 8,000.00</span
                        >
                    </td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R32"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            33
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >
                            ${renderCheck("AOPT0008")}
                            </span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >

                            </span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Scaffolding Rentals</span
                        >
                    </td>
                    <td class="s14" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >@ 5,000.00</span
                        >
                    </td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R33"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            34
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >${renderCheck("AOPT0009")}</span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Pre-Nuptial Photoshoot (3 Hrs)</span
                        >
                    </td>
                    <td class="s14" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >@ 8,000.00</span
                        >
                    </td>
                    <td class="s15"></td>
                    <td class="s15"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R34"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            35
                        </div>
                    </th>
                    <td class="s1" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >CORKAGES</span
                        >
                    </td>
                    <td class="s5" colspan="13"></td>
                    <td class="s5" colspan="7"></td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R35"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            36
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >
                            ${renderCheck("CR0001")}
                            </span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Non-accredited Caterer</span
                        >
                    </td>
                    <td class="s14" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >@ 30,000.00</span
                        >
                    </td>
                    <td class="s5"></td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 23px">
                    <th
                        id="794150301R36"
                        style="height: 23px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 23px"
                        >
                            37
                        </div>
                    </th>
                    <td class="s13" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >
                            ${renderCheck("CR0002")}
                            </span
                        >
                    </td>
                    <td class="s1" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            ></span
                        >
                    </td>
                    <td class="s14" colspan="13">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Non-accredited Lights &amp; Sounds</span
                        >
                    </td>
                    <td class="s14" colspan="7">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >@ 15,000.00</span
                        >
                    </td>
                    <td class="s15"></td>
                    <td class="s15"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R37"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            38
                        </div>
                    </th>
                    <td class="s1" colspan="26">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >SUPPLIERS</span
                        >
                    </td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R38"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            39
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td
                        class="s3"
                        colspan="4"
                        style="border-top: 1px SOLID #000000"
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Caterer</span
                        >
                    </td>
                    <td
                        class="s4"
                        colspan="10"
                        style="border-top: 1px SOLID #000000"
                    >
                    ${data.caterer}
                    </td>
                    <td
                        class="s3"
                        colspan="3"
                        style="border-top: 1px SOLID #000000"
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Coordinator</span
                        >
                    </td>
                    <td
                        class="s4"
                        colspan="7"
                        style="border-top: 1px SOLID #000000"
                    >
                    ${data.coordinator}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R39"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            40
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Stylist</span
                        >
                    </td>
                    <td class="s4" colspan="10">
                      ${data.stylist}
                    </td>
                    <td class="s3" colspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Host</span
                        >
                    </td>
                    <td class="s4" colspan="7">
                      ${data.host}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R40"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            41
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Lights &amp; Sounds</span
                        >
                    </td>
                    <td class="s4" colspan="10">
                      ${data.lights_and_sounds}
                    </td>
                    <td class="s3" colspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Band</span
                        >
                    </td>
                    <td class="s4" colspan="7">
${data.band}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R41"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            42
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Photo/Video</span
                        >
                    </td>
                    <td class="s4" colspan="10">
${data.photo_or_video}
                    </td>
                    <td class="s3" colspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Others</span
                        >
                    </td>
                    <td class="s4" colspan="7">
${data.others_first}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R42"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            43
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Photoman/Booth</span
                        >
                    </td>
                    <td class="s4" colspan="10">
${data.photoman_booth}
                    </td>
                    <td class="s3" colspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Others</span
                        >
                    </td>
                    <td class="s4" colspan="7">
${data.others_second}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 20px">
                    <th
                        id="794150301R43"
                        style="height: 20px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 20px"
                        >
                            44
                        </div>
                    </th>
                    <td class="s1" colspan="26">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >NOTES / REMARKS</span
                        >
                    </td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R44"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            45
                        </div>
                    </th>
                    <td class="s2">
                    </td>
                    <td
                        class="s4"
                        colspan="24"
                        style="border-top: 1px SOLID #000000"
                    >
                    ${data.note_1}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 13px">
                    <th
                        id="794150301R45"
                        style="height: 13px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 13px"
                        >
                            46
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s4" colspan="24">
${data.note_2}
                    </td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R46"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            47
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s4" colspan="24">${data.note_3}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R47"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            48
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s4" colspan="24">${data.note_4}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 13px">
                    <th
                        id="794150301R48"
                        style="height: 13px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 13px"
                        >
                            49
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s4" colspan="24">${data.note_5}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R49"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            50
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s4" colspan="24">${data.note_6}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 14px">
                    <th
                        id="794150301R50"
                        style="height: 14px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 14px"
                        >
                            51
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s4" colspan="24">${data.note_7}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 20px">
                    <th
                        id="794150301R51"
                        style="height: 20px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 20px"
                        >
                            52
                        </div>
                    </th>

                    <td class="s0" colspan="5">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >PAYMENT DETAILS:
                        </span>
                    </td>
                    <td class="s4" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >Schedule</span
                        >
                    </td>

                    <td class="s4" colspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >Date Due</span
                        >
                    </td>

                    <td class="s4" colspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >Date Paid</span
                        >
                    </td>
                    <td class="s4" colspan="5">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >Details</span
                        >
                    </td>
                    <td class="s4" colspan="3">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >Amount</span
                        >
                    </td>
                    <td class="s4" colspan="2">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                                font-style: italic;
                            "
                            >Received By</span
                        >
                    </td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R52"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            53
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td
                        class="s3"
                        colspan="4"
                        style="border-top: 1px SOLID #000000"
                    >
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Earnest Money</span
                        >
                    </td>
                    <td class="s4" colspan="4">
                    </td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT001")?.date_due)}</td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT001")?.date_paid)}</td>
                    <td class="s4" colspan="5">${paymentMap.get("PDT001")?.details || ""}</td>
                    <td class="s4" colspan="3">${formatAmount(paymentMap.get("PDT001")?.amount)}</td>
                    <td class="s4" colspan="2">${paymentMap.get("PDT001")?.received_by || ""}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R53"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            54
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Reservation</span
                        >
                    </td>
                    <td class="s18" colspan="4">
                        <span
                            style="
                                font-size: 5pt;
                                font-family: Calibri, Arial;
                            "
                            >Within 2 Weeks after Earnest</span
                        >
                    </td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT002")?.date_due)}</td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT002")?.date_paid)}</td>
                    <td class="s4" colspan="5">${paymentMap.get("PDT002")?.details || ""}</td>
                    <td class="s4" colspan="3">${formatAmount(paymentMap.get("PDT002")?.amount)}</td>
                    <td class="s4" colspan="2">${paymentMap.get("PDT002")?.received_by || ""}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R54"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            55
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >50% Downpayment</span
                        >
                    </td>
                    <td class="s18" colspan="4">
                        <span
                            style="
                                font-size: 5pt;
                                font-family: Calibri, Arial;
                            "
                            >2 months after Reservation</span
                        >
                    </td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT003")?.date_due)}</td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT003")?.date_paid)}</td>
                    <td class="s4" colspan="5">${paymentMap.get("PDT003")?.details || ""}</td>
                    <td class="s4" colspan="3">${formatAmount(paymentMap.get("PDT003")?.amount)}</td>
                    <td class="s4" colspan="2">${paymentMap.get("PDT003")?.received_by || ""}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R55"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            56
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Full-Payment</span
                        >
                    </td>
                    <td class="s18" colspan="4">
                        <span
                            style="
                                font-size: 5pt;
                                font-family: Calibri, Arial;
                            "
                            >2 months before event date</span
                        >
                    </td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT004")?.date_due)}</td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT004")?.date_paid)}</td>
                    <td class="s4" colspan="5">${paymentMap.get("PDT004")?.details || ""}</td>
                    <td class="s4" colspan="3">${formatAmount(paymentMap.get("PDT004")?.amount)}</td>
                    <td class="s4" colspan="2">${paymentMap.get("PDT004")?.received_by || ""}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R56"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            57
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >Security Deposit</span
                        >
                    </td>
                    <td class="s18" colspan="4">
                        <span
                            style="
                                font-size: 5pt;
                                font-family: Calibri, Arial;
                            "
                            >2 months before event date</span
                        >
                    </td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT005")?.date_due)}</td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT005")?.date_paid)}</td>
                    <td class="s4" colspan="5">${paymentMap.get("PDT005")?.details || ""}</td>
                    <td class="s4" colspan="3">${formatAmount(paymentMap.get("PDT005")?.amount)}</td>
                    <td class="s4" colspan="2">${paymentMap.get("PDT005")?.received_by || ""}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 16px">
                    <th
                        id="794150301R57"
                        style="height: 16px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 16px"
                        >
                            58
                        </div>
                    </th>
                    <td class="s2"></td>
                    <td class="s3" colspan="4">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                            "
                            >OTHERS</span
                        >
                    </td>
                    <td class="s4" colspan="4"></td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT006")?.date_due)}</td>
                    <td class="s4" colspan="3">${formatDateCompact(paymentMap.get("PDT006")?.date_paid)}</td>
                    <td class="s4" colspan="5">${paymentMap.get("PDT006")?.details || ""}</td>
                    <td class="s4" colspan="3">${formatAmount(paymentMap.get("PDT006")?.amount)}</td>
                    <td class="s4" colspan="2">${paymentMap.get("PDT006")?.received_by || ""}</td>
                    <td class="s5"></td>
                </tr>
                <tr style="height: 24px">
                    <th
                        id="794150301R58"
                        style="height: 24px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 24px"
                        >
                            59
                        </div>
                    </th>
                    <td class="s19" colspan="26">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >NOTE: Please send all your Screenshots/Proof of
                            Payment to Viber (Karen - 09171157191)</span
                        >
                    </td>
                </tr>
                <tr style="height: 56px">
                    <th
                        id="794150301R59"
                        style="height: 56px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 56px"
                        >
                            60
                        </div>
                    </th>
                    <td class="s1" colspan="7" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >CONFORME:</span
                        >
                    </td>
                    <td
                        class="s1"
                        colspan="5"
                        style="text-align: center"
                    ></td>
                    <td
                        class="s1"
                        colspan="4"
                        style="text-align: center"
                    ></td>
                    <td class="s1" colspan="6" style="text-align: center">
                        <span
                            style="
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-weight: bold;
                            "
                            >APPROVED BY:</span
                        >
                    </td>
                    <td
                        class="s1"
                        colspan="5"
                        style="text-align: center"
                    ></td>
                </tr>
                <tr style="height: 15px">
                    <th
                        id="794150301R60"
                        style="height: 15px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 15px"
                        >
                            61
                        </div>
                    </th>
                    <td class="s20" colspan="7" style="text-align: center">
                        <span
                            style="
                                display: inline-block;
                                border-top: 1px solid #000;
                                padding-top: 4px;
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-style: italic;
                                width: 200px;
                            "
                            >Clients Signature over Printed Name
                        </span>
                    </td>
                    <td class="s20" colspan="4" style="text-align: center">
                        <span
                            style="
                                display: inline-block;
                                border-top: 1px solid #000;
                                padding-top: 4px;
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-style: italic;
                                width: 100px;
                            "
                            >Date</span
                        >
                    </td>
                    <td class="s20" colspan="4"></td>
                    <td class="s20" colspan="6" style="text-align: center">
                        <span
                            style="
                                display: inline-block;
                                border-top: 1px solid #000;
                                padding-top: 4px;
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-style: italic;
                                width: 200px;
                            "
                        >
                            Signature over Printed Name</span
                        >
                    </td>
                    <td class="s20" colspan="5" style="text-align: center">
                        <span
                            style="
                                display: inline-block;
                                border-top: 1px solid #000;
                                padding-top: 4px;
                                font-size: 8pt;
                                font-family: Calibri, Arial;
                                font-style: italic;
                                width: 100px;
                            "
                            >Date</span
                        >
                    </td>
                </tr>

                <tr style="height: 20px">
                    <th
                        id="794150301R62"
                        style="height: 20px"
                        class="row-headers-background"
                    >
                        <div
                            class="row-header-wrapper"
                            style="line-height: 20px"
                        >
                            63
                        </div>
                    </th>
                    <td colspan="26" align="center">
                        <img
                        src="data:image/jpeg;base64,${footerBase64}"
                            style="display: block; pointer-events: none"
                            height="37"
                            width="642"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>`;

  return `<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8" />
  <style>
  ${styleInline}
  </style>
  </head>
  ${htmlContent}
  </html>
  `;
};
