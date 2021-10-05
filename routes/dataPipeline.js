const express = require("express");
const { data } = require("jquery");

const router = express.Router();
const dataPipelineController = require("../controllers/dataPipelineController");

/// Data Pipeline Control Page ///

// GET dataPipeline home page.
router.get("/", dataPipelineController.dataPipeline_index);

// GET request for import data pipeline.
router.get("/import", dataPipelineController.dataPipeline_import_get);

// GET request for export data pipeline.
router.get("/export", dataPipelineController.dataPipeline_export_get);

// GET request to Trigger OTP Graph
router.get("/OTPtrigger", dataPipelineController.dataPipeline_trigger_get);

module.exports = router;
