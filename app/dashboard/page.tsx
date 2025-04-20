'use client';

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

interface Audio {
  id: string;
  title: string;
  description: string;
  audioURL: string;
}

export default function Dashboard() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "audios"));
        const audioList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Audio[];
        setAudios(audioList);
      } catch (error) {
        console.error("Error fetching audios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handlePlay = (audioId: string) => {
    router.push(`/AudioPlayerAndFeedback/${audioId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <h1
          className="text-2xl font-bold text-indigo-700 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          🎵 AudioHub
        </h1>

        <nav className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => router.push("/profile")}
            className="text-indigo-600 hover:bg-indigo-100 font-medium px-4 py-2 rounded transition"
          >
            Profile
          </button>

          <button
            onClick={() => router.push("/upload")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            Upload Audio
          </button>

          <button
            onClick={handleLogout}
            className="text-red-500 hover:bg-red-100 font-medium px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Available Audios
        </h2>

        {audios.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audios.map((audio) => (
              <li
                key={audio.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-indigo-700">
                  {audio.title}
                </h3>
                <p className="text-gray-600 mt-2">{audio.description}</p>
                <button
                  onClick={() => handlePlay(audio.id)}
                  className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Listen & Feedback
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-10 text-center">
            No audios have been uploaded yet.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center py-4 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} AudioHub — Built with ❤️ by Muthres
      </footer>
    </div>
  );
}
