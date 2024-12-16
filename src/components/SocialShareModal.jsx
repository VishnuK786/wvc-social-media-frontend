import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function SocialShareModal({ 
  isOpen, 
  onClose,
  onContinue,
  prompt, 
  blogContent, 
  imageUrl,
  fileName,
  folderName 
}) {
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: '🔗' },
    { id: 'instagram', name: 'Instagram', icon: '📸' }
  ];

  const togglePlatform = (platformId) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId);
    } else {
      newSelected.add(platformId);
    }
    setSelectedPlatforms(newSelected);
  };

  const handleContinue = () => {
    if (selectedPlatforms.size > 0) {
      onContinue(selectedPlatforms);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-lg max-w-4xl mx-auto p-8">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Share Your Blog
          </Dialog.Title>
          <p className="text-gray-600 mb-6">
            Post your blog on LinkedIn and Instagram to engage with a wider audience, 
            spark conversations, and inspire connections.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`p-4 rounded-lg border-2 ${
                  selectedPlatforms.has(platform.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="text-2xl mb-2">{platform.icon}</div>
                <div className="font-medium">{platform.name}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-orange-500 text-white rounded"
              disabled={selectedPlatforms.size === 0}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}