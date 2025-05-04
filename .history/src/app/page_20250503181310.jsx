import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          SideBuilds
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          Less hassle, more hustle. Track, organize, and sell your side projects
          in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/auth/register">Get Started Free</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required • $9/month
        </p>

        <div className="mt-12 relative w-full max-w-4xl">
          <div className="bg-gradient-to-b from-primary/20 to-background p-4 rounded-lg shadow-lg">
            <Image
              src="/dashboard-preview.png"
              alt="SideBuilds dashboard preview"
              width={1200}
              height={675}
              className="rounded-md border shadow-sm"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need for Your Side Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From idea to launch and beyond, SideBuilds helps you manage every
            aspect of your side projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Your Projects</h3>
            <p className="text-muted-foreground">
              Keep all your side projects organized in one dashboard with
              progress tracking.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Measure Growth</h3>
            <p className="text-muted-foreground">
              Track key metrics like users, revenue, and traffic to see your
              projects' progress.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sell Your Projects</h3>
            <p className="text-muted-foreground">
              List your projects for sale in our marketplace and connect with
              potential buyers.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/50 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              SideBuilds makes it easy to manage all your side projects in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <ol className="space-y-8">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Create Your Project
                    </h3>
                    <p className="text-muted-foreground">
                      Add your side project details, stage, and links to get
                      started.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Track Your Progress
                    </h3>
                    <p className="text-muted-foreground">
                      Update metrics, add tasks, and see your project evolve
                      over time.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Share or Sell
                    </h3>
                    <p className="text-muted-foreground">
                      Make your project public to showcase your work, or list it
                      for sale.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-background p-4 rounded-lg shadow-lg border">
              <Image
                src="/project-detail.png"
                alt="Project detail view"
                width={600}
                height={400}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Builders Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of indie hackers and side project enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 mr-3"></div>
              <div>
                <h4 className="font-semibold">Alex Chen</h4>
                <p className="text-sm text-muted-foreground">Indie Hacker</p>
              </div>
            </div>
            <p className="italic">
              "SideBuilds has been a game-changer for keeping track of my three
              different projects. I can finally see all my metrics in one
              place!"
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 mr-3"></div>
              <div>
                <h4 className="font-semibold">Maria Lopez</h4>
                <p className="text-sm text-muted-foreground">
                  Developer & Creator
                </p>
              </div>
            </div>
            <p className="italic">
              "I sold my first side project through SideBuilds marketplace for
              $3,500. The process was smooth and secure!"
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 mr-3"></div>
              <div>
                <h4 className="font-semibold">James Wilson</h4>
                <p className="text-sm text-muted-foreground">
                  Product Designer
                </p>
              </div>
            </div>
            <p className="italic">
              "The dashboard keeps me accountable. I can see which projects are
              making progress and which ones need more attention."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to organize your side projects?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join SideBuilds today and take control of your project portfolio.
          </p>
          <Button asChild size="lg">
            <Link href="/auth/register">Get Started For Free</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. Free plan available.
          </p>
        </div>
      </section>
    </div>
  );
}
