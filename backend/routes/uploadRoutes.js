// const express = require("express");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");

// require("dotenv").config();
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = multer.memoryStorage();
// const upload = multer({storage});


// const router = express.Router();
// router.post("/",upload.single("image"),async (req,res) => {
//     try {
//         if(!req.file){
//             return res.status(400).json({message: "No file Uploaded"});
//         }
//         const streamUpload = (fileBuffer) => {
//             return new Promise((resolve,reject) => {
//                 const stream = cloudinary.uploader.upload_stream((error,result) => {
//                     if(result) {
//                         resolve(result);
//                     } else {
//                         reject(error);
//                     }
//                 });

//                 streamifier.createReadStream(fileBuffer).pipe(stream);
//             });
//         };

//         const result = await streamUpload(req.file.buffer);
//         res.json({imageUrl: result.secure_url});
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Server Error");
//     }
// })

// module.exports = router;

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { protect, admin } = require("../middleware/authMiddleware");

require("dotenv").config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log configuration (hide secrets)
console.log("☁️ Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "NOT SET",
    api_key: process.env.CLOUDINARY_API_KEY ? "✓ SET" : "✗ NOT SET",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ SET" : "✗ NOT SET",
});

// Multer configuration
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
            return;
        }
        
        cb(null, true);
    }
});

const router = express.Router();

// Handle preflight OPTIONS request
router.options("/", (req, res) => {
    res.status(200).end();
});

// Upload endpoint - Protected (only admin can upload)
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
    try {
        console.log("📤 Upload request received");
        console.log("👤 User:", req.user.email);
        console.log("🌐 Origin:", req.headers.origin);
        console.log("📁 File:", req.file ? {
            name: req.file.originalname,
            type: req.file.mimetype,
            size: `${(req.file.size / 1024).toFixed(2)} KB`
        } : "NO FILE");

        if (!req.file) {
            console.error(" No file in request");
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Additional file validation
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (req.file.size > maxSize) {
            return res.status(400).json({ 
                message: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
            });
        }

        console.log("☁️ Uploading to Cloudinary...");

        // Upload to Cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "ecommerce-products",
                        resource_type: "image",
                        transformation: [
                            { width: 1000, height: 1000, crop: "limit" },
                            { quality: "auto:good" },
                            { fetch_format: "auto" }
                        ]
                    },
                    (error, result) => {
                        if (result) {
                            console.log(" Cloudinary upload successful");
                            resolve(result);
                        } else {
                            console.error(" Cloudinary error:", error);
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        const result = await streamUpload(req.file.buffer);
        
        console.log(" Upload complete:", result.secure_url);
        
        res.json({ 
            imageUrl: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error("Upload error:", error);
        
        // Handle specific error types
        if (error.message.includes("Only")) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ 
            message: "Failed to upload image",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
});

// Delete image endpoint (optional - for cleanup)
router.delete("/:publicId", protect, admin, async (req, res) => {
    try {
        const { publicId } = req.params;
        
        console.log(" Deleting image:", publicId);
        
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result === "ok") {
            console.log("Image deleted");
            res.json({ message: "Image deleted successfully" });
        } else {
            res.status(404).json({ message: "Image not found" });
        }
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Failed to delete image" });
    }
});

module.exports = router;