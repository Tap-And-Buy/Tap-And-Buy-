import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ================= Quick Links ================= */}
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link to="/policies" className="block text-gray-600 hover:text-amber-800 transition-colors">
                Policies & Information
              </Link>
              <Link to="/support" className="block text-gray-600 hover:text-amber-800 transition-colors">
                Customer Support
              </Link>
            </div>
          </div>

          {/* ================= Contact Information ================= */}
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              Contact Information
            </h3>
            <div className="text-gray-600 space-y-2">
              <p>
                For any queries, please visit our support page
              </p>
            </div>
          </div>

          {/* ================= Business Hours ================= */}
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              Business Hours
            </h3>
            <div className="text-gray-600 space-y-2">
              <p>
                Monday to Friday: 9:00-18:00
              </p>
              <p>
                Saturday: 10:00-16:00
              </p>
              <p>
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* ================= Copyright Section ================= */}
        <div className="mt-8 pt-8 border-t border-amber-200 text-center text-gray-600">
          <p>
            {currentYear} ShopEase
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
