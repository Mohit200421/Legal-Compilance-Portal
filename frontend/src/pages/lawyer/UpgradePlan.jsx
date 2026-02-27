import { useEffect, useState } from "react";
import API from "../../api/axios";
import { mockPayment } from "../../api/paymentApi";
import toast from "react-hot-toast";
import {
  Sparkles,
  CheckCircle,
  Crown,
  Zap,
  Star,
  Shield,
  Rocket,
  Users,
  MessageSquare,
  FileText,
  Briefcase,
  Calendar,
  Clock,
  ArrowRight,
  Loader2,
  Gift,
  Award,
  TrendingUp,
  Infinity,
  Lock,
  Unlock,
  X
} from "lucide-react";

export default function UpgradePlan() {
  const [plans, setPlans] = useState([]);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' or 'yearly'
  const [hoveredPlan, setHoveredPlan] = useState(null);

  // 🔹 Load subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get("/subscriptions");
        setPlans(res.data);
      } catch (err) {
        toast.error("Failed to load plans");
      }
    };
    fetchPlans();
  }, []);

  // 🔹 MOCK UPGRADE (NO RAZORPAY)
  const handleUpgrade = async (plan) => {
    try {
      setLoadingPlanId(plan._id);

      await mockPayment(plan._id);

      toast.success("Subscription upgraded successfully 🎉");

      // refresh to re-check subscription
      window.location.reload();
    } catch (err) {
      console.error("Mock payment failed:", err);
      toast.error(err?.response?.data?.msg || "Upgrade failed");
    } finally {
      setLoadingPlanId(null);
    }
  };

  // Calculate yearly price (20% discount)
  const getPrice = (price) => {
    if (billingCycle === "yearly") {
      return price * 12 * 0.8; // 20% discount
    }
    return price;
  };

  const getPlanIcon = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes("basic")) return <User className="h-8 w-8" />;
    if (name.includes("pro")) return <Crown className="h-8 w-8" />;
    if (name.includes("premium")) return <Rocket className="h-8 w-8" />;
    if (name.includes("enterprise")) return <Award className="h-8 w-8" />;
    return <Sparkles className="h-8 w-8" />;
  };

  const getPlanColor = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes("basic")) return {
      gradient: "from-gray-500 to-gray-600",
      light: "from-gray-50 to-gray-100",
      border: "border-gray-200",
      text: "text-gray-700",
      badge: "bg-gray-100 text-gray-700"
    };
    if (name.includes("pro")) return {
      gradient: "from-purple-500 to-purple-600",
      light: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      text: "text-purple-700",
      badge: "bg-purple-100 text-purple-700"
    };
    if (name.includes("premium")) return {
      gradient: "from-yellow-500 to-yellow-600",
      light: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      text: "text-yellow-700",
      badge: "bg-yellow-100 text-yellow-700"
    };
    if (name.includes("enterprise")) return {
      gradient: "from-blue-500 to-blue-600",
      light: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700"
    };
    return {
      gradient: "from-gray-500 to-gray-600",
      light: "from-gray-50 to-gray-100",
      border: "border-gray-200",
      text: "text-gray-700",
      badge: "bg-gray-100 text-gray-700"
    };
  };

  const popularPlan = "pro"; // Mark 'pro' as popular

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-200 dark:border-purple-800 mb-4">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">UPGRADE PLAN</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Choose Your Perfect Plan
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock premium features and take your legal practice to the next level.
            Select the plan that best fits your needs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-1 border border-gray-200 dark:border-gray-700 inline-flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span>Yearly</span>
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const colors = getPlanColor(plan.name);
            const isPopular = plan.name.toLowerCase().includes(popularPlan);
            const isHovered = hoveredPlan === plan._id;
            const yearlyPrice = getPrice(plan.price);
            const monthlyEquivalent = billingCycle === "yearly" ? (yearlyPrice / 12).toFixed(0) : null;

            return (
              <div
                key={plan._id}
                onMouseEnter={() => setHoveredPlan(plan._id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`
                  group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                  rounded-3xl border-2 transition-all duration-300 overflow-hidden
                  ${isPopular 
                    ? 'border-purple-400 dark:border-purple-600 shadow-2xl scale-105 lg:scale-110 z-10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }
                  ${isHovered ? 'shadow-2xl' : 'shadow-xl'}
                `}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="relative">
                      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                        <div className="absolute transform rotate-45 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold py-1 right-[-35px] top-[32px] w-[170px] text-center shadow-lg">
                          MOST POPULAR
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Header Gradient */}
                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>

                {/* Plan Content */}
                <div className="p-8">
                  {/* Plan Icon & Name */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-lg`}>
                      {getPlanIcon(plan.name)}
                    </div>
                    {plan.price === 0 ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Free
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                        Paid
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    {plan.price === 0 ? (
                      <div className="flex items-end">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">Free</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-end">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            ₹{yearlyPrice}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2 mb-1">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        {billingCycle === "yearly" && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            ₹{monthlyEquivalent}/month equivalent
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Features List */}
                  {plan.features && plan.features.length > 0 && (
                    <div className="space-y-3 mb-8">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        What's included:
                      </p>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  {plan.price > 0 ? (
                    <button
                      onClick={() => handleUpgrade(plan)}
                      disabled={loadingPlanId === plan._id}
                      className={`
                        w-full py-4 rounded-xl text-white font-medium transition-all duration-200
                        flex items-center justify-center space-x-2
                        bg-gradient-to-r ${colors.gradient}
                        hover:shadow-xl hover:scale-105
                        ${loadingPlanId === plan._id ? 'opacity-75 cursor-not-allowed' : ''}
                      `}
                    >
                      {loadingPlanId === plan._id ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Upgrade Now</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-medium cursor-not-allowed border border-gray-200 dark:border-gray-600"
                    >
                      Current Plan
                    </button>
                  )}

                  {/* Guarantee */}
                  {plan.price > 0 && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                      30-day money-back guarantee • Cancel anytime
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Compare All Features
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              See what each plan includes and choose the best fit for your practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Client Communication</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unlimited chats with clients</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Document Management</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload and process documents</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Case Management</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track all your cases</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Event Scheduling</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage court dates and meetings</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Shield className="h-5 w-5 text-purple-500 mr-2" />
                Can I change plans later?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Clock className="h-5 w-5 text-purple-500 mr-2" />
                Is there a free trial?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All paid plans come with a 30-day money-back guarantee. Try risk-free and see if it works for you.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Users className="h-5 w-5 text-purple-500 mr-2" />
                Can I add team members?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enterprise plans include multi-user access. Contact us for custom team pricing.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Lock className="h-5 w-5 text-purple-500 mr-2" />
                Is my data secure?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We use enterprise-grade encryption to protect your data. All plans include bank-level security.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-70">
          <img src="/api/placeholder/120/40" alt="Secure" className="h-8 grayscale" />
          <img src="/api/placeholder/120/40" alt="Encrypted" className="h-8 grayscale" />
          <img src="/api/placeholder/120/40" alt="Trusted" className="h-8 grayscale" />
          <img src="/api/placeholder/120/40" alt="Guaranteed" className="h-8 grayscale" />
        </div>
      </div>
    </div>
  );
}

// Helper component for User icon if not imported
const User = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);