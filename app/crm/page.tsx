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
  const [activeTab, setActiveTab] = useState('lead');
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
      console.log('Keys in companiesResult:', Object.keys(companiesResult || {}));
      console.log('companiesResult.error:', companiesResult?.error);
      console.log('companiesResult.data:', companiesResult?.data);
      console.log('companiesResult.data length:', companiesResult?.data?.length);
      
      if (companiesResult.error) {
        console.error('Error loading companies:', companiesResult.error);
        toast.error(`Failed to load companies: ${companiesResult.error}`);
      } else if (companiesResult.data) {
        console.log('Setting companies with data:', companiesResult.data);
        setCompanies(companiesResult.data);
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
          statuses: statuses.data || [],
          sources: sources.data || [],
          scores: scores.data || [],
          sizes: sizes.data || [],
          revenues: revenues.data || [],
          positionTypes: positionTypes.data || [],
          noteTypes: noteTypes.data || [],
          contactMethods: contactMethods.data || [],
          contactTypes: contactTypes.data || [],
          addressTypes: addressTypes.data || [],
          fileCategories: fileCategories.data || [],
          industries: industries.data || []
        });
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
      if (result.data) {
        setCompanies(result.data);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadCompanyNotes = async (companyId: string) => {
    try {
      const result = await crmDatabase.getCompanyNotes(companyId);
      if (result.data) {
        setNotes(result.data);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
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
    await loadCompanyNotes(company.company_id);
    // Reset other states
    setContacts([]);
    setAddresses([]);
  };

  const handleEditLead = async (company: Company) => {
    setSelectedLead(company);
    setIsEditMode(true);
    await loadCompanyNotes(company.company_id);
    // Reset other states
    setContacts([]);
    setAddresses([]);
  };

  const handleStatusChange = async (status: Company['company_status']) => {
    if (!selectedLead) return;
    
    try {
      const result = await crmDatabase.updateCompanyStatus(selectedLead.company_id, status);
      if (result.data) {
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
    const matchesTab = company.company_status === activeTab;
    const matchesSearch = company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Debug each company's filtering
    console.log(`Company: ${company.company_name}, Status: "${company.company_status}", Active Tab: "${activeTab}", Status Length: ${company.company_status?.length}, Active Tab Length: ${activeTab?.length}, Matches Tab: ${matchesTab}`);
    
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
           <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
           <p className="text-gray-600 mt-2">Manage your leads, prospects, and clients</p>
         </div>

         {/* Statistics Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white rounded-lg shadow p-6">
             <div className="flex items-center">
               <div className="p-2 bg-blue-100 rounded-lg">
                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
               </div>
               <div className="ml-4">
                 <p className="text-sm font-medium text-gray-600">Total Leads</p>
                 <p className="text-2xl font-semibold text-gray-900">{companies.filter(c => c.company_status === 'lead').length}</p>
               </div>
             </div>
           </div>
           
           <div className="bg-white rounded-lg shadow p-6">
             <div className="flex items-center">
               <div className="p-2 bg-yellow-100 rounded-lg">
                 <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div className="ml-4">
                 <p className="text-sm font-medium text-gray-600">Active Prospects</p>
                 <p className="text-2xl font-semibold text-gray-900">{companies.filter(c => c.company_status === 'prospect').length}</p>
               </div>
             </div>
           </div>
           
           <div className="bg-white rounded-lg shadow p-6">
             <div className="flex items-center">
               <div className="p-2 bg-green-100 rounded-lg">
                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                 </svg>
               </div>
               <div className="ml-4">
                 <p className="text-sm font-medium text-gray-600">Clients</p>
                 <p className="text-2xl font-semibold text-gray-900">{companies.filter(c => c.company_status === 'client').length}</p>
               </div>
             </div>
           </div>
         </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
                             {['lead', 'prospect', 'client', 'inactive'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

                 {/* Search and Add Button */}
         <div className="flex justify-between items-center mb-6">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
             <Input
               placeholder="Search companies..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10"
             />
           </div>
           <div className="flex gap-2">
             <Button variant="outline" size="sm">
               <Filter className="h-4 w-4 mr-2" />
               Filter
             </Button>
                           <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>

                           
           </div>
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