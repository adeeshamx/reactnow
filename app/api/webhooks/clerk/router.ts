import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    console.log("Webhook verified successfully:", evt.type);
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }

  const eventType = evt.type;

  try {
    // ====================== USER CREATED ======================
    if (eventType === 'user.created') {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        username: username ?? '',
        firstName: first_name ?? '',
        lastName: last_name ?? '',
        photo: image_url ?? '',
      };

      const newUser = await createUser(user);
      console.log("MongoDB user created:", newUser);

      // Update Clerk public metadata with MongoDB _id
      const client = await clerkClient();
      await client.users.updateUserMetadata(id, {
        publicMetadata: { userId: newUser._id }
      });

      return NextResponse.json({ message: 'User created', user: newUser });
    }

    // ====================== USER UPDATED ======================
    if (eventType === 'user.updated') {
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name ?? '',
        lastName: last_name ?? '',
        username: username ?? '',
        photo: image_url ?? '',
      };

      const updatedUser = await updateUser(id, user);
      console.log("MongoDB user updated:", updatedUser);

      return NextResponse.json({ message: 'User updated', user: updatedUser });
    }

    // ====================== USER DELETED ======================
    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      if (!id) {
        return new Response('Error: Missing user id', { status: 400 });
      }

      const deletedUser = await deleteUser(id);
      console.log("MongoDB user deleted:", deletedUser);

      return NextResponse.json({ message: 'User deleted', user: deletedUser });
    }

    // ====================== OTHER EVENTS ======================
    console.log("Unhandled event type:", eventType);
    return new Response('Event ignored', { status: 200 });

  } catch (err) {
    console.error("Error processing event:", err);
    return new Response('Internal server error', { status: 500 });
  }
}
