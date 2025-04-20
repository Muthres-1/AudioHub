// app/layout.tsx
import './globals.css'; // Optional: if you're using Tailwind or global styles
import { ReactNode } from 'react';

export const metadata = {
  title: 'Firebase Auth App',
  description: 'Login and profile management using Firebase Auth',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
