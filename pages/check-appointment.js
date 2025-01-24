import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function CheckAppointment() {
  const [reference, setReference] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reference === "doctor@123") {
      router.push("/doctor-dashboard");
    } else if (reference === "receptionist@123") {
      router.push("/receptionist-dashboard");
    } else {
      try {
        const { data, error } = await supabase.from("patient_appointments").select("status").eq("patientId", reference);

        if(error) {
          console.error("error fetching appointment status:", error.message);
          alert("Error fetching appointment status. Please try again.");
          return;
        }

        if(data && data.length > 0) {
          const appointmentStatus = data[0].status;

          if(appointmentStatus === "Pending") {
            alert("Appointment status: Pending");
          } else if(appointmentStatus === "Accepted") {
            alert("Appointment status: Accepted");
          } else if(appointmentStatus === "Rejected") {
            alert("Appointment status: Rejected");
          } else {
            alert("Appointment status: Unknown Status");
          }
        }

      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Check Appointment - Dr. Smith</title>
        <meta name="description" content="Check your appointment status" />
      </Head>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Dr. Smith
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Check Appointment Status
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="reference"
                className="block text-md font-medium text-gray-700"
              >
                Reference Number or Staff Login
              </label>
              <input
                type="text"
                name="reference"
                id="reference"
                required
                className="mt-1 block border w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter reference number or staff credentials"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Check Status
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
