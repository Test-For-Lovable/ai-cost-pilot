
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 md:py-8 border-t border-theme-gray-200">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-theme-gray-500">
            © {currentYear} Bitrupt — Built with 💡 by developers, for developers
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-theme-gray-500 hover:text-theme-blue-600 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-theme-gray-500 hover:text-theme-blue-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-theme-gray-500 hover:text-theme-blue-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
