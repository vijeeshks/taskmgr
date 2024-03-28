import { authOptions } from "@/lib/auth";
import { getSecToken } from "@/lib/getSecToken";
import { getServerSession } from "next-auth/next";
export async function POST(Request) {
  const { statusid, taskid } = await Request.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { status: "error", message: "Unauthorized access" },

      {
        status: 401,
      }
    );
  }

  try {
    const token = await getSecToken();
    const response = await fetch(process.env.SEC_DATAURL + "changestatus", {
      method: "POST",
      headers: new Headers({
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      }),
      body: JSON.stringify({
        session: session.user.session,
        userid: session.user.userid,
        statusid,
        taskid,
      }),
    });

    const data = await response.json();

    const message = JSON.parse(data?.message) || [];
    if (message.status === "success") {
      return Response.json({ message }, { status: 200 });
    } else {
      return Response.json({ message, data }, { status: 400 });
    }
  } catch (e) {
    console.log(e);
    return Response.json(
      { status: "error", message: "Error fetching tasks" },
      { status: 401 }
    );
  }
}
