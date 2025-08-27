"use client"

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CandidatePortalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Candidate Portal</h1>
          <p className="text-gray-600">Welcome to the Candidate Portal. Find your next opportunity here.</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Browse Jobs</h2>
              <p className="text-gray-600">View all available positions.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Submit Application</h2>
              <p className="text-gray-600">Apply for positions that match your skills.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Upload Resume</h2>
              <p className="text-gray-600">Keep your resume and documents up to date.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Track Applications</h2>
              <p className="text-gray-600">Monitor the status of your applications.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}