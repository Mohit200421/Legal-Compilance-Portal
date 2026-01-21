import React from "react";
import "./LegalComplianceHome.css";
import logo from "../assets/security.png";

export default function LegalComplianceHome() {
  const practiceAreas = [
    {
      title: "Corporate & Commercial",
      desc: "Advising domestic and international clients on M&A, joint ventures and strategic transactions.",
    },
    {
      title: "Banking & Finance",
      desc: "Specialised counsel in complex lending, regulatory finance, restructuring and insolvency.",
    },
    {
      title: "Dispute Resolution",
      desc: "Handling arbitration, commercial litigation, white-collar and regulatory investigations.",
    },
    {
      title: "Employment & Labour",
      desc: "Advisory on policy drafting, POSH compliance, disputes and investigations.",
    },
    {
      title: "Intellectual Property",
      desc: "Protection, enforcement & commercialization of trademarks, copyrights and patents.",
    },
    {
      title: "Data Protection & Privacy",
      desc: "Advising on DPDP compliance, governance frameworks and cross-border data transfers.",
    },
  ];

  return (
    <div className="pl-page">
      {/* NAVBAR */}
      <header className="pl-navbar">
        <div className="pl-nav-container">
          {/* LEFT */}
          <div className="pl-logo-box">
            <img
              src={logo}
              alt="LegalCompliance Logo"
              className="pl-logo-img"
            />
            <div>
              <h1 className="pl-brand-title">LegalCompliance</h1>
              <p className="pl-brand-subtitle">Trusted. Transparent. Expert.</p>
            </div>
          </div>

          {/* DESKTOP LINKS */}
          <nav className="pl-nav-links">
            <a href="/property">Property</a>
            <a href="/documents">Documents</a>
            <a href="/startup">Startup</a>
            <a href="/challan">Challan</a>
            <a href="/vehicle">Vehicle Report</a>

            <a href="/register" className="pl-talktolawyer-btn">
              Talk To Lawyer
            </a>
          </nav>

          {/* RIGHT */}
          <div className="pl-auth-buttons">
            <a href="/login" className="pl-login-btn">
              Login
            </a>
            <a href="/register" className="pl-register-btn">
              Register
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pl-hero">
        <div className="pl-hero-overlay" />
        <div className="pl-hero-content">
          <h2 className="pl-hero-title">
            Protecting Your Legacy, Securing Your Future.
          </h2>
          <p className="pl-hero-desc">
            We provide sophisticated legal counsel to corporations and
            individuals facing complex regulatory challenges. Trust our
            experience.
          </p>
          <div className="pl-hero-buttons">
            <button className="pl-btn-primary">Get Consultation</button>
            <button className="pl-btn-outline">Explore Services</button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="pl-about">
        <div className="pl-about-grid">
          <div>
            <h3 className="pl-section-title">Who We Are</h3>
            <p className="pl-about-text">
              We are a full-service law firm providing end-to-end legal
              solutions for corporations, startups, financial institutions and
              global enterprises.
            </p>
            <p className="pl-about-text">
              Our team combines years of legal expertise with business-centric
              insights to help clients navigate complex regulatory, compliance
              and litigation challenges.
            </p>
            <a href="/about" className="pl-read-more">
              Learn More →
            </a>
          </div>
          <div>
            <div className="pl-about-img"></div>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="pl-practices">
        <h3 className="pl-section-title-center">Our Practice Areas</h3>
        <p className="pl-section-desc-center">
          Expert legal services tailored to your unique business needs.
        </p>
        <div className="pl-practice-grid">
          {practiceAreas.map((item) => (
            <div key={item.title} className="pl-practice-card">
              <h4 className="pl-practice-title">{item.title}</h4>
              <p className="pl-practice-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pl-cta">
        <h3 className="pl-cta-title">Need Expert Legal Support?</h3>
        <p className="pl-cta-desc">
          Schedule a consultation with our specialists today.
        </p>
        <button className="pl-btn-primary-dark">Contact Us</button>
      </section>

      {/* FOOTER */}
      <footer className="pl-footer">
        <div className="pl-footer-grid">
          <div>
            <h4 className="pl-footer-logo">LegalCompliance</h4>
            <p className="pl-footer-text">
              Providing clarity, compliance and professional legal support
              across sectors.
            </p>
          </div>

          <div>
            <h4 className="pl-footer-title">Quick Links</h4>
            <ul className="pl-footer-list">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/practice">Practice Areas</a>
              </li>
              <li>
                <a href="/team">Our Team</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="pl-footer-title">Contact</h4>
            <p className="pl-footer-text">info@legalcompliance.com</p>
            <p className="pl-footer-text">+91 98765 43210</p>
          </div>
        </div>

        <div className="pl-footer-bottom">
          © 2025 LegalCompliance. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
