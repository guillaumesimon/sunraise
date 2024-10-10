'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient'; // Assuming supabaseClient is set up
import { format, differenceInMinutes } from 'date-fns'; // For date formatting and duration calculation

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
          .select('access_token, refresh_token, expires_in')
          .eq('user_id', user.id)
          .single();

        if (tokens && !tokenError) {
          let { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = tokens;

          const tokenExpired = checkIfTokenExpired(expiresIn);

          if (tokenExpired && refreshToken) {
            const newTokenData = await refreshAccessToken(refreshToken);
            accessToken = newTokenData.access_token;

            await supabase
              .from('user_tokens')
              .update({
                access_token: newTokenData.access_token,
                expires_in: newTokenData.expires_in,
              })
              .eq('user_id', user.id);
          }

          // Get current date-time for fetching future events only
          const timeMin = new Date().toISOString();

          // Fetch future events from Google Calendar API
          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&orderBy=startTime&singleEvents=true`,
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

  const checkIfTokenExpired = (expiresIn) => {
    const expirationTime = new Date().getTime() / 1000 + expiresIn;
    return expirationTime < new Date().getTime() / 1000;
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return differenceInMinutes(endDate, startDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Your Upcoming Google Calendar Events
        </h1>

        {events.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {events.map((event) => (
              <li key={event.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {event.summary || 'No Title'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {event.start?.dateTime
                        ? format(new Date(event.start.dateTime), 'MMMM d, yyyy h:mm aa')
                        : 'All day'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {event.start?.dateTime && event.end?.dateTime
                        ? `${calculateDuration(event.start.dateTime, event.end.dateTime)} minutes`
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {event.status || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Organizer */}
                {event.organizer && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Organizer: {event.organizer.displayName || event.organizer.email}
                    </p>
                  </div>
                )}

                {/* Conference data */}
                {event.conferenceData && event.conferenceData.entryPoints && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Conference Link:</p>
                    {event.conferenceData.entryPoints.map((entryPoint, idx) => (
                      <a
                        key={idx}
                        href={entryPoint.uri}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        {entryPoint.label || entryPoint.uri}
                      </a>
                    ))}
                  </div>
                )}

                {/* Location */}
                {event.location && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Location:</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                )}

                {/* Event description */}
                {event.description && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Description:</p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                )}

                {/* Display list of participants */}
                {event.attendees && event.attendees.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold text-gray-600">Participants:</h3>
                    <ul className="list-disc ml-6">
                      {event.attendees.map((attendee) => (
                        <li key={attendee.email} className="text-sm text-gray-500">
                          {attendee.displayName || attendee.email} - {attendee.responseStatus}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No upcoming events found</p>
        )}
      </div>
    </div>
  );
};

export default CalendarEvents;
