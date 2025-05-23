import './Login.css';
import { Providers } from './providers'; // import client wrapper

export const metadata = {
  title: 'Student Management',
  description: 'Secure Login System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}