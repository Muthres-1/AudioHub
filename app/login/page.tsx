'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle } from '../../firebase/login';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/index';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      const user = auth.currentUser;
      if (user?.emailVerified) {
        router.push('/profile');
      } else {
        router.push('/verify-email');
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser?.emailVerified) {
        router.push('/profile');
      } else {
        router.push('/verify-email');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 space-y-6">
      {/* Google Login */}
      <div
        onClick={handleGoogleLogin}
        className="cursor-pointer w-80 p-6 bg-white rounded-xl shadow hover:shadow-xl transition"
      >
        <h2 className="text-xl font-bold mb-2 text-center">Login with Google</h2>
        <p className="text-gray-600 text-center">Click to login via your Google account</p>
      </div>

      {/* Divider */}
      <div className="w-80 text-center text-gray-400">or</div>

      {/* Email/Password Login */}
      <form onSubmit={handleEmailLogin} className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 text-center">Login with Email</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>

      {/* Register redirect */}
      <p className="text-sm text-gray-700">
        Don't have an account?{' '}
        <button
          onClick={goToRegister}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Register
        </button>
      </p>
    </div>
  );
}
