import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { MongoClient } from "mongodb";

// MongoDB URI from env
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

// Ensure this route is public (no clerkMiddleware auth applied)

export async function POST(req: NextRequest) {
  try {
    // Verify Clerk webhook
    const event = await verifyWebhook(req);
    console.log("Verified Clerk event:", event.type, event.data);

    // Connect to MongoDB
    await client.connect();
    const db = client.db("clerkSync");
    const users = db.collection("users");

    // Example: handle user.created / user.updated
    if (event.type === "user.created" || event.type === "user.updated") {
      const userData = event.data;
      await users.updateOne(
        { clerkId: userData.id },
        { $set: { ...userData, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log("User synced:", userData.id);
    }

    // Handle user deleted
    if (event.type === "user.deleted") {
      await users.deleteOne({ clerkId: event.data.id });
      console.log("User deleted:", event.data.id);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    await client.close();
  }
}
