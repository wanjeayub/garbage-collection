const Location = require("../models/Location");
const Plot = require("../models/Plot");
const PaymentSchedule = require("../models/PaymentSchedule");

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 }).lean(); // Using lean() for better performance

    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

// @desc    Create a location
// @route   POST /api/locations
// @access  Public
const createLocation = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Location name is required" });
    }

    // Check for duplicate location name (case insensitive)
    const existingLocation = await Location.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingLocation) {
      return res.status(400).json({ error: "Location already exists" });
    }

    // Using create() instead of new + save()
    const location = await Location.create({ name });

    res.status(201).json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Public
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate required field
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Location name is required" });
    }

    // Check if location exists
    const locationExists = await Location.exists({ _id: id });
    if (!locationExists) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Check for duplicate name
    const duplicateLocation = await Location.findOne({
      _id: { $ne: id }, // Exclude current location
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (duplicateLocation) {
      return res.status(400).json({ error: "Location name already exists" });
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      { name },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    res.json(updatedLocation);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Public
const deleteLocation = async (req, res) => {
  const session = await Location.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Check if location exists
    const locationExists = await Location.exists({ _id: id }).session(session);
    if (!locationExists) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Location not found" });
    }

    // Check if location has associated plots
    const hasPlots = await Plot.exists({ location: id }).session(session);
    if (hasPlots) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Cannot delete location with associated plots",
      });
    }

    // Delete the location
    const result = await Location.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    res.json({
      message: "Location removed successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  getLocations,
  createLocation,
  updateLocation, // Added update functionality
  deleteLocation,
};
