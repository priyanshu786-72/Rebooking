import { Train, Shield, IndianRupee, Clock, CheckCircle, ArrowRight, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Train className="size-8 text-blue-600" />
            <span className="font-bold text-2xl text-gray-900">TicketShare</span>
          </div>
          <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
            Get Started
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
            🚂 Revolutionary Ticket Sharing Platform
          </div>
          <h1 className="mb-6 text-gray-900">
            Turn Your Unused Train Tickets Into Cash
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Missed your train? Don't let your ticket go to waste. Upload it on TicketShare 
            and help fellow travelers while earning money legally.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
            >
              Start Sharing Tickets
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={onGetStarted}
              className="text-lg px-8"
            >
              Browse Available Tickets
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 text-center border-2">
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Tickets Shared</div>
            </Card>
            <Card className="p-6 text-center border-2">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Happy Users</div>
            </Card>
            <Card className="p-6 text-center border-2">
              <div className="text-4xl font-bold text-blue-600 mb-2">₹50K+</div>
              <div className="text-gray-600">Money Saved</div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-4 text-gray-900">How TicketShare Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Simple, secure, and legal way to share unused train tickets
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Sellers */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <IndianRupee className="size-5 text-blue-600" />
                </div>
                <h3 className="text-gray-900">For Ticket Owners (Sellers)</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Upload Your Ticket</h4>
                    <p className="text-gray-600">Enter PNR details and set your price</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Admin Verification</h4>
                    <p className="text-gray-600">We verify your ticket authenticity</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Get Paid</h4>
                    <p className="text-gray-600">Receive payment when ticket is sold</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Buyers */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Train className="size-5 text-green-600" />
                </div>
                <h3 className="text-gray-900">For Travelers (Buyers)</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Search Tickets</h4>
                    <p className="text-gray-600">Find tickets for your route and date</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Add Your Details</h4>
                    <p className="text-gray-600">Enter passenger information and pay</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Travel Legally</h4>
                    <p className="text-gray-600">Use the PNR for your journey</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-4 text-gray-900">Why Choose TicketShare?</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Safe, secure, and beneficial for everyone
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 border-2 hover:border-blue-300 transition-colors bg-white">
              <div className="size-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="size-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-gray-900">100% Legal & Safe</h3>
              <p className="text-gray-600">
                All tickets are verified by our admin team before listing
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-blue-300 transition-colors bg-white">
              <div className="size-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <IndianRupee className="size-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-gray-900">Save Money</h3>
              <p className="text-gray-600">
                Get train tickets at reduced prices and travel affordably
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-blue-300 transition-colors bg-white">
              <div className="size-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Clock className="size-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-gray-900">Quick Process</h3>
              <p className="text-gray-600">
                Upload or buy tickets in minutes with our simple interface
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-blue-300 transition-colors bg-white">
              <div className="size-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <CheckCircle className="size-6 text-orange-600" />
              </div>
              <h3 className="mb-2 text-gray-900">Verified Tickets</h3>
              <p className="text-gray-600">
                Every ticket is checked for authenticity and validity
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-blue-300 transition-colors bg-white">
              <div className="size-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                <Users className="size-6 text-pink-600" />
              </div>
              <h3 className="mb-2 text-gray-900">Trusted Community</h3>
              <p className="text-gray-600">
                Join thousands of users who trust TicketShare
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-blue-300 transition-colors bg-white">
              <div className="size-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
                <Train className="size-6 text-cyan-600" />
              </div>
              <h3 className="mb-2 text-gray-900">All Routes Covered</h3>
              <p className="text-gray-600">
                Find tickets for popular routes across India
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join TicketShare today and be part of India's first ticket sharing community
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
          >
            Join TicketShare Now
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Train className="size-6 text-blue-400" />
                <span className="font-bold text-xl text-white">TicketShare</span>
              </div>
              <p className="text-sm">
                Making train travel accessible and affordable for everyone in India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>How It Works</li>
                <li>Safety & Security</li>
                <li>Pricing</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li>Disclaimer</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 TicketShare. All rights reserved. | Made with ❤️ for Indian Railways</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
