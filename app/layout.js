import './globals.css';

export const metadata = {
  title: 'QuoteSnap - AI Estimates for Trade Contractors',
  description: 'Generate itemized estimates and client-ready proposals in seconds.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
