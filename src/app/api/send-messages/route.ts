import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
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

        //is user acccepting the messages

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "Not Accepting Messages",
                },
                {
                    status: 403,
                }
            );
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message Sent Successfully",
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Something Went Wrong in Sending Messages " + error,
            },
            {
                status: 500,
            }
        );
    }
}