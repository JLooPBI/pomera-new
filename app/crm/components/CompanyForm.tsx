"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomTooltip from '@/components/ui/custom-tooltip';
import { crmDatabase, type Company, type DimensionValue, type CompanyAddress, type CompanyContact } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';
import { ChevronDown, ChevronRight } from 'lucide-react';
import AddressesSection from './AddressesSection';
import ContactsSection from './ContactsSection';

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
  const [addresses, setAddresses] = useState<CompanyAddress[]>([]);
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    companyInfo: true,
    address: false,
    primaryContact: false,
    leadData: false,
    staffingNeeds: false
  });
  
  // Form state with ALL fields
  const [formData, setFormData] = useState({
    // Company Info
    company_name: '',
    industry: '',
    company_size: '',
    annual_revenue: '',
    company_website: '',
    tin: '',
    
    // Lead Info
    company_status: '',
    lead_source: '',
    lead_score: '',
    expected_close_date: '',
    opportunity_value: 0,
    
    // Staffing Needs
    staffing_needs_overview: '',
    immediate_positions: 0,
    annual_positions: 0,
    position_type: '',
    additional_staffing_details: '',
    ...initialData
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    console.log('Toggling section:', section);
    setExpandedSections(prev => {
      const newState = {
        ...prev,
        [section]: !prev[section]
      };
      console.log('New expanded state:', newState);
      return newState;
    });
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



  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Standard handling for fields
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
      
      console.log('Submitting company data:', companyData);
      
      let result;
      if (isEditMode && initialData.company_id) {
        result = await crmDatabase.updateCompany(initialData.company_id, companyData);
      } else {
        result = await crmDatabase.createCompany(companyData);
      }

      console.log('Company creation result:', result);

      if (result && result.company_id) {
        // If this is a new company, save addresses and contacts
        if (!isEditMode && result.company_id) {
          console.log('Saving addresses and contacts for new company:', result.company_id);
          console.log('Addresses to save:', addresses);
          console.log('Contacts to save:', contacts);
          
          // Save addresses (only if there are any)
          if (addresses.length > 0) {
            for (const address of addresses) {
              try {
                // Remove temporary ID and set the real company_id
                const { address_id, ...addressData } = address;
                console.log('Saving address:', addressData);
                const savedAddress = await crmDatabase.createAddress({
                  ...addressData,
                  company_id: result.company_id
                });
                console.log('Address saved successfully:', savedAddress);
              } catch (error) {
                console.error('Error saving address:', error);
                toast.error('Some addresses could not be saved');
              }
            }
          }
          
          // Save contacts (only if there are any)
          if (contacts.length > 0) {
            for (const contact of contacts) {
              try {
                // Remove temporary ID and set the real company_id
                const { contact_id, ...contactData } = contact;
                console.log('Saving contact:', contactData);
                const savedContact = await crmDatabase.createContact({
                  ...contactData,
                  company_id: result.company_id
                });
                console.log('Contact saved successfully:', savedContact);
              } catch (error) {
                console.error('Error saving contact:', error);
                toast.error('Some contacts could not be saved');
              }
            }
          }
        }
        
        const successMessage = isEditMode ? 'Company updated successfully!' : 'Company added successfully!';
        toast.success(successMessage);
        onSuccess(result);
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
        <div className="mb-6 border rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('companyInfo')}
            className="w-full px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-t-lg cursor-pointer transition-colors border border-gray-200 hover:border-gray-300"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">Company Information</h4>
              <span className="text-xs text-gray-500">(click to expand/collapse)</span>
            </div>
            {expandedSections.companyInfo ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          {expandedSections.companyInfo && (
            <div className="p-4 space-y-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TIN (Tax ID)</label>
                  <Input
                    name="tin"
                    value={formData.tin}
                    onChange={handleInputChange}
                    placeholder="XX-XXXXXXX"
                  />
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
          )}
        </div>

        {/* Addresses Section */}
        <div className="mb-6 border rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('address')}
            className="w-full px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-t-lg cursor-pointer transition-colors border border-gray-200 hover:border-gray-300"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">Addresses/Locations</h4>
              <span className="text-xs text-gray-500">(click to expand/collapse)</span>
            </div>
            {expandedSections.address ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          {expandedSections.address && (
            <div className="p-4">
              <AddressesSection
                companyId={isEditMode && initialData.company_id ? initialData.company_id : ''}
                addresses={addresses}
                addressTypes={dimensions.addressTypes}
                onAddressesChange={setAddresses}
                saving={saving}
                isNewCompany={!isEditMode}
              />
            </div>
          )}
        </div>

        {/* Contacts Section */}
        <div className="mb-6 border rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('primaryContact')}
            className="w-full px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-t-lg cursor-pointer transition-colors border border-gray-200 hover:border-gray-300"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">Contacts</h4>
              <span className="text-xs text-gray-500">(click to expand/collapse)</span>
            </div>
            {expandedSections.primaryContact ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          {expandedSections.primaryContact && (
            <div className="p-4">
              <ContactsSection
                companyId={isEditMode && initialData.company_id ? initialData.company_id : ''}
                contacts={contacts}
                contactTypes={dimensions.contactTypes}
                contactMethods={dimensions.contactMethods}
                onContactsChange={setContacts}
                saving={saving}
                isNewCompany={!isEditMode}
              />
            </div>
          )}
        </div>

        {/* Lead Data Section */}
        <div className="mb-6 border rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('leadData')}
            className="w-full px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-t-lg cursor-pointer transition-colors border border-gray-200 hover:border-gray-300"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">Lead Data</h4>
              <span className="text-xs text-gray-500">(click to expand/collapse)</span>
            </div>
            {expandedSections.leadData ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          {expandedSections.leadData && (
            <div className="p-4 space-y-4">
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
                    <option value="">Select lead score</option>
                    {dimensions.scores.map(score => (
                      <option key={score.id} value={score.name}>{score.name}</option>
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
                  <div className="flex items-start gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700 mt-0.5">
                      Opportunity Value
                    </label>
                    <CustomTooltip content="Enter amount in USD, ex: 5,000" />
                  </div>
                  <Input
                    name="opportunity_value"
                    type="text"
                    value={formData.opportunity_value === 0 ? '' : formatCurrency(formData.opportunity_value)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[$,]/g, '');
                      const numValue = value === '' ? 0 : parseInt(value, 10);
                      if (!isNaN(numValue) && numValue >= 0) {
                        setFormData(prev => ({ ...prev, opportunity_value: numValue }));
                      }
                    }}
                    placeholder="Estimated Opportunity Size"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Staffing Needs Section */}
        <div className="mb-6 border rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('staffingNeeds')}
            className="w-full px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-t-lg cursor-pointer transition-colors border border-gray-200 hover:border-gray-300"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">Staffing Needs</h4>
              <span className="text-xs text-gray-500">(click to expand/collapse)</span>
            </div>
            {expandedSections.staffingNeeds ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          {expandedSections.staffingNeeds && (
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staffing Needs Overview</label>
                <textarea
                  name="staffing_needs_overview"
                  value={formData.staffing_needs_overview}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Describe the overall staffing needs..."
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
                    placeholder="0"
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
                    placeholder="0"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Staffing Details</label>
                <textarea
                  name="additional_staffing_details"
                  value={formData.additional_staffing_details}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Any additional details about staffing requirements..."
                />
              </div>
            </div>
          )}
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
