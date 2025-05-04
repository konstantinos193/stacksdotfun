import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PUT(request: Request) {
  try {
    const { address, username, avatar_url } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Missing Stacks address' },
        { status: 400 }
      );
    }

    // Check username uniqueness if updating username
    if (username) {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('stacks_address')
        .eq('username', username)
        .single();

      if (existingUser && existingUser.stacks_address !== address) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...(username && { username }),
        ...(avatar_url && { avatar_url }),
        updated_at: new Date().toISOString()
      })
      .eq('stacks_address', address)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
} 