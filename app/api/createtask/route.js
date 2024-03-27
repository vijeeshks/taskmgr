import { authOptions } from "@/lib/auth";
import { getSecToken } from "@/lib/getSecToken";
import { getServerSession } from "next-auth/next";
export async function POST(Request) {
  const { title, description } = await Request.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { status: "error", message: "Unauthorized access" },

      {
        status: 401,
      }
    );
  }

  // console.log("after functin....");

  try {
    const token = await getSecToken();
    const response = await fetch(process.env.SEC_DATAURL + "createtask", {
      method: "POST",
      headers: new Headers({
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      }),
      body: JSON.stringify({
        session: session.user.session,
        userid: session.user.userid,
        title,
        description,
      }),
    });

    const data = await response.json();

    const message = JSON.parse(data?.message) || [];
    if (message.status === "success") {
      return Response.json({ data: data.taskid, message }, { status: 200 });
    } else {
      return Response.json({ message, data }, { status: 400 });
    }
  } catch (e) {
    console.log(e);
    return Response.json(
      { status: "error", message: "Error creating task" },
      { status: 401 }
    );
  }
}
