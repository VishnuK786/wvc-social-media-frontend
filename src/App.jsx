import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import FileSelector from './components/FileSelector';
import UploadMethod from './components/UploadMethod';
import BlogPrompt from './components/BlogPrompt';
import GeneratedBlog from './components/GeneratedBlog';
import SocialContent from './components/SocialContent';
import SocialPlatformContent from './components/SocialContent/SocialPlatformContent';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';

function AppContent() {
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(true);

  useEffect(() => {
    if (location.pathname === "/home") {
      setSelectedFile(false);
    }else if(location.pathname === "/login"){
      setSelectedFile(false);
    }else {
      setSelectedFile(true);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {selectedFile && (
          <ProtectedRoute>
            <FileSelector onFileSelect={setSelectedFile} />
          </ProtectedRoute>
        )}
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <UploadMethod onFileSelect={setSelectedFile} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prompt"
              element={
                <ProtectedRoute>
                  <BlogPrompt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/generated"
              element={
                <ProtectedRoute>
                  <GeneratedBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/social/:platform"
              element={
                <ProtectedRoute>
                  <SocialPlatformContent />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

 function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
export default App;