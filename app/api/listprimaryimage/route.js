import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
export async function POST(Request) {
  const { imagename } = await Request.json();
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
    const response = await fetch(process.env.OBJECT_URL + imagename, {
      method: "GET",
    });

    const data = await response.json();
    if (data && response.status === 200) {
      return Response.json({ data: data }, { status: 200 });
    } else {
      return Response.json(
        { data: [], message: "Error fetching primary image" },
        { status: 400 }
      );
    }
  } catch (e) {
    console.log(e);
    return Response.json(
      { status: "error", message: "Error fetching primary image" },
      { status: 401 }
    );
  }
}
