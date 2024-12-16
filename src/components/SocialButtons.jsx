import { 
  ShareIcon
} from '@heroicons/react/24/outline';

export function FacebookShareButton() {
  return (
    <button className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700">
      <ShareIcon className="w-6 h-6" />
    </button>
  );
}

export function TwitterShareButton() {
  return (
    <button className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600">
      <ShareIcon className="w-6 h-6" />
    </button>
  );
}

export function LinkedinShareButton() {
  return (
    <button className="p-3 rounded-full bg-blue-700 text-white hover:bg-blue-800">
      <ShareIcon className="w-6 h-6" />
    </button>
  );
}