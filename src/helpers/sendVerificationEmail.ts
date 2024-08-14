import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "vineet290403@gmail.com",
      to: email,
      subject: "True Feedback Verification Code",
      react: verificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Successfully  send verification email" };
  } catch (Emailerror) {
    console.log("Error sending verification email", Emailerror);
    return { success: false, message: "Failed to send verification email" };
  }
}
