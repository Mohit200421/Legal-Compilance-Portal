import { useState } from "react";
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
} from "lucide-react";

// Import the app logo
import appLogo from "../assets/app_logo.png";

export default function TermsAndConditions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useState(() => {
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
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo with stacked layout */}
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src={appLogo} 
                alt="LawSetu Logo" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                LawSetu
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/login"
                className="block py-2 text-gray-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block py-2 text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Table of Contents */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Table of Contents
                </h3>
                <ul className="space-y-2">
                  {tableOfContents.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 py-8 lg:py-12">
              {/* Back Button - Hidden on mobile, visible on desktop */}
              <button
                onClick={() => navigate(-1)}
                className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back</span>
              </button>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Terms and Conditions
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: January 2025</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>v1.0</span>
                  </div>
                </div>
              </div>

              {/* Introduction */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5 mr-3" />
                  <p className="text-sm text-blue-700">
                    Please read these Terms and Conditions carefully before
                    using the LawSetu platform. By accessing or using
                    our services, you agree to be bound by these terms.
                  </p>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {/* Section 1: Acceptance of Terms */}
                <section id="acceptance" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
                      1
                    </span>
                    Acceptance of Terms
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      By accessing and using LawSetu ("the Platform"),
                      you accept and agree to be bound by the terms and
                      provision of this agreement. Additionally, when using
                      LawSetu's services, you shall be subject to any
                      posted guidelines or rules applicable to such services.
                    </p>
                    <p className="mt-4">
                      If you do not agree to abide by these terms, please do not
                      use this Platform. Your continued use of LawSetu
                      following any changes to these terms will mean you accept
                      those changes.
                    </p>
                  </div>
                </section>

                {/* Section 2: Description of Service */}
                <section id="description" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
                      2
                    </span>
                    Description of Service
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      LawSetu is a comprehensive legal practice
                      management platform that provides:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                      <li>Case management and tracking tools</li>
                      <li>Client portal for secure communication</li>
                      <li>Document management and storage</li>
                      <li>Legal research resources</li>
                      <li>Billing and invoicing features</li>
                      <li>Appointment scheduling</li>
                      <li>Communication tools for lawyers and clients</li>
                    </ul>
                    <p className="mt-4">
                      We reserve the right to modify or discontinue the service
                      at any time with reasonable notice.
                    </p>
                  </div>
                </section>

                {/* Section 3: User Accounts */}
                <section id="account" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
                      3
                    </span>
                    User Accounts
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      To access certain features of the Platform, you must
                      create an account. You agree to:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
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
                    <p className="mt-4">
                      We reserve the right to suspend or terminate accounts that
                      violate these terms or for any other reason at our sole
                      discretion.
                    </p>
                  </div>
                </section>

                {/* Section 4: User Obligations */}
                <section id="obligations" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
                      4
                    </span>
                    User Obligations
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>When using LawSetu, you agree NOT to:</p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
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
                    <p className="mt-4">
                      Lawyers using the platform must maintain valid bar council
                      registration and comply with relevant professional ethics
                      rules.
                    </p>
                  </div>
                </section>

                {/* Section 5: Intellectual Property */}
                <section id="intellectual" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
                      5
                    </span>
                    Intellectual Property
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      The LawSetu platform, including all content,
                      features, and functionality, is owned by LawSetu
                      and is protected by copyright, trademark, and other
                      intellectual property laws.
                    </p>
                    <p className="mt-4">
                      <strong>Your Content:</strong> You retain ownership of any
                      content you upload to the Platform. By uploading content,
                      you grant us a license to use, store, and display your
                      content solely for providing and improving our services.
                    </p>
                    <p className="mt-4">
                      <strong>Restrictions:</strong> You may not copy, modify,
                      distribute, sell, or lease any part of our service without
                      prior written permission.
                    </p>
                  </div>
                </section>

                {/* Section 6: Termination */}
                <section id="termination" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
                      6
                    </span>
                    Termination
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      Either party may terminate this agreement at any time.
                      Upon termination:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
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
                    <p className="mt-4">
                      We may terminate or suspend your account immediately,
                      without prior notice, for any reason, including breach of
                      these Terms.
                    </p>
                  </div>
                </section>

                {/* Section 7: Limitation of Liability */}
                <section id="liability" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
                      7
                    </span>
                    Limitation of Liability
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, LawSetu
                      SHALL NOT BE LIABLE FOR:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
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
                    <p className="mt-4">
                      Our total liability shall not exceed the amount paid by
                      you, if any, for accessing the service during the twelve
                      (12) months preceding the claim.
                    </p>
                  </div>
                </section>

                {/* Section 8: Privacy & Data Protection */}
                <section id="privacy" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
                      8
                    </span>
                    Privacy & Data Protection
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      Your privacy is important to us. Please review our Privacy
                      Policy, which explains how we collect, use, disclose, and
                      safeguard your information.
                    </p>
                    <p className="mt-4">
                      By using the Platform, you consent to the processing of
                      your information as described in our Privacy Policy.
                    </p>
                    <p className="mt-4">
                      We are committed to protecting personal data in accordance
                      with applicable data protection laws, including the
                      Information Technology Act, 2000 and related regulations.
                    </p>
                  </div>
                </section>

                {/* Section 9: Contact Information */}
                <section id="contact" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
                      9
                    </span>
                    Contact Information
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      If you have any questions about these Terms and
                      Conditions, please contact us:
                    </p>
                    <div className="bg-gray-50 rounded-xl p-6 mt-4">
                      <p>
                        <strong>LawSetu</strong>
                      </p>
                      <p>123 Legal Street, Mumbai, India</p>
                      <p>Email: legal@LawSetu.com</p>
                      <p>Phone: +91 12345 67890</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Agreement Box */}
              <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mr-3" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Agreement to Terms
                    </h3>
                    <p className="text-sm opacity-90">
                      By creating an account or using LawSetu, you
                      acknowledge that you have read, understood, and agree to
                      be bound by these Terms and Conditions and our Privacy
                      Policy.
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img 
                src={appLogo} 
                alt="LawSetu Logo" 
                className="h-6 w-auto object-contain brightness-0 invert"
              />
              <span className="font-bold">LawSetu</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link
                to="/terms-and-conditions"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4 md:mt-0">
              © {new Date().getFullYear()} LawSetu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}