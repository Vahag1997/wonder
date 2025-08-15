'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/login');
    }
  }, [user, initialized, router]);

  // If not authenticated, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // If authenticated, render the protected content
  return children;
}
