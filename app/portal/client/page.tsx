"use client"

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ClientPortalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Client Portal</h1>
          <p className="text-gray-600">Welcome to the Client Portal. This section is under construction.</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Submit Job Requirements</h2>
              <p className="text-gray-600">Post new job openings and requirements.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">View Applications</h2>
              <p className="text-gray-600">Review candidate applications for your positions.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Purchase Services</h2>
              <p className="text-gray-600">Browse and purchase recruitment services.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Track Progress</h2>
              <p className="text-gray-600">Monitor the status of your job postings.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}