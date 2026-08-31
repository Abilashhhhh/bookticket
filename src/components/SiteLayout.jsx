import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SiteLayout() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
   const showBack = location.pathname !== '/';

  return (
    <>
     <Navbar /> <main> {showBack && ( <button onClick={() => navigate(-1)} aria-label="Go back" style={{ margin: '16px 0 0 16px', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14, }} > ← Back </button> )} <Outlet /> </main>
      <Footer />
    </>
  );
}
