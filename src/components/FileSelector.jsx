import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFiles,fetchLoadChromaPost } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function FileSelector({ onFileSelect }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { folderName } = location.state || {};
  const { fileName } = location.state || '';
  useEffect(() => {
    const fetchFiles = async () => {
      if (!folderName) return;
      
      setLoading(true);
      try {
        const response = await getFiles(folderName);
        if(response.length <0 ){
          return false;
        }
        const splitedFile =  response.map((e)=>{
          const data = e.split('.');
          return data[0]
        })
        setFiles(splitedFile);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folderName]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.value;
    if(!selectedFile){
      return;
    }
    onFileSelect(selectedFile);
    setLoading(true);
    await fetchLoadChromaPost(folderName,selectedFile)
    setLoading(false);
    navigate('/prompt', {
      state: {
        fileName: selectedFile,
        folderName: folderName
      }
    });
  };

  return (
    <div className="w-[20rem] bg-gray-50 p-4 border-r h-screen">
      <div className="mb-4">
        <label htmlFor="file-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Document
        </label>
        <select
          id="file-select"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-lg"
          disabled={loading}
          value={fileName}
        >
          <option value='' selected defaultChecked disabled>Select File</option>
          {files.length > 0 && files.map((file, index) => (
            <option key={index} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>
      {loading && <LoadingSpinner />}
    </div>
  );
}