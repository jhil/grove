import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

/**
 * Auth callback route handler.
 * This handles the OAuth/magic link callback from Supabase.
 * When a user clicks a confirmation link in their email, they are redirected here.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`);
    }

    // If successful, ensure profile exists
    if (data?.user) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      // Create profile if it doesn't exist
      if (!existingProfile) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email || null,
          display_name: data.user.user_metadata?.display_name || data.user.email?.split("@")[0] || "User",
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Continue anyway - the user is authenticated
        }
      }
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  // No code provided - redirect to home with error
  return NextResponse.redirect(`${origin}/?error=auth_callback_no_code`);
}
