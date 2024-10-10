'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to login if no user is found
        router.push('/login');
      } else {
        // Set the user in state if logged in
        setUser(user);
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user.email}!</h1>
        <p className="text-gray-600 mb-6">You're successfully logged in!</p>
        
        <div className="text-center">
          <a
            href="/calendar/connect"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Link your Google Calendar
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
