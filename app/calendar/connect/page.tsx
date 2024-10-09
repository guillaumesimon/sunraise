'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';

const ConnectCalendar = () => {
  const router = useRouter();

//useEffect(() => {
//     const checkUserSession = async () => {
//       const { data: session } = await supabase.auth.getSession();

//       if (!session || !session.user) {
//         // If no user session, redirect them to login page
//         router.push('/login');
//       }
//     };

//     checkUserSession();
//   }, [router]);

  const connectToGoogleCalendar = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const redirectUri = `${window.location.origin}/calendar/callback`;

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=https://www.googleapis.com/auth/calendar&include_granted_scopes=true&prompt=consent`;

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
