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
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: string) => {
    const scoreObj = dimensions.scores.find(s => s.name.toLowerCase() === score?.toLowerCase());
    if (scoreObj?.color) {
      return `text-${scoreObj.color}-600`;
    }
    switch (score?.toLowerCase()) {
      case 'hot': return 'text-red-600';
      case 'warm': return 'text-orange-600';
      case 'cold': return 'text-blue-600';
      default: return 'text-gray-600';
    }
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
                    {company.lead_score.toUpperCase()}
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
