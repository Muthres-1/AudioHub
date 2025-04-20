'use client';
import { useState } from "react";
import { auth, db } from "../../firebase/index";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function UploadAudio() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioURL) return setError("Please provide a valid audio URL.");
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      // Store metadata and URL in Firestore
      const docRef = await addDoc(collection(db, "audios"), {
        title,
        description: desc,
        audioURL,
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
      });

      router.push(`/audio/${docRef.id}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleUpload} className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-12">
      <h2 className="text-2xl mb-4">Upload Audio</h2>
      <input 
        type="text" 
        placeholder="Title" 
        className="mb-2 p-2 w-full border" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
      />
      <textarea 
        placeholder="Description" 
        className="mb-2 p-2 w-full border" 
        value={desc} 
        onChange={e => setDesc(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Audio URL" 
        className="mb-2 p-2 w-full border" 
        value={audioURL} 
        onChange={e => setAudioURL(e.target.value)} 
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Upload</button>
    </form>
  );
}
