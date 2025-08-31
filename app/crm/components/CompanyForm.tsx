"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { crmDatabase, type Company, type DimensionValue } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';

interface CompanyFormProps {
  dimensions: {
    statuses: DimensionValue[];
    sources: DimensionValue[];
    scores: DimensionValue[];
    sizes: DimensionValue[];
    revenues: DimensionValue[];
    positionTypes: DimensionValue[];
    noteTypes: DimensionValue[];
    contactMethods: DimensionValue[];
    contactTypes: DimensionValue[];
    addressTypes: DimensionValue[];
    fileCategories: DimensionValue[];
    industries: DimensionValue[];
  };
  onSuccess: (company: Company) => void;
  onCancel: () => void;
  initialData?: Partial<Company>;
  isEditMode?: boolean;
}

export default function CompanyForm({ 
  dimensions, 
  onSuccess, 
  onCancel, 
  initialData = {}, 
  isEditMode = false 
}: CompanyFormProps) {
  const [saving, setSaving] = useState(false);
  
  // Form state with ALL fields
  const [formData, setFormData] = useState({
    // Company Info
    company_name: '',
    industry: '',
    company_size: '',
    annual_revenue: '',
    company_website: '',
    
    // Address fields
    street_number: '',
    street_name: '',
    apt_suite: '',
    city: '',
    state: '',
    zip_code: '',
    
    // Contact fields
    contact_first_name: '',
    contact_last_name: '',
    contact_job_title: '',
    contact_email: '',
    contact_phone: '',
    contact_mobile: '',
    preferred_contact_method: 'email',
    
    // Lead Info
    company_status: 'lead' as 'lead' | 'prospect' | 'client' | 'inactive',
    lead_source: '',
    lead_score: 'warm' as 'hot' | 'warm' | 'cold',
    expected_close_date: '',
    
    // Opportunity
    staffing_needs_overview: '',
    immediate_positions: 0,
    annual_positions: 0,
    opportunity_value: 0,
    position_names: '',
    position_type: '',
    additional_staffing_details: '',
    ...initialData
  });

  // Validation functions
  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const formatWebsiteUrl = (url: string): string => {
    if (!url) return url;
    
    // If it already has a protocol, return as is
    if (url.match(/^https?:\/\//)) {
      return url;
    }
    
    // If it starts with www., add https://
    if (url.match(/^www\./)) {
      return `https://${url}`;
    }
    
    // If it's just a domain, add https://
    if (url.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)) {
      return `https://${url}`;
    }
    
    // Return as is if it doesn't match any pattern
    return url;
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Apply formatting for phone numbers
    if (name === 'contact_phone' || name === 'contact_mobile') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
      return;
    }
    
    // Standard handling for other fields
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const validateForm = (): boolean => {
    // Required fields validation
    if (!formData.company_name) {
      toast.error('Company name is required');
      return false;
    }
    
    // Validate zip code if provided
    if (formData.zip_code && !validateZipCode(formData.zip_code)) {
      toast.error('Please enter a proper Zip code in format XXXXX or XXXXX-XXXX');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      // Format the website URL if provided
      const companyData = {
        ...formData,
        company_website: formData.company_website ? formatWebsiteUrl(formData.company_website) : formData.company_website
      };
      
      let result;
      if (isEditMode && initialData.company_id) {
        result = await crmDatabase.updateCompany(initialData.company_id, companyData);
      } else {
        result = await crmDatabase.createCompany(companyData);
      }

      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      if (result.data) {
        const successMessage = isEditMode ? 'Company updated successfully!' : 'Company added successfully!';
        toast.success(successMessage);
        onSuccess(result.data);
      }
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 border-b bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">
        {isEditMode ? 'Edit Company' : 'Add New Company'}
      </h3>
      <form onSubmit={handleSubmit}>
        {/* Company Information Section */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Company Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <Input
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select industry</option>
                {dimensions.industries.map(industry => (
                  <option key={industry.id} value={industry.name}>{industry.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
              <select
                name="company_size"
                value={formData.company_size}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select size</option>
                {dimensions.sizes.map(size => (
                  <option key={size.id} value={size.name}>{size.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue</label>
              <select
                name="annual_revenue"
                value={formData.annual_revenue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select revenue</option>
                {dimensions.revenues.map(rev => (
                  <option key={rev.id} value={rev.name}>{rev.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <Input
                name="company_website"
                value={formData.company_website}
                onChange={handleInputChange}
                type="text"
                placeholder="www.example.com or https://example.com"
              />
              {formData.company_website && (
                <p className="text-xs text-gray-500 mt-1">
                  Will be saved as: {formatWebsiteUrl(formData.company_website)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="street_number"
                placeholder="Number"
                value={formData.street_number}
                onChange={handleInputChange}
              />
              <Input
                name="street_name"
                placeholder="Street Name"
                value={formData.street_name}
                onChange={handleInputChange}
              />
            </div>
            <Input
              name="apt_suite"
              placeholder="Apt/Suite"
              value={formData.apt_suite}
              onChange={handleInputChange}
            />
            <Input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">State</option>
                {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <Input
                name="zip_code"
                placeholder="12345 or 12345-6789"
                pattern="[0-9]{5}(-[0-9]{4})?"
                value={formData.zip_code}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Primary Contact Section */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Primary Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="contact_first_name"
              placeholder="First Name"
              value={formData.contact_first_name}
              onChange={handleInputChange}
            />
            <Input
              name="contact_last_name"
              placeholder="Last Name"
              value={formData.contact_last_name}
              onChange={handleInputChange}
            />
            <Input
              name="contact_job_title"
              placeholder="Job Title"
              value={formData.contact_job_title}
              onChange={handleInputChange}
            />
            <Input
              name="contact_email"
              type="email"
              placeholder="email@company.com"
              value={formData.contact_email}
              onChange={handleInputChange}
            />
            <Input
              name="contact_phone"
              placeholder="(555) 123-4567"
              value={formData.contact_phone}
              onChange={handleInputChange}
            />
            <Input
              name="contact_mobile"
              placeholder="(555) 123-4567"
              value={formData.contact_mobile}
              onChange={handleInputChange}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
              <select
                name="preferred_contact_method"
                value={formData.preferred_contact_method}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {dimensions.contactMethods.map(method => (
                  <option key={method.id} value={method.name.toLowerCase()}>{method.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lead Information Section */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Lead Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
              <select
                name="lead_source"
                value={formData.lead_source}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select source</option>
                {dimensions.sources.map(source => (
                  <option key={source.id} value={source.name}>{source.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Score</label>
              <select
                name="lead_score"
                value={formData.lead_score}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {dimensions.scores.map(score => (
                  <option key={score.id} value={score.name.toLowerCase()}>{score.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
              <Input
                name="expected_close_date"
                type="date"
                value={formData.expected_close_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opportunity Value</label>
              <Input
                name="opportunity_value"
                type="number"
                value={formData.opportunity_value}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Staffing Needs Section */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Staffing Needs</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staffing Needs Overview</label>
              <textarea
                name="staffing_needs_overview"
                value={formData.staffing_needs_overview}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Immediate Positions</label>
                <Input
                  name="immediate_positions"
                  type="number"
                  value={formData.immediate_positions}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Positions</label>
                <Input
                  name="annual_positions"
                  type="number"
                  value={formData.annual_positions}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position Type</label>
                <select
                  name="position_type"
                  value={formData.position_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select type</option>
                  {dimensions.positionTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : (isEditMode ? 'Update Company' : 'Save Company')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
