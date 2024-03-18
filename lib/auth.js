import CredentialsProvider from "next-auth/providers/credentials";
import { getSecToken } from "./getSecToken";

const authenticate = async (token, username, pwd) => {
  try {
    const response = await fetch(process.env.SEC_DATAURL + "authenticate", {
      method: "POST",
      headers: new Headers({
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      }),
      body: JSON.stringify({ username, pwd, client: "Test" }),
    });

    const data = await response.json();

    return data;
  } catch (e) {
    throw new Error("Error in authentication");
  }
};

const getUserRoles = async (token, userid, session) => {
  const response = await fetch(`${process.env.SEC_DATAURL}listuserroles`, {
    method: "POST",
    headers: new Headers({
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    }),
    body: JSON.stringify({
      session,
      userid,
    }),
  });
  try {
    const result = await response.json();
    return result;
  } catch (e) {
    throw new Error("Error in getting roles...");
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
            const rolesData = await getUserRoles(
              token,
              user.userid,
              user.session
            );

            const messageRoles = JSON.parse(rolesData.message) || {};

            if (
              messageRoles?.status !== "success" ||
              rolesData?.result?.length === 0
            ) {
              throw new Error("No roles exists for the user....");
            }
            user.roles = rolesData?.result;
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
      token.test = 1;
      if (user) {
        token.session = user.session;
        token.mobile = user.mobile;
        token.roles = user.roles;
        token.userid = user.userid;
      }
      return token;
    }, // called whenever session is checked
    session: async ({ session, token }) => {
      if (token) {
        session.session = token.session;
        session.user.mobile = token.mobile;
        session.user.roles = token.roles;
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
