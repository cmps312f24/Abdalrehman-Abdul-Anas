import '../globals.css';
import NavBar from '../components/NavBar';

export const metadata = {
  title: 'NutriSnap - Home',
  description: 'Track your meals easily with NutriSnap',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-M3buhhBf3n9N/4ZRvJvMAnX43IQr6fJ2QU4Rw9S9vGyNIDxxQ+iHTH9OaS74K1s8ZkFtYvVEKmK6ZWHzYm7zHg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <div className="mobile-header">
          <h2 className="header-page-name">Home</h2>
        </div>
        <NavBar />
        <main className="content-area">
          {children}
        </main>
      </body>
    </html>
  );
}