const express = require("express");
const router = express.Router();
const {
  getPaymentSchedules,
  carryForwardSchedules,
  markScheduleAsPaid,
  createPaymentSchedule,
} = require("../controllers/paymentController");

router.route("/").get(getPaymentSchedules).post(createPaymentSchedule);

router.route("/carry").post(carryForwardSchedules);

router.route("/:id/pay").put(markScheduleAsPaid);

module.exports = router;
