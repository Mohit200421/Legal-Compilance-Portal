import { Link } from "react-router-dom";
import aboutImg from "../assets/about.jpg";
import { Scale, Target, Eye, Heart, CheckCircle, Sparkles, Users, Briefcase, Award, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

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

export default function About() {
  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  const teamMembers = [
    {
      name: "Adv. Mohit Badgujar",
      role: "Senior Partner — Criminal & Civil Litigation",
      experience: "18+ years",
      cases: "500+",
      image: aboutImg,
    },
    {
      name: "Adv. Priya Sharma",
      role: "Partner — Family & Matrimonial Law",
      experience: "14+ years",
      cases: "400+",
      image: aboutImg,
    },
    {
      name: "Adv. R. Gupta",
      role: "Corporate Counsel — Contracts & Compliance",
      experience: "12+ years",
      cases: "350+",
      image: aboutImg,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.surface }}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section - Updated with Lex-Modernism */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: colors.primary }}>
        {/* Background gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(circle at 10% 30%, ${colors.secondary}30, transparent 70%)` }}
        />
        
        {/* Decorative dots pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `radial-gradient(${colors.secondary} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Trust badge */}
              <div 
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm mb-6"
                style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.secondary }}
              >
                <Sparkles size={14} />
                <span className="font-medium tracking-wide">LEGAL EXCELLENCE SINCE 2010</span>
              </div>
              
              <h1 
                className="text-4xl lg:text-5xl font-bold mb-6 leading-[1.2] tracking-[-0.02em]"
                style={{ color: "white" }}
              >
                About Law<span style={{ color: colors.secondary }}>Setu</span>
              </h1>
              
              <p 
                className="text-base lg:text-lg mb-8 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}
              >
                LawSetu is a full-service law firm providing expert legal
                guidance in civil, criminal, corporate, family and cyber law. We
                combine deep legal knowledge with real-world experience to
                protect your rights and deliver outcomes.
              </p>

              {/* KPIs - Glassmorphism */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`${glassCardClass} p-4 text-center`} style={{ backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
                  <div className="text-3xl lg:text-4xl font-bold" style={{ color: colors.secondary }}>15+</div>
                  <div className="text-xs lg:text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Years Experience</div>
                </div>
                <div className={`${glassCardClass} p-4 text-center`} style={{ backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
                  <div className="text-3xl lg:text-4xl font-bold" style={{ color: colors.secondary }}>3,200+</div>
                  <div className="text-xs lg:text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Cases Handled</div>
                </div>
                <div className={`${glassCardClass} p-4 text-center`} style={{ backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
                  <div className="text-3xl lg:text-4xl font-bold" style={{ color: colors.secondary }}>98%</div>
                  <div className="text-xs lg:text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className={`relative rounded-xl overflow-hidden ${glassCardClass} p-2`}>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={aboutImg}
                    alt="Law firm team"
                    className="w-full h-auto"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${colors.secondary}20, transparent)` }}
                  />
                </div>
              </div>
              {/* Decorative element */}
              <div 
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl -z-10"
                style={{ backgroundColor: colors.secondary, opacity: 0.3 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values - Glassmorphism Cards */}
      <section className="py-16 md:py-24" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mission */}
            <div className={`${glassCardClass} p-6 group cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${colors.secondary}15` }}
              >
                <Target className="h-7 w-7" style={{ color: colors.secondary }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.onSurface }}>
                Our Mission
              </h3>
              <p className="leading-relaxed" style={{ color: colors.onSurfaceVariant, lineHeight: "1.5" }}>
                To provide clear, ethical and result-oriented legal services
                that protect client interests and deliver justice.
              </p>
            </div>

            {/* Vision */}
            <div className={`${glassCardClass} p-6 group cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${colors.secondary}15` }}
              >
                <Eye className="h-7 w-7" style={{ color: colors.secondary }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.onSurface }}>
                Our Vision
              </h3>
              <p className="leading-relaxed" style={{ color: colors.onSurfaceVariant, lineHeight: "1.5" }}>
                To be the most trusted legal partner — respected for our
                integrity, professionalism and client-first approach.
              </p>
            </div>

            {/* Values */}
            <div className={`${glassCardClass} p-6 group cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${colors.secondary}15` }}
              >
                <Heart className="h-7 w-7" style={{ color: colors.secondary }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.onSurface }}>
                Our Values
              </h3>
              <div className="space-y-2">
                {["Integrity", "Excellence", "Transparency", "Client-First"].map((value, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                    <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: colors.surfaceContainerLow }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div 
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm mb-4"
              style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.secondary }}
            >
              <Users size={14} />
              <span className="font-medium tracking-wide">OUR EXPERTS</span>
            </div>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4 leading-[1.3] tracking-[-0.01em]"
              style={{ color: colors.onSurface }}
            >
              Meet Our Team
            </h2>
            <p 
              className="max-w-2xl mx-auto"
              style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}
            >
              Our experienced team of lawyers is dedicated to providing you with
              the best legal solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`${glassCardClass} overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to top, ${colors.primary}CC, transparent)` }}
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold mb-1" style={{ color: colors.onSurface }}>
                    {member.name}
                  </h4>
                  <p className="text-sm font-medium mb-3" style={{ color: colors.secondary }}>
                    {member.role}
                  </p>
                  <div className="flex justify-between pt-3 border-t" style={{ borderTopColor: colors.outlineVariant }}>
                    <div>
                      <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>Experience</span>
                      <p className="text-sm font-semibold" style={{ color: colors.onSurface }}>{member.experience}</p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>Cases Won</span>
                      <p className="text-sm font-semibold" style={{ color: colors.onSurface }}>{member.cases}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: colors.secondary }}>
        {/* Glass overlay effect */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: `radial-gradient(circle at 20% 40%, white 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.3] tracking-[-0.01em]" style={{ color: "white" }}>
            Need legal help today?
          </h2>
          <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.9)", lineHeight: "1.6" }}>
            Book a consultation with our experts. We provide practical guidance
            and strategic legal solutions.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl group"
            style={{ 
              backgroundColor: colors.surface,
              color: colors.secondary,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.backgroundColor = colors.surfaceBright;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.backgroundColor = colors.surface;
            }}
          >
            <span>Book Consultation</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer - Updated with Lex-Modernism */}
      <footer className="py-12" style={{ backgroundColor: colors.primary, borderTop: `1px solid ${colors.primaryContainer}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src={appLogo} 
              alt="LawSetu Logo" 
              className="h-6 w-auto object-contain brightness-0 invert"
            />
            <span className="text-xl font-bold text-white">
              Law<span style={{ color: colors.secondary }}>Setu</span>
            </span>
          </div>
          <p className="mb-4" style={{ color: colors.onPrimaryContainer, lineHeight: "1.5" }}>
            Providing clarity, compliance and professional legal support across sectors.
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-sm transition-colors" style={{ color: colors.onPrimaryContainer }}>Privacy Policy</a>
            <a href="#" className="text-sm transition-colors" style={{ color: colors.onPrimaryContainer }}>Terms of Service</a>
            <a href="#" className="text-sm transition-colors" style={{ color: colors.onPrimaryContainer }}>Contact</a>
          </div>
          <div className="pt-8 text-sm" style={{ borderTop: `1px solid ${colors.primaryContainer}`, color: colors.onPrimaryContainer }}>
            © 2025 LawSetu Legal Tech. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}