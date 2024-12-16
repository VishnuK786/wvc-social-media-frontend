import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { getFiles } from '../services/api';

function UploadMethod({ onFileSelect }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleMethodSelect = async (method) => {
    setLoading(true);
    try {
      const dataType = method === 'local' ? 'local_chroma_db' : 'azure_chroma_db';
      const files = await getFiles(dataType);
      if (files && files.length > 0) {
        onFileSelect(files);
        navigate('/prompt', {
          state: {
            fileName: '',
            folderName: dataType
          }
        });
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Choose your preferred method to Select the file:</h2>
        <p className="text-gray-600">
          Choose from your local PC, or connect to your Azure account to select files directly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => handleMethodSelect('local')}
          disabled={loading}
          className="p-8 bg-white rounded-lg shadow-sm border-2 border-transparent hover:border-orange-500 transition-all disabled:opacity-50"
        >
          <ComputerDesktopIcon className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-lg font-medium">My Computer</p>
        </button>

        <button
          onClick={() => handleMethodSelect('azure')}
          disabled={loading}
          className="p-8 bg-white rounded-lg shadow-sm border-2 border-transparent hover:border-orange-500 transition-all disabled:opacity-50"
        >
          <img src="https://azure.microsoft.com/svghandler/azure-logo.png" alt="Azure" className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Azure</p>
        </button>
      </div>
    </div>
  );
}

export default UploadMethod;