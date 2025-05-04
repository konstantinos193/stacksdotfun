import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    
    // Debug logs
    console.log('API received:', { address });

    // Validate input
    if (!address) {
      return NextResponse.json(
        { error: 'Missing wallet address' },
        { status: 400 }
      );
    }

    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', address)
      .single();

    console.log('Fetch result:', { existingProfile, fetchError });

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the "not found" error
      throw fetchError;
    }

    if (existingProfile) {
      return NextResponse.json(existingProfile);
    }

    // Create new profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        wallet_address: address,
        username: `stx_${address.slice(0, 8)}`,
        referral_code: Math.random().toString(36).substring(2, 15)
      })
      .select()
      .single();

    console.log('Insert result:', { newProfile, insertError });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(newProfile);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 