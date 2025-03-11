import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="bg-saasha-cream/80 dark:bg-dark-secondary/80 backdrop-blur-md rounded-2xl shadow-lg px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-saasha-brown dark:text-dark-text">saasha</Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" text="Home" />
              <NavLink to="/about" text="About Us" />
              <NavLink to="/team" text="Team" />
              <NavLink to="/events" text="Events" />
              <NavLink to="/gallery" text="Gallery" />
              <NavLink to="/blogs" text="Blogs" />
              <NavLink to="/contact" text="Contact" />
              <Link 
                to="/volunteer" 
                className="bg-saasha-rose text-saasha-cream px-6 py-2 rounded-full hover:bg-saasha-brown dark:hover:bg-dark-accent transition-colors duration-300"
              >
                Volunteer
              </Link>
            </div>

            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-saasha-brown dark:text-dark-text p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-saasha-brown/10 dark:border-dark-text/10">
              <div className="flex flex-col space-y-4">
                <MobileNavLink to="/" text="Home" onClick={closeMenu} />
                <MobileNavLink to="/about" text="About Us" onClick={closeMenu} />
                <MobileNavLink to="/team" text="Team" onClick={closeMenu} />
                <MobileNavLink to="/events" text="Events" onClick={closeMenu} />
                <MobileNavLink to="/gallery" text="Gallery" onClick={closeMenu} />
                <MobileNavLink to="/blogs" text="Blogs" onClick={closeMenu} />
                <MobileNavLink to="/contact" text="Contact" onClick={closeMenu} />
                <Link 
                  to="/volunteer" 
                  onClick={closeMenu}
                  className="bg-saasha-rose text-saasha-cream px-6 py-2 rounded-full hover:bg-saasha-brown dark:hover:bg-dark-accent transition-colors duration-300 w-full text-center"
                >
                  Volunteer
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, text }: { to: string; text: string }) => (
  <Link
    to={to}
    className="text-saasha-brown dark:text-dark-text hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300 font-medium"
  >
    {text}
  </Link>
);

const MobileNavLink = ({ to, text, onClick, className }: { to: string; text: string; onClick?: () => void; className?: string }) => (
  <Link
    to={to}
    onClick={onClick}
    className={className || "text-saasha-brown dark:text-dark-text hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300 font-medium block w-full text-center"}
  >
    {text}
  </Link>
);

export default Navbar;