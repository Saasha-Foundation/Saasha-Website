import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="bg-saasha-cream/80 backdrop-blur-md rounded-2xl shadow-lg px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-saasha-brown">Saasha</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <NavLink text="Home" />
              <NavLink text="About Us" />
              <NavLink text="Team" />
              <NavLink text="Blogs" />
              <NavLink text="Contact" />
              <NavLink text="Register" />
            </div>

            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-saasha-brown p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-saasha-brown/10">
              <div className="flex flex-col space-y-4">
                <MobileNavLink text="Home" />
                <MobileNavLink text="About Us" />
                <MobileNavLink text="Team" />
                <MobileNavLink text="Blogs" />
                <MobileNavLink text="Contact" />
                <MobileNavLink text="Register" />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ text }: { text: string }) => (
  <a
    href={`#${text.toLowerCase().replace(' ', '-')}`}
    className="text-saasha-brown hover:text-saasha-rose transition-colors duration-300 font-medium"
  >
    {text}
  </a>
);

const MobileNavLink = ({ text }: { text: string }) => (
  <a
    href={`#${text.toLowerCase().replace(' ', '-')}`}
    className="text-saasha-brown hover:text-saasha-rose transition-colors duration-300 font-medium block w-full text-center"
  >
    {text}
  </a>
);

export default Navbar;
