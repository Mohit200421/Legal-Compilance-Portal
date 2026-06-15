import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scale,
  ArrowLeft,
  Menu,
  X,
  Clock,
  Shield,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// Import the app logo
import appLogo from "../assets/app_logo.svg";

// Lex-Modernism Color System
const colors = {
  primary: "#091426",
  primaryContainer: "#1e293b",
  onPrimaryContainer: "#8590a6",
  secondary: "#4648d4",
  secondaryContainer: "#6063ee",
  onSecondaryContainer: "#fffbff",
  surface: "#fbf8fa",
  surfaceDim: "#dcd9db",
  surfaceBright: "#fbf8fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f5f3f4",
  surfaceContainer: "#f0edef",
  surfaceContainerHigh: "#eae7e9",
  surfaceContainerHighest: "#e4e2e3",
  onSurface: "#1b1b1d",
  onSurfaceVariant: "#45474c",
  outline: "#75777d",
  outlineVariant: "#c5c6cd",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onError: "#ffffff",
  onErrorContainer: "#93000a",
  tertiary: "#1e1200",
  tertiaryContainer: "#35260c",
  onTertiaryContainer: "#a38c6a",
};

export default function TermsAndConditions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Glassmorphism card style
  const glassCardClass =
    "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  const tableOfContents = [
    { id: "acceptance", label: "Acceptance of Terms" },
    { id: "description", label: "Description of Service" },
    { id: "account", label: "User Accounts" },
    { id: "obligations", label: "User Obligations" },
    { id: "intellectual", label: "Intellectual Property" },
    { id: "termination", label: "Termination" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "privacy", label: "Privacy & Data Protection" },
    { id: "contact", label: "Contact Information" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.surface }}>
      {/* Navigation Bar - Glassmorphism */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(30,41,59,0.05)] border-b border-white/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 ${!scrolled ? glassCardClass : ""}`}
              >
                <img
                  src={appLogo}
                  alt="LegalSetu Logo"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span
                className="text-lg md:text-xl font-bold transition-colors"
                style={{ color: colors.onSurface }}
              >
                Legal<span style={{ color: colors.secondary }}>Setu</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.secondary)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.onSurfaceVariant)
                }
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-xl"
                style={{ backgroundColor: colors.secondary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    colors.secondaryContainer)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.secondary)
                }
              >
                Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: scrolled
                  ? colors.surfaceContainerHighest
                  : "transparent",
              }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X
                  className="h-5 w-5"
                  style={{ color: colors.onSurfaceVariant }}
                />
              ) : (
                <Menu
                  className="h-5 w-5"
                  style={{ color: colors.onSurfaceVariant }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Glassmorphism */}
        {isMenuOpen && (
          <div
            className="md:hidden"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              borderTop: `1px solid ${colors.outlineVariant}`,
            }}
          >
            <div className="px-6 py-4 space-y-2">
              <Link
                to="/login"
                className="block py-2 text-sm font-medium transition-colors"
                style={{ color: colors.onSurfaceVariant }}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block py-2 text-sm font-medium"
                style={{ color: colors.secondary }}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-20 md:pt-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Table of Contents - Glass Card */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className={`sticky top-24 ${glassCardClass} p-6`}>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Table of Contents
                </h3>
                <ul className="space-y-2">
                  {tableOfContents.map((item, index) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className="text-sm transition-colors text-left w-full group flex items-center justify-between"
                        style={{ color: colors.onSurfaceVariant }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = colors.secondary)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color =
                            colors.onSurfaceVariant)
                        }
                      >
                        <span className="text-sm">
                          {(index + 1).toString().padStart(2, "0")}.{" "}
                          {item.label}
                        </span>
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 py-8 lg:py-12">
              {/* Back Button - Glassmorphism */}
              <button
                onClick={() => navigate(-1)}
                className="hidden md:inline-flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 mb-6 group"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.surfaceContainerHighest;
                  e.currentTarget.style.color = colors.onSurface;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = colors.onSurfaceVariant;
                }}
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>

              {/* Header */}
              <div className="mb-8">
                <h1
                  className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2] tracking-[-0.02em]"
                  style={{ color: colors.onSurface }}
                >
                  Terms and Conditions
                </h1>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock
                      className="h-4 w-4"
                      style={{ color: colors.onSurfaceVariant }}
                    />
                    <span style={{ color: colors.onSurfaceVariant }}>
                      Last updated: January 2025
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield
                      className="h-4 w-4"
                      style={{ color: colors.onSurfaceVariant }}
                    />
                    <span style={{ color: colors.onSurfaceVariant }}>v2.0</span>
                  </div>
                </div>
              </div>

              {/* Introduction - Glass Card */}
              <div
                className="rounded-xl p-6 mb-8"
                style={{
                  backgroundColor: `${colors.secondary}08`,
                  border: `1px solid ${colors.secondary}20`,
                }}
              >
                <div className="flex items-start">
                  <AlertCircle
                    className="h-5 w-5 flex-shrink-0 mt-0.5 mr-3"
                    style={{ color: colors.secondary }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Please read these Terms and Conditions carefully before
                    using the LegalSetu platform. By accessing or using our
                    services, you agree to be bound by these terms.
                  </p>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {/* Section 1: Acceptance of Terms */}
                <section id="acceptance" className="scroll-mt-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center"
                    style={{ color: colors.onSurface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      1
                    </span>
                    Acceptance of Terms
                  </h2>
                  <div
                    className="space-y-3"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    <p className="leading-relaxed">
                      By accessing and using LegalSetu ("the Platform"), you
                      accept and agree to be bound by the terms and provision of
                      this agreement. Additionally, when using LegalSetu's
                      services, you shall be subject to any posted guidelines or
                      rules applicable to such services.
                    </p>
                    <p className="leading-relaxed">
                      If you do not agree to abide by these terms, please do not
                      use this Platform. Your continued use of LegalSetu
                      following any changes to these terms will mean you accept
                      those changes.
                    </p>
                  </div>
                </section>

                {/* Section 2: Description of Service */}
                <section id="description" className="scroll-mt-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center"
                    style={{ color: colors.onSurface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      2
                    </span>
                    Description of Service
                  </h2>
                  <div
                    className="space-y-3"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    <p className="leading-relaxed">
                      LegalSetu is a comprehensive legal practice management
                      platform that provides:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Case management and tracking tools</li>
                      <li>Client portal for secure communication</li>
                      <li>Document management and storage</li>
                      <li>Legal research resources</li>
                      <li>Billing and invoicing features</li>
                      <li>Appointment scheduling</li>
                      <li>Communication tools for lawyers and clients</li>
                    </ul>
                    <p className="leading-relaxed">
                      We reserve the right to modify or discontinue the service
                      at any time with reasonable notice.
                    </p>
                  </div>
                </section>

                {/* Section 3: User Accounts */}
                <section id="account" className="scroll-mt-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center"
                    style={{ color: colors.onSurface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      3
                    </span>
                    User Accounts
                  </h2>
                  <div
                    className="space-y-3"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    <p className="leading-relaxed">
                      To access certain features of the Platform, you must
                      create an account. You agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Provide accurate and complete registration information
                      </li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Promptly update any changes to your information</li>
                      <li>
                        Accept responsibility for all activities under your
                        account
                      </li>
                      <li>Notify us immediately of any unauthorized access</li>
                    </ul>
                    <p className="leading-relaxed">
                      We reserve the right to suspend or terminate accounts that
                      violate these terms or for any other reason at our sole
                      discretion.
                    </p>
                  </div>
                </section>

                {/* Section 4: User Obligations */}
                <section id="obligations" className="scroll-mt-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center"
                    style={{ color: colors.onSurface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      4
                    </span>
                    User Obligations
                  </h2>
                  <div
                    className="space-y-3"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    <p className="leading-relaxed">
                      When using LegalSetu, you agree NOT to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Violate any applicable laws or regulations</li>
                      <li>Infringe upon the rights of others</li>
                      <li>Upload or transmit viruses or malicious code</li>
                      <li>
                        Attempt to gain unauthorized access to the Platform
                      </li>
                      <li>
                        Interfere with the proper operation of the service
                      </li>
                      <li>Use the service for any unlawful purpose</li>
                      <li>Harass, abuse, or harm another person</li>
                      <li>Post false, misleading, or defamatory content</li>
                    </ul>
                    <p className="leading-relaxed">
                      Lawyers using the platform must maintain valid bar council
                      registration and comply with relevant professional ethics
                      rules.
                    </p>
                  </div>
                </section>

                {/* Section 5: Intellectual Property */}
                <section id="intellectual" className="scroll-mt-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center"
                    style={{ color: colors.onSurface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      5
                    </span>
                    Intellectual Property
                  </h2>
                  <div
                    className="space-y-3"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    <p className="leading-relaxed">
                      The LegalSetu platform, including all content, features,
                      and functionality, is owned by LegalSetu and is protected
                      by copyright, trademark, and other intellectual property
                      laws.
                    </p>
                    <p className="leading-relaxed">
                      <strong>Your Content:</strong> You retain ownership of any
                      content you upload to the Platform. By uploading content,
                      you grant us a license to use, store, and display your
                      content solely for providing and improving our services.
                    </p>
                    <p className="leading-relaxed">
                      <strong>Restrictions:</strong> You may not copy, modify,
                      distribute, sell, or lease any part of our service without
                      prior written permission.
                    </p>
                  </div>
                </section>

                {/* Section 6: Termination */}
                <section id="termination" className="scroll-mt-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center"
                    style={{ color: colors.onSurface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      6
                    </span>
                    Termination
                  </h2>
                  <div
                    className="space-y-3"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    <p className="leading-relaxed">
                      Either party may terminate this agreement at any time.
                      Upon termination:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Your right to use the service immediately ceases</li>
                      <li>
                        You must delete all copies of any content from the
                        Platform
                      </li>
                      <li>Any outstanding fees remain payable</li>
                      <li>
                        Provisions that by their nature should survive
                        termination will remain in effect
                      </li>
                    </ul>
                    <p className="leading-relaxed">
                      We may terminate or suspend your account immediately,
                      without prior notice, for any reason, including breach of
                      these Terms.
                    </p>
                  </div>
                </section>

                {/* Section 7: Limitation of Liability */}
                <section id="liability" className="scroll-mt-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center"
                    style={{ color: colors.onSurface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      7
                    </span>
                    Limitation of Liability
                  </h2>
                  <div
                    className="space-y-3"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    <p className="leading-relaxed">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, LegalSetu SHALL
                      NOT BE LIABLE FOR:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Any indirect, incidental, special, consequential, or
                        punitive damages
                      </li>
                      <li>
                        Loss of profits, data, use, goodwill, or other
                        intangible losses
                      </li>
                      <li>
                        Any damages arising from your use of or inability to use
                        the service
                      </li>
                      <li>
                        Any conduct or content of third parties on the platform
                      </li>
                      <li>
                        Any damages related to services not supplied by us
                      </li>
                    </ul>
                    <p className="leading-relaxed">
                      Our total liability shall not exceed the amount paid by
                      you, if any, for accessing the service during the twelve
                      (12) months preceding the claim.
                    </p>
                  </div>
                </section>

                {/* Section 8: Privacy & Data Protection */}
                <section id="privacy" className="scroll-mt-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center"
                    style={{ color: colors.onSurface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      8
                    </span>
                    Privacy & Data Protection
                  </h2>
                  <div
                    className="space-y-3"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    <p className="leading-relaxed">
                      Your privacy is important to us. Please review our Privacy
                      Policy, which explains how we collect, use, disclose, and
                      safeguard your information.
                    </p>
                    <p className="leading-relaxed">
                      By using the Platform, you consent to the processing of
                      your information as described in our Privacy Policy.
                    </p>
                    <p className="leading-relaxed">
                      We are committed to protecting personal data in accordance
                      with applicable data protection laws, including the
                      Information Technology Act, 2000 and related regulations.
                    </p>
                  </div>
                </section>

                {/* Section 9: Contact Information */}
                <section id="contact" className="scroll-mt-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 flex items-center"
                    style={{ color: colors.onSurface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      9
                    </span>
                    Contact Information
                  </h2>
                  <div
                    className="space-y-3"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    <p className="leading-relaxed">
                      If you have any questions about these Terms and
                      Conditions, please contact us:
                    </p>
                    <div
                      className="rounded-xl p-6 mt-4"
                      style={{
                        backgroundColor: colors.surfaceContainerHighest,
                      }}
                    >
                      <p>
                        <strong style={{ color: colors.onSurface }}>
                          LegalSetu
                        </strong>
                      </p>
                      <p>123 Legal Street, Mumbai, India</p>
                      <p>Email: legal@LegalSetu.com</p>
                      <p>Phone: +91 12345 67890</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Agreement Box - Glass Card */}
              <div
                className="mt-12 rounded-xl p-6 text-white"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})`,
                }}
              >
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mr-3" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Agreement to Terms
                    </h3>
                    <p className="text-sm opacity-90">
                      By creating an account or using LegalSetu, you acknowledge
                      that you have read, understood, and agree to be bound by
                      these Terms and Conditions and our Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-8 mt-12"
        style={{
          backgroundColor: colors.primary,
          borderTop: `1px solid ${colors.primaryContainer}`,
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img
                src={appLogo}
                alt="LegalSetu Logo"
                className="h-6 w-auto object-contain brightness-0 invert"
              />
              <span className="font-bold text-white">
                Law<span style={{ color: colors.secondary }}>Setu</span>
              </span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/terms-and-conditions"
                className="transition-colors"
                style={{ color: colors.onPrimaryContainer }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.secondary)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.onPrimaryContainer)
                }
              >
                Terms
              </Link>
              <Link
                to="/contact"
                className="transition-colors"
                style={{ color: colors.onPrimaryContainer }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.secondary)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.onPrimaryContainer)
                }
              >
                Contact
              </Link>
            </div>
            <p
              className="text-sm mt-4 md:mt-0"
              style={{ color: colors.onPrimaryContainer }}
            >
              © {new Date().getFullYear()} LegalSetu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
