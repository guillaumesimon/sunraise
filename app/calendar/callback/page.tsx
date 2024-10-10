'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient'; 

const CalendarCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const getTokensFromAuthorizationCode = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const authorizationCode = searchParams.get('code'); // Extract the authorization code from the URL

      if (authorizationCode) {
        try {
          // Exchange the authorization code for access and refresh tokens
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              code: authorizationCode,
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
              client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!, // Ensure the secret is securely stored in environment variables
              redirect_uri: `${window.location.origin}/calendar/callback`, // Redirect URI must match what you set in Google Cloud
              grant_type: 'authorization_code',
            }),
          });

          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;
          const refreshToken = tokenData.refresh_token || null; // Not always available
          const expiresIn = tokenData.expires_in;
          const tokenType = tokenData.token_type;

          if (accessToken) {
            // Get current user from Supabase
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (user && !userError) {
              // Store tokens in Supabase database
              const { error: insertError } = await supabase
                .from('user_tokens')
                .upsert({
                    user_id: user.id,
                    access_token: accessToken,
                    refresh_token: refreshToken, // Save refresh token if available
                    expires_in: expiresIn,
                    token_type: tokenType,
                }, {
                    onConflict: ['user_id'] // This tells Supabase to update on conflict of user_id
                });
              if (!insertError) {
                // Redirect to the calendar events page or another secure page
                router.push('/calendar/events');
              } else {
                console.error('Error storing tokens:', insertError.message);
              }
            } else {
              console.error('Error getting user:', userError?.message || 'No user session found.');
              router.push('/login'); // Redirect to login if the user is not authenticated
            }
          } else {
            console.error('Access token is missing from response');
          }
        } catch (error) {
          console.error('Error exchanging authorization code for tokens:', error);
        }
      } else {
        console.error('Authorization code not found in URL');
        router.push('/login'); // Redirect to login if no authorization code is found
      }
    };

    getTokensFromAuthorizationCode();
  }, [router]);

  return <div>Connecting to Google Calendar...</div>;
};

export default CalendarCallback;
