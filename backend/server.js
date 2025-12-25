// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoutes");
// const productRoutes = require("./routes/productRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const checkoutRoutes = require("./routes/checkoutRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const uploadRoutes = require("./routes/uploadRoutes");
// const subscriberRoutes = require("./routes/subscriberRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const productAdminRoutes =  require("./routes/productAdminRoutes");
// const adminOrderRoutes = require("./routes/adminOrderRoutes");
// const app = express();
// app.use(express.json());
// app.use(cors());

// dotenv.config();
// const PORT = process.env.PORT || 3000;
// connectDB();
// app.get("/",(req,res) => {
//     res.send("WELCOME TO RABIT API")
// })

// //api route
// app.use("/api/users",userRoutes);
// app.use("/api/products",productRoutes);
// app.use("/api/cart",cartRoutes);
// app.use("/api/checkout",checkoutRoutes);
// app.use("/api/orders",orderRoutes);
// app.use("/api/upload",uploadRoutes);
// app.use("/api",subscriberRoutes);

// //admin
// app.use("/api/admin/users",adminRoutes);
// app.use("/api/admin/products",productAdminRoutes);
// app.use("/api/admin/orders",adminOrderRoutes);
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
    
// })

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ===== SECURITY CONFIGURATION =====

// Helmet - Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disable if using external resources like Cloudinary
}));

// CORS Configuration - SECURE
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl, etc.)
        if (!origin) return callback(null, true);
        
        // Development mode - allow all localhost
        if (process.env.NODE_ENV !== "production" && origin.includes("localhost")) {
            return callback(null, true);
        }
        
        // Production - only allow specific origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn("❌ CORS blocked origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per 15 minutes per IP
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 uploads per 15 minutes per IP
    message: "Too many uploads, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Max 5 login attempts per 15 minutes
    message: "Too many login attempts, please try again later",
});

// Apply general rate limiter to all routes
app.use("/api/", generalLimiter);

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Additional security headers
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
});

// Request logging middleware (development only)
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log(`📨 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
        next();
    });
}

// ===== DATABASE CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// ===== ROUTES =====
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes =  require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");


// Apply specific rate limiters
app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/checkout",checkoutRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api",subscriberRoutes);

//admin
app.use("/api/admin/users",adminRoutes);
app.use("/api/admin/products",productAdminRoutes);
app.use("/api/admin/orders",adminOrderRoutes);


// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Error:", err);
    
    // Don't leak error details in production
    const message = process.env.NODE_ENV === "production" 
        ? "Internal Server Error" 
        : err.message;
    
    res.status(err.status || 500).json({
        message: message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔒 CORS enabled for: ${allowedOrigins.join(", ")}`);
});

module.exports = app;