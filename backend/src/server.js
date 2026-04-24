require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bfhlRouter = require("./routes/bfhl");
const { renderApiHome } = require("./views/apiHome");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.type("html").send(renderApiHome());
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/bfhl", bfhlRouter);

app.use((err, _req, res, _next) => {
  res.status(500).json({
    is_success: false,
    message: err.message || "Unexpected server error."
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

module.exports = app;
