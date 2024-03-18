import { authOptions } from "@/lib/auth";
import { getSecToken } from "@/lib/getSecToken";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth/next";
export async function POST(Request) {
  const { searchParams } = new URL(Request.url);
  const data = await Request.json();
  const newsid = searchParams.get("newsid");
  const fileName = searchParams.get("filename");
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
    const uuid = uuidv4();
    const imageId = `${newsid}_${uuid}_${fileName}`;
    const imageResponse = await fetch(`${process.env.OBJECT_URL}${imageId}`, {
      headers: new Headers({
        "Content-type": "application/json",
      }),
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (imageResponse.status === 200) {
      const token = await getSecToken();
      const response = await fetch(
        process.env.SEC_DATAURL + "updatenewsimageurl",
        {
          method: "POST",
          headers: new Headers({
            "Content-type": "application/json",
            Authorization: "Bearer " + token,
          }),
          body: JSON.stringify({
            session: session.user.session,
            userid: session.user.userid,
            newsid,
            imagename: imageId,
          }),
        }
      );

      const data = await response.json();
      const message = JSON.parse(data?.message) || [];
      if (data && message.status === "success") {
        return Response.json({ message: message.message }, { status: 200 });
      } else {
        return Response.json(
          { message: "Updating image  failed.." },
          { status: 400 }
        );
      }
    } else {
      return Response.json(
        { status: "error", message: "Image upload Failed" },
        { status: 400 }
      );
    }
  } catch (e) {
    console.log(e);
    return Response.json(
      { status: "error", message: "Error uploading image..." },
      { status: 401 }
    );
  }
}
