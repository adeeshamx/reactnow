// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';

export async function POST(request: NextRequest) {
  // Get webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing WEBHOOK_SECRET environment variable');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Get headers for verification
  const svix_id = request.headers.get('svix-id');
  const svix_timestamp = request.headers.get('svix-timestamp');
  const svix_signature = request.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const body = await request.text();

  try {
    // Verify the webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    const payload = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;

    // Process the webhook
    console.log('Verified webhook:', payload);

    const { type, data } = payload;

    switch (type) {
      case 'user.created':
        console.log('User created:', data);
        // Your logic here
        break;

      case 'user.updated':
        console.log('User updated:', data);
        // Your logic here
        break;

      case 'user.deleted':
        console.log('User deleted:', data);
        // Your logic here
        break;

      default:
        console.log('Unhandled webhook type:', type);
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Webhook endpoint active' },
    { status: 200 }
  );
}