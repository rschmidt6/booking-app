import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-500"
      : "text-gray-600 hover:text-blue-500";
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              BookingApp
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`${isActive("/")} transition-colors duration-200`}
            >
              Home
            </Link>
            <Link
              to="/booking"
              className={`${isActive(
                "/booking"
              )} transition-colors duration-200`}
            >
              Book Now
            </Link>
            <Link
              to="/gallery"
              className={`${isActive(
                "/gallery"
              )} transition-colors duration-200`}
            >
              Gallery
            </Link>
            <Link
              to="/info"
              className={`${isActive("/info")} transition-colors duration-200`}
            >
              Info
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
