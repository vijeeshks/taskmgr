import CredentialsProvider from "next-auth/providers/credentials";
import { getSecToken } from "./getSecToken";

const authenticate = async (token, email, pwd) => {
  try {
    const response = await fetch(process.env.SEC_DATAURL + "loginuser", {
      method: "POST",
      headers: new Headers({
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      }),
      body: JSON.stringify({ email, pwd }),
    });
    const data = await response.json();
    console.log(data);

    return data;
  } catch (e) {
    console.log(e);
    throw new Error("Error in authentication");
  }
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const token = await getSecToken();

          if (!token) {
            throw new Error("Unauthorized....");
          }
          const data = await authenticate(
            token,
            credentials.email,
            credentials.password
          );
          const message = JSON.parse(data.message) || {};
          if (message.status === "success" && data?.result?.length > 0) {
            let user = {};
            const userProfile = data?.result[0];
            user = { ...user, ...userProfile };

            return user;
          } else {
            throw new Error("Login error...");
          }
        } catch (e) {
          throw new Error("Unexpected error......");
        }
      },
    }),
  ],
  callbacks: {
    // called after sucessful signin
    jwt: async ({ token, user }) => {
      if (user) {
        token.session = user.session;
        token.userid = user.userid;
      }
      return token;
    }, // called whenever session is checked
    session: async ({ session, token }) => {
      if (token) {
        session.session = token.session;
        session.user.userid = token.userid;
      }
      return session;
    },
  },
  secret: "SECRET_HERE",
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1d
  },
  jwt: {
    secret: "SECRET_HERE",
    encryption: true,
  },
};
