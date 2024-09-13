import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import GitHubProvider from "next-auth/providers/github";

export const AuthOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Username or Email", type: "text", placeholder: "Enter email ..." },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          // Ensure credentials match field used in the form
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },  // Correct field here
              { username: credentials.email },  // You can log in with either username or email
            ],
          });

          if (!user) {
            throw new Error("No user found with this email or username");
          }

          if (!user.isVerified) {
            throw new Error("User is not verified, please verify your email");
          }

          // Check password
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            throw new Error("Password is incorrect");
          }

          // Return only the necessary fields
          return {
            //@ts-ignore
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            isAcceptingMessage: user.isAcceptingMessage,
          };

        } catch (error: any) {
          throw new Error("Error while signing in: " + error.message);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user fields to the token
        token._id = user._id;
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },

    async session({ session, token }) {
      // Add token data to the session's user object
      if (token) {
        session.user = {
          _id: token._id,
          email: token.email,
          username: token.username,
          isVerified: token.isVerified,
          isAcceptingMessage: token.isAcceptingMessage,
        };
      }

      console.log("Session object:", session);
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",  // Use JWT-based sessions
  },

  secret: process.env.NEXTAUTH_SECRET,
};
