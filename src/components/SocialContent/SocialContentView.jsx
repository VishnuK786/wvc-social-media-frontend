import React,{ useState } from 'react';
import { Tab } from '@headlessui/react';
import LinkedInPreview from './LinkedInPreview';
import InstagramPreview from './InstagramPreview';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SocialContentView({ platforms, content, onBack, onRefine }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [refineOpen, setRefineOpen] = useState(false);
  const [refineKeywords, setRefineKeywords] = useState('');

  const handleRefineSubmit = (platform) => {
if(refineKeywords){
    onRefine(platform, refineKeywords);
    setRefineOpen(false);
    setRefineKeywords('');
}
  };

  const tabs = platforms.map(platform => ({
    id: platform,
    name: platform === 'linkedin' ? 'LinkedIn' : 'Instagram',
    component: platform === 'linkedin' ? LinkedInPreview : InstagramPreview,
    content: platform === 'linkedin' ? content.linkedin : content.instagram
  }));

  if (tabs.length === 1) {
    const { id, component: Preview, content: platformContent } = tabs[0];
    return (
      <Preview
        content={platformContent}
        onBack={onBack}
        onRefine={() => {
          setRefineOpen(true);
          // handleRefineSubmit(id);
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 border-b p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab) => (
            <Tab.Panel key={tab.id}>
              {React.createElement(tab.component, {
                content: tab.content,
                onBack,
                onRefine: () => {
                  setRefineOpen(true);
                  // handleRefineSubmit(tab.id);
                }
              })}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      {refineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-black opacity-50 absolute inset-0" />
          <div className="bg-white rounded-lg p-6 relative z-10 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Refine Content</h3>
            <input
              type="text"
              value={refineKeywords}
              onChange={(e) => setRefineKeywords(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter keywords to refine..."
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setRefineOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRefineSubmit(tabs[selectedIndex].id)}
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Refine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}