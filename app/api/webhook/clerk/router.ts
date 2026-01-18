import { headers } from "next/headers";
import { Webhook } from "svix";
import { connectToDatabase } from "@/lib/mongodb/database";
import User from "@/lib/mongodb/database/models/user.model";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  const payload = await req.text();
  const headerPayload = await headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(payload, svixHeaders);
  } catch (err) {
    return new Response("Webhook verification failed", { status: 400 });
  }

  // Handle user.created
  if (evt.type === "user.created") {
    const user = evt.data;

    await connectToDatabase();

    await User.create({
      clerkId: user.id,
      email: user.email_addresses[0].email_address,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      imageUrl: user.image_url,
    });
  }

  return new Response("OK", { status: 200 });
}
