import './globals.css';

import { GeistSans } from 'geist/font/sans';

let title = 'QR-Code Authentication Demo';
let description =
  'A demo of QR-code authentication using Next.js, React, and Neon.';

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://demo-git-main-sterling-millers-projects.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.variable}>{children}</body>
    </html>
  );
}

