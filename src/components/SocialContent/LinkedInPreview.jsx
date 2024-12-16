import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { postLinkedInPost } from '../../services/api';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import ImageSlider from '../ImageSlider';
import DOMPurify from "dompurify";
import { marked } from 'marked';
import SocialSugesstIcons from './SocialSugesstIcons';

export default function LinkedInPreview({ content, onBack, onRefine }) {
  const sanitizedContent = DOMPurify.sanitize(content?.linkedin_content);
  const getHTMLContent = (content) => {
    return { __html: marked(content) }; // Convert Markdown to HTML
  };
  const [loader,SetLoader] = useState(false);
  const [successMessage,SetSuccessMessage] = useState(false);
  const postLinkedIn = async () => {
    try {
      SetLoader(true);
      await postLinkedInPost(content.linkedin_content, content.imageUrl);
      SetLoader(false);
      SetSuccessMessage(true);
    } catch (error) {
      console.log(error);
      SetLoader(false);
    }
  }

  useEffect(() => {
    SetSuccessMessage(false)
  }, [onRefine])

  // convert bold text
  const parseHashtags = (text) => {
    // This regex will match text starting with '#' and ending with space or line break
    return text.split(' ').map((word, index) => {
      // If the word starts with '#' (hashtag), wrap it in <strong> to make it bold
      if (word.startsWith('#')) {
        return <strong key={index} style={{fontWeight: 'bold'}}>{word}</strong>;
      }
      return word + ' '; // Otherwise, return the word as is
    });
  };
  // end bold text

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold">LinkedIn Preview</h2>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
            LOGO
          </div>
          <div className="ml-3">
            <h3 className="font-semibold">Changepond</h3>
            <p className="text-sm text-gray-600">14,500 Followers</p>
          </div>
          <button className="ml-auto px-4 py-1 border rounded-full text-blue-600 hover:bg-blue-50">
            Follow
          </button>
        </div>

        <div className="mb-4 -mx-4 flex justify-center items-center">
          {/* <img 
            src={content.imageUrl} 
            alt="Content"
            className="w-auto max-w-full aspect-[1/0] object-contain mx-auto"
          /> */}
            <ImageSlider images={content.imageUrl} />
                  <div className="whitespace-pre-line">
                    {/* {parse(content.instagram_content)} */}
                  </div>
        </div>

        <div className="prose max-w-none mb-6">
          <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
          <div dangerouslySetInnerHTML={getHTMLContent(content?.linkedin_content)} />

          {/* <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: sanitizedContent }} /> */}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex space-x-6">
            <button className="flex items-center text-gray-600">
              <span className="mr-2">👍</span>
              Like
            </button>
            <button className="flex items-center text-gray-600">
              <span className="mr-2">💬</span>
              Comment
            </button>
            <button className="flex items-center text-gray-600">
              <span className="mr-2">↗️</span>
              Repost
            </button>
            <button className="flex items-center text-gray-600">
              <span className="mr-2">📤</span>
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end space-x-4">
        <button
          onClick={onRefine}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Refine This
        </button>
        <button  onClick={postLinkedIn} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Post
        </button>
      </div>
      {successMessage &&
        <SocialSugesstIcons isStatic={true}/>
      }
      {loader && <LoadingSpinner />}
    </div>
  );
}