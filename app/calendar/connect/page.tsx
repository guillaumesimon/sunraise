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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Connect your Google Calendar</h1>
        <p className="text-gray-600 mb-6">
          To sync your Google Calendar, click the button below to authorize access.
        </p>
        <button
          onClick={connectToGoogleCalendar}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          Connect Google Calendar
        </button>
      </div>
    </div>
  );
};

export default ConnectCalendar;
