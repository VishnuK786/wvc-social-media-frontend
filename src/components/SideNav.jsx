import { DocumentIcon } from '@heroicons/react/24/outline';

export default function SideNav({ selectedFile }) {
  if (!selectedFile) return null;

  return (
    <div className="w-64 bg-gray-50 p-4 border-r h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-600">Selected Document</h2>
      </div>
      <div className="space-y-2">
        <div className="flex items-center p-2 bg-white rounded-lg shadow-sm">
          <DocumentIcon className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-sm">{selectedFile}</span>
        </div>
      </div>
    </div>
  );
}