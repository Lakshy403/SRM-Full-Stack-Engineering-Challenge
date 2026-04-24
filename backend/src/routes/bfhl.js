const express = require("express");
const { identity } = require("../config/identity");
const { analyzeHierarchies } = require("../services/hierarchyAnalyzer");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    operation_code: 1
  });
});

router.post("/", (req, res) => {
  if (!req.is("application/json")) {
    return res.status(415).json({
      is_success: false,
      message: "Content-Type must be application/json."
    });
  }

  const { data } = req.body || {};

  if (!Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      message: "Request body must include a data array."
    });
  }

  const analysis = analyzeHierarchies(data);

  return res.status(200).json({
    is_success: true,
    ...identity,
    ...analysis
  });
});

module.exports = router;
