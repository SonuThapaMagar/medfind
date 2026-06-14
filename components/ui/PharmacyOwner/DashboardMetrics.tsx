import Link from "next/link";

export default function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="flex flex-col gap-2 bg-white p-4 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between border-b border-gray-400 py-1">
          <h2 className="text-black font-semibold text-lg">Out of Stock</h2>
          <Link className="text-primary rounded-2xl px-2" href="/medicine">
            View All
          </Link>
        </div>

        <ul className="flex flex-col gap-4">
          <li className="flex items-center justify-between w-full text-sm">
            Paracetamol
            <span>
              <button className="bg-gray-700 text-white rounded-2xl px-2">
                1 item
              </button>
            </span>
          </li>
          <li className="flex items-center justify-between w-full text-sm">
            Paracetamol
            <span>
              <button className="bg-gray-700 text-white rounded-2xl px-2">
                1 item
              </button>
            </span>
          </li>
          <li className="flex items-center justify-between w-full text-sm">
            Paracetamol
            <span>
              <button className="bg-gray-700 text-white rounded-2xl px-2">
                1 item
              </button>
            </span>
          </li>
          <li className="flex items-center justify-between w-full text-sm">
            Paracetamol
            <span>
              <button className="bg-gray-700 text-white rounded-2xl px-2">
                1 item
              </button>
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-2 bg-white p-4 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between border-b border-gray-400 p-1">
          <h2 className="text-black font-semibold text-lg">Low Stock</h2>
          <Link className="text-primary rounded-2xl px-2" href="/medicine">
            View All
          </Link>
        </div>

        <ul className="flex flex-col gap-3">
          <li className="flex items-center justify-between w-full text-sm">
            Amoxcil
            <span>
              <button className="bg-gray-700 text-white rounded-2xl px-2">
                1 item
              </button>
            </span>
          </li>
          <li className="flex items-center justify-between w-full text-sm">
            Paracetamol
            <span>
              <button className="bg-gray-700 text-white rounded-2xl px-2">
                1 item
              </button>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
