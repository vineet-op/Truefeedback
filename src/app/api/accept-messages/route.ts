import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(AuthOptions);
    const user: User = session?.user as User;

    if (!session || !session?.user) {
        return Response.json(
            {
                message: "Not Authenticated",
            },
            {
                status: 401,
            }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const UpdatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessages,
            },
            {
                new: true,
            }
        );

        if (!UpdatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Unable to find User",
                },
                {
                    status: 401,
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Messages Status Changed Successfully",
                UpdatedUser,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages" + error,
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(AuthOptions);
    const user: User = session?.user as User;

    if (!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            {
                status: 401,
            }
        );
    }

    const userId = user._id;

    try {

        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User Not found",
                },
                {
                    status: 404,
                }
            );
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage
            },
            {
                status: 200,
            }
        );


    } catch (error) {
        return Response.json(
            {
                message: "Something Went Wrong in Accepting Messages " + error,
            },
            {
                status: 500,
            }
        );
    }
}
