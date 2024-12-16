import React,{ useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { Dialog } from '@headlessui/react';
import LinkedInPreview from './LinkedInPreview';
import InstagramPreview from './InstagramPreview';
import LoadingSpinner from '../LoadingSpinner';
import { generateInstagramContent, generateLinkedInContent } from '../../services/api';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SocialPlatformContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { platform } = useParams();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({});
  const [isRefineOpen, setIsRefineOpen] = useState(false);
  const [refineKeywords, setRefineKeywords] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  
  const { platforms = [], prompt = '', blogContent, imageUrl, fileName, folderName } = location.state || {};

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const contentPromises = platforms.map(platform => {
          if (platform === 'linkedin') {
            return generateLinkedInContent(prompt, folderName, fileName).then(response => ({
              platform: 'linkedin',
              content: {
                ...response,
                imageUrl,
                text: response.linkedin_content
              }
            }));
          } else {
            return generateInstagramContent(prompt, folderName, fileName).then(response => ({
              platform: 'instagram',
              content: {
                ...response,
                imageUrl,
                text: response.instagram_content
              }
            }));
          }
        });

        const results = await Promise.all(contentPromises);
        const newContent = {};
        results.forEach(({ platform, content }) => {
          newContent[platform] = content;
        });
        setContent(newContent);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (platforms.length > 0 && prompt) {
      fetchContent();
    }
  }, [platforms, prompt, fileName, folderName, imageUrl]);

  const handleRefine = async () => {
    if (!refineKeywords.trim() || !selectedPlatform) return;
    
    setLoading(true);
    try {
      const response = await (selectedPlatform === 'linkedin' 
        ? generateLinkedInContent(refineKeywords, folderName, fileName)
        : generateInstagramContent(refineKeywords, folderName, fileName));

      setContent(prev => ({
        ...prev,
        [selectedPlatform]: {
          ...response,
          imageUrl,
          text: selectedPlatform === 'linkedin' ? response.linkedin_content : response.instagram_content
        }
      }));
      setIsRefineOpen(false);
    } catch (error) {
      console.error('Error refining content:', error);
    } finally {
      setLoading(false);
    }
  };

  const openRefineDialog = (platform) => {
    setSelectedPlatform(platform);
    setIsRefineOpen(true);
  };

  const tabs = platforms.map(platform => ({
    id: platform,
    name: platform === 'linkedin' ? 'LinkedIn' : 'Instagram',
    component: platform === 'linkedin' ? LinkedInPreview : InstagramPreview,
    content: content[platform]
  }));

  if (!content || Object.keys(content).length === 0) {
    return loading ? <LoadingSpinner /> : null;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-sm">
        <Tab.Group>
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
                  onBack: () => navigate(-1),
                  onRefine: () => openRefineDialog(tab.id)
                })}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      <Dialog
        open={isRefineOpen}
        onClose={() => setIsRefineOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Refine Your Content
            </Dialog.Title>
            <p className="text-gray-600 mb-4">
              Tweak ideas, add depth, and ensure every detail aligns perfectly with
              your message for a truly impactful final piece
            </p>
            <input
              type="text"
              value={refineKeywords}
              onChange={(e) => setRefineKeywords(e.target.value)}
              placeholder="Enter keywords..."
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsRefineOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRefine}
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Refine
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      {loading && <LoadingSpinner />}
    </div>
  );
}