import { Link } from 'react-router-dom';
import Logo from './Logo';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo variant="light" />
          <p>Book events. Live moments. A professional platform for discovering events and managing tickets end-to-end.</p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/events">All Events</Link>
          <Link to="/events?category=Music">Music</Link>
          <Link to="/events?category=Technology">Technology</Link>
          <Link to="/events?category=Sports">Sports</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/my-tickets">My Tickets</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About BookTix</Link>
          <Link to="/contact">Contact Support</Link>
          <Link to="/privacy">Terms &amp; Privacy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-legal">
          <span>© {new Date().getFullYear()} BookTix. All rights reserved.</span>
          <span>Built for demo &amp; internship purposes.</span>
        </div>
      </div>
    </footer>
  );
}