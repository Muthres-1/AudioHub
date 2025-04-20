'use client';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/index';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface UserData {
  displayName: string;
  email: string;
  photoURL: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData>({
    displayName: '',
    email: '',
    photoURL: ''
  });

  const [newDisplayName, setNewDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          setUserData(data);
          setNewDisplayName(data.displayName || '');
        }
      } catch (error) {
        toast.error('Error loading profile data');
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleProfileUpdate = async () => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { displayName: newDisplayName });
      setUserData(prev => ({ ...prev, displayName: newDisplayName }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
      <div className="animate-pulse space-y-4">
        <div className="h-24 w-24 rounded-full bg-gray-300 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <img
              src={userData.photoURL || '/default-avatar.png'}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover transition-all duration-300"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {userData.displayName || 'Anonymous User'}
            </h1>
            <p className="text-gray-500 mb-1">{userData.email}</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
              user
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            Dashboard
          </button>
          <button
            onClick={handleProfileUpdate}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            Update Profile
          </button>
          <button
            onClick={async () => {
              await auth.signOut();
              router.push('/');
            }}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            Logout
          </button>
          <button
            onClick={() => router.push('/upload')}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-all border-2 border-black"
          >
            Upload Audio
          </button>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Profile Settings</h2>
          <div className="flex flex-col gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                value={newDisplayName}
                onChange={e => setNewDisplayName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
