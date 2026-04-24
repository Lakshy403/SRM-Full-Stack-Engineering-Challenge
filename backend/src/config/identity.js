function normalizeFullName(fullName) {
  return String(fullName || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z_]/g, "");
}

const identity = {
  user_id: `${normalizeFullName(process.env.FULL_NAME || "your_full_name")}_${process.env.DOB_DDMMYYYY || "01012000"}`,
  email_id: process.env.COLLEGE_EMAIL || "yourname@srmist.edu.in",
  college_roll_number: process.env.COLLEGE_ROLL_NUMBER || "RA0000000000000"
};

module.exports = { identity };
