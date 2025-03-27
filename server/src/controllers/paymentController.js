const PaymentSchedule = require("../models/PaymentSchedule");
const Plot = require("../models/Plot");

// @desc    Get all payment schedules
// @route   GET /api/schedules
// @access  Public
const getPaymentSchedules = async (req, res) => {
  try {
    const { month, year, isPaid, location } = req.query;

    const query = {};

    // Date filtering
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    // Payment status filtering
    if (isPaid) {
      query.isPaid = isPaid === "true";
    }

    // Location filtering
    let plotPopulation = {
      path: "plot",
      populate: {
        path: "location",
        select: "name",
      },
    };

    if (location) {
      plotPopulation.match = { location };
    }

    const schedules = await PaymentSchedule.find(query)
      .populate(plotPopulation)
      .sort({ createdAt: -1 })
      .lean(); // Using lean() for better performance

    // Filter out schedules where plot was deleted
    const validSchedules = schedules.filter(
      (schedule) => schedule.plot !== null
    );

    res.json(validSchedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
};

// @desc    Carry forward unpaid schedules to next month
// @route   POST /api/schedules/carry
// @access  Public
const carryForwardSchedules = async (req, res) => {
  const session = await PaymentSchedule.startSession();
  session.startTransaction();

  try {
    const { month, year } = req.body;

    if (!month || !year) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Month and year are required" });
    }

    // Calculate next month and year
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    // Find all unpaid schedules for the current month
    const unpaidSchedules = await PaymentSchedule.find({
      month,
      year,
      isPaid: false,
    })
      .populate("plot")
      .session(session);

    if (unpaidSchedules.length === 0) {
      await session.abortTransaction();
      return res.json({ message: "No unpaid schedules to carry forward" });
    }

    // Create new schedules for next month using bulk operations
    const operations = unpaidSchedules.map((schedule) => ({
      insertOne: {
        document: {
          plot: schedule.plot._id,
          month: nextMonth,
          year: nextYear,
          expectedAmount: schedule.plot.expectedAmount,
          carriedFrom: schedule._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }));

    const result = await PaymentSchedule.bulkWrite(operations, { session });

    await session.commitTransaction();
    res.json({
      message: `${result.insertedCount} schedules carried forward to ${nextMonth}/${nextYear}`,
      carriedCount: result.insertedCount,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  } finally {
    session.endSession();
  }
};

// @desc    Mark schedule as paid
// @route   PUT /api/schedules/:id/pay
// @access  Public
const markScheduleAsPaid = async (req, res) => {
  const session = await PaymentSchedule.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { paidAmount, paymentDate } = req.body;

    // Validate payment
    if (paidAmount && isNaN(paidAmount)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    const schedule = await PaymentSchedule.findById(id)
      .populate("plot")
      .session(session);

    if (!schedule) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Schedule not found" });
    }

    if (schedule.isPaid) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Schedule is already paid" });
    }

    // Update schedule
    const update = {
      isPaid: true,
      paidAmount: paidAmount || schedule.plot.expectedAmount,
      paidAt: paymentDate ? new Date(paymentDate) : new Date(),
      updatedAt: new Date(),
    };

    const updatedSchedule = await PaymentSchedule.findByIdAndUpdate(
      id,
      update,
      { new: true, session }
    );

    await session.commitTransaction();
    res.json(updatedSchedule);
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  } finally {
    session.endSession();
  }
};

// @desc    Create payment schedule
// @route   POST /api/schedules
// @access  Public
const createPaymentSchedule = async (req, res) => {
  const session = await PaymentSchedule.startSession();
  session.startTransaction();

  try {
    const { plotId, month, year, expectedAmount } = req.body;

    // Validate input
    if (!plotId || !month || !year) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if plot exists
    const plotExists = await Plot.exists({ _id: plotId }).session(session);
    if (!plotExists) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Plot not found" });
    }

    // Check for existing schedule
    const existingSchedule = await PaymentSchedule.findOne({
      plot: plotId,
      month,
      year,
    }).session(session);

    if (existingSchedule) {
      await session.abortTransaction();
      return res.status(409).json({
        error: "Schedule already exists for this period",
        existingId: existingSchedule._id,
      });
    }

    // Get plot to determine default amount
    const plot = await Plot.findById(plotId).session(session);

    // Create new schedule
    const schedule = await PaymentSchedule.create(
      [
        {
          plot: plotId,
          month,
          year,
          expectedAmount: expectedAmount || plot.expectedAmount,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json(schedule[0]);
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  getPaymentSchedules,
  carryForwardSchedules,
  markScheduleAsPaid,
  createPaymentSchedule,
};
