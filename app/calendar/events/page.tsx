'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient'; // Assuming supabaseClient is set up

const CalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      // Get current user from Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (user && !userError) {
        // Fetch tokens from Supabase
        const { data: tokens, error: tokenError } = await supabase
          .from('user_tokens')
          .select('access_token')
          .eq('user_id', user.id)
          .single();

        if (tokens && !tokenError) {
          const accessToken = tokens.access_token;

          // Fetch events from Google Calendar API
          const response = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          setEvents(data.items || []);
        } else {
          console.error('Error fetching tokens:', tokenError?.message);
        }
      } else {
        console.error('Error fetching user:', userError?.message);
      }

      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Google Calendar Events</h1>
      <ul>
        {events.length > 0
          ? events.map((event) => (
              <li key={event.id}>
                {event.summary} - {event.start?.dateTime}
              </li>
            ))
          : 'No events found'}
      </ul>
    </div>
  );
};

export default CalendarEvents;
