import { FaClipboardList } from 'react-icons/fa';
import { IoMdMoon } from 'react-icons/io';
import { IoSettingsSharp } from 'react-icons/io5';
import { ImBook } from 'react-icons/im';
import kfaImg from '../assets/image.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const Navigate = useNavigate();
  
  const handleBookClick = () => {
    Navigate('/monitor');
  }

  return (
    <div className="bg-gray-700 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <img src="/kfc-logo.png" alt="KFC Logo" className="h-10 w-10 mr-2" onError={(e) => { e.target.onerror = null; e.target.src = kfaImg; }} />
          <span className="text-2xl font-bold">KFC</span>
        </div>
        <button className="flex items-center bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded">
          <FaClipboardList className="mr-2" />
          <span>Status</span>
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-600 rounded-full">
          <IoMdMoon size={20} />
        </button>
        <button className="p-2 hover:bg-gray-600 rounded-full">
          <IoSettingsSharp size={20} />
        </button>
        <button className="p-2 hover:bg-gray-600 rounded-full">
          <ImBook 
          onClick={handleBookClick}
          size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
