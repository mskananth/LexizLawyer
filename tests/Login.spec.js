require("dotenv").config();

const { test, expect } = require("@playwright/test");
const { getOTP } = require("../utils/emailHelper");
const { extractOTP } = require("../utils/otpExtractor");

test("Email OTP Login", async ({ page }) => {
  await page.goto(process.env.BASE_URL);

  await page.locator("#id_otp_identifier").fill(process.env.EMAIL);

  const sendOtpButton = page.getByRole("button", { name: "Send OTP" });

  await expect(sendOtpButton).toBeEnabled();
  await sendOtpButton.click();

  await expect(page.locator("div.lx-otp-boxes")).toBeVisible({
    timeout: 30000,
  });

  const emailText = await getOTP();
  const otp = extractOTP(emailText);

  expect(otp).toBeTruthy();

  const otpInputs = page.locator(".lx-otp-box");

  for (let i = 0; i < otp.length; i++) {
    await otpInputs.nth(i).click();
    await otpInputs.nth(i).pressSequentially(otp[i]);
  }
  await page.getByRole("button", { name: "Verify OTP" }).click();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveTitle("LexiZ Lawyers");
  await page.pause();
});
