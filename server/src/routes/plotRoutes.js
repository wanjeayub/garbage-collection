const express = require("express");
const router = express.Router();
const {
  getPlots,
  createPlot,
  deletePlot,
  updatePlot,
} = require("../controllers/plotController");

router.route("/").get(getPlots).post(createPlot);

router
  .route("/:id")
  .put(updatePlot) // Make sure this line exists
  .delete(deletePlot);

module.exports = router;
