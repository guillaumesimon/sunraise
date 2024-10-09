'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';

const CalendarCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const expiresIn = params.get('expires_in');
      const tokenType = params.get('token_type');

      if (accessToken) {
        // Use getSession to get user session information
        const storeTokensInSupabase = async () => {
          const { data: session, error: sessionError } = await supabase.auth.getSession();

          if (session && session.user && !sessionError) {
            const user = session.user;
            const { error: insertError } = await supabase
              .from('user_tokens')
              .upsert({
                user_id: user.id,
                access_token: accessToken,
                expires_in: parseInt(expiresIn!),
                token_type: tokenType,
              });

            if (!insertError) {
              // Redirect to calendar events or another secure page
              router.push('/calendar/events');
            } else {
              console.error('Error storing tokens:', insertError.message);
            }
          } else {
            console.error('Error getting session or user:', sessionError?.message || 'No user session found.');
          }
        };

        storeTokensInSupabase();
      } else {
        console.error('Access token is missing from the URL parameters.');
      }
    }
  }, [router]);

  return <div>Connecting to Google Calendar...</div>;
};

export default CalendarCallback;
