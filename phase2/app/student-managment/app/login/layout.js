import './Login.css';

export const metadata = {
  title: 'Login',
  description: 'Student Management Login',
};

export default function LoginLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}