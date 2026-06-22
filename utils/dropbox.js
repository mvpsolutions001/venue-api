import fetch from "node-fetch";
import { DROPBOX_TOKEN } from "../db/conn.js";

async function safeJson(res, label = "Dropbox") {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error(`${label} non-JSON response:`, text);
    throw new Error(`${label} returned invalid JSON`);
  }
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export async function uploadToDropbox(buffer, fileName) {
  try {
    const safeFileName = sanitizeFileName(fileName);

    const dropboxArg = {
      path: `/uploads/${Date.now()}-${safeFileName}`,
      mode: "add",
      autorename: true,
      mute: false,
    };

    const uploadRes = await fetch(
      "https://content.dropboxapi.com/2/files/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DROPBOX_TOKEN}`,
          "Dropbox-API-Arg": JSON.stringify(dropboxArg),
          "Content-Type": "application/octet-stream",
        },
        body: buffer,
      },
    );

    const text = await uploadRes.text();

    console.log("DROPBOX STATUS:", uploadRes.status);
    console.log("DROPBOX RAW RESPONSE:", text);

    let uploadData;
    try {
      uploadData = JSON.parse(text);
    } catch (e) {
      throw new Error("Dropbox returned NON-JSON response (see logs above)");
    }

    if (!uploadRes.ok) {
      console.log("DROPBOX ERROR OBJECT:", uploadData);
      throw new Error("Dropbox upload failed");
    }

    const filePath = uploadData.path_display;

    if (!filePath) {
      throw new Error("No file path returned from Dropbox");
    }

    // 2. Create shared link
    const shareRes = await fetch(
      "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DROPBOX_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: uploadData.path_display,
          settings: {
            requested_visibility: "public",
          },
        }),
      },
    );

    let shareData = await safeJson(shareRes, "Dropbox share");

    // 3. Handle "already exists" case (VERY IMPORTANT)
    if (shareRes.status === 409) {
      const listRes = await fetch(
        "https://api.dropboxapi.com/2/sharing/list_shared_links",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${DROPBOX_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: uploadData.path_display,
            direct_only: true,
          }),
        },
      );

      const listData = await safeJson(listRes, "Dropbox list links");
      shareData = listData.links[0];
    }

    return {
      filePath,
      url: shareData.url.includes("dl=0")
        ? shareData.url.replace("dl=0", "raw=1")
        : shareData.url + "&raw=1",
    };
  } catch (err) {
    console.error("Dropbox upload error:", err);
    throw err;
  }
}
