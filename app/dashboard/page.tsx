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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>You're successfully logged in!</p>
      <p>link your <a href="/calendar/connect">calendar</a></p>
    </div>
  );
};

export default Dashboard;
