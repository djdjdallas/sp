import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Features - SideBuilds",
  description: "Track, organize, and sell your side projects in one place",
};

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Powerful Features for Side Project Success
        </h1>
        <p className="text-xl mt-4 text-muted-foreground max-w-2xl">
          Everything you need to take your side projects from idea to launch and
          beyond.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 my-16">
        {/* Feature 1 */}
        <div className="flex flex-col items-start p-6 border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            {/* Icon placeholder */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Project Dashboard</h3>
          <p className="text-muted-foreground mb-4">
            Keep all your side projects organized in one place with an intuitive
            dashboard that gives you a bird's-eye view of your entire portfolio.
          </p>
          <ul className="space-y-2 text-sm mt-auto">
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Project status tracking
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Development stage indicators
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Recent activity tracking
            </li>
          </ul>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-start p-6 border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 20V10"></path>
              <path d="M18 20V4"></path>
              <path d="M6 20v-6"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Metric Tracking</h3>
          <p className="text-muted-foreground mb-4">
            Monitor the success of your projects with customizable metrics that
            help you understand your growth and impact.
          </p>
          <ul className="space-y-2 text-sm mt-auto">
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Revenue tracking
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              User growth statistics
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Custom metric support
            </li>
          </ul>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-start p-6 border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              <path d="m9 14 2 2 4-4"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Task Management</h3>
          <p className="text-muted-foreground mb-4">
            Keep your projects on track with built-in task management tools
            designed specifically for side projects.
          </p>
          <ul className="space-y-2 text-sm mt-auto">
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Project-specific task lists
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Due date tracking
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Status updates
            </li>
          </ul>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-start p-6 border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m16 10-4 4-4-4"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Public Profiles</h3>
          <p className="text-muted-foreground mb-4">
            Showcase your projects to the world with beautiful public profiles
            that highlight your achievements.
          </p>
          <ul className="space-y-2 text-sm mt-auto">
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Customizable project pages
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Shareable links
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Privacy controls
            </li>
          </ul>
        </div>

        {/* Feature 5 */}
        <div className="flex flex-col items-start p-6 border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
          <p className="text-muted-foreground mb-4">
            Buy and sell side projects in our dedicated marketplace, designed to
            help creators monetize their work.
          </p>
          <ul className="space-y-2 text-sm mt-auto">
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Secure transactions
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Project listings
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Buyer-seller messaging
            </li>
          </ul>
        </div>

        {/* Feature 6 */}
        <div className="flex flex-col items-start p-6 border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Integrations</h3>
          <p className="text-muted-foreground mb-4">
            Connect your projects with the tools you already use to streamline
            your workflow and save time.
          </p>
          <ul className="space-y-2 text-sm mt-auto">
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              GitHub repository sync
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Domain monitoring
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Analytics connection
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Supercharge Your Side Projects?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of creators who are using SideBuilds to track, grow,
          and monetize their side projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Get Started Free</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
