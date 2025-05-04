import '../globals.css';
import NavBar from '../components/NavBar';

export const metadata = {
  title: 'NutriSnap - Home',
  description: 'Track your meals easily with NutriSnap',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">      
      <body>
          <div className="mobile-header">
              {/* <i className="fa-solid fa-bars nav-button-mobile" onclick="showMobileNav()"></i> */}
              <h2 className="header-page-name">Home</h2>
              {/* <img src="/img\profile.png" alt="User" id="mobile-img-user" onClick="displaytSettings(document.querySelector('#Settings-btn'))"></img> */}
          </div>
          <NavBar /> 
          <main className="content-area">
              {children}
          </main>
      </body>
    </html>
  );
}