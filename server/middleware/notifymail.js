import { createTransport } from "nodemailer";

//send verify successfully and send user id on email  for admin user and for student user both
export const sendVerifyUser = async (email, subject) => {
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
        <h1 style="color: green; font-size: 20px; margin-bottom: 10px;">Email verification complete </h1>
       </div>
</body>
`;
  await transport.sendMail({
    from: process.env.GMAIL,
    to: email,
    subject,
    html,
  });
};
export const sendLoginMailtoUser = async (subject, data) => {
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
        <h1 style="color: red; font-size: 20px; margin-bottom: 10px;">Login email </h1>
        <h3 style="color: #333; font-size: 16px; margin-bottom: 5px;">Dear ${data?.name}</h3>
        <h3 style="color: #333; font-size: 16px; margin-bottom: 5px;">Dear ${data?.message}</h3>
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
export const sendMailtoUser = async (email, subject, name, message) => {
  // console.log(email,subject,name,message)
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `<h3>Hello ${name} </h3>
                <p> ${message} </p>`;

  await transport.sendMail({
    from: process.env.GMAIL,
    to: email,
    subject,
    html,
  });
};
export const sendMailtoAdmin = async (subject, name, message) => {
  // console.log(email,subject,name,message)
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `<h3>Hello ${name} </h3>
                <p> ${message} </p>`;

  await transport.sendMail({
    from: process.env.GMAIL,
    to: "ny663922@gmail.com",
    subject,
    html,
  });
};
