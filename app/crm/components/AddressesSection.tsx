"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AddressesSectionProps {
  companyId: string;
  addresses: any[];
  addressTypes: any[];
  onAddressesChange: (addresses: any[]) => void;
  saving: boolean;
}

export default function AddressesSection({ 
  companyId, 
  addresses, 
  addressTypes, 
  onAddressesChange,
  saving 
}: AddressesSectionProps) {
  const [newAddress, setNewAddress] = useState({
    address_type: '',
    street_name_number: '',
    apt_suite: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const handleAddAddress = async () => {
    if (!newAddress.street_name_number || !newAddress.city || !newAddress.state) {
      toast.error('Street, city, and state are required');
      return;
    }

    // Validate zip code if provided
    if (newAddress.zip_code && !validateZipCode(newAddress.zip_code)) {
      toast.error('Please enter a proper Zip code in format XXXXX or XXXXX-XXXX');
      return;
    }

    try {
      // For now, just add to local state since we don't have a separate addresses table
      const address = {
        id: Date.now().toString(),
        ...newAddress,
        company_id: companyId
      };
      
      onAddressesChange([...addresses, address]);
      setNewAddress({
        address_type: '',
        street_name_number: '',
        apt_suite: '',
        city: '',
        state: '',
        zip_code: ''
      });
      toast.success('Address added successfully');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = (index: number) => {
    onAddressesChange(addresses.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Addresses</h3>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <Input
          placeholder="Street Name & Number"
          value={newAddress.street_name_number}
          onChange={(e) => setNewAddress({ ...newAddress, street_name_number: e.target.value })}
        />
        <Input
          placeholder="Apt/Suite"
          value={newAddress.apt_suite}
          onChange={(e) => setNewAddress({ ...newAddress, apt_suite: e.target.value })}
        />
        <Input
          placeholder="City"
          value={newAddress.city}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
        />
        <Input
          placeholder="State"
          value={newAddress.state}
          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
        />
        <Input
          placeholder="12345 or 12345-6789"
          value={newAddress.zip_code}
          onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })}
        />
        <div className="col-span-2">
          <Button onClick={handleAddAddress} disabled={saving} size="sm">
            {saving ? 'Adding...' : 'Add Address'}
          </Button>
        </div>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {addresses.length === 0 ? (
          <p className="text-sm text-gray-500">No addresses yet</p>
        ) : (
          addresses.map((address, index) => (
            <div key={address.id || index} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{address.street_name_number}</p>
                  {address.apt_suite && <p className="text-sm text-gray-600">Apt/Suite: {address.apt_suite}</p>}
                  <p className="text-sm">{address.city}, {address.state} {address.zip_code}</p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(index)}
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
