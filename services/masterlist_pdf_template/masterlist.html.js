import fs from "fs";
import { getPHDate } from "../../db/common.js";
import { parseMasterlistRow } from "./masterListRowHelper.js";

export const styleInline = fs.readFileSync(
  "services/masterlist_pdf_template/style_inline.css",
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

export const constructMasterlistHtml = (data) => {
  console.log("data");
  console.log(data);

  // const paymentMap = new Map(data.payment_details.map((p) => [p.term_code, p]));
  let rowHtml = data
    .map((row) => {
      return parseMasterlistRow(row);
    })
    .join("");

  let htmlContent = `<div class="ritz grid-container" dir="ltr">
      <table class="waffle" cellspacing="0" cellpadding="0">
          <thead>
              <tr>
                  <th class="row-header freezebar-origin-ltr"></th>
                  <th
                      id="1516909919C0"
                      style="width: 32px"
                      class="column-headers-background"
                  >
                      A
                  </th>
                  <th
                      id="1516909919C1"
                      style="width: 95px"
                      class="column-headers-background"
                  >
                      B
                  </th>
                  <th
                      id="1516909919C2"
                      style="width: 152px"
                      class="column-headers-background"
                  >
                      C
                  </th>
                  <th
                      id="1516909919C3"
                      style="width: 69px"
                      class="column-headers-background"
                  >
                      D
                  </th>
                  <th
                      id="1516909919C4"
                      style="width: 123px"
                      class="column-headers-background"
                  >
                      E
                  </th>
                  <th
                      id="1516909919C5"
                      style="width: 165px"
                      class="column-headers-background"
                  >
                      F
                  </th>
                  <th
                      id="1516909919C6"
                      style="width: 113px"
                      class="column-headers-background"
                  >
                      G
                  </th>
                  <th
                      id="1516909919C7"
                      style="width: 109px"
                      class="column-headers-background"
                  >
                      H
                  </th>
                  <th
                      id="1516909919C8"
                      style="width: 89px"
                      class="column-headers-background"
                  >
                      I
                  </th>
                  <th
                      id="1516909919C9"
                      style="width: 89px"
                      class="column-headers-background"
                  >
                      J
                  </th>
                  <th
                      id="1516909919C10"
                      style="width: 89px"
                      class="column-headers-background"
                  >
                      K
                  </th>
                  <th
                      id="1516909919C11"
                      style="width: 100px"
                      class="column-headers-background"
                  >
                      L
                  </th>
                  <th
                      id="1516909919C12"
                      style="width: 122px"
                      class="column-headers-background"
                  >
                      M
                  </th>
                  <th
                      id="1516909919C13"
                      style="width: 155px"
                      class="column-headers-background"
                  >
                      N
                  </th>
                  <th
                      id="1516909919C14"
                      style="width: 89px"
                      class="column-headers-background"
                  >
                      O
                  </th>
                  <th
                      id="1516909919C15"
                      style="width: 170px"
                      class="column-headers-background"
                  >
                      P
                  </th>
                  <th
                      id="1516909919C16"
                      style="width: 43px"
                      class="column-headers-background"
                  >
                      Q
                  </th>
              </tr>
          </thead>
          <tbody>
              <tr style="height: 42px">
                  <th
                      id="1516909919R0"
                      style="height: 42px"
                      class="row-headers-background"
                  >
                      <div class="row-header-wrapper" style="line-height: 42px">
                          1
                      </div>
                  </th>
                  <td class="s0" colspan="16">EVENT BOOKING MASTER LIST</td>
                  <td class="s1"></td>
              </tr>
              <tr style="height: 19px">
                  <th
                      id="1516909919R1"
                      style="height: 19px"
                      class="row-headers-background"
                  >
                      <div class="row-header-wrapper" style="line-height: 19px">
                          2
                      </div>
                  </th>
                  <td class="s2" colspan="16">
                      T h e C h a n d e l i e r E v e n t s P l a c e
                      <span
                          style="
                              font-size: 22pt;
                              font-family: Arial;
                              font-weight: bold;
                              color: #000000;
                          "
                      >
                      </span
                      ><span
                          style="
                              font-size: 14pt;
                              font-family: &quot;Arial Black&quot;, Arial;
                              font-weight: bold;
                              color: #000000;
                          "
                          >updated: ${getPHDate()}</span
                      >
                  </td>
                  <td class="s1"></td>
              </tr>
              <tr style="height: 19px">
                  <th
                      id="1516909919R2"
                      style="height: 19px"
                      class="row-headers-background"
                  >
                      <div class="row-header-wrapper" style="line-height: 19px">
                          3
                      </div>
                  </th>
                  <td class="s3"></td>
                  <td class="s3"></td>
                  <td class="s3"></td>
                  <td class="s3"></td>
                  <td class="s3"></td>
                  <td class="s3"></td>
                  <td class="s4"></td>
                  <td class="s3"></td>
                  <td class="s3"></td>
                  <td class="s3"></td>
                  <td class="s3"></td>
                  <td class="s4"></td>
                  <td class="s3"></td>
                  <td class="s3"></td>
                  <td class="s5"></td>
                  <td class="s6"></td>
                  <td class="s3"></td>
              </tr>
              <tr style="height: 19px">
                  <th
                      id="1516909919R3"
                      style="height: 19px"
                      class="row-headers-background"
                  >
                      <div class="row-header-wrapper" style="line-height: 19px">
                          4
                      </div>
                  </th>
                  <td class="s7"></td>
                  <td class="s8" rowspan="2">EVENT DATE</td>
                  <td class="s7">NAME OF EVENT</td>
                  <td class="s7">DAY</td>
                  <td class="s7">TIME</td>
                  <td class="s7">SPECIAL REQUESTS</td>
                  <td class="s7">PAYMENT</td>
                  <td class="s8" rowspan="2">AMOUNT</td>
                  <td class="s8" rowspan="2">DATE DUE</td>
                  <td class="s8" rowspan="2">DATE PAID</td>
                  <td class="s8" rowspan="2">OR / AR #</td>
                  <td class="s8" colspan="2" rowspan="2">SUPPLIERS</td>
                  <td class="s8" rowspan="2">REMARKS</td>
                  <td class="s9" rowspan="2">TOTAL RENT</td>
                  <td class="s8" colspan="2" rowspan="2">STATUS</td>
              </tr>
              <tr style="height: 19px">
                  <th
                      id="1516909919R4"
                      style="height: 19px"
                      class="row-headers-background"
                  >
                      <div class="row-header-wrapper" style="line-height: 19px">
                          5
                      </div>
                  </th>
                  <td class="s10"></td>
                  <td class="s11 softmerge">
                      <div
                          class="softmerge-inner"
                          style="width: 157px; left: -9px"
                      >
                          VENUE &amp; NO. OF GUESTS
                      </div>
                  </td>
                  <td class="s12">DURATION</td>
                  <td class="s10"></td>
                  <td class="s10">DISCOUNTS</td>
                  <td class="s10">SCHEDULE</td>
              </tr>

              ${rowHtml}
          </tbody>
      </table>
  </div>
`;

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
