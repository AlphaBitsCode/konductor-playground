"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase, { RecordModel } from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export interface User {
  id: string;
  email: string;
  name?: string;
  verified: boolean;
  avatar?: string;
  created: string;
  updated: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        // Check for our custom auth cookie
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';');
          const authCookie = cookies.find(cookie => cookie.trim().startsWith('pb_auth='));
          
          if (authCookie) {
            const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
            if (authData.token && authData.model) {
              setUser({
                id: authData.model.id,
                email: authData.model.email,
                name: authData.model.username,
                verified: authData.model.verified || true,
                avatar: authData.model.avatar,
                created: authData.model.created || new Date().toISOString(),
                updated: authData.model.updated || new Date().toISOString(),
              });
              return;
            }
          }
        }

        // Fallback to PocketBase auth store
        if (pb.authStore.isValid && pb.authStore.model) {
          const model = pb.authStore.model as RecordModel;
          setUser({
            id: model.id,
            email: model.email,
            name: model.name || model.username,
            verified: model.verified,
            avatar: model.avatar,
            created: model.created,
            updated: model.updated,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange(() => {
      checkAuth();
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    pb.authStore.clear();
    setUser(null);
    router.push('/login');
  };

  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const requireVerification = () => {
    if (!loading && user && !user.verified) {
      router.push('/verify-email');
      return false;
    }
    return true;
  };

  return {
    user,
    loading,
    logout,
    requireAuth,
    requireVerification,
    isAuthenticated: !!user,
    isVerified: user?.verified || false,
  };
}

// Server-side auth check utility
export async function getServerAuth() {
  try {
    // This would be used in server components
    // Implementation depends on how you store auth on server
    return null;
  } catch (error) {
    return null;
  }
}

// Auth status checker for client components
export function checkAuthStatus() {
  try {
    // Check for our custom auth cookie first
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('pb_auth='));
      
      if (authCookie) {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        if (authData.token && authData.model) {
          return {
            isAuthenticated: true,
            isVerified: authData.model.verified || true,
            user: {
              id: authData.model.id,
              email: authData.model.email,
              name: authData.model.username,
              verified: authData.model.verified || true,
              avatar: authData.model.avatar,
              created: authData.model.created || new Date().toISOString(),
              updated: authData.model.updated || new Date().toISOString(),
            } as User
          };
        }
      }
    }

    // Fallback to PocketBase auth store
    if (pb.authStore.isValid && pb.authStore.model) {
      const model = pb.authStore.model as RecordModel;
      return {
        isAuthenticated: true,
        isVerified: model.verified || false,
        user: {
          id: model.id,
          email: model.email,
          name: model.name || model.username,
          verified: model.verified,
          avatar: model.avatar,
          created: model.created,
          updated: model.updated,
        } as User
      };
    }
    return { isAuthenticated: false, isVerified: false, user: null };
  } catch (error) {
    return { isAuthenticated: false, isVerified: false, user: null };
  }
}