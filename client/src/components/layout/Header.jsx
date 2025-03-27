const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Garbage Collection Management
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Welcome, Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
