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
              src="/assets/project-metrics.png"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10">
                  1
                </div>
                <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
                  <Image
                    src="/how-it-works/create-project.gif"
                    alt="Create your project animation"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Create Your Project
              </h3>
              <p className="text-muted-foreground">
                Add your side project details, stage, and links to get started.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10">
                  2
                </div>
                <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
                  <Image
                    src="/how-it-works/track-progress.gif"
                    alt="Track your progress animation"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Track Your Progress
              </h3>
              <p className="text-muted-foreground">
                Update metrics, add tasks, and see your project evolve over
                time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10">
                  3
                </div>
                <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
                  <Image
                    src="/how-it-works/share-sell.gif"
                    alt="Share or sell animation"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share or Sell</h3>
              <p className="text-muted-foreground">
                Make your project public to showcase your work, or list it for
                sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-muted/30 border rounded-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Why I Built SideBuilds
                </h2>
                <div className="space-y-4 text-lg">
                  <p>Hi, I'm Dominick! 👋</p>
                  <p>
                    Like many developers diving into the indie hacking world, I
                    found myself juggling multiple side projects. My ideas list
                    grew faster than I could build, and I started losing track
                    of which projects I was actually working on.
                  </p>
                  <p>
                    I needed a solution to organize my scattered projects, so I
                    built one. But then I realized - if I'm having this problem,
                    other indie developers probably are too.
                  </p>
                  <p>
                    That's how SideBuilds was born: a tool to help builders like
                    us stay organized, track progress, and even sell our
                    projects when they're ready. Along the way, we're building
                    an amazing community of creators who get it.
                  </p>
                  <div className="mt-8">
                    <Button asChild>
                      <Link href="/auth/register">Join Our Community</Link>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-2 border-primary/20">
                  <Image
                    src="/assets/dominick_avatar.jpg"
                    alt="Dominick - Founder of SideBuilds"
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6NTc4Pzs/OjdASUZFRkVHT0tPVlVWXVZfYWH/2wBDARUXFx4aHh4gICAhYTYxNmFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-16 md:py-24">
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
      </section> */}

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
