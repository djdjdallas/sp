import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const metadata = {
  title: "Pricing - SideBuilds",
  description: "Simple, transparent pricing for all your side project needs",
};

const pricingPlans = [
  {
    name: "Free",
    description: "For indie makers just getting started",
    price: "$0",
    billing: "forever",
    features: [
      "Up to 3 projects",
      "Basic metrics tracking",
      "Task management",
      "Public project profiles",
    ],
    button: {
      text: "Get Started",
      href: "/register",
      variant: "outline",
    },
  },
  {
    name: "Pro",
    description: "For serious side project builders",
    price: "$12",
    billing: "per month",
    popular: true,
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
      href: "/register?plan=pro",
      variant: "default",
    },
  },
  {
    name: "Team",
    description: "For small teams working on multiple projects",
    price: "$29",
    billing: "per month",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Team collaboration tools",
      "Project permissions",
      "Enhanced security",
      "Audit logs",
      "Dedicated support",
    ],
    button: {
      text: "Contact Sales",
      href: "/contact",
      variant: "outline",
    },
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl mt-4 text-muted-foreground max-w-2xl">
          Choose the perfect plan for your side project journey. No hidden fees,
          cancel anytime.
        </p>
      </div>

      {/* Pricing Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col p-8 rounded-lg border ${
              plan.popular ? "border-primary shadow-lg" : "border-border"
            }`}
          >
            {plan.popular && (
              <div className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-full w-fit mb-4">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              {plan.description}
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground ml-2">{plan.billing}</span>
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

      {/* FAQ Section */}
      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Can I upgrade or downgrade my plan at any time?
            </h3>
            <p className="text-muted-foreground">
              Yes, you can change your plan at any time. If you upgrade, the new
              features will be available immediately. If you downgrade, the
              changes will take effect at the end of your current billing cycle.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Is there a free trial for paid plans?
            </h3>
            <p className="text-muted-foreground">
              All paid plans come with a 14-day free trial, no credit card
              required. You can test all the features before committing to a
              subscription.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              What happens to my projects if I cancel my subscription?
            </h3>
            <p className="text-muted-foreground">
              If you cancel your subscription, your account will revert to the
              Free plan at the end of your billing cycle. You'll still have
              access to your projects, but with limited features. No data is
              deleted.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Do you offer discounts for yearly subscriptions?
            </h3>
            <p className="text-muted-foreground">
              Yes, we offer a 20% discount when you choose annual billing for
              any of our paid plans. This option is available during checkout.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-muted-foreground">
              We accept all major credit cards (Visa, Mastercard, American
              Express) and PayPal. All payments are securely processed through
              Stripe.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-muted-foreground">
              If you're not satisfied with your subscription within the first 30
              days, contact our support team for a full refund. After 30 days,
              we offer prorated refunds for the unused portion of your
              subscription.
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
