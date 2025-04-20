'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/index'; // Make sure this matches your actual path
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        router.replace('/profile'); // Redirect to profile if logged in and verified
      } else {
        router.replace('/register'); // Otherwise, redirect to login
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
