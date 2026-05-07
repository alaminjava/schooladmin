const cors = require("cors");
const express = require("express");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const authRoutes = require("./routes/authRoutes");
const classFeeRoutes = require("./routes/classFeeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const healthRoutes = require("./routes/healthRoutes");
const incrementRoutes = require("./routes/incrementRoutes");
const markRoutes = require("./routes/markRoutes");
const routineRoutes = require("./routes/routineRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const schoolSettingRoutes = require("./routes/schoolSettingRoutes");
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";
const corsOptions = corsOrigin === "*"
  ? {}
  : { origin: corsOrigin.split(",").map((origin) => origin.trim()).filter(Boolean) };

app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));

// Safety net for older frontend builds or misconfigured env values that send /api/api/...
app.use((req, _res, next) => {
  if (req.url.startsWith("/api/api/")) {
    req.url = req.url.replace("/api/api/", "/api/");
  }
  next();
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/class-fees", classFeeRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/salary-increments", incrementRoutes);
app.use("/api/school-settings", schoolSettingRoutes);

// Serve the built React frontend when running only the backend server.
const clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDistPath, "index.html"), (error) => {
    if (error) next();
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
