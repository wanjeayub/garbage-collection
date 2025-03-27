const mongoose = require("mongoose");

const PaymentScheduleSchema = new mongoose.Schema({
  plot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plot",
    required: true,
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  expectedAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  carriedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentSchedule",
  },
  createdAt: { type: Date, default: Date.now },
});

// Index for faster queries by month and year
PaymentScheduleSchema.index({ month: 1, year: 1 });

module.exports = mongoose.model("PaymentSchedule", PaymentScheduleSchema);
