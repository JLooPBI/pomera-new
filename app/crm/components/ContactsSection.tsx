"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { crmDatabase, type DimensionValue } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';

interface ContactsSectionProps {
  companyId: string;
  contacts: any[];
  contactTypes: DimensionValue[];
  onContactsChange: (contacts: any[]) => void;
  saving: boolean;
}

export default function ContactsSection({ 
  companyId, 
  contacts, 
  contactTypes, 
  onContactsChange,
  saving 
}: ContactsSectionProps) {
  const [newContact, setNewContact] = useState({
    contact_type: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_job_title: '',
    contact_email: '',
    contact_phone: '',
    contact_mobile: '',
    preferred_contact_method: 'email' as 'email' | 'phone' | 'mobile'
  });

  const handleAddContact = async () => {
    if (!newContact.contact_first_name || !newContact.contact_last_name || !newContact.contact_email) {
      toast.error('First name, last name, and email are required');
      return;
    }

    try {
      const result = await crmDatabase.createContact({
        ...newContact,
        company_id: companyId,
        is_primary_contact: contacts.length === 0 // First contact is primary
      });
      
      if (result.data) {
        onContactsChange([...contacts, result.data]);
        setNewContact({
          contact_type: '',
          contact_first_name: '',
          contact_last_name: '',
          contact_job_title: '',
          contact_email: '',
          contact_phone: '',
          contact_mobile: '',
          preferred_contact_method: 'email' as 'email' | 'phone' | 'mobile'
        });
        toast.success('Contact added successfully');
      }
    } catch (error) {
      toast.error('Failed to add contact');
    }
  };

  const handleDeleteContact = (index: number) => {
    onContactsChange(contacts.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Contacts</h3>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <Input
          placeholder="First Name"
          value={newContact.contact_first_name}
          onChange={(e) => setNewContact({ ...newContact, contact_first_name: e.target.value })}
        />
        <Input
          placeholder="Last Name"
          value={newContact.contact_last_name}
          onChange={(e) => setNewContact({ ...newContact, contact_last_name: e.target.value })}
        />
        <Input
          placeholder="Job Title"
          value={newContact.contact_job_title}
          onChange={(e) => setNewContact({ ...newContact, contact_job_title: e.target.value })}
        />
        <Input
          placeholder="Email"
          type="email"
          value={newContact.contact_email}
          onChange={(e) => setNewContact({ ...newContact, contact_email: e.target.value })}
        />
        <Input
          placeholder="Phone"
          value={newContact.contact_phone}
          onChange={(e) => setNewContact({ ...newContact, contact_phone: e.target.value })}
        />
        <Input
          placeholder="Mobile"
          value={newContact.contact_mobile}
          onChange={(e) => setNewContact({ ...newContact, contact_mobile: e.target.value })}
        />
        <div className="col-span-2">
          <Button onClick={handleAddContact} disabled={saving} size="sm">
            {saving ? 'Adding...' : 'Add Contact'}
          </Button>
        </div>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {contacts.length === 0 ? (
          <p className="text-sm text-gray-500">No contacts yet</p>
        ) : (
          contacts.map((contact, index) => (
            <div key={contact.contact_id || index} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{contact.contact_first_name} {contact.contact_last_name}</p>
                  <p className="text-sm text-gray-600">{contact.contact_job_title}</p>
                  <p className="text-sm">{contact.contact_email}</p>
                  {contact.contact_phone && <p className="text-sm">{contact.contact_phone}</p>}
                </div>
                <button
                  onClick={() => handleDeleteContact(index)}
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
  );
}
