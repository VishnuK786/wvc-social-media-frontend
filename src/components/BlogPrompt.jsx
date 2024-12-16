import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import ContentTypeSelector from './ContentTypeSelector';
import { generateBlog, generateImage, generateLinkedInContent, generateInstagramContent } from '../services/api';

export default function BlogPrompt() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileName, folderName } = location.state || {};
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [errorMessage,SetErrorMessage] = useState(false);
  useEffect(()=>{
    SetErrorMessage(false);
  },[fileName])
  const handleComposeBlog = () => {
    if (!prompt.trim()) return;
    if(!fileName){
      SetErrorMessage(true);
      return;
    }
    setIsTypeSelectOpen(true);
  };

  const generateContent = async (types) => {
    setLoading(true);
    try {
      const contentPromises = [];
      const imagePromises = types.map(() => generateImage(prompt));
      types.forEach(type => {
        if(type !=='blog'){
          contentPromises.push(generateBlog(prompt, folderName, fileName)); // Ensure it's only generated once
        }
        switch (type) {
          case 'blog':
            contentPromises.push(
              generateBlog(prompt, folderName, fileName)
                .then(response => ({ type, content: response.blog_content }))
            );
            break;
          case 'linkedin':
            contentPromises.push(
              generateLinkedInContent(prompt, folderName, fileName)
                .then(response => ({ type, content: response.linkedin_content }))
            );
            break;
          case 'instagram':
            contentPromises.push(
              generateInstagramContent(prompt, folderName, fileName)
                .then(response => ({ type, content: response.instagram_content }))
            );
            break;
        }
      });

      const [imageResponses, ...contentResponses] = await Promise.all([
        Promise.all(imagePromises),
        ...contentPromises
      ]);
      const generatedContent = {};
      contentResponses.forEach(({ type, content }, index) => {
        generatedContent[type] = {
          content,
          imageUrl: imageResponses[0]
        };
      });
      navigate('/generated', {
        state: {
          contents: generatedContent,
          prompt,
          fileName,
          folderName
        }
      });
    } catch (error) {
      console.error('Error generating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-8 h-8 bg-purple-500 rotate-45 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Shape Your Story</h2>
          <p className="text-gray-600">
            Kickstart your AI-generated content with a creative prompt.
          </p>
        </div>

        <div className="mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Write a compelling post about..."
          />
        </div>

        <button
          onClick={handleComposeBlog}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Generate Content
        </button>
        {errorMessage && <p className='text-red-500 text-lg font-medium text-center m-3'>* Please select a document.</p>}
      </div>

      <ContentTypeSelector
        isOpen={isTypeSelectOpen}
        onClose={() => setIsTypeSelectOpen(false)}
        onContinue={generateContent}
      />

      {loading && <LoadingSpinner />}
    </div>
  );
}