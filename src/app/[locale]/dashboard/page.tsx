// pages/dashboard.js
export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-64 bg-green-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <nav>
          <ul>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer">Overview</li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer">Reports</li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer">Settings</li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer">Profile</li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer">Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-4 shadow">
          <h2 className="text-3xl font-semibold">Overviews</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
            Add New
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold">Total Sales</h3>
              <p className="text-3xl text-green-600">$10,000</p>
              <p className="text-gray-600">+15% from last month</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold">Active Users</h3>
              <p className="text-3xl text-green-600">1,250</p>
              <p className="text-gray-600">+30% from last month</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold">New Signups</h3>
              <p className="text-3xl text-green-600">300</p>
              <p className="text-gray-600">+20% from last month</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold">Latest Activity</h3>
              <ul className="mt-2">
                <li className="text-gray-700">User John signed up</li>
                <li className="text-gray-700">User Jane made a purchase</li>
                <li className="text-gray-700">User Alex logged in</li>
                <li className="text-gray-700">User Mary updated profile</li>
              </ul>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold">Revenue Overview</h3>
              <p className="text-green-600 text-3xl">$2,500</p>
              <p className="text-gray-600">This week</p>
              <div className="mt-4">
                <div className="bg-green-200 h-4 rounded" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
