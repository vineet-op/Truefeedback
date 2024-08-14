import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schema/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: "Invalid query Parameters",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const ExistingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (ExistingVerifiedUser) {
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

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error checking usernameValidation", error);

    return Response.json(
      {
        success: false,
        message: "Error Checking Username",
      },
      {
        status: 500,
      }
    );
  }
}
