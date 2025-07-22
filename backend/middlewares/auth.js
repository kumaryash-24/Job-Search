// import jwt from "jsonwebtoken";

// export const isAuthenticated = (req, res, next) => {
//   const token = req.cookies?.token;
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     req.id = decoded.userId;
//     next();
//   } catch (err) {
//     console.error("Token verification error:", err.message);
//     return res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };






import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    console.log("No token found");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.userId;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // 🔁 Here is the fix

    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(401).json({ message: "Token failed" });
  }
};
