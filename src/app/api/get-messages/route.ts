import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: "$_id", messages: { $push: '$messages' } } }
        ])

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Cannot Find User to Get Messages",
                },
                {
                    status: 400,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: user[0].messages,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        return Response.json(
            {
                message: "Failed to Get Messages",
            },
            {
                status: 500,
            }
        );
    }
}

