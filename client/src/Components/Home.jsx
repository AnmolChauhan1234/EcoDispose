import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Smart Battery <span className="text-green-600">Recycling</span>
      </h1>
      <p className="text-gray-600 max-w-xl mx-auto mb-6">
        Scan your battery's QR code or barcode to instantly check its recycling status and contribute to a cleaner environment.
      </p>
      <Link to="/scan">
        <button className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition font-semibold">
          <ScanLine className="inline mr-2" size={18} />
          Start Scanning
        </button>
      </Link>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <div className="text-green-600 text-3xl mb-2">📷</div>
            <h3 className="font-semibold text-lg">Easy Scanning</h3>
            <p className="text-gray-500 text-sm mt-2">Quick QR and barcode scanning for instant battery information.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <div className="text-green-600 text-3xl mb-2">🔋</div>
            <h3 className="font-semibold text-lg">Battery Analysis</h3>
            <p className="text-gray-500 text-sm mt-2">Detailed information about battery condition and recyclability.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <div className="text-green-600 text-3xl mb-2">♻️</div>
            <h3 className="font-semibold text-lg">Recycling Guidance</h3>
            <p className="text-gray-500 text-sm mt-2">Clear instructions for proper battery disposal and recycling.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
