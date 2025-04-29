import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us - SideBuilds",
  description:
    "Our mission is to help side project creators track, grow, and succeed with their passion projects",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Empowering the Makers and Creators
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          SideBuilds exists to help passionate creators turn their side projects
          into successful ventures. We provide the tools, community, and
          marketplace to make it happen.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4">
            <p>
              SideBuilds was founded in 2024 by a group of passionate makers who
              were frustrated by the lack of tools specifically designed for
              side project creators. We were juggling multiple projects,
              spreadsheets, and task management tools without a centralized way
              to track our progress.
            </p>
            <p>
              We believed that side projects deserve dedicated tools that
              understand the unique challenges of building something on the
              side. Whether you're working nights and weekends or dedicating a
              few hours each day, SideBuilds is designed to help you make
              measurable progress.
            </p>
            <p>
              Today, SideBuilds is used by thousands of creators around the
              world who are building, launching, and growing their passion
              projects. From simple weekend hacks to full-fledged startups,
              we're proud to be part of so many maker journeys.
            </p>
          </div>
        </div>
        <div className="relative h-80 w-full rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden">
          {/* Replace with actual image */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            [Team Photo Placeholder]
          </div>
        </div>
      </div>

      {/* Mission and Values Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Our Mission & Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Empower Makers</h3>
            <p className="text-muted-foreground">
              We believe everyone should have the tools and support to turn
              their ideas into reality. Our platform is designed to remove
              obstacles and help you focus on building.
            </p>
          </div>

          <div className="p-6 border rounded-lg">
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
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Celebrate Progress</h3>
            <p className="text-muted-foreground">
              Side projects are built in small steps over time. We help you
              track and celebrate every milestone, keeping you motivated
              throughout your journey.
            </p>
          </div>

          <div className="p-6 border rounded-lg">
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Foster Community</h3>
            <p className="text-muted-foreground">
              Building can be solitary, but it doesn't have to be. We're
              creating a supportive community of makers who share knowledge,
              provide feedback, and inspire each other.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Team Member 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 mb-4 overflow-hidden">
              {/* Replace with actual team member photo */}
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Photo
              </div>
            </div>
            <h3 className="text-lg font-semibold">Sarah Chen</h3>
            <p className="text-muted-foreground">Founder & CEO</p>
            <div className="flex gap-2 mt-2">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 mb-4 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Photo
              </div>
            </div>
            <h3 className="text-lg font-semibold">Miguel Rodriguez</h3>
            <p className="text-muted-foreground">CTO</p>
            <div className="flex gap-2 mt-2">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 mb-4 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Photo
              </div>
            </div>
            <h3 className="text-lg font-semibold">Alex Johnson</h3>
            <p className="text-muted-foreground">Head of Product</p>
            <div className="flex gap-2 mt-2">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 mb-4 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Photo
              </div>
            </div>
            <h3 className="text-lg font-semibold">Emma Patel</h3>
            <p className="text-muted-foreground">Head of Marketing</p>
            <div className="flex gap-2 mt-2">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-24 bg-muted py-16 px-4 sm:px-8 rounded-lg">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            SideBuilds in Numbers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">15,000+</p>
              <p className="text-muted-foreground">Active Users</p>
            </div>

            <div>
              <p className="text-4xl font-bold mb-2">32,000+</p>
              <p className="text-muted-foreground">Projects Tracked</p>
            </div>

            <div>
              <p className="text-4xl font-bold mb-2">$1.2M+</p>
              <p className="text-muted-foreground">Projects Sold</p>
            </div>

            <div>
              <p className="text-4xl font-bold mb-2">120+</p>
              <p className="text-muted-foreground">Countries</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          Join the SideBuilds Community
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Be part of a growing community of makers, creators, and entrepreneurs
          who are building amazing projects on the side.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Get Started Free</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
