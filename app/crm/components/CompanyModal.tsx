"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { type Company, type DimensionValue } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';
import NotesSection from './NotesSection';
import ContactsSection from './ContactsSection';
import AddressesSection from './AddressesSection';

interface CompanyModalProps {
  company: Company;
  isEditMode: boolean;
  onClose: () => void;
  onEditModeChange: (editMode: boolean) => void;
  onCompanyUpdate: (company: Company) => void;
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
  notes: any[];
  contacts: any[];
  addresses: any[];
  onNotesChange: (notes: any[]) => void;
  onContactsChange: (contacts: any[]) => void;
  onAddressesChange: (addresses: any[]) => void;
  onStatusChange: (status: Company['company_status']) => void;
  saving: boolean;
}

export default function CompanyModal({
  company,
  isEditMode,
  onClose,
  onEditModeChange,
  onCompanyUpdate,
  dimensions,
  notes,
  contacts,
  addresses,
  onNotesChange,
  onContactsChange,
  onAddressesChange,
  onStatusChange,
  saving
}: CompanyModalProps) {
  const [editFormData, setEditFormData] = useState<Partial<Company>>(company);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    company: true,
    opportunity: true,
    notes: true,
    contacts: false,
    addresses: false,
    uploads: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = async () => {
    try {
      // Validate zip code if provided
      if (editFormData.zip_code && !/^\d{5}(-\d{4})?$/.test(editFormData.zip_code)) {
        toast.error('Please enter a proper Zip code in format XXXXX or XXXXX-XXXX');
        return;
      }
      
      // Format the website URL if provided
      const updateData = {
        ...editFormData,
        company_website: editFormData.company_website ? 
          (editFormData.company_website.match(/^https?:\/\//) ? 
            editFormData.company_website : 
            `https://${editFormData.company_website}`) : 
          editFormData.company_website
      };
      
      // For now, just update local state
      onCompanyUpdate({ ...company, ...updateData });
      onEditModeChange(false);
      toast.success('Company updated successfully');
    } catch (error) {
      toast.error('Failed to update company');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{company.company_name}</h2>
              <p className="text-gray-600">{company.industry}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Status:</span>
                <select
                  value={company.company_status}
                  onChange={(e) => onStatusChange(e.target.value as Company['company_status'])}
                  className="px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                  <option value="client">Client</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Company Information Section - COLLAPSIBLE */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('company')}
              className="flex items-center justify-between w-full text-left mb-4 p-2 hover:bg-gray-50 rounded"
            >
              <h3 className="text-lg font-semibold">Company Information</h3>
              {expandedSections.company ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {expandedSections.company && (
              <div className="pl-2">
                {isEditMode ? (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Edit mode fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <Input
                        name="company_name"
                        value={editFormData.company_name || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <select
                        name="industry"
                        value={editFormData.industry || ''}
                        onChange={handleEditInputChange}
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
                        value={editFormData.company_size || ''}
                        onChange={handleEditInputChange}
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
                        value={editFormData.annual_revenue || ''}
                        onChange={handleEditInputChange}
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
                        value={editFormData.company_website || ''}
                        onChange={handleEditInputChange}
                        type="text"
                        placeholder="www.example.com or https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Number</label>
                      <Input
                        name="street_number"
                        value={editFormData.street_number || ''}
                        onChange={handleEditInputChange}
                        placeholder="Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Name</label>
                      <Input
                        name="street_name"
                        value={editFormData.street_name || ''}
                        onChange={handleEditInputChange}
                        placeholder="Street Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apt/Suite</label>
                      <Input
                        name="apt_suite"
                        value={editFormData.apt_suite || ''}
                        onChange={handleEditInputChange}
                        placeholder="Apt/Suite"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <Input
                        name="city"
                        value={editFormData.city || ''}
                        onChange={handleEditInputChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <select
                        name="state"
                        value={editFormData.state || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">State</option>
                        {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <Input
                        name="zip_code"
                        value={editFormData.zip_code || ''}
                        onChange={handleEditInputChange}
                        placeholder="12345 or 12345-6789"
                        pattern="[0-9]{5}(-[0-9]{4})?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact First Name</label>
                      <Input
                        name="contact_first_name"
                        value={editFormData.contact_first_name || ''}
                        onChange={handleEditInputChange}
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Last Name</label>
                      <Input
                        name="contact_last_name"
                        value={editFormData.contact_last_name || ''}
                        onChange={handleEditInputChange}
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <Input
                        name="contact_job_title"
                        value={editFormData.contact_job_title || ''}
                        onChange={handleEditInputChange}
                        placeholder="Job Title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        name="contact_email"
                        value={editFormData.contact_email || ''}
                        onChange={handleEditInputChange}
                        type="email"
                        placeholder="email@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <Input
                        name="contact_phone"
                        value={editFormData.contact_phone || ''}
                        onChange={handleEditInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                      <Input
                        name="contact_mobile"
                        value={editFormData.contact_mobile || ''}
                        onChange={handleEditInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                      <select
                        name="preferred_contact_method"
                        value={editFormData.preferred_contact_method || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {dimensions.contactMethods.map(method => (
                          <option key={method.id} value={method.name.toLowerCase()}>{method.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                      <select
                        name="lead_source"
                        value={editFormData.lead_source || ''}
                        onChange={handleEditInputChange}
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
                        value={editFormData.lead_score || ''}
                        onChange={handleEditInputChange}
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
                        value={editFormData.expected_close_date || ''}
                        onChange={handleEditInputChange}
                        type="date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Opportunity Value</label>
                      <Input
                        name="opportunity_value"
                        value={editFormData.opportunity_value || ''}
                        onChange={handleEditInputChange}
                        type="number"
                        min="0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Staffing Needs Overview</label>
                      <textarea
                        name="staffing_needs_overview"
                        value={editFormData.staffing_needs_overview || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Immediate Positions</label>
                      <Input
                        name="immediate_positions"
                        value={editFormData.immediate_positions || ''}
                        onChange={handleEditInputChange}
                        type="number"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Annual Positions</label>
                      <Input
                        name="annual_positions"
                        value={editFormData.annual_positions || ''}
                        onChange={handleEditInputChange}
                        type="number"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position Type</label>
                      <select
                        name="position_type"
                        value={editFormData.position_type || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select type</option>
                        {dimensions.positionTypes.map(type => (
                          <option key={type.id} value={type.name}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Staffing Details</label>
                      <textarea
                        name="additional_staffing_details"
                        value={editFormData.additional_staffing_details || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {/* View mode - display all fields */}
                    <div>
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-medium">{company.company_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Industry</p>
                      <p className="font-medium">{company.industry || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company Size</p>
                      <p className="font-medium">{company.company_size || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Annual Revenue</p>
                      <p className="font-medium">{company.annual_revenue || 'Not specified'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Website</p>
                      <p className="font-medium">{company.company_website || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {[company.street_number, company.street_name, company.apt_suite]
                          .filter(Boolean).join(' ')}<br/>
                        {[company.city, company.state, company.zip_code]
                          .filter(Boolean).join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact First Name</p>
                      <p className="font-medium">{company.contact_first_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact Last Name</p>
                      <p className="font-medium">{company.contact_last_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Job Title</p>
                      <p className="font-medium">{company.contact_job_title || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{company.contact_email || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{company.contact_phone || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="font-medium">{company.contact_mobile || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Preferred Contact Method</p>
                      <p className="font-medium">{company.preferred_contact_method || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lead Source</p>
                      <p className="font-medium">{company.lead_source || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lead Score</p>
                      <p className="font-medium">{company.lead_score || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company Status</p>
                      <p className="font-medium">{company.company_status || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Close Date</p>
                      <p className="font-medium">{company.expected_close_date || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Opportunity Value</p>
                      <p className="font-medium">{company.opportunity_value ? formatCurrency(company.opportunity_value) : 'Not specified'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Staffing Needs Overview</p>
                      <p className="font-medium">{company.staffing_needs_overview || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Immediate Positions</p>
                      <p className="font-medium">{company.immediate_positions || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Annual Positions</p>
                      <p className="font-medium">{company.annual_positions || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Position Type</p>
                      <p className="font-medium">{company.position_type || 'Not specified'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Additional Staffing Details</p>
                      <p className="font-medium">{company.additional_staffing_details || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Opportunity Details Section - COLLAPSIBLE */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('opportunity')}
              className="flex items-center justify-between w-full text-left mb-4 p-2 hover:bg-gray-50 rounded"
            >
              <h3 className="text-lg font-semibold">Opportunity Details</h3>
              {expandedSections.opportunity ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {expandedSections.opportunity && (
              <div className="pl-2 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Opportunity Value</p>
                  <p className="text-lg font-semibold text-green-600">
                    {company.opportunity_value ? formatCurrency(company.opportunity_value) : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Staffing Needs Overview</p>
                  <p>{company.staffing_needs_overview || 'Not provided'}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Immediate Positions</p>
                    <p className="font-medium">{company.immediate_positions || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Annual Positions</p>
                    <p className="font-medium">{company.annual_positions || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Position Type</p>
                    <p className="font-medium">{company.position_type || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes Section - COLLAPSIBLE */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('notes')}
              className="flex items-center justify-between w-full text-left mb-4 p-2 hover:bg-gray-50 rounded"
            >
              <h3 className="text-lg font-semibold">Notes & Activities</h3>
              {expandedSections.notes ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {expandedSections.notes && (
              <div className="pl-2">
                <NotesSection
                  companyId={company.company_id}
                  notes={notes}
                  noteTypes={dimensions.noteTypes}
                  onNotesChange={onNotesChange}
                  saving={saving}
                />
              </div>
            )}
          </div>

          {/* Contacts Section - COLLAPSIBLE */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('contacts')}
              className="flex items-center justify-between w-full text-left mb-4 p-2 hover:bg-gray-50 rounded"
            >
              <h3 className="text-lg font-semibold">Contacts</h3>
              {expandedSections.contacts ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {expandedSections.contacts && (
              <div className="pl-2">
                <ContactsSection
                  companyId={company.company_id}
                  contacts={contacts}
                  contactTypes={dimensions.contactTypes}
                  onContactsChange={onContactsChange}
                  saving={saving}
                />
              </div>
            )}
          </div>

          {/* Addresses Section - COLLAPSIBLE */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('addresses')}
              className="flex items-center justify-between w-full text-left mb-4 p-2 hover:bg-gray-50 rounded"
            >
              <h3 className="text-lg font-semibold">Addresses</h3>
              {expandedSections.addresses ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {expandedSections.addresses && (
              <div className="pl-2">
                <AddressesSection
                  companyId={company.company_id}
                  addresses={addresses}
                  addressTypes={dimensions.addressTypes}
                  onAddressesChange={onAddressesChange}
                  saving={saving}
                />
              </div>
            )}
          </div>

          {/* Uploads Section - COLLAPSIBLE */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('uploads')}
              className="flex items-center justify-between w-full text-left mb-4 p-2 hover:bg-gray-50 rounded"
            >
              <h3 className="text-lg font-semibold">Documents & Files</h3>
              {expandedSections.uploads ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {expandedSections.uploads && (
              <div className="pl-2">
                <div className="mb-4">
                  <Button size="sm" variant="outline" onClick={() => {
                    toast.success('File upload functionality coming soon');
                  }}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
                <p className="text-sm text-gray-500">No files uploaded yet</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {isEditMode ? (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => onEditModeChange(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => onEditModeChange(true)}>
                Edit Company
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
