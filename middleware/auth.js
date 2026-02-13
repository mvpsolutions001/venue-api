import { dbValidateToken } from "../db/control.js";

// middlewares/auth.js
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.venutoken;

    if (!token) {
      return res.status(401).json({ message: "Invalid request" });

      console.log("no token");
    }

    const result = await dbValidateToken(token, req);

    // console.log("result dbValidateToken");
    // console.log(result);

    if (!result) {
      return res.status(401).json({ message: "Invalid request" });
    }

    if (result && !result.code) {
      return res.status(401).json({ message: "Invalid request" });
    }

    if (result && result.code !== 200) {
      return res.status(401).json({ message: "Invalid request" });
    }

    req.user = result.data;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Invalid request" });
  }
};
