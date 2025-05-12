import './stat.css';

export const metadata = {
  title: 'Student Management',
  description: 'Secure Login System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}