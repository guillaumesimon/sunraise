'use client';

import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if there is an active session
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData?.session || null);

      if (sessionData?.session) {
        // If session exists, redirect the user
        router.push('/dashboard');
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.push('/dashboard');
      }
    });

    return () => {
      // Unsubscribe when component unmounts
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {!session ? (
        <Auth
          supabaseClient={supabase}
          providers={['google']} // You can add more providers if needed
          appearance={{ theme: ThemeSupa }}
          theme="dark" // Optional, choose between 'dark' or 'light'
          redirectTo="http://localhost:3000/dashboard" // Optional, add your redirect URL after login
        />
      ) : (
        <p>Redirecting to dashboard...</p>
      )}
    </div>
  );
};

export default Login;
