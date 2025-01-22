import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AppointmentConfirmation() {
  const router = useRouter();
  const { query } = router;

  // Example appointment details (in a real app, this would come from your backend)
  const appointmentDetails = {
    appointmentId: 'APT' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    patientName: query.firstName ? `${query.firstName} ${query.lastName}` : 'John Doe',
    date: query.preferredDate || '2025-01-05',
    time: query.preferredTime || 'Morning (9:00 AM - 12:00 PM)',
    doctor: query.doctorPreference || 'Dr. Smith',
    type: query.appointmentType || 'General Consultation',
  };

  useEffect(() => {
    // You could trigger a confirmation email here
    console.log('Sending confirmation email...');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Appointment Confirmed - Dr. Smith's Clinic</title>
        <meta name="description" content="Appointment confirmation" />
      </Head>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-50 border-b border-green-100 p-6">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="22" strokeWidth="2" strokeLinecap="round" />
                  <path strokeWidth="2" strokeLinecap="round" d="M16 24l6 6 12-12" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-green-800">
                  Appointment Confirmed!
                </h1>
                <p className="text-green-600">
                  Your appointment has been successfully scheduled
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Appointment ID</p>
                  <p className="text-sm font-medium text-gray-900">{appointmentDetails.appointmentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="text-sm font-medium text-gray-900">{appointmentDetails.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">{appointmentDetails.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">{appointmentDetails.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="text-sm font-medium text-gray-900">{appointmentDetails.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">{appointmentDetails.type}</p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h2>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-2">
                  <li>Please arrive 15 minutes before your scheduled appointment time</li>
                  <li>Bring a valid ID and your insurance card</li>
                  <li>If you need to cancel or reschedule, please do so at least 24 hours in advance</li>
                  <li>Wear a mask during your visit</li>
                  <li>A confirmation email has been sent to your registered email address</li>
                </ul>
              </div>
            </div>

            {/* What to Bring */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What to Bring</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Government-issued photo ID</li>
                  <li>Insurance card (if applicable)</li>
                  <li>List of current medications</li>
                  <li>Medical history records</li>
                  <li>Payment method for co-pay or self-pay</li>
                </ul>
              </div>
            </div>

            {/* Location and Contact */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location & Contact</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Dr. Smith's Clinic</p>
                  <p>123 Medical Center Drive</p>
                  <p>Suite 456</p>
                  <p>City, State 12345</p>
                  <p className="mt-2">Phone: (555) 123-4567</p>
                  <p>Email: appointments@drsmith.com</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/dashboard"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Print Confirmation
              </button>
            </div>
          </div>
        </div>

        {/* Additional Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{' '}
            <a href="tel:555-123-4567" className="text-blue-600 hover:text-blue-500">
              (555) 123-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
