'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/index';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        createdAt: serverTimestamp(),
        emailVerified: false,
      });

      router.push('/verify-email');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>

      {/* Link to Login */}
      <p className="mt-4 text-sm text-gray-700">
        Already have an account?{' '}
        <button
          onClick={goToLogin}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Login
        </button>
      </p>
    </div>
  );
}
