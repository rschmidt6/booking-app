import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <Link
          to="/booking"
          className="p-6 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          Book Now
        </Link>
        <Link
          to="/gallery"
          className="p-6 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          Gallery
        </Link>
        <Link
          to="/contact"
          className="p-6 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
