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
      clientSecret: process.env.GITHUB_SECRET || ""
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { password: "Password", type: "text" },
      },


      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              {
                email: credentials.email,
              },
              {
                username: credentials.identifier,
              },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("User is not verified please verify email");
          }

          //*Check password now

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Password is Incorrect");
          }
        } catch (error: any) {
          throw new Error("Error While Signing In", error);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("Token", token);

      if (token) {
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }

      console.log("Session object", session);
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",

  },
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

};
