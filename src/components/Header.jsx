import { Link } from 'react-router-dom';
import { ArrowRightEndOnRectangleIcon, HomeIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-auto h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold mr-3">
          &nbsp; Social Media Content Generation  &nbsp;
          </div>
          {/* <h1 className="text-xl font-semibold">World Vision Canada</h1> */}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
            <Link to="/home" className="flex items-center text-gray-600 hover:text-gray-900">
            <HomeIcon className="w-6 h-6" />
            <span className="ml-2">Home</span>
          </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600 hover:text-gray-900">
            <UserCircleIcon className="w-6 h-6" />
            <span className="ml-1"><strong>{user.name}</strong></span>
          </div>
          <div className="flex items-center text-gray-600 hover:text-gray-900">
            <button
                onClick={logout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                <span>Logout</span>
              </button>
          </div>
            </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}