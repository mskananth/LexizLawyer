const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");

async function regOTP() {
  const config = {
    imap: {
      user: process.env.IMAP_USER1,
      password: process.env.IMAP_PASSWORD1,
      host: process.env.IMAP_HOST1,
      port: Number(process.env.IMAP_PORT1),
      tls: true,
      authTimeout: 10000,
      tlsOptions: {
        rejectUnauthorized: false, // Development only
      },
    },
  };

  const connection = await imaps.connect(config);

  await connection.openBox("INBOX");

  const delay = 5000;

  await new Promise((resolve) => setTimeout(resolve, delay));

  const searchCriteria = ["UNSEEN"];

  const fetchOptions = {
    bodies: [""],
    markSeen: true,
  };

  const messages = await connection.search(searchCriteria, fetchOptions);

  const latest = messages[messages.length - 1];

  const parsed = await simpleParser(latest.parts[0].body);

  connection.end();

  return parsed.text;
}

module.exports = { regOTP };
