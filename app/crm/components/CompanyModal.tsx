"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight, Upload } from 'lucide-react';
import CustomTooltip from '@/components/ui/custom-tooltip';
import { type Company, type DimensionValue, crmDatabase } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';
import NotesSection from './NotesSection';
import ContactsSection from './ContactsSection';
import AddressesSection from './AddressesSection';

interface CompanyModalProps {
  company: Company;
  onClose: () => void;
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
    documentTypes: DimensionValue[];
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
  onClose,
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
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    companyInfo: false,
    address: false,
    primaryContact: false,
    leadData: false,
    staffingNeeds: false,
    notes: false,
    uploads: false
  });
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{company.company_name}</h2>
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
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setShowNotesModal(true)}>
                + Add Note/Activity
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowUploadModal(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            <button
              onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-3xl ml-2"
            >
              ×
            </button>
            </div>
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
                  readOnly={true}
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
                  readOnly={true}
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
                  readOnly={true}
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
                <p className="text-sm text-gray-500">No files uploaded yet</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
              </Button>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-start justify-center p-4 pt-20">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Add Note/Activity</h3>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <NotesSection
                companyId={company.company_id}
                notes={notes}
                noteTypes={dimensions.noteTypes}
                contactMethods={dimensions.contactMethods}
                onNotesChange={onNotesChange}
                saving={saving}
                readOnly={false}
                onNoteSaved={() => setShowNotesModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Upload File</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select document type</option>
                    {dimensions.documentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => {
                      if (!selectedDocType) {
                        toast.error('Please select a document type');
                        return;
                      }
                      toast.success(`File upload functionality coming soon for ${selectedDocType}`);
                      setShowUploadModal(false);
                      setSelectedDocType('');
                    }}
                    disabled={!selectedDocType}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    File upload functionality coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
