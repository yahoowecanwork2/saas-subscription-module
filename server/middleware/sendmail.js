import { createTransport } from "nodemailer";

// use while registration and use in resend otp
const sendRegisterAndResendOtpMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `<body style="font-family: Arial, sans-serif; line-height: 1.3; margin: 10px; padding: 14px; background-color: #f4f4f4; text-align: left; display: flex; justify-content: center; align-items: center; height: fit-content;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 15px; border-radius: 6px; box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333; font-size: 20px; margin-bottom: 10px;">Verify Your Email – Complete Your Registration</h2>
        <h3 style="color: #333; font-size: 16px; margin-bottom: 5px;">Dear</h3>
        <p style="color: #555; font-size: 13px; margin-bottom: 5px;">
            Thank you for signing up with <b>subscription module </b>! To complete your registration, please verify your email address using the OTP below:
        </p>
        <h2 style="padding: 8px; display: inline-block; border-radius: 4px; font-size: 18px; margin-bottom: 8px;">
            Your OTP: <b> ${data.otp} </b>
        </h2>
        <p style="color: #555; font-size: 13px; margin-bottom: 5px;">
            This OTP is valid for <b>5 minutes</b>. Please enter this code on the verification page to activate your account.
        </p>
        <p style="color: #555; font-size: 13px; margin-bottom: 5px;">
            If you did not request this, please ignore this email or contact our support team at 
            <a href="mailto:nehayadav.com" style="color: #007bff; text-decoration: none;">nehayadav.com</a>.
        </p>
        <h4 style="color: #333; font-size: 14px; margin-bottom: 3px;">Best Regards,</h4>
        <h4 style="color: #d9534f; font-size: 14px; margin-bottom: 8px;">Study material</h4>
        <p style="margin-bottom: 5px;">
            <a href="https://subscription-module.com/" style="color: #007bff; text-decoration: none; font-size: 14px;">
                www.subscription-module.com
            </a>
        </p>
        <p style="color: #333; font-size: 14px; font-weight: bold; margin-bottom: 3px;">📞 951288145901</p> 
      </div>
    </body>`;

  await transport.sendMail({
    from: process.env.GMAIL,
    to: email,
    subject,
    html,
  });
};

export default sendRegisterAndResendOtpMail;
export const sendForgotMail = async (subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `<body style="font-family: Arial, sans-serif; line-height: 1.4; margin: 10px; padding: 14px; background-color: #f4f4f4; text-align: left; display: flex; justify-content: center; align-items: center; height: fit-content;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 15px; border-radius: 6px; box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);">        
        <h1 style="color: red; font-size: 20px; margin-bottom: 10px;">Reset Your Password</h1>
        <h3 style="color: #333; font-size: 16px; margin-bottom: 5px;">Dear ${data?.name}</h3>
        <p style="color: #555; font-size: 13px; margin-bottom: 5px;">
            We received a request to reset your password for your account at Study material application.
        </p>
        <p style="color: #555; font-size: 13px; margin-bottom: 5px;">
            If you did not request this, please ignore this email. Otherwise, you can reset your password by clicking the button below:
        </p>
        <a href="${process.env.FRONTEND}/resetpage?token=${data.token}" style="font-size: 14px;">
            Reset Password
        </a>
        <p style="color: #555; font-size: 12px; margin-top: 5px;">
            This link is valid for <b>[X] minutes</b>. If you need further assistance, contact our support team.
        </p>
        <h4 style="color: #333; font-size: 14px; margin-bottom: 3px;">Best Regards,</h4>
        <h4 style="color: #333; font-size: 14px; margin-bottom: 8px;">Robovation</h4>
        <p style="margin-bottom: 5px;">
            <a href="https://www.yahoowecanwork2.com/" style="color: #333; text-decoration: none; font-size: 14px;">
                www.yahoowecanwork2.com
            </a>
        </p>
        <p style="color: #333; font-size: 14px; font-weight: bold; margin-bottom: 3px;">📞 9512904252</p> 
    </div>
</body>
`;

  await transport.sendMail({
    from: process.env.GMAIL,
    to: data.email,
    subject,
    html,
  });
};

// send otp on login and resend otp while login
export const loginAndresendOtpEmail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `<body style="font-family: Arial, sans-serif; line-height: 1.3; margin: 10px; padding: 14px; background-color: #f4f4f4; text-align: left; display: flex; justify-content: center; align-items: center; height: fit-content;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 15px; border-radius: 6px; box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);">     
        <h1 style="font-size: 20px; margin-bottom: 10px;">Resend OTP – Verify Your Email</h1>
        <h3 style="color: #333; font-size: 15px; margin-bottom: 5px;">Dear ${data.name}</h3>
        <p style="color: #555; font-size: 15px; margin-bottom: 5px;">
           One-Time Password (OTP) for email verification.
        </p>
        <h2 style="padding: 8px; display: inline-block; border-radius: 4px; font-size: 18px; margin-bottom: 8px;">
            Your Login OTP: <b> ${data.otp} </b>
        </h2>
        <p style="color: #555; font-size: 15px; margin-bottom: 5px;">
            This OTP is valid for <b>5 minutes</b>. Please enter this code on the verification page to complete your registration.
        </p>
        <p style="color: #555; font-size: 16px; margin-bottom: 5px;">
            If you did not request this, please ignore this email or contact our support team at 
            <a href="mailto:support@ny663922.com" style="color: #007bff; text-decoration: none;">ny663922@gmail.com</a>.
        </p>
        <h4 style="color: #333; font-size: 16px; margin-bottom: 3px;">Best Regards,</h4>
        <h4 style="color: #333; font-size: 16px; margin-bottom: 8px;">Lee Home Packers and Movers</h4>
        <p style="margin-bottom: 5px;">
            <a href="https://www.yahoowecanwork2.com/" style="color: #333; text-decoration: none; font-size: 16px;">
                www.yahoowecanwork2.com
            </a>
        </p>
        <p style="color: #333; font-size: 16px; font-weight: bold; margin-bottom: 3px;">📞 9310553121</p>
    </div>
</body>`;

  await transport.sendMail({
    from: process.env.GMAIL,
    to: email,
    subject,
    html,
  });
};
