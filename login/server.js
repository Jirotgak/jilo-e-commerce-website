// server.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static assets (css, client js, images)
app.use(express.static(path.join(__dirname, "public")));

// Simple session (for demo only) — change secret for production
app.use(
  session({
    secret: "change_this_secret_in_production",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// ---- MongoDB (local) ----
// Change URI for your DB. If you don't want DB now, comment out mongoose usage and stub User model.
mongoose
  .connect("mongodb://127.0.0.1:27017/loginApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// User model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
});
const User = mongoose.model("User", userSchema);

// ---- Routes ----
// Serve the HTML pages from /views using absolute path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Register (POST)
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.send("Fill both fields. <a href='/register'>Back</a>");

    const existing = await User.findOne({ email });
    if (existing) return res.send("User exists. <a href='/register'>Back</a>");

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// Login (POST)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send("Invalid credentials. <a href='/'>Back</a>");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Invalid credentials. <a href='/'>Back</a>");

    // save minimal session info
    req.session.userId = user._id;
    req.session.email = user.email;
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// Protected dashboard
app.get("/dashboard", (req, res) => {
  if (!req.session.userId) return res.redirect("/");
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
