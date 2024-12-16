import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { Dialog } from '@headlessui/react';
import parse from 'html-react-parser';
import LoadingSpinner from './LoadingSpinner';
import ImageSlider from './ImageSlider';
import { generateBlog, generateLinkedInContent, generateInstagramContent, generateImage, postLinkedInPost } from '../services/api';
import { copyToClipboard } from '../utils/clipboard';
import SocialShareModal from './SocialShareModal';
import SocialSugesstIcons from './SocialContent/SocialSugesstIcons';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function GeneratedBlog() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRefineOpen, setIsRefineOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refineKeywords, setRefineKeywords] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const { contents, prompt, fileName, folderName } = location.state || {};
  const [blogContent, setBlogContent] = useState(location.state?.blogContent || '');
  const [imageUrl, setImageUrl] = useState(location.state?.imageUrl || '');
  const [successMessage,SetSuccessMessage] = useState(false);
  const [isOpen, SetIsOpen]= useState(false);

  const contentTypes = [
    { id: 'blog', name: 'Blog Post' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'instagram', name: 'Instagram' }
  ].filter(type => contents[type.id]);

  const handleCopy = async (content) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleRefine = async () => {
    if (!refineKeywords.trim()) return;
    
    setLoading(true);
    try {
      const currentType = contentTypes[selectedTab].id;
      const [newContent, newImages] = await Promise.all([
        (() => {
          switch (currentType) {
            case 'blog':
              return generateBlog(refineKeywords, folderName, fileName)
                .then(response => response.blog_content);
            case 'linkedin':
              return generateLinkedInContent(refineKeywords, folderName, fileName)
                .then(response => response.linkedin_content);
            case 'instagram':
              return generateInstagramContent(refineKeywords, folderName, fileName)
                .then(response => response.instagram_content);
          }
        })(),
        generateImage(refineKeywords)
      ]);
      console.log("newImages",newImages)
      contents[currentType] = {
        content: newContent,
        imageUrl: newImages
      };

      setIsRefineOpen(false);
    } catch (error) {
      console.error('Error refining content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    SetSuccessMessage(false);
    if(contentTypes.length === 1 && contentTypes[0].id === 'blog'){
    setImageUrl(contents[contentTypes[0].id].imageUrl || '')
    }
  }, [imageUrl,selectedTab])

  // if only blog 
  const handleSocialContinue = (platforms) => {
    setIsSocialOpen(false);
    setImageUrl(contents[contentTypes[0].id].imageUrl || '')
    navigate(`/social/${Array.from(platforms)[0]}`, {
      state: {
        platforms: Array.from(platforms),
        prompt,
        blogContent,
        imageUrl,
        fileName,
        folderName
      }
    });
  };
  // end if only blog

  // linkedIn post function
  const postLinkedIn = async () => {
    contentTypes[selectedTab].id === 'linkedin'
    try {
      setLoading(true);
      await postLinkedInPost(contents['linkedin'].content, contents['linkedin'].imageUrl);
      setLoading(false);
      // SetSuccessMessage(true);
      SetIsOpen(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  // end linkedIn post function
  const parseHashtags = (text) => {
    return text.split(' ').map((word, index) => {
      // Check if the word starts with one or more '#'
      if (word.startsWith('#')) {
        return <strong key={index} style={{ fontWeight: 'bold',wordWrap:'break-word' }}>{word}</strong>;
      }
      return word + ' '; 
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-orange-100 p-1 mb-6">
          {contentTypes.map((type) => (
            <Tab
              key={type.id}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-orange-700'
                    : 'text-orange-600 hover:bg-white/[0.12] hover:text-orange-700'
                )
              }
            >
              {type.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {contentTypes.map((type) => (
            <Tab.Panel
              key={type.id}
              className="bg-white rounded-lg shadow-sm p-8"
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Prompt</h2>
                <p className="text-gray-600">{prompt}</p>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Generated Content</h3>
                  <button 
                    onClick={() => handleCopy(contents[type.id].content)}
                    className="text-orange-500 hover:text-orange-600 flex items-center"
                  >
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="prose max-w-none">
                  <ImageSlider images={contents[type.id].imageUrl} />
                  <div className="whitespace-pre-line">
                    {/* {parse(contents[type.id].content)} */}
                    <div className="text-gray-800">
                      {parseHashtags(contents[type.id].content).map((item, index) => (
                        <span key={index}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={() => setIsRefineOpen(true)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Refine This
                  </button>
                  {contentTypes.length === 1 && contentTypes[0].id === 'blog' && <button
                    onClick={() => setIsSocialOpen(true)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Approve
                  </button>}
                  {
                    contentTypes[selectedTab].id === 'linkedin' &&
                    <>
                      <button disabled={successMessage} onClick={postLinkedIn} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Post
                      </button>
                      <div>
                      {successMessage && <div className="flex items-center justify-center ">
                        <div className="bg-green-500 text-white p-2 rounded-lg shadow-lg mb-3">
                          The post was successfully published on LinkedIn!
                        </div>
                      </div>
                      }
                      </div>
                    </>
                  }
                  {contentTypes[selectedTab].id === 'instagram' &&
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90">
                    Post
                  </button>
                  }
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

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
      <SocialShareModal
          isOpen={isSocialOpen}
          onClose={() => setIsSocialOpen(false)}
          onContinue={handleSocialContinue}
          prompt={prompt}
          blogContent={blogContent}
          imageUrl={imageUrl}
          fileName={fileName}
          folderName={folderName}
        />
        {/* start success message  */}
        {isOpen && <SocialSugesstIcons isStatic={true}/>}
      
        {/* end success message */}
    </div>
  );
}