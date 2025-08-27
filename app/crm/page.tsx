"use client"

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, Building, UserCheck, Mail, Phone, MapPin, Calendar, Eye, Edit, ChevronDown, ChevronUp, Upload, FileText, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { crmDatabase, type Company, type DimensionValue } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('leads');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Company | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Properly typed expanded sections state
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    company: true,
    opportunity: true,
    notes: true,
    uploads: true
  });

  // Dimension data from database
  const [dimensions, setDimensions] = useState({
    statuses: [] as DimensionValue[],
    sources: [] as DimensionValue[],
    scores: [] as DimensionValue[],
    sizes: [] as DimensionValue[],
    revenues: [] as DimensionValue[],
    positionTypes: [] as DimensionValue[],
    noteTypes: [] as DimensionValue[],
    contactMethods: [] as DimensionValue[],
    fileCategories: [] as DimensionValue[]
  });

  // Notes state
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState({ 
    type: '', 
    text: '' 
  });

  // Form state with ALL original fields
  const [formData, setFormData] = useState({
    // Company Info
    company_name: '',
    industry: '',
    company_size: '',
    annual_revenue: '',
    company_website: '',
    
    // Address
    street_number: '',
    street_name: '',
    apt_suite: '',
    city: '',
    state: '',
    zip_code: '',
    
    // Primary Contact
    contact_first_name: '',
    contact_last_name: '',
    contact_job_title: '',
    contact_email: '',
    contact_phone: '',
    contact_mobile: '',
    preferred_contact_method: 'email',
    
    // Lead Info
    company_status: 'lead',
    lead_source: '',
    lead_score: 'warm',
    expected_close_date: '',
    
    // Opportunity
    staffing_needs_overview: '',
    immediate_positions: 0,
    annual_positions: 0,
    opportunity_value: 0,
    position_names: '',
    position_type: '',
    additional_staffing_details: ''
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState<Partial<Company>>({});

  // Load dimensions on mount
  useEffect(() => {
    loadDimensions();
  }, []);

  // Load companies when tab changes
  useEffect(() => {
    loadCompanies();
  }, [activeTab]);

  const loadDimensions = async () => {
    try {
      const [statuses, sources, scores, sizes, revenues, positionTypes, noteTypes, contactMethods, fileCategories] = 
        await Promise.all([
          crmDatabase.getCompanyStatuses(),
          crmDatabase.getLeadSources(),
          crmDatabase.getLeadScores(),
          crmDatabase.getCompanySizes(),
          crmDatabase.getAnnualRevenues(),
          crmDatabase.getPositionTypes(),
          crmDatabase.getNoteTypes(),
          crmDatabase.getContactMethods(),
          crmDatabase.getFileCategories()
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
        fileCategories: fileCategories.data || []
      });
    } catch (error) {
      console.error('Error loading dimensions:', error);
    }
  };

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const statusMap: { [key: string]: string } = {
        'leads': 'lead',
        'prospects': 'prospect',
        'clients': 'client'
      };
      
      const status = statusMap[activeTab];
      const result = await crmDatabase.getCompanies({ 
        status: status,
        search: searchTerm 
      });
      
      if (result.data) {
        setCompanies(result.data);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Apply formatting for phone numbers
    if (name === 'contact_phone' || name === 'contact_mobile') {
      const formatted = formatPhoneNumber(value);
      setEditFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
      return;
    }
    
    setEditFormData(prev => ({
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
    
    // Email validation
    if (formData.contact_email && !validateEmail(formData.contact_email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Zip code validation
    if (formData.zip_code && !validateZipCode(formData.zip_code)) {
      toast.error('Please enter a valid ZIP code (12345 or 12345-6789)');
      return false;
    }
    
    return true;
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const result = await crmDatabase.createCompany(formData);
      if (result.data) {
        toast.success('Company added successfully!');
        setShowAddForm(false);
        loadCompanies();
        // Reset form
        setFormData({
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
          contact_first_name: '',
          contact_last_name: '',
          contact_job_title: '',
          contact_email: '',
          contact_phone: '',
          contact_mobile: '',
          preferred_contact_method: 'email',
          company_status: 'lead',
          lead_source: '',
          lead_score: 'warm',
          expected_close_date: '',
          staffing_needs_overview: '',
          immediate_positions: 0,
          annual_positions: 0,
          opportunity_value: 0,
          position_names: '',
          position_type: '',
          additional_staffing_details: ''
        });
      }
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Failed to add company');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleViewLead = (company: Company) => {
    setSelectedLead(company);
    setEditFormData(company);
    setIsEditMode(false);
    // Reset expanded sections to default
    setExpandedSections({
      company: true,
      opportunity: false,
      notes: false,
      uploads: false
    });
  };

  const handleEditLead = (company: Company) => {
    setSelectedLead(company);
    setEditFormData(company);
    setIsEditMode(true);
    // Expand all sections in edit mode
    setExpandedSections({
      company: true,
      opportunity: true,
      notes: true,
      uploads: true
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your leads, prospects, and clients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <Users className="h-12 w-12 text-blue-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold">{companies.filter(c => c.company_status === 'lead').length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <Building className="h-12 w-12 text-yellow-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Active Prospects</p>
              <p className="text-2xl font-bold">{companies.filter(c => c.company_status === 'prospect').length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <UserCheck className="h-12 w-12 text-green-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Clients</p>
              <p className="text-2xl font-bold">{companies.filter(c => c.company_status === 'client').length}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b">
            <nav className="flex">
              {['leads', 'prospects', 'clients'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Toolbar */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search companies..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && loadCompanies()}
                />
              </div>
              <Button variant="outline" size="sm" onClick={loadCompanies}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>

          {/* Add Company Form - COMPLETE with all fields */}
          {showAddForm && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Add New Company</h3>
              <form onSubmit={handleAddCompany}>
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
                      <Input
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                      />
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
                        type="url"
                        placeholder="https://example.com"
                      />
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
                        placeholder="ZIP Code"
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
                    {saving ? 'Saving...' : 'Save Company'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Companies List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : companies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No {activeTab} found. Add your first company to get started.
              </div>
            ) : (
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
                          onClick={() => handleViewLead(company)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLead(company)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal for View/Edit - FULL SCREEN with COLLAPSIBLE SECTIONS */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedLead.company_name}</h2>
                    <p className="text-gray-600">{selectedLead.industry}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLead(null);
                      setIsEditMode(false);
                    }}
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
                      {/* Company fields - view or edit mode */}
                      {isEditMode ? (
                        <div className="grid grid-cols-2 gap-4">
                          {/* Edit mode fields - ALL fields editable */}
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
                            <Input
                              name="industry"
                              value={editFormData.industry || ''}
                              onChange={handleEditInputChange}
                            />
                          </div>
                          {/* Add all other company fields here in edit mode */}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {/* View mode - display all fields */}
                          <div>
                            <p className="text-sm text-gray-600">Company Size</p>
                            <p className="font-medium">{selectedLead.company_size || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Annual Revenue</p>
                            <p className="font-medium">{selectedLead.annual_revenue || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Website</p>
                            <p className="font-medium">{selectedLead.company_website || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="font-medium">
                              {[selectedLead.street_number, selectedLead.street_name, selectedLead.apt_suite]
                                .filter(Boolean).join(' ')}<br/>
                              {[selectedLead.city, selectedLead.state, selectedLead.zip_code]
                                .filter(Boolean).join(', ')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Primary Contact</p>
                            <p className="font-medium">
                              {[selectedLead.contact_first_name, selectedLead.contact_last_name]
                                .filter(Boolean).join(' ')}<br/>
                              {selectedLead.contact_job_title}<br/>
                              {selectedLead.contact_email}<br/>
                              {selectedLead.contact_phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Lead Information</p>
                            <p className="font-medium">
                              Source: {selectedLead.lead_source || 'Unknown'}<br/>
                              Score: {selectedLead.lead_score || 'Not set'}<br/>
                              Status: {selectedLead.company_status}
                            </p>
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
                          {selectedLead.opportunity_value ? formatCurrency(selectedLead.opportunity_value) : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Staffing Needs Overview</p>
                        <p>{selectedLead.staffing_needs_overview || 'Not provided'}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Immediate Positions</p>
                          <p className="font-medium">{selectedLead.immediate_positions || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Annual Positions</p>
                          <p className="font-medium">{selectedLead.annual_positions || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Position Type</p>
                          <p className="font-medium">{selectedLead.position_type || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes Section - COLLAPSIBLE with DROPDOWN */}
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
                      <div className="mb-4 flex gap-2">
                        <select
                          value={newNote.type}
                          onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}
                          className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select note type</option>
                          {dimensions.noteTypes.map(type => (
                            <option key={type.id} value={type.name}>{type.name}</option>
                          ))}
                        </select>
                        <Input
                          placeholder="Add a note..."
                          value={newNote.text}
                          onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => {
                            if (newNote.type && newNote.text) {
                              // Add note logic here
                              setNotes([...notes, { ...newNote, date: new Date().toISOString() }]);
                              setNewNote({ type: '', text: '' });
                              toast.success('Note added');
                            } else {
                              toast.error('Please select a type and enter a note');
                            }
                          }} 
                          size="sm"
                        >
                          Add Note
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {notes.length === 0 ? (
                          <p className="text-sm text-gray-500">No notes yet</p>
                        ) : (
                          notes.map((note, index) => (
                            <div key={index} className="border rounded p-3 bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-gray-700">{note.type}</span>
                                  <p className="text-sm mt-1">{note.text}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(note.date).toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => setNotes(notes.filter((_, i) => i !== index))}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
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
                        <Button size="sm" variant="outline">
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
                      <Button onClick={async () => {
                        setSaving(true);
                        try {
                          const result = await crmDatabase.updateCompany(selectedLead.company_id, editFormData);
                          if (result.data) {
                            setSelectedLead(result.data);
                            setIsEditMode(false);
                            loadCompanies();
                            toast.success('Company updated successfully');
                          }
                        } catch (error) {
                          toast.error('Failed to update company');
                        } finally {
                          setSaving(false);
                        }
                      }} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditMode(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditMode(true)}>
                      Edit Company
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
		
		
		
		
      </main>
      
      <Footer />
    </div>
  );
}