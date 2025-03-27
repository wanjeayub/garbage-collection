const mongoose = require("mongoose");

const PlotSchema = new mongoose.Schema({
  plotNumber: { type: String, required: true },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  ownerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  bagsPerCollection: { type: Number, required: true, default: 1 },
  expectedAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Plot", PlotSchema);
