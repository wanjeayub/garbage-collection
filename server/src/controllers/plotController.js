const Plot = require("../models/Plot");
const PaymentSchedule = require("../models/PaymentSchedule");
const Location = require("../models/Location");

// @desc    Get all plots
// @route   GET /api/plots
// @access  Public
const getPlots = async (req, res) => {
  try {
    const { location } = req.query;

    let query = {};
    if (location) {
      query.location = location;
    }

    const plots = await Plot.find(query)
      .populate("location", "name")
      .sort({ createdAt: -1 })
      .lean(); // Using lean() for better performance

    res.json(plots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Create a plot
// @route   POST /api/plots
// @access  Public
const createPlot = async (req, res) => {
  try {
    const {
      plotNumber,
      location,
      ownerName,
      mobileNumber,
      bagsPerCollection,
      expectedAmount,
    } = req.body;

    // Validate required fields
    if (
      !plotNumber ||
      !location ||
      !ownerName ||
      !mobileNumber ||
      !expectedAmount
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if location exists using modern exists() method
    const locationExists = await Location.exists({ _id: location });
    if (!locationExists) {
      return res.status(400).json({ error: "Location does not exist" });
    }

    // Check for duplicate plot number in location
    const duplicatePlot = await Plot.exists({ plotNumber, location });
    if (duplicatePlot) {
      return res
        .status(400)
        .json({ error: "Plot number already exists in this location" });
    }

    const plot = new Plot({
      plotNumber,
      location,
      ownerName,
      mobileNumber,
      bagsPerCollection: bagsPerCollection || 1,
      expectedAmount,
    });

    const createdPlot = await plot.save();

    // Create initial payment schedule for current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    await PaymentSchedule.create({
      plot: createdPlot._id,
      month: currentMonth,
      year: currentYear,
      expectedAmount: createdPlot.expectedAmount,
    });

    res.status(201).json(createdPlot);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

// @desc    Update a plot
// @route   PUT /api/plots/:id
// @access  Public
const updatePlot = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate plot exists
    const plotExists = await Plot.exists({ _id: id });
    if (!plotExists) {
      return res.status(404).json({ error: "Plot not found" });
    }

    // If location is being updated, validate it exists
    if (updateData.location) {
      const locationExists = await Location.exists({
        _id: updateData.location,
      });
      if (!locationExists) {
        return res.status(400).json({ error: "Location does not exist" });
      }
    }

    // Update plot using findByIdAndUpdate with modern options
    const updatedPlot = await Plot.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
      context: "query", // Needed for some validators
    }).populate("location", "name");

    // If expected amount changed, update unpaid schedules
    if (updateData.expectedAmount) {
      await PaymentSchedule.updateMany(
        { plot: id, isPaid: false },
        { expectedAmount: updateData.expectedAmount }
      );
    }

    res.json(updatedPlot);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

// @desc    Delete a plot
// @route   DELETE /api/plots/:id
// @access  Public
const deletePlot = async (req, res) => {
  try {
    const { id } = req.params;

    // Using deleteOne() instead of remove()
    const result = await Plot.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Plot not found" });
    }

    // Delete all payment schedules for this plot
    await PaymentSchedule.deleteMany({ plot: id });

    res.json({
      message: "Plot and its payment schedules removed successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

module.exports = {
  getPlots,
  createPlot,
  updatePlot, // Added update functionality
  deletePlot,
};
