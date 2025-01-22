import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ReceptionistDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('appointments');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'leave',
      message: 'Dr. Smith has requested leave from 2025-01-10 to 2025-01-12',
      time: '5 minutes ago',
      isRead: false,
      action: 'approve_leave',
      leaveId: 1
    },
    {
      id: 2,
      type: 'appointment',
      message: 'New online appointment booking from Emily Wilson',
      time: '30 minutes ago',
      isRead: false
    },
    {
      id: 3,
      type: 'leave',
      message: 'Dr. Smith has requested half-day leave on 2025-01-20 (Morning)',
      time: '1 hour ago',
      isRead: false,
      action: 'approve_leave',
      leaveId: 2
    },
    {
      id: 4,
      type: 'doctor',
      message: 'Dr. Smith added notes for patient Mike Johnson',
      time: '2 hours ago',
      isRead: true,
    },
  ]);

  const handleLogout = () => {
    router.push('/');
  };

  const handleLeaveAction = (notificationId, leaveId, action) => {
    // In a real app, you would make an API call to update the leave status
    console.log(`Leave ${leaveId} ${action}ed`);
    
    // Update the notification to mark it as read
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Receptionist Dashboard - Dr. Smith</title>
        <meta name="description" content="Receptionist's Dashboard" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Receptionist Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                  </div>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={"px-4 py-3 hover:bg-gray-50 " + (!notification.isRead ? "bg-blue-50" : "")}
                        >
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          {notification.action === 'approve_leave' && !notification.isRead && (
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={() => handleLeaveAction(notification.id, notification.leaveId, 'approve')}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs hover:bg-green-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleLeaveAction(notification.id, notification.leaveId, 'reject')}
                                className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs hover:bg-red-200"
                              >
                                Reject
                              </button>
                            </div>
                          )}
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
                  onClick={() => setActiveTab('appointments')}
                  className={"w-full text-left px-4 py-2 rounded-md " + 
                    (activeTab === 'appointments' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50')
                  }
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={"w-full text-left px-4 py-2 rounded-md " + 
                    (activeTab === 'schedule' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50')
                  }
                >
                  Schedule Management
                </button>
                <button
                  onClick={() => setActiveTab('patients')}
                  className={"w-full text-left px-4 py-2 rounded-md " + 
                    (activeTab === 'patients' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50')
                  }
                >
                  Patient Registration
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={"w-full text-left px-4 py-2 rounded-md " + 
                    (activeTab === 'billing' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50')
                  }
                >
                  Billing
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={"w-full text-left px-4 py-2 rounded-md " + 
                    (activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50')
                  }
                >
                  Notifications
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'appointments' && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Today's Appointments</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    New Appointment
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      name: 'John Doe',
                      time: '9:00 AM',
                      type: 'General Checkup',
                      status: 'Checked In',
                      statusColor: 'green',
                    },
                    {
                      name: 'Jane Smith',
                      time: '10:00 AM',
                      type: 'Follow-up',
                      status: 'Waiting',
                      statusColor: 'yellow',
                    },
                    {
                      name: 'Mike Johnson',
                      time: '11:30 AM',
                      type: 'Consultation',
                      status: 'Scheduled',
                      statusColor: 'blue',
                    },
                  ].map((appointment, index) => (
                    <div key={index} className="border-l-4 border-blue-500 bg-white p-4 shadow rounded-r-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{appointment.name}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.time} - {appointment.type}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={"px-2 py-1 text-xs font-semibold rounded-full " + 
                            "text-" + appointment.statusColor + "-800 bg-" + appointment.statusColor + "-100"
                          }>
                            {appointment.status}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800">Manage</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Schedule Management</h2>
                <div className="grid grid-cols-7 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="border rounded-lg p-4">
                      <h3 className="font-medium text-center mb-2">{day}</h3>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">9:00 AM - 5:00 PM</div>
                        <div className="text-xs bg-blue-100 text-blue-800 rounded p-1">
                          {Math.floor(Math.random() * 8)} Slots Available
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Patient Registration</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    New Patient
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input type="tel" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Register Patient
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Recent Billing</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { id: 'INV-001', patient: 'John Doe', amount: '$150', status: 'Paid' },
                        { id: 'INV-002', patient: 'Jane Smith', amount: '$200', status: 'Pending' },
                        { id: 'INV-003', patient: 'Mike Johnson', amount: '$175', status: 'Paid' },
                      ].map((invoice, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{invoice.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{invoice.patient}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{invoice.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={"px-2 py-1 text-xs font-semibold rounded-full " + 
                              (invoice.status === 'Paid' ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100')
                            }>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-blue-600 hover:text-blue-800">View Invoice</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
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
                      className={"p-4 rounded-lg border " + 
                        (!notification.isRead ? "bg-blue-50 border-blue-200" : "border-gray-200")
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
