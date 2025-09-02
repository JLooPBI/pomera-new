"use client"

import { Button } from '@/components/ui/button';
import { Eye, Edit, Mail, Phone, MapPin } from 'lucide-react';
import { type Company, type DimensionValue } from '@/lib/supabase-crm';

interface CompanyListProps {
  companies: Company[];
  loading: boolean;
  activeTab: string;
  onViewLead: (company: Company) => void;
  onEditLead: (company: Company) => void;
  dimensions: {
    scores: DimensionValue[];
  };
}

export default function CompanyList({ 
  companies, 
  loading, 
  activeTab, 
  onViewLead, 
  onEditLead,
  dimensions 
}: CompanyListProps) {
  const getStatusColor = (status: string) => {
    const statusObj = dimensions.statuses.find(s => 
      s.name.toLowerCase() === status?.toLowerCase() ||
      s.name.toLowerCase().includes(status?.toLowerCase() || '') ||
      status?.toLowerCase().includes(s.name.toLowerCase())
    );
    if (statusObj?.color) {
      // Map color names to Tailwind classes - completely dynamic
      const colorMap: { [key: string]: string } = {
        'red': 'bg-red-100 text-red-800',
        'orange': 'bg-orange-100 text-orange-800',
        'blue': 'bg-blue-100 text-blue-800',
        'green': 'bg-green-100 text-green-800',
        'yellow': 'bg-yellow-100 text-yellow-800',
        'purple': 'bg-purple-100 text-purple-800',
        'pink': 'bg-pink-100 text-pink-800',
        'grey': 'bg-gray-100 text-gray-800',
        'gray': 'bg-gray-100 text-gray-800',
        'black': 'bg-black text-white',
        'white': 'bg-white text-black'
      };
      return colorMap[statusObj.color.toLowerCase()] || 'bg-gray-100 text-gray-800';
    }
    // If no color in dimension table, use default
    return 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: string) => {
    const scoreObj = dimensions.scores.find(s => 
      s.name.toLowerCase() === score?.toLowerCase() ||
      s.name.toLowerCase().includes(score?.toLowerCase() || '') ||
      score?.toLowerCase().includes(s.name.toLowerCase())
    );
    if (scoreObj?.color) {
      // Map color names to Tailwind classes - completely dynamic
      const colorMap: { [key: string]: string } = {
        'red': 'text-red-600',
        'orange': 'text-orange-600',
        'blue': 'text-blue-600',
        'green': 'text-green-600',
        'yellow': 'text-yellow-600',
        'purple': 'text-purple-600',
        'pink': 'text-pink-600',
        'grey': 'text-gray-600',
        'gray': 'text-gray-600',
        'black': 'text-black',
        'white': 'text-white'
      };
      return colorMap[scoreObj.color.toLowerCase()] || 'text-gray-600';
    }
    // If no color in dimension table, use default
    return 'text-gray-600';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {activeTab} found. Add your first company to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <div key={company.company_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{company.company_name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(company.company_status)}`}>
                  {company.company_status}
                </span>
                {company.lead_score && (
                  <span className={`text-sm font-medium ${getScoreColor(company.lead_score)}`}>
                    {dimensions.scores.find(s => 
                      s.name.toLowerCase() === company.lead_score?.toLowerCase() ||
                      s.name.toLowerCase().includes(company.lead_score?.toLowerCase() || '') ||
                      company.lead_score?.toLowerCase().includes(s.name.toLowerCase())
                    )?.name || company.lead_score}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {company.contact_email || 'No email'}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {company.contact_phone || 'No phone'}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {company.city && company.state ? `${company.city}, ${company.state}` : 'No location'}
                </div>
              </div>
              {company.opportunity_value && company.opportunity_value > 0 && (
                <p className="mt-2 text-sm font-medium text-green-600">
                  Opportunity: {formatCurrency(company.opportunity_value)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewLead(company)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditLead(company)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
