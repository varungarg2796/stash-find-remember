import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/services/api/userApi';
import { Loader2 } from 'lucide-react';
import { User } from '@/types';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const processAuth = async () => {
      try {
        const hash = window.location.hash.substring(1); // Get fragment part of URL
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (!accessToken || !refreshToken) {
          throw new Error('Authentication tokens not found in URL.');
        }

        // Store tokens immediately
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Fetch user profile with the new access token
        // Note: The apiClient will now automatically use the stored token
        const userProfile = await userApi.getCurrentUser() as User;
        
        // Update the auth context with the fetched user data
        login(userProfile);
        
        // Redirect to the main stash page
        navigate('/my-stash', { replace: true });

      } catch (error) {
        console.error('Authentication callback failed:', error);
        // On failure, clear any partial tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/', { replace: true });
      }
    };

    processAuth();
  }, [navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Authenticating, please wait...</p>
    </div>
  );
};

export default AuthCallback;