import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marcus - AI Philosopher',
  description: 'Engage in philosophical discourse with Marcus Omega',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
