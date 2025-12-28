"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session, SupabaseClient } from "@supabase/supabase-js";

/**
 * User profile info stored in database.
 */
export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { display_name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  // Initialize supabase client on mount (client-side only)
  useEffect(() => {
    try {
      const client = createClient();
      setSupabase(client);
    } catch (error) {
      console.error("Failed to create Supabase client:", error);
      setIsLoading(false);
    }
  }, []);

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string, client: SupabaseClient) => {
    try {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as UserProfile | null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }, []);

  // Initialize auth state when supabase is ready
  // Uses both getSession() and onAuthStateChange for reliability
  useEffect(() => {
    if (!supabase) return;

    let isMounted = true;
    let didSetLoading = false;

    const setLoadingFalse = () => {
      if (!didSetLoading && isMounted) {
        didSetLoading = true;
        setIsLoading(false);
      }
    };

    // Timeout fallback - ensure loading stops after 3 seconds max
    const timeout = setTimeout(() => {
      console.warn("Auth initialization timeout - forcing loading to false");
      setLoadingFalse();
    }, 3000);

    // Get initial session immediately
    const initSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const userProfile = await fetchProfile(currentSession.user.id, supabase);
          if (isMounted) setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoadingFalse();
      }
    };

    initSession();

    // Listen for auth changes (sign in, sign out, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const userProfile = await fetchProfile(newSession.user.id, supabase);
          if (isMounted) setProfile(userProfile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    if (!supabase) throw new Error("Supabase not initialized");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split("@")[0],
        },
      },
    });

    if (error) throw error;

    // Create profile in database
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        display_name: displayName || email.split("@")[0],
      });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
    }
  }, [supabase]);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not initialized");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  }, [supabase]);

  // Sign out
  const signOut = useCallback(async () => {
    if (!supabase) throw new Error("Supabase not initialized");

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, [supabase]);

  // Update profile (uses upsert to create profile if it doesn't exist)
  const updateProfile = useCallback(async (updates: { display_name?: string }) => {
    if (!supabase) throw new Error("Supabase not initialized");
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        ...updates,
      });

    if (error) throw error;

    // Refresh profile
    const newProfile = await fetchProfile(user.id, supabase);
    setProfile(newProfile);
  }, [user, supabase, fetchProfile]);

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
