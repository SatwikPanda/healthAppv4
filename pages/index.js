import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dr. Smith - Professional Healthcare</title>
        <meta name="description" content="Book an appointment with Dr. Smith" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Dr. Smith</span>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#services" className="text-gray-600 hover:text-gray-900">Services</a>
              <Link href="/check-appointment" className="text-gray-600 hover:text-gray-900">
                Check Appointment
              </Link>
              <Link href="/book-appointment" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Your Health is Our</span>
                    <span className="block text-blue-600">Top Priority</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    With over 15 years of experience, Dr. Smith provides comprehensive healthcare services
                    with a focus on patient comfort and well-being.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link href="/book-appointment"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              alt="Doctor's office"
            />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-blue-600">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">15+</div>
                <div className="mt-2 text-sm font-medium text-blue-100">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">10k+</div>
                <div className="mt-2 text-sm font-medium text-blue-100">Patients Treated</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">4.9</div>
                <div className="mt-2 text-sm font-medium text-blue-100">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">24/7</div>
                <div className="mt-2 text-sm font-medium text-blue-100">Emergency Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Services</h2>
              <p className="mt-4 text-xl text-gray-500">Comprehensive healthcare solutions for you and your family</p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'General Check-ups',
                  description: 'Regular health check-ups and preventive care services',
                  icon: '🏥',
                },
                {
                  title: 'Specialized Care',
                  description: 'Expert treatment for specific health conditions',
                  icon: '👨‍⚕️',
                },
                {
                  title: 'Lab Services',
                  description: 'Comprehensive laboratory testing and diagnostics',
                  icon: '🔬',
                },
                {
                  title: 'Vaccinations',
                  description: 'Full range of vaccines for all age groups',
                  icon: '💉',
                },
                {
                  title: 'Telemedicine',
                  description: 'Virtual consultations for your convenience',
                  icon: '📱',
                },
                {
                  title: 'Emergency Care',
                  description: '24/7 emergency medical services',
                  icon: '🚑',
                },
              ].map((service) => (
                <div key={service.title} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-gray-500">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  About Dr. Smith
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Dr. Sarah Smith is a board-certified physician with over 15 years of experience in general medicine. 
                  She completed her medical degree at Harvard Medical School and residency at Johns Hopkins Hospital.
                </p>
                <p className="mt-4 text-lg text-gray-500">
                  Her approach to healthcare combines traditional medical expertise with modern technology, 
                  ensuring that each patient receives personalized care tailored to their specific needs.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Board Certified in Internal Medicine</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Member of American Medical Association</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Certified in Telemedicine</span>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:mt-0">
                <img
                  className="rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Dr. Smith"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
                <div className="text-gray-300 space-y-2">
                  <p>123 Medical Center Drive</p>
                  <p>Silicon Valley, CA 94025</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Email: info@drsmith.com</p>
                </div>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold mb-4">Office Hours</h3>
                <div className="text-gray-300 space-y-2">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p>Emergency: 24/7</p>
                </div>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/book-appointment" className="block text-gray-300 hover:text-white">
                    Book Appointment
                  </Link>
                  <Link href="/check-appointment" className="block text-gray-300 hover:text-white">
                    Check Appointment
                  </Link>
                  <a href="#services" className="block text-gray-300 hover:text-white">
                    Services
                  </a>
                  <a href="#about" className="block text-gray-300 hover:text-white">
                    About Us
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-300"> 2025 Dr. Smith Medical Practice. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
