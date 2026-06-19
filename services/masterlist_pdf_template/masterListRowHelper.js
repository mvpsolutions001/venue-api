import { formatDate } from "../../db/func.js";
const formatAmount = (value) => {
  if (value == null) return "";

  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDateCompact = (date) =>
  date ? new Date(date).toLocaleDateString("en-PH") : "";

export const parseMasterlistRow = (r) => {
  // let discount_notes = ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"];
  let discount_notes = ["", "", "", "", "", "", "", ""];
  // let payment_status = ["ok1", "ok2", "ok3", "ok4", "ok5", "ok6", "ok7", "ok8"];
  let payment_status = ["-", "-", "-", "-", "-", "-", "-", "-"];

  const paymentMap = new Map(r.payment_details.map((p) => [p.term_code, p]));

  const totalAmount = r.payment_details.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0,
  );

  const no_arn = "N/A";

  return `
    <tr style="height: 19px">
        <th
            id="1516909919R5"
            style="height: 19px"
            class="row-headers-background"
        >
            <div class="row-header-wrapper" style="line-height: 19px">
                6
            </div>
        </th>
        <td class="s13" rowspan="8">${r.row_number}</td>
        <td class="s14"></td>
        <td class="s14"></td>
        <td class="s15"></td>
        <td class="s16"></td>
        <td class="s17">
            ${discount_notes[0]}
        </td>
        <td class="s18"></td>
        <td class="s15"></td>
        <td class="s15"></td>
        <td class="s15"></td>
        <td class="s16"></td>
        <td class="s18"></td>
        <td class="s16"></td>
        <td class="s19"></td>
        <td class="s20" rowspan="8">${r.grand_total}</td>
        <td class="s21">Reservation</td>
        <td class="s22">${payment_status[0]}</td>
    </tr>
    <tr style="height: 19px">
        <th
            id="1516909919R6"
            style="height: 19px"
            class="row-headers-background"
        >
            <div class="row-header-wrapper" style="line-height: 19px">
                7
            </div>
        </th>
        <td class="s14">${formatDate(r.event_date)}</td>
        <td class="s23">${r.event_type}</td>
        <td class="s16" colspan="2">${r.event_day}</td>
        <td class="s17">${discount_notes[1]}</td>
        <td class="s24">EARNEST MONEY</td>
        <td class="s25">${formatAmount(paymentMap.get("PDT001")?.amount)}</td>
        <td class="s16">${formatDate(paymentMap.get("PDT001")?.date_due)}</td>
        <td class="s16">${formatDate(paymentMap.get("PDT001")?.date_paid)}</td>
        <td class="s16">${paymentMap.get("PDT001")?.ar_no ?? no_arn}</td>
        <td class="s24">CATERER</td>
        <td class="s26 softmerge">
            <div
                class="softmerge-inner"
                style="width: 275px; left: -1px"
            >
                ${r.caterer}
            </div>
        </td>
        <td class="s27">${r.note_1}</td>
        <td class="s21">50% DP</td>
        <td class="s22">${payment_status[1]}</td>
    </tr>
    <tr style="height: 19px">
        <th
            id="1516909919R7"
            style="height: 19px"
            class="row-headers-background"
        >
            <div class="row-header-wrapper" style="line-height: 19px">
                8
            </div>
        </th>
        <td class="s14"></td>
        <td class="s23">${r.client_table_name}</td>
        <td class="s16">${r.event_time_tentative} Hrs</td>
        <td class="s25">4:30 - 9:30 pm</td>
        <td class="s28">${discount_notes[2]}</td>
        <td class="s24">RESERVATION</td>
        <td class="s29">${formatAmount(paymentMap.get("PDT002")?.amount)}</td>
        <td class="s30">${formatDate(paymentMap.get("PDT002")?.date_due)}</td>
        <td class="s30">${formatDate(paymentMap.get("PDT002")?.date_paid)}</td>
        <td class="s31">${paymentMap.get("PDT002")?.ar_no ?? no_arn}</td>
        <td class="s24">LIGHTS &amp; SOUNDS</td>
        <td class="s32">${r.lights_and_sounds}</td>
        <td class="s19">${r.note_2}</td>
        <td class="s21">Draft Contract</td>
        <td class="s22">${payment_status[2]}</td>
    </tr>
    <tr style="height: 19px">
        <th
            id="1516909919R8"
            style="height: 19px"
            class="row-headers-background"
        >
            <div class="row-header-wrapper" style="line-height: 19px">
                9
            </div>
        </th>
        <td class="s14"></td>
        <td class="s23"></td>
        <td class="s16"></td>
        <td class="s25"></td>
        <td class="s17">${discount_notes[4]}</td>
        <td class="s24 softmerge">
            <div
                class="softmerge-inner"
                style="width: 110px; left: -1px"
            >
                50% DOWNPAYMENT
            </div>
        </td>
        <td class="s29">${formatAmount(paymentMap.get("PDT003")?.amount)}</td>
        <td class="s30">${formatDate(paymentMap.get("PDT003")?.date_due)}</td>
        <td class="s30">${formatDate(paymentMap.get("PDT003")?.date_paid)}</td>
        <td class="s31">${paymentMap.get("PDT003")?.ar_no ?? no_arn}</td>
        <td class="s24">COORDINATOR</td>
        <td class="s32">${r.coordinator}</td>
        <td class="s19">${r.note_3}</td>
        <td class="s21">Full Payment</td>
        <td class="s22">${payment_status[3]}</td>
    </tr>
    <tr style="height: 19px">
        <th
            id="1516909919R9"
            style="height: 19px"
            class="row-headers-background"
        >
            <div class="row-header-wrapper" style="line-height: 19px">
                10
            </div>
        </th>
        <td class="s14"></td>
        <td class="s14">Grand Hall</td>
        <td class="s32">INGRESS</td>
        <td class="s25">${r.ingress_time_tentative}</td>
        <td class="s17">${discount_notes[5]}</td>
        <td class="s24">FULL PAYMENT</td>
        <td class="s25">${formatAmount(paymentMap.get("PDT004")?.amount)}</td>
        <td class="s16">${formatDate(paymentMap.get("PDT004")?.date_due)}</td>
        <td class="s16">${formatDate(paymentMap.get("PDT004")?.date_paid)}</td>
        <td class="s16">${paymentMap.get("PDT004")?.ar_no ?? no_arn}</td>
        <td class="s24">STYLIST</td>
        <td class="s32">${r.stylist}</td>
        <td class="s19">${r.note_4}</td>
        <td class="s21">Final Contract</td>
        <td class="s22">${payment_status[4]}</td>
    </tr>
    <tr style="height: 18px">
        <th
            id="1516909919R10"
            style="height: 18px"
            class="row-headers-background"
        >
            <div class="row-header-wrapper" style="line-height: 18px">
                11
            </div>
        </th>
        <td class="s14"></td>
        <td class="s14">100-120 pax</td>
        <td class="s26">EGRESS</td>
        <td class="s33 softmerge">
            <div
                class="softmerge-inner"
                style="width: 122px; left: -3px"
            >
                ${r.egress_time_tentative}
            </div>
        </td>
        <td class="s34">
        ${discount_notes[6]}
        </td>
        <td class="s24">SECURITY DEPOSIT</td>
        <td class="s25">${formatAmount(paymentMap.get("PDT005")?.amount)}</td>
        <td class="s16">${formatDate(paymentMap.get("PDT005")?.date_due)}</td>
        <td class="s16">${formatDate(paymentMap.get("PDT005")?.date_paid)}</td>
        <td class="s16">${paymentMap.get("PDT005")?.ar_no ?? no_arn}</td>
        <td class="s24">PHOTO/VIDEO</td>
        <td class="s32">${r.photo_or_video}</td>
        <td class="s19">${r.note_5}</td>
        <td class="s21">Sec. Deposit</td>
        <td class="s22">${payment_status[5]}</td>
    </tr>
    <tr style="height: 19px">
        <th
            id="1516909919R11"
            style="height: 19px"
            class="row-headers-background"
        >
            <div class="row-header-wrapper" style="line-height: 19px">
                12
            </div>
        </th>
        <td class="s14"></td>
        <td class="s23"></td>
        <td class="s16"></td>
        <td class="s25"></td>
        <td class="s34">${discount_notes[6]}</td>
        <td class="s24">ADD-ONS</td>
        <td class="s25">${formatAmount(paymentMap.get("PDT006")?.amount)}</td>
        <td class="s16">${formatDate(paymentMap.get("PDT006")?.date_due)}</td>
        <td class="s16">${formatDate(paymentMap.get("PDT006")?.date_paid)}</td>
        <td class="s16">${paymentMap.get("PDT006")?.ar_no ?? no_arn}</td>
        <td class="s24">BAND</td>
        <td class="s32">${r.band}</td>
        <td class="s19">${r.note_6}</td>
        <td class="s21">Others</td>
        <td class="s22">${payment_status[6]}</td>
    </tr>
    <tr style="height: 19px">
        <th
            id="1516909919R12"
            style="height: 19px"
            class="row-headers-background"
        >
            <div class="row-header-wrapper" style="line-height: 19px">
                13
            </div>
        </th>
        <td class="s35"></td>
        <td class="s36"></td>
        <td class="s35"></td>
        <td class="s36"></td>
        <td class="s34">${discount_notes[7]}</td>
        <td class="s37">TOTAL PAYMENT</td>
        <td class="s36">${formatAmount(totalAmount)}</td>
        <td class="s35"></td>
        <td class="s35"></td>
        <td class="s35"></td>
        <td class="s37">OTHERS</td>
        <td class="s38">${r.others_first}</td>
        <td class="s39 softmerge">
            <div
                class="softmerge-inner"
                style="width: 152px; left: -1px"
            >
                ${r.note_7}
            </div>
        </td>
        <td class="s39">Sec. Deposit Returned</td>
        <td class="s40">${payment_status[7]}</td>
    </tr>
    `;
};
