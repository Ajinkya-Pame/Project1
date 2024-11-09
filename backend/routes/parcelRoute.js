const express = require("express");
const Parcel = require("../models/Parcel"); // Make sure this points to your Parcel model
const router = express.Router();
const multer = require("multer");
// Render the parcel registration page

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");  // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/registerParcel", (req, res) => {
  res.render("registerParcel.ejs", { error: null }); // Pass null initially for error
});

// Handle parcel registration
router.post("/registerParcel", async (req, res) => {
  const {
    senderName,
    senderEmail,
    weight,
    dimensions,
    destination,
    specialInstructions,
  } = req.body;
  try {
    const newParcel = new Parcel({
      senderName,
      senderEmail,
      weight,
      dimensions,
      destination,
      specialInstructions,
      image: req.file ? req.file.filename : null,
    });
    await newParcel.save();
    res.redirect("/success"); // Redirect to a success page after registration
  } catch (err) {
    console.error(err);
    // Pass the error message to the view
    res.render("registerParcel", {
      error: "Error registering the parcel. Please try again.",
    }); 
  }
});

module.exports = router;
