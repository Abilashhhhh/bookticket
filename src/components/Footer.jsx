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
          <Link to="/events">Music</Link>
          <Link to="/events">Technology</Link>
          <Link to="/events">Sports</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/my-tickets">My Tickets</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="#!">About BookTix</a>
          <a href="#!">Contact Support</a>
          <a href="#!">Terms &amp; Privacy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container flex-between">
          <span>© {new Date().getFullYear()} BookTix. All rights reserved.</span>
          <span>Built for demo &amp; internship purposes.</span>
        </div>
      </div>
    </footer>
  );
}
