import { Dialog } from '@headlessui/react';
import { DocumentTextIcon, ShareIcon, CameraIcon } from '@heroicons/react/24/outline';
import React,{ useState } from 'react';

export default function ContentTypeSelector({ isOpen, onClose, onContinue }) {
  const [selectedTypes, setSelectedTypes] = useState(new Set());

  const contentTypes = [
    { id: 'blog', name: 'Blog Post', icon: DocumentTextIcon, description: 'Create a detailed blog post' },
    { id: 'linkedin', name: 'LinkedIn', icon: ShareIcon, description: 'Professional network post' },
    { id: 'instagram', name: 'Instagram', icon: CameraIcon, description: 'Visual-focused social post' }
  ];

  const toggleSelection = (typeId) => {
    const newSelection = new Set(selectedTypes);
    if (newSelection.has(typeId)) {
      newSelection.delete(typeId);
    } else {
      newSelection.add(typeId);
    }
    setSelectedTypes(newSelection);
  };

  const handleContinue = () => {
    if (selectedTypes.size > 0) {
      onContinue(Array.from(selectedTypes));
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-lg p-8 max-w-2xl mx-auto">
          <Dialog.Title className="text-2xl font-semibold mb-4">
            Choose Content Types
          </Dialog.Title>
          <p className="text-gray-600 mb-6">
            Select one or more types of content you want to generate
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => toggleSelection(type.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedTypes.has(type.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                }`}
              >
                <type.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <h3 className="font-medium mb-1">{type.name}</h3>
                <p className="text-sm text-gray-500">{type.description}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedTypes.size === 0}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}