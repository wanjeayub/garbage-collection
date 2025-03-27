import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  MapPinIcon as LocationMarkerIcon,
  ArchiveBoxIcon as CollectionIcon,
} from "@heroicons/react/24/outline"; // Using outline style from v2

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md">
      <nav className="mt-6">
        <div>
          <NavLink
            to="/"
            className={({ isActive }) => `
              flex items-center px-6 py-3 text-sm font-medium
              ${
                isActive
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }
            `}
          >
            <HomeIcon className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>

          <NavLink
            to="/locations"
            className={({ isActive }) => `
              flex items-center px-6 py-3 text-sm font-medium
              ${
                isActive
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }
            `}
          >
            <LocationMarkerIcon className="h-5 w-5 mr-3" />
            Locations
          </NavLink>

          <NavLink
            to="/plots"
            className={({ isActive }) => `
              flex items-center px-6 py-3 text-sm font-medium
              ${
                isActive
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }
            `}
          >
            <CollectionIcon className="h-5 w-5 mr-3" />
            Plots
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
