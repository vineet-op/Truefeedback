import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(AuthOptions);
    const _user = session?.user;

    console.log("User in session:", _user);
    console.log("Full session:", session);

    if (!session) {
        return new Response(
            JSON.stringify({ message: "Not Authenticated" }),
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },  // Match the correct field for the user id
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: "$_id", messages: { $push: '$messages' } } },
        ]);

        if (!user || user.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Cannot Find User to Get Messages",
                }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                messages: user[0].messages,
            }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to Get Messages",
            }),
            { status: 500 }
        );
    }
}
