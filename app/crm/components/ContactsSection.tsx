"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { PhoneIcon } from './icons/PhoneIcon';
import { SmartphoneIcon } from './icons/SmartphoneIcon';
import { crmDatabase, type CompanyContact, type DimensionValue } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';

interface ContactsSectionProps {
  companyId: string;
  contacts: CompanyContact[];
  contactTypes: DimensionValue[];
  contactMethods: DimensionValue[];
  onContactsChange: (contacts: CompanyContact[]) => void;
  saving: boolean;
  isNewCompany?: boolean;
}

export default function ContactsSection({ 
  companyId, 
  contacts, 
  contactTypes,
  contactMethods,
  onContactsChange,
  saving,
  isNewCompany = false
}: ContactsSectionProps) {
  const [newContact, setNewContact] = useState<Partial<CompanyContact>>({
    contact_type: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_job_title: '',
    contact_email: '',
    contact_phone: '',
    contact_mobile: '',
    preferred_contact_method: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return true; // Empty phone is valid (optional field)
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11; // 10 digits or 11 with country code
  };

  const handleAddContact = async () => {
    if (!newContact.contact_type || !newContact.contact_first_name || !newContact.contact_last_name) {
      toast.error('Please fill in all required fields (Contact Type, First Name, Last Name)');
      return;
    }

    // Validate phone numbers
    if (newContact.contact_phone && !validatePhoneNumber(newContact.contact_phone)) {
      toast.error('Work phone must be a valid 10-digit phone number');
      return;
    }

    if (newContact.contact_mobile && !validatePhoneNumber(newContact.contact_mobile)) {
      toast.error('Mobile phone must be a valid 10-digit phone number');
      return;
    }

    try {
      if (isNewCompany) {
        // For new companies, just add to local state - will be saved when company is created
        const tempContact: CompanyContact = {
          contact_id: `temp-${Date.now()}`, // Temporary ID
          company_id: '', // Will be set when company is created
          contact_type: newContact.contact_type!,
          contact_first_name: newContact.contact_first_name!,
          contact_last_name: newContact.contact_last_name!,
          contact_job_title: newContact.contact_job_title,
          contact_email: newContact.contact_email || '',
          contact_phone: newContact.contact_phone,
          contact_mobile: newContact.contact_mobile,
          preferred_contact_method: newContact.preferred_contact_method || '',
          is_active: true,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        };
        
        onContactsChange([...contacts, tempContact]);
        setNewContact({
          contact_type: '',
          contact_first_name: '',
          contact_last_name: '',
          contact_job_title: '',
          contact_email: '',
          contact_phone: '',
          contact_mobile: '',
          preferred_contact_method: ''
        });
        setShowAddForm(false);
        toast.success('Contact added (will be saved when company is created)');
      } else {
        // For existing companies, save to database immediately
        const contactData = await crmDatabase.createContact({
          company_id: companyId,
          ...newContact
        });
        
        onContactsChange([...contacts, contactData]);
        setNewContact({
          contact_type: '',
          contact_first_name: '',
          contact_last_name: '',
          contact_job_title: '',
          contact_email: '',
          contact_phone: '',
          contact_mobile: '',
          preferred_contact_method: ''
        });
        setShowAddForm(false);
        toast.success('Contact added successfully');
      }
    } catch (error) {
      console.error('Contact creation error:', error);
      if (error instanceof Error) {
        toast.error(`Failed to add contact: ${error.message}`);
      } else {
        toast.error('Failed to add contact');
      }
    }
  };

  const handleDeleteContact = async (contact: CompanyContact, index: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        if (!isNewCompany && contact.contact_id && !contact.contact_id.startsWith('temp-')) {
          // Only delete from database if it's an existing contact
          await crmDatabase.deleteContact(contact.contact_id);
        }
        onContactsChange(contacts.filter((_, i) => i !== index));
        toast.success('Contact deleted successfully');
      } catch (error) {
        toast.error('Failed to delete contact');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Format phone numbers
    if (name === 'contact_phone' || name === 'contact_mobile') {
      // Remove all non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      
      // Format as (XXX) XXX-XXXX
      let formattedValue = '';
      if (numericValue.length > 0) {
        if (numericValue.length <= 3) {
          formattedValue = `(${numericValue}`;
        } else if (numericValue.length <= 6) {
          formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
        } else {
          formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
        }
      }
      
      setNewContact(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setNewContact(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          type="button"
          onClick={toggleAddForm}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type *</label>
              <select
                name="contact_type"
                value={newContact.contact_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select contact type</option>
                {contactTypes.map(type => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <Input
              name="contact_first_name"
              placeholder="First Name *"
              value={newContact.contact_first_name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              name="contact_last_name"
              placeholder="Last Name *"
              value={newContact.contact_last_name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              name="contact_job_title"
              placeholder="Job Title"
              value={newContact.contact_job_title}
              onChange={handleInputChange}
            />
            
            <Input
              name="contact_email"
              type="email"
              placeholder="Email"
              value={newContact.contact_email}
              onChange={handleInputChange}
            />
            
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-gray-500" />
              <Input
                name="contact_phone"
                placeholder="Work Phone"
                value={newContact.contact_phone}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <SmartphoneIcon className="h-4 w-4 text-gray-500" />
              <Input
                name="contact_mobile"
                placeholder="Mobile Phone"
                value={newContact.contact_mobile}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
              <select
                name="preferred_contact_method"
                value={newContact.preferred_contact_method}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select method</option>
                {contactMethods.map(method => (
                  <option key={method.id} value={method.name}>{method.name}</option>
                ))}
              </select>
            </div>
            

          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleAddContact} 
              size="sm"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Contact'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={toggleAddForm}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <p className="text-sm text-gray-500">No contacts added yet</p>
        ) : (
          contacts.map((contact, index) => (
            <div key={contact.contact_id || index} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">{contact.contact_type}</span>
                    {contact.is_primary_contact && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Primary
                      </span>
                    )}
                    {contact.is_decision_maker && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Decision Maker
                      </span>
                    )}
                    {!contact.is_active && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">{contact.contact_first_name} {contact.contact_last_name}</span>
                    {contact.contact_job_title && ` - ${contact.contact_job_title}`}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <div>{contact.contact_email}</div>
                    {contact.contact_phone && (
                      <div className="flex items-center gap-1">
                        <PhoneIcon className="h-3 w-3" />
                        <span>{contact.contact_phone}</span>
                        <span className="text-xs text-gray-400">(work)</span>
                      </div>
                    )}
                    {contact.contact_mobile && (
                      <div className="flex items-center gap-1">
                        <SmartphoneIcon className="h-3 w-3" />
                        <span>{contact.contact_mobile}</span>
                        <span className="text-xs text-gray-400">(mobile)</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      Preferred: {contact.preferred_contact_method}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteContact(contact, index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
