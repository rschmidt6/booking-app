import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const isActive = (path) => {
    return location.pathname === path
      ? "text-gray-800 hover:text-gray-900"
      : "text-gray-200 hover:text-white";
  };

  return !isHome ? (
    <nav className="bg-gray-500 shadow-md">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between h-12 font-almendra">
          <div className="flex items-center">
            <Link to="/">
              <img
                src="./gs_name1.png"
                alt="gs logo"
                className="h-9 w-auto hover:invert"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/booking" className={`${isActive("/booking")} font-bold`}>
              booking
            </Link>
            <Link to="/gallery" className={`${isActive("/gallery")} font-bold`}>
              flash
            </Link>
            <Link to="/info" className={`${isActive("/info")} font-bold`}>
              info
            </Link>
          </div>
        </div>
      </div>
    </nav>
  ) : (
    <div className="flex justify-center items-center">
      <img
        src="./gs_name1.png"
        alt="gs logo"
        className="h-18 lg:h-28 w-auto p-6"
      />
    </div>
  );
}
