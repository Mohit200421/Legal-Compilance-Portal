import aboutImg from "../assets/about.jpg"; // replace with your real image

export default function About() {
  return (
    <div className="about-container">

      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="hero-card">
          <h2>About LawSatu</h2>
          <p>
            LawSatu is a full-service law firm providing expert legal guidance in civil,
            criminal, corporate, family and cyber law. We combine deep legal knowledge
            with real-world experience to protect your rights and deliver outcomes.
          </p>

          <div className="kpis">
            <div className="kpi">
              <h3>15+</h3>
              <p>Years Experience</p>
            </div>
            <div className="kpi">
              <h3>3,200+</h3>
              <p>Cases Handled</p>
            </div>
            <div className="kpi">
              <h3>98%</h3>
              <p>Client Satisfaction</p>
            </div>
          </div>
        </div>

        <div className="about-visual">
          <img src={aboutImg} alt="Law firm team" />
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="about-grid">
        <div className="about-card">
          <h4>Our Mission</h4>
          <p>
            To provide clear, ethical and result-oriented legal services that protect
            client interests and deliver justice.
          </p>
        </div>

        <div className="about-card">
          <h4>Our Vision</h4>
          <p>
            To be the most trusted legal partner — respected for our integrity,
            professionalism and client-first approach.
          </p>
        </div>

        <div className="about-card">
          <h4>Our Values</h4>
          <p>
            Integrity · Excellence · Transparency · Client-First · Timely Communication
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="team">
        <h3>Meet Our Team</h3>

        <div className="team-grid">
          <div className="member">
            <img src={aboutImg} alt="Advocate" />
            <div>
              <h5>Adv. Mohit Badgujar</h5>
              <p>Senior Partner — Criminal & Civil Litigation</p>
            </div>
          </div>

          <div className="member">
            <img src={aboutImg} alt="Advocate" />
            <div>
              <h5>Adv. Priya Sharma</h5>
              <p>Partner — Family & Matrimonial Law</p>
            </div>
          </div>

          <div className="member">
            <img src={aboutImg} alt="Advocate" />
            <div>
              <h5>Adv. R. Gupta</h5>
              <p>Corporate Counsel — Contracts & Compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta-box">
        <div>
          <h3>Need legal help today?</h3>
          <p>
            Book a consultation with our experts. We provide practical guidance and
            strategic legal solutions.
          </p>
        </div>

        <a className="cta-btn" href="/consult">
          Book Consultation
        </a>
      </section>
    </div>
  );
}
