import {
  SMTP_PORTAL_URL,
  SMTP_PORTAL_CHANGE_URL,
  all,
  CORS_DOMAIN,
} from "../../db/conn.js";

export const forgotPasswordResetHTMLTemplate = (user) => {
  return `<!doctype html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <title>Forgot Password Reset</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f7fa;
                  margin: 0;
                  padding: 0;
              }
              .email-container {
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 6px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
              }
              h2 {
                  color: #333333;
              }
              p {
                  color: #555555;
                  line-height: 1.5;
              }
              table {
                  width: 100%;
                  margin: 20px 0;
                  border-collapse: collapse;
              }
              td {
                  padding: 3px 0;
              }
              .button {
                  display: inline-block;
                  /*margin-top: 20px;*/
                  padding: 8px 15px;
                  background-color: #004e89;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 4px;
                  /*font-weight: bold;*/
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #999999;
                  margin-top: 40px;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <h2>Welcome back to FTRS Dashboard!</h2>

              <p>Hello <strong>${user.first_name}</strong>,</p>

              <p>
              We received a request to reset your password. If you made this request, please click the button below to continue:
              </p>

              <br>
              <br>

              <a href="${CORS_DOMAIN}${SMTP_PORTAL_CHANGE_URL}${user.resetToken}" class="button" style="color:white">Click here</a>

              <p>
                  Best regards,<br />
                  The FTRS Dashboard Team
              </p>

              <div class="footer">
                  © 2025 FTRS. All rights reserved.
              </div>
          </div>
      </body>
  </html>
`;
};
export const passwordResetHTMLTemplate = (user) => {
  return `<!doctype html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <title>Password Reset</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f7fa;
                  margin: 0;
                  padding: 0;
              }
              .email-container {
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 6px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
              }
              h2 {
                  color: #333333;
              }
              p {
                  color: #555555;
                  line-height: 1.5;
              }
              table {
                  width: 100%;
                  margin: 20px 0;
                  border-collapse: collapse;
              }
              td {
                  padding: 3px 0;
              }
              .button {
                  display: inline-block;
                  /*margin-top: 20px;*/
                  padding: 8px 15px;
                  background-color: #004e89;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 4px;
                  /*font-weight: bold;*/
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #999999;
                  margin-top: 40px;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <h2>Welcome to FTRS Dashboard!</h2>

              <p>Hello <strong>${user.first_name}</strong>,</p>

              <p>
                  Your account has been created successfully. Please click button below to continue:
              </p>

<br>
<br>

              <a href="${CORS_DOMAIN}${SMTP_PORTAL_CHANGE_URL}${user.resetToken}" class="button" style="color:white">Click here</a>


              <p>
                  Best regards,<br />
                  The FTRS Dashboard Team
              </p>

              <div class="footer">
                  © 2025 FTRS. All rights reserved.
              </div>
          </div>
      </body>
  </html>
`;
};

export const passwordResetHTMLTemplateTest = () => {
  return {
    data: "all",
    body: `<!doctype html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <title>Test Email</title>
      </head>
      <body>
              <h2>Test Email</h2>
      </body>
  </html>
`,
  };
};
