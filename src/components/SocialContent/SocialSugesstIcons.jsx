import React, { useState } from 'react';
import { Dialog } from '@headlessui/react'; // Importing Dialog from Headless UI
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for routing
import { HomeIcon } from '@heroicons/react/24/solid';

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', icon: '🔗' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
];

const SocialSugesstIcons = ({isStatic}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set()); // Tracks selected platforms
  const [isOpen, setIsOpen] = useState(true); // State to control Dialog visibility
  const navigate = useNavigate(); // Hook for navigation

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(platformId)) {
        newSelection.delete(platformId);
      } else {
        newSelection.add(platformId);
      }
      return newSelection;
    });
  };

  const handleContinue = () => {
    // Logic to handle what happens when 'Continue' is clicked
    console.log('Selected platforms:', Array.from(selectedPlatforms));
    setIsOpen(false); // Close the dialog after continuing
  };

  const handleHomeRedirect = () => {
    navigate('/home'); // Redirects to /home
  };

  return (
    <div className="container">
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg max-w-4xl mx-auto p-8">
            <Dialog.Title className="text-xl font-semibold mb-4">Share Your Blog</Dialog.Title>
            <p className="text-gray-600 mb-6">
              Would you like to share on other social media platforms as well?
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
                onClick={handleHomeRedirect} // Redirects to /home on click
                className="px-4 py-2 border rounded flex items-center gap-2"
              >
                <HomeIcon className="text-lg" /> {/* Home icon */}
                Home
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
    </div>
  );
};

export default SocialSugesstIcons;
