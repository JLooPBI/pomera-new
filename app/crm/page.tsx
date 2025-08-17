"use client"

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, Building, UserCheck, Mail, Phone, MapPin, Calendar, Eye, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { crmDatabase, type Company, type CompanyContact } from '@/lib/supabase-crm';

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('leads');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Lead detail view state
  const [companyDetailsExpanded, setCompanyDetailsExpanded] = useState(false);
  const [opportunityExpanded, setOpportunityExpanded] = useState(false);
  const [leadStatus, setLeadStatus] = useState('New Lead');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityFormData, setActivityFormData] = useState({
    activity_type: '',
    notes: '',
    follow_up_date: ''
  });
  
  // Form state
  const [formData, setFormData] = useState({
    company_name: '', industry: '', company_size: '', annual_revenue: '', company_website: '',
    street_number: '', street_name: '', apt_suite: '', city: '', state: '', zip_code: '',
    lead_source: '', lead_score: '', expected_close_date: '', staffing_needs_overview: '',
    immediate_positions: '', annual_positions: '', opportunity_value: '', position_names: '',
    position_type: '', additional_staffing_details: '', contact_first_name: '', contact_last_name: '',
    contact_job_title: '', contact_email: '', contact_phone: '', contact_mobile: '', preferred_contact_method: 'email'
  });

  const tabs = [
    { id: 'leads', label: 'Leads', icon: Users, count: companies.filter(c => c.company_status === 'lead').length },
    { id: 'prospects', label: 'Prospects', icon: Building, count: companies.filter(c => c.company_status === 'prospect').length },
    { id: 'clients', label: 'Clients', icon: UserCheck, count: companies.filter(c => c.company_status === 'client').length }
  ];

  // Load companies when tab changes
  useEffect(() => {
    loadCompanies();
  }, [activeTab]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await crmDatabase.getCompaniesByStatus(activeTab.slice(0, -1));
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleViewLead = async (leadId: string) => {
    try {
      const leadData = await crmDatabase.getCompanyById(leadId);
      setSelectedLead(leadData);
      setLeadStatus(leadData.company_status === 'lead' ? 'New Lead' : 
                   leadData.company_status === 'prospect' ? 'Active Prospect' : 'Client');
    } catch (error) {
      console.error('Error loading lead:', error);
    }
  };

  const handleActivityInputChange = (field: string, value: string) => {
    setActivityFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveActivity = async () => {
    if (!activityFormData.activity_type || !activityFormData.notes) {
      alert('Please fill in Activity Type and Notes (both required)');
      return;
    }

    try {
      // Use the dedicated activities table
      await crmDatabase.addActivity(
        selectedLead.company_id,
        activityFormData.activity_type,
        activityFormData.notes,
        'Current User', // TODO: Replace with actual user when auth is implemented
        activityFormData.follow_up_date || undefined
      );
      
      // Reset form
      setActivityFormData({ activity_type: '', notes: '', follow_up_date: '' });
      setShowActivityForm(false);
      
      alert('Activity logged successfully!');
      
      // Refresh the lead data to show new activity
      const updatedLead = await crmDatabase.getCompanyById(selectedLead.company_id);
      setSelectedLead(updatedLead);
      
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Error saving activity. Please try again.');
    }
  };

  // Fixed: Added the missing handleStatusChange function
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedLead) return;
    
    try {
      let dbStatus = newStatus === 'New Lead' ? 'lead' : 
                    newStatus === 'Active Prospect' ? 'prospect' : 'client';
      
      await crmDatabase.updateCompanyStatus(selectedLead.company_id, dbStatus);
      setLeadStatus(newStatus);
      
      // Update the local state
      setSelectedLead(prev => ({ ...prev, company_status: dbStatus }));
      
      // Refresh the lists
      loadCompanies();
      
      alert(`Status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!formData.company_name || !formData.contact_first_name || !formData.contact_last_name || !formData.contact_email) {
      alert('Please fill in all required fields (Company Name, Contact First Name, Last Name, and Email)');
      return;
    }

    setSaving(true);
    try {
      const companyData: Company = {
        company_name: formData.company_name,
        industry: formData.industry || undefined,
        company_size: formData.company_size || undefined,
        annual_revenue: formData.annual_revenue || undefined,
        company_website: formData.company_website || undefined,
        street_number: formData.street_number || undefined,
        street_name: formData.street_name || undefined,
        apt_suite: formData.apt_suite || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zip_code: formData.zip_code || undefined,
        company_status: 'lead', // Always start as lead
        lead_source: formData.lead_source || undefined,
        lead_score: formData.lead_score || undefined,
        expected_close_date: formData.expected_close_date || undefined,
        staffing_needs_overview: formData.staffing_needs_overview || undefined,
        immediate_positions: formData.immediate_positions ? parseInt(formData.immediate_positions) : undefined,
        annual_positions: formData.annual_positions ? parseInt(formData.annual_positions) : undefined,
        opportunity_value: formData.opportunity_value ? parseFloat(formData.opportunity_value) : undefined,
        position_names: formData.position_names || undefined,
        position_type: formData.position_type || undefined,
        additional_staffing_details: formData.additional_staffing_details || undefined
      };

      const contactData = {
        contact_first_name: formData.contact_first_name,
        contact_last_name: formData.contact_last_name,
        contact_job_title: formData.contact_job_title || undefined,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone || undefined,
        contact_mobile: formData.contact_mobile || undefined,
        preferred_contact_method: formData.preferred_contact_method as 'email' | 'phone' | 'mobile',
        is_primary_contact: true,
        is_decision_maker: true,
        is_active_contact: true
      };

      await crmDatabase.createCompany(companyData, contactData);
      
      // Reset form
      setFormData({
        company_name: '', industry: '', company_size: '', annual_revenue: '', company_website: '',
        street_number: '', street_name: '', apt_suite: '', city: '', state: '', zip_code: '',
        lead_source: '', lead_score: '', expected_close_date: '', staffing_needs_overview: '',
        immediate_positions: '', annual_positions: '', opportunity_value: '', position_names: '',
        position_type: '', additional_staffing_details: '', contact_first_name: '', contact_last_name: '',
        contact_job_title: '', contact_email: '', contact_phone: '', contact_mobile: '', preferred_contact_method: 'email'
      });
      
      setShowAddForm(false);
      loadCompanies();
      alert('Lead saved successfully!');
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Error saving lead. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCompanies = companies.filter(company => 
    searchTerm === '' || 
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lead Detail View Component
  if (selectedLead) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8 mt-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setSelectedLead(null)}>
                  ← Back to {activeTab}
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-primary">{selectedLead.company_name}</h1>
                  <p className="text-muted-foreground">Lead Management</p>
                </div>
              </div>
            </div>
            
            {/* Lead Status Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Lead Status:</label>
              <select 
                value={leadStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="New Lead">New Lead</option>
                <option value="Active Prospect">Active Prospect</option>
                <option value="Client">Client</option>
              </select>
            </div>
          </div>

          {/* Company Details Section - Collapsible */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setCompanyDetailsExpanded(!companyDetailsExpanded)}
            >
              <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); alert('Edit functionality coming soon!'); }}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                {companyDetailsExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
            
            {companyDetailsExpanded && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Company Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Industry:</span> {selectedLead.industry || 'Not specified'}</p>
                      <p><span className="font-medium">Size:</span> {selectedLead.company_size || 'Not specified'}</p>
                      <p><span className="font-medium">Revenue:</span> {selectedLead.annual_revenue || 'Not specified'}</p>
                      <p><span className="font-medium">Website:</span> {selectedLead.company_website || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Address</h4>
                    <div className="text-sm">
                      {selectedLead.street_number || selectedLead.street_name ? (
                        <p>
                          {selectedLead.street_number} {selectedLead.street_name}
                          {selectedLead.apt_suite && `, ${selectedLead.apt_suite}`}
                        </p>
                      ) : null}
                      {selectedLead.city || selectedLead.state ? (
                        <p>{selectedLead.city}, {selectedLead.state} {selectedLead.zip_code}</p>
                      ) : <p>Not specified</p>}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Primary Contact</h4>
                    {selectedLead.company_contacts?.[0] && (
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedLead.company_contacts[0].contact_first_name} {selectedLead.company_contacts[0].contact_last_name}</p>
                        <p><span className="font-medium">Title:</span> {selectedLead.company_contacts[0].contact_job_title || 'Not specified'}</p>
                        <p><span className="font-medium">Email:</span> {selectedLead.company_contacts[0].contact_email}</p>
                        <p><span className="font-medium">Phone:</span> {selectedLead.company_contacts[0].contact_phone || 'Not specified'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Lead Info</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Source:</span> {selectedLead.lead_source || 'Not specified'}</p>
                      <p><span className="font-medium">Score:</span> 
                        {selectedLead.lead_score && (
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            selectedLead.lead_score === 'hot' ? 'bg-red-100 text-red-800' :
                            selectedLead.lead_score === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {selectedLead.lead_score}
                          </span>
                        )}
                      </p>
                      <p><span className="font-medium">Expected Close:</span> {selectedLead.expected_close_date || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Opportunity Section - Collapsible */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setOpportunityExpanded(!opportunityExpanded)}
            >
              <h3 className="text-lg font-semibold text-gray-900">Opportunity Details</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); alert('Edit functionality coming soon!'); }}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                {opportunityExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
            
            {opportunityExpanded && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Immediate Positions:</span> {selectedLead.immediate_positions || 'Not specified'}</p>
                    <p><span className="font-medium">Annual Positions:</span> {selectedLead.annual_positions || 'Not specified'}</p>
                    <p><span className="font-medium">Opportunity Value:</span> {selectedLead.opportunity_value ? `$${selectedLead.opportunity_value.toLocaleString()}` : 'Not specified'}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Position Names:</span> {selectedLead.position_names || 'Not specified'}</p>
                    <p><span className="font-medium">Position Type:</span> {selectedLead.position_type || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Staffing Overview:</span></p>
                    <p className="text-gray-600">{selectedLead.staffing_needs_overview || 'No overview provided'}</p>
                    {selectedLead.additional_staffing_details && (
                      <div>
                        <p><span className="font-medium">Additional Details:</span></p>
                        <p className="text-gray-600">{selectedLead.additional_staffing_details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lead Work Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Lead Activity & Notes</h3>
              <Button 
                onClick={() => setShowActivityForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Log New Activity
              </Button>
            </div>
            
            <div className="p-4">
              {/* Activity Form */}
              {showActivityForm && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Log New Activity</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type *</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={activityFormData.activity_type}
                        onChange={(e) => handleActivityInputChange('activity_type', e.target.value)}
                      >
                        <option value="">Select Activity Type</option>
                        <option value="Attempted Call">Attempted Call</option>
                        <option value="Completed Call">Completed Call</option>
                        <option value="Sent SMS">Sent SMS</option>
                        <option value="Sent Email">Sent Email</option>
                        <option value="Inbound Contact">Inbound Contact</option>
                        <option value="Note">Note</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up Date</label>
                      <Input 
                        type="date" 
                        value={activityFormData.follow_up_date}
                        onChange={(e) => handleActivityInputChange('follow_up_date', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes *</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                      placeholder="Enter activity details and notes..."
                      value={activityFormData.notes}
                      onChange={(e) => handleActivityInputChange('notes', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveActivity}>
                      Save Activity
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowActivityForm(false);
                        setActivityFormData({ activity_type: '', notes: '', follow_up_date: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Activities List */}
              {selectedLead.company_activities && selectedLead.company_activities.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Recent Activities</h4>
                  {selectedLead.company_activities.map((activity: any) => (
                    <div key={activity.activity_id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>{activity.created_by_name || 'User'}</span>
                          <Calendar className="h-4 w-4 ml-2" />
                          <span>{new Date(activity.created_date).toLocaleDateString()}</span>
                          <span>{new Date(activity.created_date).toLocaleTimeString()}</span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {activity.activity_type}
                        </span>
                      </div>
                      <div className="text-gray-900 whitespace-pre-wrap">{activity.activity_notes}</div>
                      {activity.follow_up_date && (
                        <div className="mt-2 text-sm text-orange-600">
                          Follow-up: {new Date(activity.follow_up_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No activities logged yet</p>
                  <p className="text-sm">Click "Log New Activity" to get started tracking communications and progress.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Main CRM List View
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Client CRM</h1>
          <p className="text-muted-foreground">Manage your sales pipeline from leads to clients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <div key={tab.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{tab.label}</p>
                    <p className="text-3xl font-bold text-primary">{tab.count}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full ml-1">
                  {tab.count}
                </span>
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search companies..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            {/* Only show "Add New" for leads */}
            {activeTab === 'leads' && (
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                + New Lead
              </Button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {!showAddForm ? (
            /* List View */
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading {activeTab}...</p>
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm ? `No ${activeTab} found` : `No ${activeTab} yet`}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ? `No ${activeTab} match your search criteria.` : 
                     activeTab === 'leads' ? 'Get started by adding your first lead' :
                     `${activeTab === 'prospects' ? 'Prospects' : 'Clients'} are created by promoting leads`}
                  </p>
                  {!searchTerm && activeTab === 'leads' && (
                    <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      + New Lead
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCompanies.map((company) => (
                    <div key={company.company_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{company.company_name}</h3>
                            {company.lead_score && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                company.lead_score === 'hot' ? 'bg-red-100 text-red-800' :
                                company.lead_score === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {company.lead_score}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              {company.industry && (
                                <p className="flex items-center gap-1">
                                  <Building className="h-4 w-4" />
                                  {company.industry}
                                </p>
                              )}
                              {company.city && company.state && (
                                <p className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {company.city}, {company.state}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              {company.company_contacts?.[0] && (
                                <>
                                  <p className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {company.company_contacts[0].contact_first_name} {company.company_contacts[0].contact_last_name}
                                  </p>
                                  <p className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {company.company_contacts[0].contact_email}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(company.created_date).toLocaleDateString()}
                            </span>
                            {company.opportunity_value && (
                              <span className="font-medium text-green-600">
                                ${company.opportunity_value.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewLead(company.company_id)}>
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Add Form */
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Add New Lead</h2>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Company Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <Input 
                      placeholder="Enter company name" 
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <Input 
                      placeholder="e.g., Hospital, Nursing Home, Clinic" 
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.company_size}
                        onChange={(e) => handleInputChange('company_size', e.target.value)}
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue</label>
                      <Input 
                        placeholder="e.g., $1-5M" 
                        value={formData.annual_revenue}
                        onChange={(e) => handleInputChange('annual_revenue', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <Input 
                      placeholder="https://company.com" 
                      value={formData.company_website}
                      onChange={(e) => handleInputChange('company_website', e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Address</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Input 
                        placeholder="Street #" 
                        value={formData.street_number}
                        onChange={(e) => handleInputChange('street_number', e.target.value)}
                      />
                      <Input 
                        placeholder="Street Name" 
                        className="col-span-2"
                        value={formData.street_name}
                        onChange={(e) => handleInputChange('street_name', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input 
                        placeholder="Suite/Apt" 
                        value={formData.apt_suite}
                        onChange={(e) => handleInputChange('apt_suite', e.target.value)}
                      />
                      <Input 
                        placeholder="City" 
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                      <Input 
                        placeholder="State" 
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      />
                    </div>
                    <Input 
                      placeholder="ZIP Code" 
                      className="w-32"
                      value={formData.zip_code}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                    />
                  </div>
                </div>

                {/* Contact & Opportunity */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Primary Contact</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <Input 
                        placeholder="First name" 
                        value={formData.contact_first_name}
                        onChange={(e) => handleInputChange('contact_first_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <Input 
                        placeholder="Last name" 
                        value={formData.contact_last_name}
                        onChange={(e) => handleInputChange('contact_last_name', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <Input 
                      placeholder="e.g., HR Director" 
                      value={formData.contact_job_title}
                      onChange={(e) => handleInputChange('contact_job_title', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <Input 
                      type="email" 
                      placeholder="email@company.com" 
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <Input 
                        placeholder="(555) 123-4567" 
                        value={formData.contact_phone}
                        onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                      <Input 
                        placeholder="(555) 123-4567" 
                        value={formData.contact_mobile}
                        onChange={(e) => handleInputChange('contact_mobile', e.target.value)}
                      />
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 border-b pb-2 mt-6">Lead Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.lead_source}
                        onChange={(e) => handleInputChange('lead_source', e.target.value)}
                      >
                        <option value="">Select source</option>
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Trade Show">Trade Show</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lead Score</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.lead_score}
                        onChange={(e) => handleInputChange('lead_score', e.target.value)}
                      >
                        <option value="">Select score</option>
                        <option value="hot">Hot</option>
                        <option value="warm">Warm</option>
                        <option value="cold">Cold</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
                    <Input 
                      type="date" 
                      value={formData.expected_close_date}
                      onChange={(e) => handleInputChange('expected_close_date', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Staffing Needs Overview</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      placeholder="Brief overview of staffing needs..."
                      value={formData.staffing_needs_overview}
                      onChange={(e) => handleInputChange('staffing_needs_overview', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button className="flex-1 sm:flex-none" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Lead'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}