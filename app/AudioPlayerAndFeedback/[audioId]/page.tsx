'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';

interface Audio {
  id: string;
  title: string;
  description: string;
  audioURL: string;
  ownerUid?: string;
}

export default function AudioPlayerAndFeedback() {
  const [audio, setAudio] = useState<Audio | null>(null);
  const [isAudioEnded, setIsAudioEnded] = useState(false);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();
  const params = useParams();
  const audioId = params?.audioId as string;

  const db = getFirestore();

  useEffect(() => {
    const fetchAudio = async () => {
      if (!audioId) return;
      const audioDocRef = doc(db, 'audios', audioId);
      const audioDoc = await getDoc(audioDocRef);

      if (audioDoc.exists()) {
        const audioData = audioDoc.data();
        setAudio({
          id: audioId,
          title: audioData.title,
          description: audioData.description,
          audioURL: audioData.audioURL,
          ownerUid: audioData.ownerUid,
        });
      } else {
        router.push('/dashboard');
      }
    };

    fetchAudio();
  }, [audioId, db, router]);

  const handleAudioEnded = () => setIsAudioEnded(true);
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = async () => {
    if (audio && feedback) {
      try {
        const audioDocRef = doc(db, 'audios', audio.id);
        await updateDoc(audioDocRef, { feedback });

        // Get owner's email
        if (!audio.ownerUid) throw new Error("Owner UID missing");

        const ownerRef = doc(db, 'users', audio.ownerUid);
        const ownerSnapshot = await getDoc(ownerRef);
        const ownerData = ownerSnapshot.data();

        if (!ownerData || !ownerData.email) {
          throw new Error("Owner email not found");
        }

        // Send email via EmailJS
        await emailjs.send(
          'service_ebw2l5o',
          'template_b8x8y9p',
          {
            to_email: ownerData.email,
            to_name: ownerData.displayName || "Audio Owner",
            feedback_message: feedback,
            audio_title: audio.title,
          },
        'uR_iTiXbW3NFUSGct' // replace with actual
        );

        alert("Thank you! Your feedback has been sent.");
        router.push('/dashboard');
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert("Something went wrong while submitting feedback.");
      }
    }
  };

  if (!audio) return <div>Loading audio...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <h1
          className="text-2xl font-bold text-indigo-700 cursor-pointer"
          onClick={() => router.push('/dashboard')}
        >
          🎵 AudioHub
        </h1>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">{audio.title}</h2>
        <p className="text-gray-600">{audio.description}</p>

        <div className="my-6">
          <audio controls onEnded={handleAudioEnded} className="w-full" src={audio.audioURL}>
            Your browser does not support the audio element.
          </audio>
        </div>

        {isAudioEnded && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700">Leave Feedback</h3>
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Write your feedback here..."
              className="w-full mt-4 p-4 border border-gray-300 rounded-lg"
              rows={4}
            />
            <button
              onClick={handleSubmitFeedback}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
            >
              Submit Feedback
            </button>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center py-4 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} AudioHub — Built with ❤️ by Muthres
      </footer>
    </div>
  );
}
