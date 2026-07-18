function extractOTP(emailBody) {
  const otp = emailBody.match(/\b\d{6}\b/);

  return otp ? otp[0] : null;
}

module.exports = { extractOTP };
