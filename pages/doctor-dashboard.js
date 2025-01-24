import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DoctorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("appointments");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [leaveForm, setLeaveForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    type: "full", // full or half
    halfDayPeriod: "morning", // morning or afternoon
    notes: "",
  });

  const notifications = [
    {
      id: 1,
      type: "appointment",
      message:
        "New appointment request from Sarah Parker for tomorrow at 2:00 PM",
      time: "10 minutes ago",
      isRead: false,
    },
    {
      id: 2,
      type: "receptionist",
      message: "Receptionist rescheduled John Doe's appointment to next Monday",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: 3,
      type: "prescription",
      message: "Prescription refill request from Mike Johnson",
      time: "2 hours ago",
      isRead: true,
    },
  ];

  const [leaves, setLeaves] = useState([
    {
      id: 1,
      startDate: "2025-01-10",
      endDate: "2025-01-12",
      type: "full",
      reason: "Family vacation",
      status: "approved",
    },
    {
      id: 2,
      startDate: "2025-01-20",
      endDate: "2025-01-20",
      type: "half",
      halfDayPeriod: "morning",
      reason: "Personal appointment",
      status: "pending",
    },
  ]);

  const handleLogout = () => {
    router.push("/");
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    const newLeave = {
      id: leaves.length + 1,
      ...leaveForm,
      status: "pending",
    };
    setLeaves([...leaves, newLeave]);
    // Add to notifications for receptionist
    const notification = {
      id: Math.random().toString(36).substr(2, 9),
      type: "leave",
      message: `Dr. Smith has requested leave from ${leaveForm.startDate} to ${leaveForm.endDate}`,
      time: "Just now",
      isRead: false,
    };
    // In a real app, you would send this to your backend
    console.log("New leave notification:", notification);
    setShowLeaveModal(false);
    setLeaveForm({
      startDate: "",
      endDate: "",
      reason: "",
      type: "full",
      halfDayPeriod: "morning",
      notes: "",
    });
  };

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // Format today's date as YYYY-MM-DD

        const { data, error } = await supabase
          .from("patient_appointments")
          .select("*") // Replace with necessary columns
          .eq("preferredDate", today);

        if (error) {
          console.error("Error fetching today's appointments:", error.message);
          return;
        }

        setAppointments(data || []); // Update state with fetched appointments
      } catch (error) {
        console.error("Unexpected error fetching today's appointments:", error);
      }
    };

    if (activeTab === "appointments") {
      fetchTodayAppointments();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Doctor Dashboard - Dr. Smith</title>
        <meta name="description" content="Doctor's Dashboard" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                Doctor Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {notifications.filter((n) => !n.isRead).length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                  </div>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={
                            "px-4 py-3 hover:bg-gray-50 " +
                            (!notification.isRead ? "bg-blue-50" : "")
                          }
                        >
                          <p className="text-sm text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="space-y-4">
                <button
                  onClick={() => setActiveTab("appointments")}
                  className={
                    "w-full text-left px-4 py-2 rounded-md " +
                    (activeTab === "appointments"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50")
                  }
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab("patients")}
                  className={
                    "w-full text-left px-4 py-2 rounded-md " +
                    (activeTab === "patients"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50")
                  }
                >
                  Patient Records
                </button>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className={
                    "w-full text-left px-4 py-2 rounded-md " +
                    (activeTab === "schedule"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50")
                  }
                >
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab("prescriptions")}
                  className={
                    "w-full text-left px-4 py-2 rounded-md " +
                    (activeTab === "prescriptions"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50")
                  }
                >
                  Prescriptions
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={
                    "w-full text-left px-4 py-2 rounded-md " +
                    (activeTab === "notifications"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50")
                  }
                >
                  Notifications
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("leave")}
                  className={
                    "w-full text-left px-4 py-2 rounded-md " +
                    (activeTab === "leave"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50")
                  }
                >
                  Leave Management
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "appointments" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Today's Appointments</h2>
                <div className="space-y-4">
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 bg-white p-4 shadow rounded-r-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {appointment.firstName} {appointment.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.preferredTime} -{" "}
                              {appointment.appointmentType}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span
                              className={[
                                "px-2 py-1 text-xs font-semibold rounded-full",
                                appointment.status === "Confirmed" &&
                                  "text-green-800 bg-green-100",
                                appointment.status === "Rejected" &&
                                  "text-red-800 bg-red-100",
                                appointment.status === "Pending" &&
                                  "text-yellow-800 bg-yellow-100",
                                appointment.status === "In Progress" &&
                                  "text-blue-800 bg-blue-100",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            >
                                {appointment.status}
                            </span>

                            <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-md transition">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No appointments for today.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "patients" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Patient Records</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Age
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Last Visit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { name: "John Doe", age: 45, lastVisit: "2024-12-28" },
                        {
                          name: "Jane Smith",
                          age: 32,
                          lastVisit: "2024-12-30",
                        },
                        {
                          name: "Mike Johnson",
                          age: 28,
                          lastVisit: "2025-01-02",
                        },
                      ].map((patient, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {patient.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {patient.age}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {patient.lastVisit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-blue-600 hover:text-blue-800">
                              View Record
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Weekly Schedule</h2>
                <div className="grid grid-cols-4 gap-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div key={day} className="border rounded-lg p-4">
                        <h3 className="font-medium text-center mb-2">{day}</h3>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500">
                            9:00 AM - 5:00 PM
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-800 rounded p-1">
                            6 Appointments
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {activeTab === "prescriptions" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Recent Prescriptions</h2>
                <div className="space-y-4">
                  {[
                    {
                      patient: "John Doe",
                      date: "2025-01-04",
                      medication: "Amoxicillin 500mg",
                    },
                    {
                      patient: "Jane Smith",
                      date: "2025-01-03",
                      medication: "Ibuprofen 400mg",
                    },
                    {
                      patient: "Mike Johnson",
                      date: "2025-01-02",
                      medication: "Omeprazole 20mg",
                    },
                  ].map((prescription, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-green-500 bg-white p-4 shadow rounded-r-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{prescription.patient}</p>
                          <p className="text-sm text-gray-500">
                            {prescription.date}
                          </p>
                          <p className="text-sm text-gray-700">
                            {prescription.medication}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">All Notifications</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Mark all as read
                  </button>
                </div>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={
                        "p-4 rounded-lg border " +
                        (!notification.isRead
                          ? "bg-blue-50 border-blue-200"
                          : "border-gray-200")
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "leave" && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Leave Management</h2>
                  <button
                    onClick={() => setShowLeaveModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply for Leave
                  </button>
                </div>

                {/* Leave History */}
                <div className="space-y-4">
                  {leaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">
                              {leave.startDate === leave.endDate
                                ? leave.startDate
                                : `${leave.startDate} to ${leave.endDate}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {leave.reason}
                            </p>
                            {leave.type === "half" && (
                              <p className="text-sm text-gray-500">
                                Half day ({leave.halfDayPeriod})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={
                            "px-2 py-1 text-xs font-semibold rounded-full " +
                            (leave.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : leave.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800")
                          }
                        >
                          {leave.status.charAt(0).toUpperCase() +
                            leave.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Apply for Leave</h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Leave Type
                </label>
                <select
                  value={leaveForm.type}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, type: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="full">Full Day</option>
                  <option value="half">Half Day</option>
                </select>
              </div>

              {leaveForm.type === "half" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Period
                  </label>
                  <select
                    value={leaveForm.halfDayPeriod}
                    onChange={(e) =>
                      setLeaveForm({
                        ...leaveForm,
                        halfDayPeriod: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, startDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {leaveForm.type === "full" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) =>
                      setLeaveForm({ ...leaveForm, endDate: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, reason: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  value={leaveForm.notes}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, notes: e.target.value })
                  }
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
