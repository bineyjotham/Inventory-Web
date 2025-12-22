// src/components/examples/ModalExamples.tsx
import React, { useState, useRef } from 'react';
import Modal, {
  ConfirmationModal,
  AlertModal,
  SideModal,
  BottomSheet,
  FullScreenModal,
  LoadingModal,
  useModal
} from '../common/Modal';
import Button from '../common/Button';
import {
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  EyeIcon,
  DocumentIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const ModalExamples: React.FC = () => {
  // State for different modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Using the useModal hook
  const { isOpen: isHookModalOpen, open: openHookModal, close: closeHookModal } = useModal();

  // Handle confirm action
  const handleConfirm = () => {
    console.log('Confirmed!');
    setActiveModal(null);
  };

  // Handle delete action
  const handleDelete = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setActiveModal(null);
      console.log('Item deleted!');
    }, 1500);
  };

  // Simulate progress
  const simulateProgress = () => {
    setActiveModal('loading');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setActiveModal(null), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-900">Modal Components</h2>

      {/* Basic Modals */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Modals</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={() => setActiveModal('basic')}
            icon={<EyeIcon className="w-4 h-4" />}
          >
            Basic Modal
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setActiveModal('large')}
            icon={<DocumentIcon className="w-4 h-4" />}
          >
            Large Modal
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setActiveModal('full')}
            icon={<ArrowDownTrayIcon className="w-4 h-4" />}
          >
            Full Screen
          </Button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation Modals</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="danger"
            onClick={() => setActiveModal('delete')}
            icon={<TrashIcon className="w-4 h-4" />}
          >
            Delete Item
          </Button>
          
          <Button
            variant="warning"
            onClick={() => setActiveModal('warning')}
            icon={<ExclamationTriangleIcon className="w-4 h-4" />}
          >
            Warning Alert
          </Button>
          
          <Button
            variant="success"
            onClick={() => setActiveModal('success')}
            icon={<CheckCircleIcon className="w-4 h-4" />}
          >
            Success Alert
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setActiveModal('info')}
            icon={<InformationCircleIcon className="w-4 h-4" />}
          >
            Info Alert
          </Button>
        </div>
      </div>

      {/* Special Modals */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Modals</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveModal('side')}
          >
            Side Modal
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setActiveModal('bottom')}
          >
            Bottom Sheet
          </Button>
          
          <Button
            variant="outline"
            onClick={simulateProgress}
          >
            Loading Modal
          </Button>
          
          <Button
            variant="primary"
            onClick={openHookModal}
          >
            Hook Modal
          </Button>
        </div>
      </div>

      {/* Modal Content Examples */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Form in Modal</h3>
        <Button
          variant="primary"
          onClick={() => setActiveModal('form')}
          icon={<PlusIcon className="w-4 h-4" />}
        >
          Add Item (Form)
        </Button>
      </div>

      {/* MODALS */}

      {/* Basic Modal */}
      <Modal
        isOpen={activeModal === 'basic'}
        onClose={() => setActiveModal(null)}
        title="Basic Modal"
        size="md"
        initialFocusRef={inputRef}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is a basic modal dialog. It can contain any content you want.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Field
            </label>
            <input
              ref={inputRef}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type something..."
            />
          </div>
        </div>
      </Modal>

      {/* Large Modal */}
      <Modal
        isOpen={activeModal === 'large'}
        onClose={() => setActiveModal(null)}
        title="Large Modal with Scroll"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This modal has a larger size and demonstrates scrolling content.
          </p>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <p>Content item {i + 1}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Full Screen Modal */}
      <FullScreenModal
        isOpen={activeModal === 'full'}
        onClose={() => setActiveModal(null)}
        title="Full Screen Modal"
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Full Screen Content</h2>
            <p className="text-gray-600 mb-6">
              This modal takes up the entire screen. Great for immersive experiences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Card {i + 1}</h3>
                  <p className="text-gray-600">Some content here</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FullScreenModal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="danger"
        isLoading={isLoading}
      />

      {/* Warning Alert */}
      <AlertModal
        isOpen={activeModal === 'warning'}
        onClose={() => setActiveModal(null)}
        title="Low Stock Warning"
        message="5 items are below minimum stock levels. Please consider restocking."
        variant="warning"
        buttonText="View Items"
      />

      {/* Success Alert */}
      <AlertModal
        isOpen={activeModal === 'success'}
        onClose={() => setActiveModal(null)}
        title="Operation Successful"
        message="The inventory item has been successfully updated."
        variant="success"
      />

      {/* Info Alert */}
      <AlertModal
        isOpen={activeModal === 'info'}
        onClose={() => setActiveModal(null)}
        title="Information"
        message="Your changes have been saved as draft. You can continue editing later."
        variant="info"
      />

      {/* Side Modal */}
      <SideModal
        isOpen={activeModal === 'side'}
        onClose={() => setActiveModal(null)}
        title="Side Panel"
      >
        <div className="space-y-4 h-full">
          <p className="text-gray-600">
            This modal slides in from the side. Great for settings or additional information.
          </p>
          <div className="space-y-3">
            {['Option 1', 'Option 2', 'Option 3'].map((option) => (
              <button
                key={option}
                className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </SideModal>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={activeModal === 'bottom'}
        onClose={() => setActiveModal(null)}
        title="Bottom Sheet"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This modal slides up from the bottom. Perfect for mobile interfaces.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['Action 1', 'Action 2', 'Action 3', 'Action 4'].map((action) => (
              <button
                key={action}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* Loading Modal */}
      <LoadingModal
        isOpen={activeModal === 'loading'}
        onClose={() => setActiveModal(null)}
        title="Processing..."
        message="Exporting inventory data..."
        progress={progress}
        showProgress={true}
      />

      {/* Form Modal */}
      <Modal
        isOpen={activeModal === 'form'}
        onClose={() => setActiveModal(null)}
        title="Add New Inventory Item"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setActiveModal(null)}>
              Save Item
            </Button>
          </div>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter item name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Enter item description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="office">Office Supplies</option>
                <option value="materials">Raw Materials</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Hook Modal Example */}
      <Modal
        {...isHookModalOpen.modalProps}
        title="Modal using Hook"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This modal is controlled using the useModal hook for cleaner state management.
          </p>
          <div className="flex justify-end">
            <Button variant="primary" onClick={closeHookModal}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalExamples;