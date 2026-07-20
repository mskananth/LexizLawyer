// class LoginPage {
//   constructor(page) {
//     this.page = page;

//     this.email = page.locator("#id_otp_identifier");

//     this.loginBtn = page.locator("#lx-btn");

//     this.otpTextbox = page.locator("#lx-otp-box");

//     this.verifyBtn = page.locator("#lx-btn");
//   }

//   async open(url) {
//     await this.page.goto(url);
//   }

//   async login(email) {
//     await this.email.fill(email);

//     await this.loginBtn.click();
//   }

//   async enterOTP(otp) {
//     await this.otpTextbox.fill(otp);

//     await this.verifyBtn.click();
//   }
// }

// module.exports = LoginPage;
