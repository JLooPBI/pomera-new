"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { crmDatabase, type CompanyAddress, type DimensionValue } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';

interface AddressesSectionProps {
  companyId: string;
  addresses: CompanyAddress[];
  addressTypes: DimensionValue[];
  onAddressesChange: (addresses: CompanyAddress[]) => void;
  saving: boolean;
  isNewCompany?: boolean;
}

export default function AddressesSection({ 
  companyId, 
  addresses, 
  addressTypes,
  onAddressesChange,
  saving,
  isNewCompany = false
}: AddressesSectionProps) {
  console.log('AddressesSection - addressTypes:', addressTypes);
  console.log('AddressesSection - addresses:', addresses);
  console.log('AddressesSection - address type lookup test:', addressTypes.find(type => type.id === 3));
  
  // Debug function to get address type name
  const getAddressTypeName = (typeId: number) => {
    const type = addressTypes.find(t => t.id === typeId);
    console.log(`Looking up address type ID ${typeId}:`, type);
    return type ? type.name : `Type ID: ${typeId}`;
  };
  const [newAddress, setNewAddress] = useState<Partial<CompanyAddress>>({
    address_type_id: 0,
    street_address: '',
    apt_suite: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddAddress = async () => {
    if (!newAddress.address_type_id || !newAddress.street_address || !newAddress.city || !newAddress.state) {
      toast.error('Please fill in all required fields (Address Type, Street Address, City, State)');
      return;
    }

    try {
      if (isNewCompany) {
        // For new companies, just add to local state - will be saved when company is created
        const tempAddress: CompanyAddress = {
          address_id: `temp-${Date.now()}`, // Temporary ID
          company_id: '', // Will be set when company is created
          address_type_id: newAddress.address_type_id!,
          street_address: newAddress.street_address!,
          apt_suite: newAddress.apt_suite,
          city: newAddress.city!,
          state: newAddress.state!,
          zip_code: newAddress.zip_code,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        };
        
        onAddressesChange([...addresses, tempAddress]);
        setNewAddress({
          address_type_id: 0,
          street_address: '',
          apt_suite: '',
          city: '',
          state: '',
          zip_code: ''
        });
        setShowAddForm(false);
        toast.success('Address added (will be saved when company is created)');
      } else {
        // For existing companies, save to database immediately
        const addressData = await crmDatabase.createAddress({
          company_id: companyId,
          ...newAddress
        });
        
        onAddressesChange([...addresses, addressData]);
        setNewAddress({
          address_type_id: 0,
          street_address: '',
          apt_suite: '',
          city: '',
          state: '',
          zip_code: ''
        });
        setShowAddForm(false);
        toast.success('Address added successfully');
      }
    } catch (error) {
      console.error('Address creation error:', error);
      if (error instanceof Error) {
        toast.error(`Failed to add address: ${error.message}`);
      } else {
        toast.error('Failed to add address');
      }
    }
  };

  const handleDeleteAddress = async (address: CompanyAddress, index: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        if (!isNewCompany && address.address_id && !address.address_id.startsWith('temp-')) {
          // Only delete from database if it's an existing address
          await crmDatabase.deleteAddress(address.address_id);
        }
        onAddressesChange(addresses.filter((_, i) => i !== index));
        toast.success('Address deleted successfully');
      } catch (error) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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
          Add Address
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Type *</label>
              <select
                name="address_type_id"
                value={newAddress.address_type_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select address type</option>
                {addressTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <Input
                  name="street_address"
                  placeholder="123 Main Street"
                  value={newAddress.street_address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apt/Suite</label>
                <Input
                  name="apt_suite"
                  placeholder="Apt/Suite"
                  value={newAddress.apt_suite}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <Input
                  name="city"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select
                  name="state"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">State</option>
                  {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                <Input
                  name="zip_code"
                  placeholder="Zip Code"
                  value={newAddress.zip_code}
                  onChange={handleInputChange}
                  pattern="[0-9]{5}(-[0-9]{4})?"
                />
              </div>
            </div>
            

          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleAddAddress} 
              size="sm"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Address'}
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
        {addresses.length === 0 ? (
          <p className="text-sm text-gray-500">No addresses added yet</p>
        ) : (
          addresses.map((address, index) => (
            <div key={address.address_id || index} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {getAddressTypeName(address.address_type_id)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {address.street_address}
                    {address.apt_suite && `, ${address.apt_suite}`}
                    {address.city && `, ${address.city}`}
                    {address.state && `, ${address.state}`}
                    {address.zip_code && ` ${address.zip_code}`}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteAddress(address, index)}
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
