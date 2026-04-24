const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    console.log("AUTH header starts:", header.slice(0, 30) + "...");
    console.log("JWT_SECRET present:", !!secret, "len:", secret ? secret.length : 0);

    const payload = jwt.verify(token, secret);
    req.userId = payload.sub;
    return next();
  } catch (e) {
    console.log("JWT verify error:", e.name, e.message);
    return res.status(401).json({ error: "Invalid or expired token", details: `${e.name}: ${e.message}` });
  }
}

module.exports = { requireAuth };