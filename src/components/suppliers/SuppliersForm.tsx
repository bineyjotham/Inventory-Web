// src/components/suppliers/SupplierForm.tsx
import React, { useState } from 'react';
import { Supplier } from '../../types';
import Button from '../common/Button';

interface SupplierFormProps {
  supplier?: Supplier;
  onClose: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onClose }) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contactPerson: supplier?.contactPerson || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    status: supplier?.status || 'active'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Supplier saved:', formData);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supplier Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter supplier name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person *
          </label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
            placeholder="Enter contact person name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="supplier@company.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="active"
              checked={formData.status === 'active'}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Active</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="inactive"
              checked={formData.status === 'inactive'}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Inactive</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {supplier ? 'Update Supplier' : 'Add Supplier'}
        </Button>
      </div>
    </form>
  );
};

export default SupplierForm;