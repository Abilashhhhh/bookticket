export default function About() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <p className="section-eyebrow">About</p>
        <h1>About BookTix</h1>
        <p className="muted" style={{ marginTop: 16, lineHeight: 1.7 }}>
          BookTix is a demo event management and ticketing platform built to showcase
          a complete full-stack booking flow — from browsing events to booking tickets,
          secure checkout, and an admin console for managing events, organizers and bookings.
          This project was built for learning and internship/resume purposes.
        </p>
      </div>
    </div>
  );
}