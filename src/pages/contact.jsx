export default function Contact() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <p className="section-eyebrow">Support</p>
        <h1>Contact Support</h1>
        <p className="muted" style={{ marginTop: 16, lineHeight: 1.7 }}>
          Have a question about an event or booking, or want to get in touch about this project?
          Reach out using the details below.
        </p>

        <div className="card" style={{ marginTop: 24, padding: 24 }}>
          <div className="field" style={{ marginBottom: 16 }}>
            <label>Email</label>
            <p style={{ marginTop: 4 }}>
              <a href="mailto:abilashofficial3012@gmail.com">abilashofficial3012@gmail.com</a>
            </p>
          </div>
          <div className="field">
            <label>Phone</label>
            <p style={{ marginTop: 4 }}>
              <a href="tel:+917603826047">+91 76038 26047</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}