"use client"

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, Building, UserCheck, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicNotes from '@/components/DynamicNotes';
import SecureFileUpload from '@/components/SecureFileUpload';
import { crmDatabase, type Company, type CompanyContact } from '@/lib/supabase-crm';

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('leads');
  const [showAddForm, setShowAddForm] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    // Company data
    company_name: '',
    industry: '',
    company_size: '',
    annual_revenue: '',
    company_website: '',
    street_number: '',
    street_name: '',
    apt_suite: '',
    city: '',
    state: '',
    zip_code: '',
    lead_source: '',
    lead_score: '',
    expected_close_date: '',
    staffing_needs_overview: '',
    immediate_positions: '',
    annual_positions: '',
    opportunity_value: '',
    position_names: '',
    position_type: '',
    additional_staffing_details: '',
    
    // Contact data
    contact_first_name: '',
    contact_last_name: '',
    contact_job_title: '',
    contact_email: '',
    contact_phone: '',
    contact_mobile: '',
    preferred_contact_method: 'email'
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
      const data = await crmDatabase.getCompaniesByStatus(activeTab.slice(0, -1)); // Remove 's' from 'leads'
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        industry: formData.industry,
        company_size: formData.company_size,
        annual_revenue: formData.annual_revenue,
        company_website: formData.company_website,
        street_number: formData.street_number,
        street_name: formData.street_name,
        apt_suite: formData.apt_suite,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        company_status: activeTab.slice(0, -1) as 'lead' | 'prospect' | 'client',
        lead_source: formData.lead_source,
        lead_score: formData.lead_score,
        expected_close_date: formData.expected_close_date,
        staffing_needs_overview: formData.staffing_needs_overview,
        immediate_positions: formData.immediate_positions ? parseInt(formData.immediate_positions) : undefined,
        annual_positions: formData.annual_positions ? parseInt(formData.annual_positions) : undefined,
        opportunity_value: formData.opportunity_value ? parseFloat(formData.opportunity_value) : undefined,
        position_names: formData.position_names,
        position_type: formData.position_type,
        additional_staffing_details: formData.additional_staffing_details
      };

      const contactData = {
        contact_first_name: formData.contact_first_name,
        contact_last_name: formData.contact_last_name,
        contact_job_title: formData.contact_job_title,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        contact_mobile: formData.contact_mobile,
        preferred_contact_method: formData.preferred_contact_method as 'email' | 'phone' | 'mobile',
        is_primary_contact: true,
        is_decision_maker: true,
        is_active_contact: true
      };

      await crmDatabase.createCompany(companyData, contactData);
      
      // Reset form and refresh list
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
      
      alert('Company saved successfully!');
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Error saving company. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCompanies = companies.filter(company => 
    searchTerm === '' || 
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              + New
            </Button>
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
                    {searchTerm ? `No ${activeTab} match your search criteria.` : `Get started by adding your first ${activeTab.slice(0, -1)}`}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      + New
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
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Add Form - Same as before but with working save functionality */
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Add New {activeTab.slice(0, -1)}</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
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
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.annual_revenue}
                        onChange={(e) => handleInputChange('annual_revenue', e.target.value)}
                      >
                        <option value="">Select range</option>
                        <option value="<1M">Less than $1M</option>
                        <option value="1M-5M">$1M - $5M</option>
                        <option value="5M-10M">$5M - $10M</option>
                        <option value="10M+">$10M+</option>
                      </select>
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <Input 
                          placeholder="Street Number" 
                          className="col-span-1" 
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
                      <Input 
                        placeholder="Apt/Suite # (optional)" 
                        value={formData.apt_suite}
                        onChange={(e) => handleInputChange('apt_suite', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="City" 
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                        <select 
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        >
                          <option value="">State</option>
                          <option value="AL">AL</option>
                          <option value="AK">AK</option>
                          <option value="AZ">AZ</option>
                          <option value="AR">AR</option>
                          <option value="CA">CA</option>
                          <option value="CO">CO</option>
                          <option value="CT">CT</option>
                          <option value="DE">DE</option>
                          <option value="FL">FL</option>
                          <option value="GA">GA</option>
                          <option value="HI">HI</option>
                          <option value="ID">ID</option>
                          <option value="IL">IL</option>
                          <option value="IN">IN</option>
                          <option value="IA">IA</option>
                          <option value="KS">KS</option>
                          <option value="KY">KY</option>
                          <option value="LA">LA</option>
                          <option value="ME">ME</option>
                          <option value="MD">MD</option>
                          <option value="MA">MA</option>
                          <option value="MI">MI</option>
                          <option value="MN">MN</option>
                          <option value="MS">MS</option>
                          <option value="MO">MO</option>
                          <option value="MT">MT</option>
                          <option value="NE">NE</option>
                          <option value="NV">NV</option>
                          <option value="NH">NH</option>
                          <option value="NJ">NJ</option>
                          <option value="NM">NM</option>
                          <option value="NY">NY</option>
                          <option value="NC">NC</option>
                          <option value="ND">ND</option>
                          <option value="OH">OH</option>
                          <option value="OK">OK</option>
                          <option value="OR">OR</option>
                          <option value="PA">PA</option>
                          <option value="RI">RI</option>
                          <option value="SC">SC</option>
                          <option value="SD">SD</option>
                          <option value="TN">TN</option>
                          <option value="TX">TX</option>
                          <option value="UT">UT</option>
                          <option value="VT">VT</option>
                          <option value="VA">VA</option>
                          <option value="WA">WA</option>
                          <option value="WV">WV</option>
                          <option value="WI">WI</option>
                          <option value="WY">WY</option>
                        </select>
                      </div>
                      <Input 
                        placeholder="ZIP Code" 
                        pattern="[0-9]{5}(-[0-9]{4})?" 
                        title="Enter 5-digit or 9-digit ZIP code"
                        value={formData.zip_code}
                        onChange={(e) => handleInputChange('zip_code', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Contact */}
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
                      placeholder="e.g., HR Director, COO, Administrator" 
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.preferred_contact_method}
                      onChange={(e) => handleInputChange('preferred_contact_method', e.target.value)}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="mobile">Mobile</option>
                    </select>
                  </div>
                </div>

                {/* Sales Information */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Sales Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.lead_source}
                        onChange={(e) => handleInputChange('lead_source', e.target.value)}
                      >
                        <option value="">Select source</option>
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="cold-call">Cold Call</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="trade-show">Trade Show</option>
                        <option value="other">Other</option>
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
                        <option value="hot">Hot - Ready to buy</option>
                        <option value="warm">Warm - Interested</option>
                        <option value="cold">Cold - Early stage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
                      <Input 
                        type="date" 
                        value={formData.expected_close_date}
                        onChange={(e) => handleInputChange('expected_close_date', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Staffing Needs Overview</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      placeholder="Brief overview of staffing requirements"
                      value={formData.staffing_needs_overview}
                      onChange={(e) => handleInputChange('staffing_needs_overview', e.target.value)}
                    />
                  </div>
                </div>

                {/* Opportunity Details */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Opportunity Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Immediate Positions</label>
                      <Input 
                        type="number" 
                        placeholder="# positions needed now" 
                        value={formData.immediate_positions}
                        onChange={(e) => handleInputChange('immediate_positions', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Annual Positions</label>
                      <Input 
                        type="number" 
                        placeholder="Estimated yearly need" 
                        value={formData.annual_positions}
                        onChange={(e) => handleInputChange('annual_positions', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Opportunity Value</label>
                      <Input 
                        type="number" 
                        placeholder="Estimated revenue ($)" 
                        value={formData.opportunity_value}
                        onChange={(e) => handleInputChange('opportunity_value', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position Names</label>
                      <Input 
                        placeholder="e.g., RN, LPN, CNA, Physical Therapist" 
                        value={formData.position_names}
                        onChange={(e) => handleInputChange('position_names', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position Type</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.position_type}
                        onChange={(e) => handleInputChange('position_type', e.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="full-time">Full Time</option>
                        <option value="temp">Temporary</option>
                        <option value="contract">Contract</option>
                        <option value="maternity">Maternity Cover</option>
                        <option value="temp-to-perm">Temp to Permanent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Staffing Details</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      placeholder="Additional details about staffing requirements"
                      value={formData.additional_staffing_details}
                      onChange={(e) => handleInputChange('additional_staffing_details', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button 
                  className="flex-1 sm:flex-none"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : `Save ${activeTab.slice(0, -1)}`}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}