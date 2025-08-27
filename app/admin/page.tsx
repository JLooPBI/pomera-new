"use client"

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">System administration and user management.</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">User Management</h2>
              <p className="text-gray-600">Manage user accounts and permissions.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">System Settings</h2>
              <p className="text-gray-600">Configure system-wide settings.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Reports</h2>
              <p className="text-gray-600">View system reports and analytics.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Invite Users</h2>
              <p className="text-gray-600">Send invitations to new users.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Audit Logs</h2>
              <p className="text-gray-600">Review system activity logs.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Backup & Restore</h2>
              <p className="text-gray-600">Manage data backups.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}