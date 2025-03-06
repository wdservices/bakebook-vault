
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Mail, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">
              BakeBook
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-fade-in delay-100">
              Your Digital Recipe Companion for Perfect Baking Every Time
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-200">
              <Button asChild size="lg" className="gap-2">
                <Link to="/login">
                  <Download className="h-5 w-5" />
                  Sign Up Today
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-accent/5" id="about">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About BakeBook</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              BakeBook is the ultimate app for bakers who want to organize, store, and manage 
              their recipes digitally. Say goodbye to messy paper notes and hello to a seamless 
              baking experience. With BakeBook, you can easily store your recipes, track ingredients, 
              generate receipts, and access your favorite recipes anytime, anywhere. Whether 
              you're a home baker or a professional, BakeBook is designed to make your baking 
              journey easier and more enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose BakeBook?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CheckCircle />}
              title="Digital Recipe Storage"
              description="Store all your recipes in one place, organized and easily accessible."
            />
            <FeatureCard 
              icon={<Star />}
              title="Ingredient Tracking"
              description="Check off ingredients as you use them to stay organized during baking."
            />
            <FeatureCard 
              icon={<Download />}
              title="Receipt Generation"
              description="Create and export receipts in PDF format for your baking business."
            />
            <FeatureCard 
              icon={<Users />}
              title="User-Friendly Interface"
              description="Simple and intuitive design for bakers of all skill levels."
            />
            <FeatureCard 
              icon={<Star />}
              title="AI Recommendations"
              description="Get smart suggestions for baking times and temperatures."
            />
            <FeatureCard 
              icon={<Mail />}
              title="Cross-Device Access"
              description="Access your recipes from any device, anytime, anywhere."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-accent/5" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How BakeBook Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard 
              number="1"
              title="Sign Up"
              description="Create your account in seconds with just a few clicks."
            />
            <StepCard 
              number="2"
              title="Add Recipes"
              description="Input your recipes with ingredients, measurements, and baking instructions."
            />
            <StepCard 
              number="3"
              title="Bake with Ease"
              description="Use the app to track your progress and generate receipts."
            />
            <StepCard 
              number="4"
              title="Enjoy Baking"
              description="Access your recipes anytime, anywhere from any device."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TestimonialCard 
              quote="BakeBook has completely transformed how I manage my recipes. It's so easy to use!"
              author="Sarah, Home Baker"
            />
            <TestimonialCard 
              quote="The receipt feature is a game-changer for my bakery business."
              author="John, Professional Baker"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-accent/5" id="contact">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions about BakeBook? We'd love to hear from you!
            </p>
            <div className="flex justify-center items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:hello.wdservices@gmail.com" className="text-primary hover:underline">
                hello.wdservices@gmail.com
              </a>
            </div>
            <div className="mt-12">
              <Button asChild size="lg">
                <Link to="/login">
                  Sign Up Today
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BakeBook
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
              <a href="#about" className="text-muted-foreground hover:text-foreground">
                About
              </a>
              <a href="#features" className="text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">
                How It Works
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 BakeBook. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <Card className="border border-accent/20 hover:border-accent/50 transition-all">
      <CardContent className="pt-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

// Step Card Component
const StepCard = ({ number, title, description }: { 
  number: string; 
  title: string; 
  description: string; 
}) => {
  return (
    <div className="text-center">
      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ quote, author }: { 
  quote: string; 
  author: string;
}) => {
  return (
    <Card className="border border-accent/20">
      <CardContent className="pt-6">
        <blockquote className="text-lg italic mb-4">"{quote}"</blockquote>
        <p className="text-right text-muted-foreground">— {author}</p>
      </CardContent>
    </Card>
  );
};

export default Landing;
