import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
const nodemailer = require('nodemailer');

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ status: 400 });
  }

  const { message, recepientEmail } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail', // replace with your email service
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Set up email data
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${recepientEmail}`,
    subject: `TestQuick Beta - New message from ${email}`,
    html: `
    <html>
      <head>
        <style>
          body, html {
            height: 100%;
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
          }
          .background {
            background: linear-gradient(to bottom, #E0FFFF 50%, #000080 100%);
            padding: 20px;
          }
          .email-container {
            background-color: white; 
            border-radius: 10px; 
            margin: 0 auto;
            padding: 20px; 
            width: fit-content; 
            max-width: 600px;
          }
          .header img { border-radius: 10px; padding: 10px; padding-bottom: 0px; }
          .content { padding: 20px; }
          .footer { padding: 10px; text-align: center; font-size: 12px; }
          .question { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
          .question strong { display: block; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="background">
          <div class="email-container">
            <div class="header">
              <img src="https://www.testquick.org/testquick.png" alt="TestQuick Logo" style="width: 300px;"/>
            </div>
            <div class="content">
              ${message}
            </div>
            <div class="footer">
              <p>&copy; TestQuick</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };

  try {
    const emailResponse = await transporter.sendMail(mailOptions);
    return NextResponse.json({ status: "201", message: `Email sent: ${emailResponse}` });
  } catch (error) {
    return NextResponse.json({ status: "500", message: error });
  }

}