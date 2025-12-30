import React, { useState } from 'react';
import Button from '../common/Button';
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

interface MovementFormProps {
  onClose: () => void;
}

const MovementForm: React.FC<MovementFormProps> = ({ onClose }) => {
  const [movementType, setMovementType] = useState<'inbound' | 'outbound' | 'adjustment'>('inbound');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Movement recorded:', {
        movementType,
        itemId,
        quantity,
        reference,
        notes
      });
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setMovementType('inbound')}
          className={`p-4 rounded-xl border-2 transition-all ${
            movementType === 'inbound'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              movementType === 'inbound' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <ArrowDownCircleIcon className={`w-6 h-6 ${
                movementType === 'inbound' ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-left">
              <div className={`font-medium ${
                movementType === 'inbound' ? 'text-green-900' : 'text-gray-900'
              }`}>
                Inbound
              </div>
              <div className={`text-sm ${
                movementType === 'inbound' ? 'text-green-700' : 'text-gray-500'
              }`}>
                Receiving stock
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMovementType('outbound')}
          className={`p-4 rounded-xl border-2 transition-all ${
            movementType === 'outbound'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              movementType === 'outbound' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <ArrowUpCircleIcon className={`w-6 h-6 ${
                movementType === 'outbound' ? 'text-red-600' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-left">
              <div className={`font-medium ${
                movementType === 'outbound' ? 'text-red-900' : 'text-gray-900'
              }`}>
                Outbound
              </div>
              <div className={`text-sm ${
                movementType === 'outbound' ? 'text-red-700' : 'text-gray-500'
              }`}>
                Dispatching stock
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMovementType('adjustment')}
          className={`p-4 rounded-xl border-2 transition-all ${
            movementType === 'adjustment'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              movementType === 'adjustment' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <AdjustmentsHorizontalIcon className={`w-6 h-6 ${
                movementType === 'adjustment' ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-left">
              <div className={`font-medium ${
                movementType === 'adjustment' ? 'text-blue-900' : 'text-gray-900'
              }`}>
                Adjustment
              </div>
              <div className={`text-sm ${
                movementType === 'adjustment' ? 'text-blue-700' : 'text-gray-500'
              }`}>
                Stock correction
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Selection
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="Enter Item ID or SKU"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Browse Items
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., PO-2024-001"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes or comments..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
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
          Record Movement
        </Button>
      </div>
    </form>
  );
};

export default MovementForm;