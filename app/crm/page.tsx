"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { crmDatabase, type Company, type DimensionValue } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';
import CompanyForm from './components/CompanyForm';
import CompanyList from './components/CompanyList';
import CompanyModal from './components/CompanyModal';
import Header from '@/components/Header';

export default function CRMPage() {
  console.log('=== CRM COMPONENT MOUNTING ===');
  
  // State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [dimensions, setDimensions] = useState<{
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
  }>({
    statuses: [],
    sources: [],
    scores: [],
    sizes: [],
    revenues: [],
    positionTypes: [],
    noteTypes: [],
    contactMethods: [],
    contactTypes: [],
    addressTypes: [],
    fileCategories: [],
    industries: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Company | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  // Load data on component mount
  useEffect(() => {
    console.log('=== USE_EFFECT TRIGGERED ===');
    loadData();
  }, []);



  const loadData = async () => {
    setLoading(true);
    try {
      // Load companies first
      console.log('=== DEBUGGING COMPANIES LOADING ===');
      const companiesResult = await crmDatabase.getCompanies();
      console.log('Raw companiesResult:', companiesResult);
      console.log('Type of companiesResult:', typeof companiesResult);
      console.log('companiesResult length:', companiesResult?.length);
      
      if (companiesResult) {
        console.log('Setting companies with data:', companiesResult);
        setCompanies(companiesResult);
      } else {
        console.log('No companies data, setting empty array');
        setCompanies([]);
      }
      
      // Load dimensions using the working approach
      try {
        const [statuses, sources, scores, sizes, revenues, positionTypes, noteTypes, contactMethods, contactTypes, addressTypes, fileCategories, industries] = await Promise.all([
          crmDatabase.getDimensions('dim_company_status'),
          crmDatabase.getDimensions('dim_lead_source'),
          crmDatabase.getDimensions('dim_lead_score'),
          crmDatabase.getDimensions('dim_company_size'),
          crmDatabase.getDimensions('dim_annual_revenue'),
          crmDatabase.getDimensions('dim_position_type'),
          crmDatabase.getDimensions('dim_note_type'),
          crmDatabase.getDimensions('dim_contact_method'),
          crmDatabase.getDimensions('dim_contact_type'),
          crmDatabase.getDimensions('dim_address_type'),
          crmDatabase.getDimensions('dim_file_category'),
          crmDatabase.getDimensions('dim_industry')
        ]);
        
        setDimensions({
          statuses: statuses || [],
          sources: sources || [],
          scores: scores || [],
          sizes: sizes || [],
          revenues: revenues || [],
          positionTypes: positionTypes || [],
          noteTypes: noteTypes || [],
          contactMethods: contactMethods || [],
          contactTypes: contactTypes || [],
          addressTypes: addressTypes || [],
          fileCategories: fileCategories || [],
          industries: industries || []
        });
        
        // Set default active tab to first status if not already set
        if (!activeTab && statuses && statuses.length > 0) {
          setActiveTab(statuses[0].name.toLowerCase());
        }
      } catch (dimensionError) {
        console.error('Error loading dimensions:', dimensionError);
        toast.error('Failed to load some dimension data');
        // Don't fail the whole load if dimensions fail
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const result = await crmDatabase.getCompanies();
      if (result) {
        setCompanies(result);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadCompanyNotes = async (companyId: string) => {
    try {
      const result = await crmDatabase.getCompanyNotes(companyId);
      if (result) {
        setNotes(result);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const loadCompanyAddresses = async (companyId: string) => {
    try {
      const result = await crmDatabase.getCompanyAddresses(companyId);
      if (result) {
        setAddresses(result);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const loadCompanyContacts = async (companyId: string) => {
    try {
      const result = await crmDatabase.getCompanyContacts(companyId);
      if (result) {
        setContacts(result);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleAddCompany = async (company: Company) => {
    setShowAddForm(false);
    await loadCompanies();
    toast.success('Company added successfully!');
  };

  const handleViewLead = async (company: Company) => {
    setSelectedLead(company);
    setIsEditMode(false);
    await Promise.all([
      loadCompanyNotes(company.company_id),
      loadCompanyAddresses(company.company_id),
      loadCompanyContacts(company.company_id)
    ]);
  };

  const handleEditLead = async (company: Company) => {
    setSelectedLead(company);
    setIsEditMode(true);
    await Promise.all([
      loadCompanyNotes(company.company_id),
      loadCompanyAddresses(company.company_id),
      loadCompanyContacts(company.company_id)
    ]);
  };

  const handleStatusChange = async (status: Company['company_status']) => {
    if (!selectedLead) return;
    
    try {
      const result = await crmDatabase.updateCompanyStatus(selectedLead.company_id, status);
      if (result) {
        setSelectedLead({ ...selectedLead, company_status: status });
        await loadCompanies(); // Refresh the list
        toast.success('Status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCompanyUpdate = async (updatedCompany: Company) => {
    setSelectedLead(updatedCompany);
    await loadCompanies();
  };

  const closeModal = () => {
    setSelectedLead(null);
    setIsEditMode(false);
    setNotes([]);
    setContacts([]);
    setAddresses([]);
  };

  // Filter companies based on active tab and search
  const filteredCompanies = companies.length > 0 ? companies.filter(company => {
    // Use flexible matching for status
    const matchesTab = dimensions.statuses.some(status => 
      (status.name.toLowerCase() === activeTab && 
       (company.company_status?.toLowerCase() === status.name.toLowerCase() ||
        company.company_status?.toLowerCase().includes(status.name.toLowerCase()) ||
        status.name.toLowerCase().includes(company.company_status?.toLowerCase() || '')))
    );
    
    const matchesSearch = company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && (searchTerm === '' || matchesSearch);
  }) : [];

  // Debug filtering
  console.log('=== FILTERING DEBUG ===');
  console.log('Total companies:', companies.length);
  console.log('Active tab:', activeTab);
  console.log('Search term:', searchTerm);
  console.log('Filtered companies:', filteredCompanies.length);
  console.log('Sample company statuses:', companies.map(c => c.company_status));
  console.log('Sample company names:', companies.map(c => c.company_name));





  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Header */}
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-primary">CRM Dashboard</h1>
           <p className="text-gray-600 mt-2">Manage your leads, prospects, and clients</p>
         </div>

         {/* Statistics Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {dimensions.statuses.slice(0, 3).map((status, index) => {
             const count = companies.filter(c => {
               return c.company_status?.toLowerCase() === status.name.toLowerCase() ||
                      c.company_status?.toLowerCase().includes(status.name.toLowerCase()) ||
                      status.name.toLowerCase().includes(c.company_status?.toLowerCase() || '');
             }).length;
             
             const iconColors = [
               { bg: 'bg-blue-100', text: 'text-blue-600' },
               { bg: 'bg-yellow-100', text: 'text-yellow-600' },
               { bg: 'bg-green-100', text: 'text-green-600' }
             ];
             
             const icons = [
               <path key="users" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
               <path key="check" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
               <path key="star" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
             ];
             
             return (
               <div key={status.name} className="bg-white rounded-lg shadow p-6">
                 <div className="flex items-center">
                   <div className={`p-2 ${iconColors[index]?.bg || 'bg-gray-100'} rounded-lg`}>
                     <svg className={`w-6 h-6 ${iconColors[index]?.text || 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       {icons[index]}
                     </svg>
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">Total {status.name}s</p>
                     <p className="text-2xl font-semibold text-gray-900">{count}</p>
                   </div>
                 </div>
               </div>
             );
           })}
         </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {dimensions.statuses.map((status) => (
                <button
                  key={status.name}
                  onClick={() => setActiveTab(status.name.toLowerCase())}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === status.name.toLowerCase()
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {status.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

                 {/* Search and Add Button */}
         <div className="flex justify-between items-center mb-6 gap-4">
           <Button onClick={() => setShowAddForm(true)}>
             <Plus className="h-4 w-4 mr-2" />
             Add Company
           </Button>
           
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
             <Input
               placeholder="Search companies..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10"
             />
           </div>
           
           <Button variant="outline" size="sm">
             <Filter className="h-4 w-4 mr-2" />
             Filter & Sort
           </Button>
         </div>

        {/* Add Company Form */}
        {showAddForm && (
          <CompanyForm
            dimensions={dimensions}
            onSuccess={handleAddCompany}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Company List */}
        <CompanyList
          companies={filteredCompanies}
          loading={loading}
          activeTab={activeTab}
          onViewLead={handleViewLead}
          onEditLead={handleEditLead}
          dimensions={dimensions}
        />

        {/* Company Modal */}
        {selectedLead && (
          <CompanyModal
            company={selectedLead}
            isEditMode={isEditMode}
            onClose={closeModal}
            onEditModeChange={setIsEditMode}
            onCompanyUpdate={handleCompanyUpdate}
            dimensions={dimensions}
            notes={notes}
            contacts={contacts}
            addresses={addresses}
            onNotesChange={setNotes}
            onContactsChange={setContacts}
            onAddressesChange={setAddresses}
            onStatusChange={handleStatusChange}
            saving={saving}
          />
        )}
             </div>
     </div>
   );
}