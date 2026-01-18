// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB setup
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export const runtime = "edge"; // or "nodejs" if you prefer

export async function POST(req: NextRequest) {
  try {
    // Parse incoming JSON
    const body = await req.json();

    console.log("Webhook received:", JSON.stringify(body, null, 2));

    // Example: Clerk webhook verification (optional, if using secret)
    const clerkSignature = req.headers.get("x-clerk-signature");
    const clerkSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (clerkSecret && clerkSignature !== clerkSecret) {
      console.warn("Invalid Clerk signature");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db("webhooksDB");
    const collection = db.collection("clerkEvents");

    // Save webhook data
    await collection.insertOne({
      event: body,
      receivedAt: new Date(),
    });

    console.log("Webhook saved to MongoDB ✅");

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
