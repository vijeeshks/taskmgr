import { authOptions } from "@/lib/auth";
import { getSecToken } from "@/lib/getSecToken";
import { getServerSession } from "next-auth/next";
export async function GET(Request) {
  const { searchParams } = new URL(Request.url);
  const id = searchParams.get("id");
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

  // console.log(session);
  try {
    const token = await getSecToken();
    const response = await fetch(process.env.SEC_DATAURL + "listnewsedit", {
      method: "POST",
      headers: new Headers({
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      }),
      body: JSON.stringify({
        session: session.user.session,
        userid: session.user.userid,
      }),
    });

    const data = await response.json();
    const message = JSON.parse(data?.message) || [];
    if (data && data?.result && message.status === "success") {
      return Response.json(
        { data: data.result, message: message.message },
        { status: 200 }
      );
    }
  } catch (e) {
    console.log(e);
    return Response.json(
      { status: "error", message: "Error fetching  news" },
      { status: 401 }
    );
  }
}
