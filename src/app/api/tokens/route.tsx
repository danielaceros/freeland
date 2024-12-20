// src/app/api/pay/route.tsx

import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

// Handle POST requests to create the Stripe Checkout session
export async function POST(req: Request) {
  try {
    const { amount, productName } = await req.json();
    const tokensToAdd = amount * 10;
    // Determine the success and cancel URLs based on the environment
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_URL
      : process.env.NEXT_PUBLIC_URL_DEV;

    if (!baseUrl) {
      throw new Error('Environment URL not set');
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName, // Dynamic product name
            },
            unit_amount: amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/successtokens?tokens=${tokensToAdd}`,
      cancel_url: `${baseUrl}/failed`, // Assuming a cancel route
    });

    // Respond with the session URL
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
