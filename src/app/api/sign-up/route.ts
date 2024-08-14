import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifyByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifyByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is Already Taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const HashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = HashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    }

    //* First time user
    else {
      const HashedPassword = await bcrypt.hash(password, 10);
      const ExpiryDate = new Date();
      ExpiryDate.setHours(ExpiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: HashedPassword,
        verifyCode,
        verifyCodeExpiry: ExpiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    //Send email for verification
    const EmailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!EmailResponse.success) {
      return Response.json(
        {
          success: false,
          message: EmailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering new user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
