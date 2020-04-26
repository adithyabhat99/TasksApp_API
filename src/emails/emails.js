const sgMail = require("@sendgrid/mail");
const api_key =
  process.env.SENDGRID_API_KEY || require("../secrets/sendgrid.json").sendgrid;

sgMail.setApiKey(api_key);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "roofandbunk@gmail.com",
    subject: "Welcome to Task Manager",
    text: `Hey ${name}! Thank You for signing up for Task Manager :)`,
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "roofandbunk@gmail.com",
    subject: "Ba Bye",
    text: `Goodbye ${name}, I hope you signup once again if you change your mind`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
