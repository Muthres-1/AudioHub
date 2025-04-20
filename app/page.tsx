'use client';


import { loginWithGoogle } from '../firebase/login';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();


  const handleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      router.push('/profile');
    }
  };


  return (
    <main className="min-h-screen flex items-center justify-center">
      <div
        onClick={handleLogin}
        className="cursor-pointer w-80 p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300"
      >
        <h2 className="text-xl font-bold mb-2">Login with Google</h2>
        <p className="text-gray-600">Click this card to login</p>
      </div>
    </main>
  );
}
