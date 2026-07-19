const { test, expect } = require("@playwright/test");
const { getOTP } = require("../utils/emailHelper");
const { getOTP1 } = require("../utils/emailHelper1");
const { extractOTP } = require("../utils/otpExtractor");
require("dotenv").config();

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
  // await page.pause();
});

// test("Signup with OTP ", async ({ page }) => {
//   await page.goto(process.env.BASE_URL);

//   await page.getByText("Register Here").click();

//   await page.locator("#id_fullname").fill("New Registration");

//   await page.locator("#id_email").fill(process.env.EMAIL1);

//   await page.locator("#id_phone").fill("9002233111");

//   const sendOtpButton = page.getByRole("button", { name: "Send OTP" });

//   await expect(sendOtpButton).toBeEnabled();

//   await sendOtpButton.click();

//   await page.getByRole("button", { name: "Yes, Continue" }).click();

//   await expect(page.locator("div.lx-otp-boxes")).toBeVisible({
//     timeout: 30000,
//   });

//   const emailText = await getOTP1();
//   const otp = extractOTP(emailText);

//   expect(otp).toBeTruthy();

//   const otpInputs = page.locator(".lx-otp-box");

//   for (let i = 0; i < otp.length; i++) {
//     await otpInputs.nth(i).click();
//     await otpInputs.nth(i).pressSequentially(otp[i]);
//   }
//   await page.getByRole("button", { name: "Verify OTP" }).click();
//   await page.waitForLoadState("networkidle");
//   await expect(page).toHaveTitle("LexiZ Lawyers");
//   await page.pause();
// });
