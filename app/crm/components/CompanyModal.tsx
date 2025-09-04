"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight, Upload } from 'lucide-react';
import CustomTooltip from '@/components/ui/custom-tooltip';
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
    companyInfo: true,
    address: false,
    primaryContact: false,
    leadData: false,
    staffingNeeds: false,
    notes: true,
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

  const handleSave = async () => {
    try {
      // Validate zip code if provided (check if it exists in the form data)
      if ((editFormData as any).zip_code && !/^\d{5}(-\d{4})?$/.test((editFormData as any).zip_code)) {
        toast.error('Please enter a proper Zip code in format XXXXX or XXXXX-XXXX');
        return;
      }
      
      // Format the website URL if provided
      const updateData = {
        ...editFormData,
        company_website: editFormData.company_website ? formatWebsiteUrl(editFormData.company_website) : editFormData.company_website
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
                {isEditMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                      <Input
                        name="company_name"
                        value={editFormData.company_name || ''}
                        onChange={handleEditInputChange}
                        required
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">TIN (Tax ID)</label>
                      <Input
                        name="tin"
                        value={editFormData.tin || ''}
                        onChange={handleEditInputChange}
                        placeholder="XX-XXXXXXX"
                      />
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
                      {editFormData.company_website && (
                        <p className="text-xs text-gray-500 mt-1">
                          Will be saved as: {formatWebsiteUrl(editFormData.company_website)}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <p className="text-sm text-gray-600">TIN (Tax ID)</p>
                      <p className="font-medium">{company.tin || 'Not specified'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Website</p>
                      <p className="font-medium">{company.company_website || 'Not provided'}</p>
                    </div>
                  </div>
                )}
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
                  companyId={company.company_id}
                  addresses={addresses}
                  addressTypes={dimensions.addressTypes}
                  onAddressesChange={onAddressesChange}
                  saving={saving}
                  isNewCompany={false}
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
                  companyId={company.company_id}
                  contacts={contacts}
                  contactTypes={dimensions.contactTypes}
                  contactMethods={dimensions.contactMethods}
                  onContactsChange={onContactsChange}
                  saving={saving}
                  isNewCompany={false}
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
                {isEditMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={editFormData.expected_close_date || ''}
                        onChange={handleEditInputChange}
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
                        value={editFormData.opportunity_value === 0 ? '' : formatCurrency(editFormData.opportunity_value || 0)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[$,]/g, '');
                          const numValue = value === '' ? 0 : parseInt(value, 10);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setEditFormData(prev => ({ ...prev, opportunity_value: numValue }));
                          }
                        }}
                        placeholder="Estimated Opportunity Size"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Lead Source</p>
                      <p className="font-medium">{company.lead_source || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lead Score</p>
                      <p className="font-medium">
                        {company.lead_score ? 
                          (dimensions.scores.find(s => 
                            s.name.toLowerCase() === company.lead_score?.toLowerCase() ||
                            s.name.toLowerCase().includes(company.lead_score?.toLowerCase() || '') ||
                            company.lead_score?.toLowerCase().includes(s.name.toLowerCase())
                          )?.name || company.lead_score) 
                          : 'Not specified'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Close Date</p>
                      <p className="font-medium">{company.expected_close_date || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Opportunity Value</p>
                      <p className="font-medium">{company.opportunity_value ? formatCurrency(company.opportunity_value) : 'Not specified'}</p>
                    </div>
                  </div>
                )}
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
                {isEditMode ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Staffing Needs Overview</label>
                      <textarea
                        name="staffing_needs_overview"
                        value={editFormData.staffing_needs_overview || ''}
                        onChange={handleEditInputChange}
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
                          value={editFormData.immediate_positions || ''}
                          onChange={handleEditInputChange}
                          min="0"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Annual Positions</label>
                        <Input
                          name="annual_positions"
                          type="number"
                          value={editFormData.annual_positions || ''}
                          onChange={handleEditInputChange}
                          min="0"
                          placeholder="0"
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
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Staffing Details</label>
                      <textarea
                        name="additional_staffing_details"
                        value={editFormData.additional_staffing_details || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        placeholder="Any additional details about staffing requirements..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Staffing Needs Overview</p>
                      <p className="font-medium">{company.staffing_needs_overview || 'Not provided'}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div>
                      <p className="text-sm text-gray-600">Additional Staffing Details</p>
                      <p className="font-medium">{company.additional_staffing_details || 'Not provided'}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="mb-6 border rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('notes')}
              className="w-full px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-t-lg cursor-pointer transition-colors border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">Notes & Activities</h4>
                <span className="text-xs text-gray-500">(click to expand/collapse)</span>
              </div>
              {expandedSections.notes ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {expandedSections.notes && (
              <div className="p-4">
                <NotesSection
                  companyId={company.company_id}
                  notes={notes}
                  noteTypes={dimensions.noteTypes}
                  contactMethods={dimensions.contactMethods}
                  onNotesChange={onNotesChange}
                  saving={saving}
                />
              </div>
            )}
          </div>

          {/* Uploads Section */}
          <div className="mb-6 border rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('uploads')}
              className="w-full px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-t-lg cursor-pointer transition-colors border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">Documents & Files</h4>
                <span className="text-xs text-gray-500">(click to expand/collapse)</span>
              </div>
              {expandedSections.uploads ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {expandedSections.uploads && (
              <div className="p-4">
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
