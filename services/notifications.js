import {
  CORS_DOMAIN,
  SMTP_RECEIVER_EMAIL,
  SMTP_SENDER_EMAIL,
  transporter,
} from "../db/conn.js";
import {
  forgotPasswordResetHTMLTemplate,
  passwordResetHTMLTemplate,
  passwordResetHTMLTemplateTest,
} from "./email_templates/passwordResetHTMLTemplate.js";

export const sendPasswordResetEmailNotificationTest = async () => {
  let test = passwordResetHTMLTemplateTest();
  try {
    await transporter.sendMail(
      {
        from: `"TEST " <${SMTP_SENDER_EMAIL}>`,
        to: [SMTP_RECEIVER_EMAIL], // list of receivers
        subject: `test email`, // Subject line
        text: "test email", // plain text body
        html: test.body, // html body
        headers: {
          // ✅ Add both mailto and URL options (recommended)
          "List-Unsubscribe": `<mailto:${SMTP_SENDER_EMAIL}?subject=unsubscribe>, <https://${CORS_DOMAIN}/unsubscribe?email=${SMTP_RECEIVER_EMAIL}>`,
        },
      },
      (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          // You can also log specific error details
          // console.error('Error code:', err.code);
          // console.error('Error message:', err.message);
        } else {
          console.log("Email sent:", info.messageId);
        }
      },
    );
    return test.data;
  } catch (e) {
    console.log(e);
  }
};
export const sendPasswordResetEmailNotification = async (user) => {
  try {
    return await transporter.sendMail({
      from: `"Test " <${SMTP_SENDER_EMAIL}>`,
      to: [user.email], // list of receivers
      subject: `test`, // Subject line
      text: "test", // plain text body
      html: passwordResetHTMLTemplate(user), // html body
      headers: {
        // ✅ Add both mailto and URL options (recommended)
        "List-Unsubscribe": `<mailto:${SMTP_SENDER_EMAIL}?subject=unsubscribe>, <https://${CORS_DOMAIN}/unsubscribe?email=${SMTP_RECEIVER_EMAIL}>`,
      },
    });
  } catch (e) {
    console.log("e sendPasswordResetEmailNotification");
    console.log(e);
  }
};
export const sendForgotPasswordResetEmailNotification = async (user) => {
  try {
    return await transporter.sendMail({
      from: `<${SMTP_SENDER_EMAIL}>`,
      to: [user.email],
      subject: `test`,
      text: "test",
      html: forgotPasswordResetHTMLTemplate(user),
      headers: {
        // ✅ Add both mailto and URL options (recommended)
        "List-Unsubscribe": `<mailto:${SMTP_SENDER_EMAIL}?subject=unsubscribe>, <https://${CORS_DOMAIN}/unsubscribe?email=${SMTP_RECEIVER_EMAIL}>`,
      },
    });
  } catch (e) {
    console.log("e sendPasswordResetEmailNotification");
    console.log(e);
  }
};
