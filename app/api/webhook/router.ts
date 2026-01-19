// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

// CRITICAL: This config is needed for Vercel to handle webhooks properly
export const runtime = 'edge'; // or 'nodejs'
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Webhook POST received');
    
    // Get raw body as text first
    const body = await request.text();
    console.log('Body:', body);

    // Parse JSON
    const payload = JSON.parse(body);
    console.log('Payload:', payload);

    // Get headers
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');

    console.log('Headers:', { svixId, svixTimestamp, svixSignature });

    // Process webhook
    console.log('Processing webhook type:', payload.type);

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        received: true,
        message: 'Webhook processed' 
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

  } catch (error: any) {
    console.error('Webhook error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error?.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET for testing
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Webhook endpoint is working',
      methods: ['POST'],
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}