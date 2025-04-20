# 🎧 AudioHub – Audio Feedback Platform

AudioHub is a full-stack audio sharing platform that allows users to upload audio files, play them through a clean UI, and collect feedback from listeners. Once a user finishes listening to an audio clip, they are prompted to provide feedback, which is automatically sent to the original uploader via email using EmailJS.

---

## 🚀 Features

- 🔒 Firebase Authentication & Firestore integration
- 🎵 Audio player with real-time streaming
- 📝 Feedback system after audio playback ends
- 📧 Email notifications to audio owners using EmailJS
- 🎨 Clean and responsive UI with Tailwind CSS
- 🌐 Routing with Next.js App Router

---

## 🛠️ Technologies Used

- **Next.js (App Router)**
- **Firebase (Firestore)**
- **EmailJS**
- **TypeScript**
- **Tailwind CSS**

---

## 📂 Project Structure

```
📦 AudioHub
 ┣ 📁 app
 ┃ ┣ 📁 dashboard              → User dashboard interface
 ┃ ┣ 📁 AudioPlayerAndFeedback → Audio player + feedback form
 ┃ ┣ 📁 handleSubmitFeedback   → EmailJS logic to send feedback
 ┃ ┗ 📄 layout.tsx             → Shared layout for all pages
 ┃   globals.css              → Global Tailwind styles
 ┣ 📄 firebaseConfig.ts        → Firebase setup and export
 ┣ 📄 tailwind.config.ts       → Tailwind CSS configuration
 ┣ 📄 README.md                → Project overview and setup guide
```

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/AudioHub.git
cd AudioHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a `firebaseConfig.ts` file with your Firebase credentials:

```ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

### 4. Set up EmailJS

Create an account on [EmailJS](https://www.emailjs.com/) and configure:

- **Service ID**
- **Template ID**
- **Public API Key**

Your email template must accept these fields:

```txt
to_email
to_name
audio_title
feedback_message
```

Update your `handleSubmitFeedback/page.tsx`:

```ts
emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  {
    to_email: ownerData.email,
    to_name: ownerData.displayName || "Audio Owner",
    feedback_message: feedback,
    audio_title: audio.title,
  },
  'YOUR_PUBLIC_KEY'
);
```

---

## ✅ Usage

1. User plays audio
2. After completion, a feedback form appears
3. On submit, feedback is stored in Firestore and emailed to the audio owner
4. User is redirected to their dashboard

---


## 🤝 Contributing

Feel free to open issues or pull requests. Suggestions, improvements, or feature ideas are always welcome!

---

## 📃 License

This project is licensed under the MIT License.  
© 2025 Muthres Gurjar

---
