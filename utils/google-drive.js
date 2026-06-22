import { google } from "googleapis";
import { Readable } from "stream";
import {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_DRIVE_FOLDER_ID,
  GOOGLE_PRIVATE_KEY,
} from "../db/conn.js";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

export async function uploadToDrive(buffer, fileName, mimeType) {
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id",
    supportsAllDrives: true,
  });

  const fileId = response.data.id;

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
    supportsAllDrives: true, // 🔥 IMPORTANT FIX
  });

  return {
    fileId,
    url: `https://drive.google.com/file/d/${fileId}/view`,
  };
}
