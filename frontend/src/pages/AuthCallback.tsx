import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the session to verify the user is authenticated
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
        return;
      }
      
      if (data?.session) {
        // Successful authentication, redirect to dashboard
        navigate('/dashboard');
      } else {
        // No session found, redirect to login
        navigate('/login');
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="auth-callback">
      <p>Completing authentication, please wait...</p>
    </div>
  );
};

export default AuthCallback;