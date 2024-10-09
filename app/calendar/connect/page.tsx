'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';

const ConnectCalendar = () => {
  const router = useRouter();

  const connectToGoogleCalendar = async () => {
    // Store Supabase session before redirect
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      localStorage.setItem('supabase_session', JSON.stringify(sessionData.session));
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const redirectUri = `${window.location.origin}/calendar/callback`;
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar');
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;


    // Redirect the user to Google for consent
    window.location.href = googleOAuthUrl;
  };

  return (
    <div>
      <button onClick={connectToGoogleCalendar} className="btn">
        Connect Google Calendar
      </button>
    </div>
  );
};

export default ConnectCalendar;
