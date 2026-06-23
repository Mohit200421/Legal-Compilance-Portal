import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Star,
  Shield,
  Lock,
  Bell,
  DollarSign,
  Users,
  Briefcase,
  Heart,
  Building2,
  Gavel,
  Landmark,
  Lightbulb,
  Scale,
  CheckCircle2,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Send,
  Quote,
} from "lucide-react";

import appLogo from "../assets/app_logo.svg";

// Lex-Modernism Color System
const colors = {
  primary: "#091426",
  primaryContainer: "#1e293b",
  onPrimaryContainer: "#8590a6",
  secondary: "#4648d4",
  secondaryContainer: "#6063ee",
  onSecondaryContainer: "#fffbff",
  tertiary: "#1e1200",
  tertiaryContainer: "#35260c",
  onTertiaryContainer: "#a38c6a",
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
  surfaceTint: "#545f73",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onError: "#ffffff",
  onErrorContainer: "#93000a",
};

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = [
        "hero",
        "how-it-works",
        "practice-areas",
        "why-choose",
        "testimonials",
      ];
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const practiceAreas = [
    {
      icon: Heart,
      title: "Family Law",
      description:
        "Compassionate guidance for divorce, child custody, and domestic matters.",
      color: "#e91e63",
    },
    {
      icon: Building2,
      title: "Corporate Law",
      description:
        "Structuring, compliance, and dispute resolution for businesses of all sizes.",
      color: "#2196f3",
    },
    {
      icon: Gavel,
      title: "Criminal Defense",
      description:
        "Aggressive representation to protect your rights and freedom in court.",
      color: "#f44336",
    },
    {
      icon: Landmark,
      title: "Real Estate",
      description:
        "Property transactions, leasing disputes, and zoning legal counsel.",
      color: "#4caf50",
    },
    {
      icon: Lightbulb,
      title: "Intellectual Property",
      description:
        "Protecting your inventions, brands, and creative works globally.",
      color: "#ff9800",
    },
    {
      icon: Scale,
      title: "Civil Litigation",
      description:
        "Resolving non-criminal disputes through mediation or court proceedings.",
      color: "#9c27b0",
    },
  ];

  const whyChooseItems = [
    {
      icon: Users,
      title: "Verified Professionals",
      description:
        "Every lawyer undergoes a rigorous 5-step background and expertise verification.",
    },
    {
      icon: Lock,
      title: "Secure & Confidential",
      description:
        "Bank-grade encryption protects your data. Attorney-client privilege is our cornerstone.",
    },
    {
      icon: Bell,
      title: "Real-time Updates",
      description:
        "Track case progress 24/7 through our interactive dashboard with instant notifications.",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description:
        "No surprise bills. Get upfront quotes and flexible payment plans for all services.",
    },
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Founder, Sharma Logistics",
      content:
        "Finding a trustworthy corporate lawyer was difficult until I discovered LegalSetu. The platform is easy to use, and the expert guided us professionally.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Priya Deshmukh",
      role: "Homeowner, Pune",
      content:
        "The document verification service was extremely helpful. My property agreement was reviewed quickly, and every clause was explained clearly.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Amit Verma",
      role: "Freelance Designer",
      content:
        "I was concerned about high consultation fees, but LegalSetu provided an affordable fixed-price consultation. The lawyer patiently answered all my questions.",
      rating: 4,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Share Case",
      description:
        "Upload documents and describe your situation securely in our portal.",
      icon: Briefcase
    },
    {
      number: "02",
      title: "Connect",
      description:
        "Get matched with specialized lawyers and pick the one that fits your needs.",
      icon: Users
    },
    {
      number: "03",
      title: "Resolve",
      description:
        "Receive legal advice, file papers, and get your issues resolved effectively.",
      icon: CheckCircle2
    },
  ];

  const navigation = [
    { name: "Home", href: "#hero" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Practice Areas", href: "#practice-areas" },
    { name: "Why Choose Us", href: "#why-choose" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (href) => {
    closeMenu();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{ backgroundColor: colors.surface, color: colors.onSurface }}
    >
      {/* Navigation */}
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer z-50"
              onClick={() => navigate("/")}
            >
              <img
                src={appLogo}
                alt="LegalSetu Logo"
                className="h-7 w-auto object-contain"
              />
              <span
                className="ml-2 text-xl font-bold tracking-tight"
                style={{ color: colors.onSurface }}
              >
                Legal<span style={{ color: colors.secondary }}>Setu</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-sm font-medium transition-colors duration-200 cursor-pointer relative group"
                  style={{
                    color:
                      activeSection === item.href.slice(1)
                        ? colors.secondary
                        : colors.onSurfaceVariant,
                  }}
                >
                  {item.name}
                  <span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: colors.secondary }}
                  />
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block px-5 py-2 text-sm font-semibold transition-all duration-200 rounded-full border"
                style={{
                  color: colors.secondary,
                  borderColor: colors.outlineVariant,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surfaceContainerLow;
                  e.currentTarget.style.borderColor = colors.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = colors.outlineVariant;
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hidden md:flex items-center px-5 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-full shadow-md hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: colors.secondary }}
              >
                Get Started
                <ArrowRight size={14} className="ml-1.5" />
              </button>
              <button
                ref={menuButtonRef}
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-xl transition-colors"
                style={{
                  backgroundColor: colors.surfaceContainerHighest,
                  color: colors.onSurfaceVariant,
                }}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={closeMenu}
          style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
        />

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ease-out md:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 40px rgba(30, 41, 59, 0.15)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          <div className="flex flex-col h-full">
            <div
              className="flex items-center justify-between p-6"
              style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}
            >
              <div className="flex items-center">
                <img
                  src={appLogo}
                  alt="LegalSetu Logo"
                  className="h-8 w-auto object-contain"
                />
                <span
                  className="ml-2 text-xl font-bold"
                  style={{ color: colors.onSurface }}
                >
                  Law<span style={{ color: colors.secondary }}>Setu</span>
                </span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-xl"
                style={{ backgroundColor: colors.surfaceContainerHighest }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-6">
              <div className="px-6 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="block py-3 text-lg font-medium"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div
                style={{
                  borderTop: `1px solid ${colors.outlineVariant}`,
                  margin: "24px 24px",
                }}
              />
              <div className="px-6 space-y-3">
                <button
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                  className="w-full px-4 py-3 font-medium rounded-xl border"
                  style={{
                    color: colors.secondary,
                    borderColor: colors.outlineVariant,
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    closeMenu();
                  }}
                  className="w-full px-4 py-3 font-medium text-white rounded-xl"
                  style={{ backgroundColor: colors.secondary }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
      >
        {/* Background pattern & gradients */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${colors.secondary}15, transparent 60%)`,
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${colors.onSurface} 1px, transparent 1px), linear-gradient(90deg, ${colors.onSurface} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs mb-8 font-semibold uppercase tracking-wider border"
                style={{
                  backgroundColor: colors.surfaceContainer,
                  color: colors.secondary,
                  borderColor: colors.secondaryContainer
                }}
              >
                <Sparkles size={12} />
                <span>Trusted by 10,000+ Clients</span>
              </div>

              <h1
                className="text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight"
                style={{ color: colors.onSurface }}
              >
                Expert Legal Guidance,{" "}
                <span style={{ color: colors.secondary }} className="italic font-light">
                  Just a Click Away.
                </span>
              </h1>

              <p
                className="text-lg mb-10 max-w-xl"
                style={{ color: colors.onSurfaceVariant, lineHeight: "1.7" }}
              >
                LegalSetu bridges the gap between individuals and top-tier legal
                professionals. Get instant consultations, secure document
                reviews, and transparent pricing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <button
                  onClick={() => navigate("/register")}
                  className="px-7 py-3.5 text-white font-semibold transition-all duration-200 rounded-full flex items-center justify-center group shadow-lg hover:shadow-xl hover:scale-105"
                  style={{ backgroundColor: colors.secondary }}
                >
                  Get Started Now
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </button>
                <button
                  onClick={() => handleNavClick("#practice-areas")}
                  className="px-7 py-3.5 font-semibold transition-all duration-200 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: colors.outline,
                    color: colors.onSurface,
                    backgroundColor: 'rgba(255,255,255,0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.secondary;
                    e.currentTarget.style.color = colors.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.outline;
                    e.currentTarget.style.color = colors.onSurface;
                  }}
                >
                  Explore Services
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-10">
                <div>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: colors.onSurface }}
                  >
                    500+
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Verified Lawyers
                  </div>
                </div>
                <div className="border-l pl-10" style={{ borderColor: colors.outlineVariant }}>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: colors.onSurface }}
                  >
                    15k+
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Cases Solved
                  </div>
                </div>
                <div className="border-l pl-10" style={{ borderColor: colors.outlineVariant }}>
                  <div
                    className="text-3xl font-bold flex items-center gap-1"
                    style={{ color: colors.onSurface }}
                  >
                    4.9
                    <Star
                      className="h-5 w-5 fill-current"
                      style={{ color: "#f59e0b" }}
                    />
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Client Ratings
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image with Floating UI Elements */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Legal Professional"
                  className="w-full h-[500px] object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${colors.primary}40, transparent)`,
                  }}
                />
              </div>

              {/* Floating Badge Top Left */}
              <div 
                className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Case Status</p>
                  <p className="text-sm font-bold text-slate-900">Resolved Successfully</p>
                </div>
              </div>

              {/* Floating Badge Bottom Right */}
              <div 
                className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
              >
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}15` }}>
                  <Shield size={20} style={{ color: colors.secondary }} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">100% Secure</p>
                  <p className="text-sm font-bold text-slate-900">Confidential</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 relative"
        style={{ backgroundColor: colors.surfaceContainerLow }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.secondary }}>
              Process
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold mt-2 mb-4 tracking-tight"
              style={{ color: colors.onSurface }}
            >
              How It Works
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}
            >
              Simplified legal support in three easy steps. No jargon, no hidden
              fees, just results.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-10 left-0 w-full h-0.5 hidden md:block" style={{ backgroundColor: colors.outlineVariant }} />

            <div className="grid md:grid-cols-3 gap-12 relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="text-center flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 relative z-10"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.secondary,
                      }}
                    >
                      <Icon size={28} style={{ color: colors.secondary }} />
                    </div>
                    <span 
                      className="text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full"
                      style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}
                    >
                      Step {step.number}
                    </span>
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ color: colors.onSurface }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="leading-relaxed max-w-xs"
                      style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}
                    >
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section id="practice-areas" className="py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.secondary }}>
              Expertise
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold mt-2 mb-4 tracking-tight"
              style={{ color: colors.onSurface }}
            >
              Practice Areas
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}
            >
              Our multidisciplinary team covers a wide spectrum of legal needs,
              ensuring you always have the right representation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {practiceAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl border border-slate-200 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative overflow-hidden"
                  onClick={() => console.log(`Navigate to ${area.title}`)}
                >
                  {/* Hover Accent Line */}
                  <div 
                    className="absolute top-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ backgroundColor: area.color }}
                  />
                  
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${area.color}15` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: area.color }} />
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: colors.onSurface }}
                  >
                    {area.title}
                  </h3>
                  <p
                    className="mb-6 leading-relaxed text-sm"
                    style={{
                      color: colors.onSurfaceVariant,
                      lineHeight: "1.6",
                    }}
                  >
                    {area.description}
                  </p>
                  <div 
                    className="flex items-center text-sm font-semibold transition-colors"
                    style={{ color: colors.secondary }}
                  >
                    Learn More
                    <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Dark Contrast */}
      <section
        id="why-choose"
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: colors.primary }}
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(${colors.secondary} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.secondaryContainer }}>
              Advantages
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold mt-2 mb-4 tracking-tight text-white"
            >
              Why Choose LegalSetu?
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.onPrimaryContainer, lineHeight: "1.6" }}
            >
              We combine legal expertise with cutting-edge technology to provide an unmatched client experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl border transition-all duration-300 hover:bg-white/5"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3
                    className="text-xl font-bold mb-3 text-white"
                  >
                    {item.title}
                  </h3>
                  <p
                    className="leading-relaxed text-sm"
                    style={{
                      color: colors.onPrimaryContainer,
                      lineHeight: "1.6",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.secondary }}>
              Testimonials
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold mt-2 mb-4 tracking-tight"
              style={{ color: colors.onSurface }}
            >
              Trusted by Thousands
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative"
              >
                <Quote 
                  className="absolute top-6 right-6 opacity-10" 
                  size={64} 
                  style={{ color: colors.secondary }}
                />
                <div className="flex items-center space-x-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "fill-current" : ""}`}
                      style={{
                        color: i < testimonial.rating ? "#f59e0b" : colors.outlineVariant,
                      }}
                    />
                  ))}
                </div>
                <p
                  className="mb-8 leading-relaxed text-slate-700 relative z-10"
                  style={{ lineHeight: "1.7" }}
                >
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4 border-t pt-6 border-slate-100">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-slate-100"
                  />
                  <div>
                    <h4
                      className="font-bold"
                      style={{ color: colors.onSurface }}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div 
            className="rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
            style={{ backgroundColor: colors.secondary }}
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px)`,
                backgroundSize: '25px 25px'
              }}
            />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                Ready to Resolve Your Case?
              </h2>
              <p className="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
                Join thousands of satisfied clients who found their legal solution
                with LegalSetu. Your first consultation is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 font-bold transition-all duration-200 rounded-full bg-white shadow-lg hover:shadow-xl hover:scale-105"
                  style={{ color: colors.secondary }}
                >
                  Get Started Now
                </button>
                <button
                  onClick={() => handleNavClick("#practice-areas")}
                  className="px-8 py-4 font-bold text-white transition-all duration-200 rounded-full border-2 border-white/80 hover:bg-white/10"
                >
                  Talk to an Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="pt-16 pb-8 border-t"
        style={{
          backgroundColor: colors.surfaceContainerLow,
          borderColor: colors.outlineVariant,
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center mb-6">
                <img
                  src={appLogo}
                  alt="LegalSetu Logo"
                  className="h-8 w-auto object-contain"
                />
                <span
                  className="ml-2 text-xl font-bold"
                  style={{ color: colors.onSurface }}
                >
                  Law<span style={{ color: colors.secondary }}>Setu</span>
                </span>
              </div>
              <p
                className="text-sm mb-6"
                style={{ color: colors.onSurfaceVariant, lineHeight: "1.7" }}
              >
                Democratizing access to high-end legal services through
                technology and transparency.
              </p>
              <div className="flex space-x-3">
                <button
                  className="p-2.5 rounded-xl transition-colors hover:bg-slate-200"
                  style={{ backgroundColor: colors.surfaceContainerHighest }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </button>
                <button
                  className="p-2.5 rounded-xl transition-colors hover:bg-slate-200"
                  style={{ backgroundColor: colors.surfaceContainerHighest }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.083-3.428c.967-1.71 1.495-3.616 1.495-5.58 0-.313-.02-.627-.058-.94.965-.695 1.82-1.557 2.53-2.539z" />
                  </svg>
                </button>
                <button
                  className="p-2.5 rounded-xl transition-colors hover:bg-slate-200"
                  style={{ backgroundColor: colors.surfaceContainerHighest }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-6 text-lg" style={{ color: colors.onSurface }}>
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm">
                {["Home", "Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimers"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:underline transition-colors"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-6 text-lg" style={{ color: colors.onSurface }}>
                Contact
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3" style={{ color: colors.onSurfaceVariant }}>
                  <Phone size={16} style={{ color: colors.secondary }} />
                  +91 98765 43210
                </li>
                <li className="flex items-center gap-3" style={{ color: colors.onSurfaceVariant }}>
                  <Mail size={16} style={{ color: colors.secondary }} />
                  support@legalsetu.in
                </li>
                <li className="flex items-center gap-3" style={{ color: colors.onSurfaceVariant }}>
                  <MapPin size={16} style={{ color: colors.secondary }} />
                  Mumbai, Maharashtra
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold mb-6 text-lg" style={{ color: colors.onSurface }}>
                Newsletter
              </h4>
              <p className="text-sm mb-4" style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}>
                Stay updated with the latest legal news and updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface
                  }}
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl text-white font-medium flex items-center justify-center transition-transform hover:scale-105"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          <div
            className="pt-8 text-center text-sm"
            style={{
              borderTop: `1px solid ${colors.outlineVariant}`,
              color: colors.onSurfaceVariant,
            }}
          >
            <p>&copy; {new Date().getFullYear()} LegalSetu Legal Tech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;