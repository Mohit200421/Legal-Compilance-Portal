import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Scale,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Star,
  PlayCircle,
  Briefcase,
  FileText,
  Users2,
  ShieldCheck,
  Globe,
  MessageCircle,
  Database,
  BarChart3,
  Mail,
  Phone,
  Quote,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Brain,
} from "lucide-react";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [counts, setCounts] = useState({
    cases: 0,
    clients: 0,
    lawyers: 0,
    satisfaction: 0,
  });

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

    // Add event listener with capture to handle clicks properly
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Counter animation
  useEffect(() => {
    const targets = {
      cases: 5000,
      clients: 2500,
      lawyers: 150,
      satisfaction: 98,
    };

    const duration = 2000;
    const steps = 50;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        cases: Math.floor(targets.cases * progress),
        clients: Math.floor(targets.clients * progress),
        lawyers: Math.floor(targets.lawyers * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = [
        "hero",
        "features",
        "services",
        "showcase",
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

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Smart Case Management",
      description:
        "AI-powered organization and tracking of all your cases in one central hub.",
      color: "blue",
      stats: "50% faster case resolution",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption ensures your sensitive legal data stays protected.",
      color: "purple",
      stats: "99.99% uptime",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Process documents and access information in seconds, not hours.",
      color: "orange",
      stats: "3x faster processing",
    },
    {
      icon: Globe,
      title: "Cloud Access",
      description:
        "Work from anywhere, anytime with our secure cloud infrastructure.",
      color: "green",
      stats: "100% remote ready",
    },
    {
      icon: MessageCircle,
      title: "Client Portal",
      description:
        "Secure messaging and document sharing with real-time updates.",
      color: "pink",
      stats: "98% client satisfaction",
    },
    {
      icon: Database,
      title: "Legal Research",
      description:
        "Comprehensive database with AI-powered search and recommendations.",
      color: "indigo",
      stats: "1M+ legal documents",
    },
  ];

  const services = [
    {
      title: "Case Management",
      description:
        "End-to-end case tracking with automated workflows and deadline management.",
      icon: Briefcase,
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Document Automation",
      description:
        "Generate legal documents instantly with smart templates and e-signatures.",
      icon: FileText,
      image:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Client Collaboration",
      description:
        "Real-time collaboration tools for seamless client communication.",
      icon: Users2,
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Analytics & Reports",
      description:
        "Data-driven insights to optimize your practice performance.",
      icon: BarChart3,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const showcaseItems = [
    {
      title: "Intelligent Case Analytics",
      description:
        "Predict outcomes and identify patterns with advanced AI algorithms.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    },
    {
      title: "Seamless Collaboration",
      description: "Work together with your team and clients in real-time.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    },
    {
      title: "Document Intelligence",
      description: "Extract, analyze, and organize documents automatically.",
      image:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Managing Partner",
      firm: "Johnson & Associates",
      content:
        "This platform transformed how we manage cases. We've seen a 40% increase in efficiency and our clients love the portal.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Michael Chen",
      role: "Senior Attorney",
      firm: "Chen Legal Group",
      content:
        "The document automation feature alone saved our firm hundreds of hours. Worth every penny.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Emily Rodriguez",
      role: "Legal Director",
      firm: "Rodriguez Law",
      content:
        "Finally, a platform that understands what lawyers actually need. The client portal has improved our communication dramatically.",
      avatar:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    },
  ];

  const navigation = [
    { name: "Home", href: "#hero" },
    { name: "Features", href: "#features" },
    { name: "Services", href: "#services" },
    { name: "Showcase", href: "#showcase" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      green: "from-green-500 to-green-600",
      pink: "from-pink-500 to-pink-600",
      indigo: "from-indigo-500 to-indigo-600",
    };
    return colors[color] || colors.blue;
  };

  // Close menu function
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Toggle menu function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle navigation click
  const handleNavClick = (href) => {
    closeMenu();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer z-50"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Law<span className="text-blue-600">Setu</span>
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
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.name.toLowerCase()
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
              <button
                ref={menuButtonRef}
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors z-50"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
          id="mobile-menu"
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out md:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Legal<span className="text-blue-600">Suite</span>
                </span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto py-6">
              {/* Navigation Links */}
              <div className="px-6 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`block py-3 text-base font-medium transition-colors ${
                      activeSection === item.name.toLowerCase()
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6 mx-6" />

              {/* Auth Buttons */}
              <div className="px-6 space-y-3">
                <button
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                  className="w-full px-4 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    closeMenu();
                  }}
                  className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Menu Footer */}
            <div className="p-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                &copy; 2024 LawSetu. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-24 pb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mb-6">
                <Sparkles size={14} />
                <span>AI-Powered Legal Platform</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Modern Legal Practice
                <br />
                <span className="text-blue-600">Made Simple</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Streamline your law firm with intelligent case management,
                automated document processing, and seamless client
                collaboration.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center group"
                >
                  Start Free Trial
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </button>
                <button
                  onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium flex items-center justify-center"
                >
                  <PlayCircle className="mr-2" size={18} />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {counts.cases.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-600">
                    Cases Won
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {counts.clients.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-600">
                    Happy Clients
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {counts.lawyers}+
                  </div>
                  <div className="text-sm text-gray-600">
                    Expert Lawyers
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {counts.satisfaction}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Success Rate
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Trusted by <span className="font-semibold">2,500+</span> firms
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    4.9/5
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Legal Professional"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to run your practice
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed for modern law firms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(
                      feature.color
                    )} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {feature.description}
                  </p>
                  <div className="text-sm font-medium text-blue-600">
                    {feature.stats}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-gray-600">
              Specialized solutions for every aspect of your practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <service.icon className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See it in action
            </h2>
            <p className="text-lg text-gray-600">
              Experience the power of modern legal technology
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {showcaseItems.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="relative h-96 rounded-xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-2xl font-bold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-white/90">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() =>
                setCurrentSlide(
                  (prev) =>
                    (prev - 1 + showcaseItems.length) % showcaseItems.length
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % showcaseItems.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRightIcon size={20} />
            </button>

            <div className="flex justify-center mt-6 space-x-2">
              {showcaseItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-6 bg-blue-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by legal professionals
            </h2>
            <p className="text-lg text-gray-600">
              See what our clients have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.firm}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your practice?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of law firms already using LawSetu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 font-semibold text-gray-900">
                  LawSetu
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Modern legal practice management platform for forward-thinking
                law firms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Contact
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Mail size={14} />
                  <span>hello@lawsetu.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone size={14} />
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 LawSetu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;