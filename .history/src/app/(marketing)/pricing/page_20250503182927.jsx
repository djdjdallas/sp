import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const metadata = {
  title: "Pricing - SideBuilds",
  description: "Simple, transparent pricing for all your side project needs",
};

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Monthly",
      description: "Perfect for trying out SideBuilds",
      price: "$9",
      billing: "per month",
      features: [
        "Unlimited projects",
        "Advanced metrics & charts",
        "Custom domains",
        "API access",
        "Priority support",
        "Email notifications",
        "Marketplace access",
      ],
      button: {
        text: "Start Free Trial",
        href: "/auth/register?plan=monthly",
        variant: "default",
      },
    },
    {
      name: "Yearly",
      description: "Best value for serious builders",
      price: "$90",
      billing: "per year",
      popular: true,
      savings: "Save $18",
      features: [
        "Everything in Monthly",
        "Save 16.7% annually",
        "Priority feature requests",
        "Early access to new features",
        "Extended API limits",
      ],
      button: {
        text: "Start Free Trial",
        href: "/auth/register?plan=yearly",
        variant: "default",
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl mt-4 text-muted-foreground max-w-2xl">
          Start with our free plan, upgrade when you need more. No hidden fees,
          cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {/* Free Plan */}
        <div className="flex flex-col p-8 rounded-lg border border-border">
          <h3 className="text-2xl font-bold">Free</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Get started with the basics
          </p>
          <div className="mb-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground ml-2">forever</span>
          </div>

          <ul className="space-y-3 mb-8 flex-grow">
            {[
              "Up to 3 projects",
              "Basic metrics tracking",
              "Task management",
              "Public project profiles",
              "Community support",
            ].map((feature) => (
              <li key={feature} className="flex items-start">
                <Check
                  size={20}
                  className="mr-2 text-green-500 shrink-0 mt-0.5"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            variant="outline"
            size="lg"
            className="w-full mt-auto"
            asChild
          >
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>

        {/* Paid Plans */}
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col p-8 rounded-lg border ${
              plan.popular
                ? "border-primary shadow-lg relative"
                : "border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary py-2 text-sm font-medium text-primary-foreground text-center">
                Best Value
              </div>
            )}
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              {plan.description}
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground ml-2">{plan.billing}</span>
              {plan.savings && (
                <div className="mt-2">
                  <span className="inline-block px-2.5 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    {plan.savings}
                  </span>
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check
                    size={20}
                    className="mr-2 text-green-500 shrink-0 mt-0.5"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.button.variant}
              size="lg"
              className="w-full mt-auto"
              asChild
            >
              <Link href={plan.button.href}>{plan.button.text}</Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Social Proof */}
      <div className="text-center mb-16">
        <p className="text-lg text-muted-foreground">
          Trusted by <span className="font-semibold">500+</span> indie hackers
          and side project builders
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Do I need a credit card to start?
            </h3>
            <p className="text-muted-foreground">
              No! You can start with our free plan without any credit card. When
              you're ready to upgrade, you'll get a 14-day free trial of the
              paid features.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Can I switch between monthly and yearly billing?
            </h3>
            <p className="text-muted-foreground">
              Yes, you can switch between billing periods at any time. If you
              upgrade from monthly to yearly, we'll prorate the difference.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              What happens to my projects if I downgrade to free?
            </h3>
            <p className="text-muted-foreground">
              Your projects remain safe. If you have more than 3 projects,
              you'll need to archive some to stay within the free plan limits.
              All your data is preserved and becomes accessible again when you
              upgrade.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Is there a refund policy?
            </h3>
            <p className="text-muted-foreground">
              Yes! If you're not satisfied within the first 30 days, we'll give
              you a full refund, no questions asked.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Can I cancel my subscription anytime?
            </h3>
            <p className="text-muted-foreground">
              Absolutely. You can cancel your subscription at any time, and
              you'll continue to have access until the end of your billing
              period.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Do you offer discounts for students or non-profits?
            </h3>
            <p className="text-muted-foreground">
              Yes! We offer 50% off for students and non-profit organizations.
              Contact us with proof of eligibility to get your discount.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact our team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
