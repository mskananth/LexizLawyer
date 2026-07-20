require("dotenv").config();
console.log(process.env.BASE_URL);

const { test, expect } = require("@playwright/test");
const { getOTP } = require("../utils/emailHelper");
const { regOTP } = require("../utils/emailHelper1");
const { extractOTP } = require("../utils/otpExtractor");

test("Verify UI Elements", async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  await expect(page.locator("img.lx-logo")).toBeVisible();
  await expect(page.locator("#id_otp_identifier")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send OTP" }));
});

test("Empty Input Validations", async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  const sendOtpButton = page.getByRole("button", { name: "Send OTP" });
  await sendOtpButton.click();
  await expect(page.getByText("Email or Mobile is required")).toBeVisible();
});

test("Invalid Email Format", async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  await page.locator("#id_otp_identifier").fill("agile.ananth@");

  const sendOtpButton = page.getByRole("button", { name: "Send OTP" });
  await sendOtpButton.click();
  await expect(
    page.getByText("Enter a valid email or 10-digit mobile number"),
  ).toBeVisible();
});
test("Invalid Mobile Format", async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  await page.locator("#id_otp_identifier").fill("98431100");

  const sendOtpButton = page.getByRole("button", { name: "Send OTP" });
  await sendOtpButton.click();
  await expect(
    page.getByText("Enter a valid email or 10-digit mobile number"),
  ).toBeVisible();
});

test("Login with Unregistered Email", async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  await page.locator("#id_otp_identifier").fill("agile.ananth1@gmail.com");

  const sendOtpButton = page.getByRole("button", { name: "Send OTP" });
  await sendOtpButton.click();
  await expect(page.getByText("User not found")).toBeVisible();
});

test("Valid Regsitered Email", async ({ page }) => {
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
