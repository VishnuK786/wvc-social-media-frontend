import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ImageSlider from '../ImageSlider';
import { marked } from 'marked';

export default function InstagramPreview({ content, onBack, onRefine }) {
  const getHTMLContent = (content) => {
    return { __html: marked(content) }; // Convert Markdown to HTML
  };
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold">Instagram Preview</h2>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            NGO
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-sm">Changepond</h3>
          </div>
          <button className="ml-auto text-sm font-semibold text-gray-600">
            •••
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

        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <button className="text-2xl">❤️</button>
            <button className="text-2xl">💬</button>
            <button className="text-2xl">📤</button>
          </div>
          <button className="text-2xl">🔖</button>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-1">98 likes</p>
          <p>
            <span className="font-semibold">Changepond</span>{' '}
            {content?.instagram_content}
            <div dangerouslySetInnerHTML={getHTMLContent(content?.instagram_content)} />
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end space-x-4">
        <button
          onClick={onRefine}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Refine This
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90">
          Post
        </button>
      </div>
    </div>
  );
}