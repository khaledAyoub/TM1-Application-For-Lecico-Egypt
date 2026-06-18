import React from "react";
import LogoutButton from "../component/LogoutButton.jsx";
import { useNavigate } from "react-router-dom";
import Logo from "../images/companylogo.png";
import { getFromLocalStorage } from "../helper/localstoragehelper.js";
import Header from "../component/Header.jsx";

export default function WelcomePage({ setIsAuthenticated }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header setIsAuthenticated={setIsAuthenticated} backBtton={false} />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {/* Card 1 */}
          <div className="bg-white border rounded-lg p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold mb-3">TM1py Cube Demo</h2>

            <p className="text-gray-600 mb-6">Access and edit TM1 cube data.</p>

            <button
              onClick={() => navigate("/tm1pytestcube")}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Open
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white border rounded-lg p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold mb-3">TM1 Tools</h2>

            <p className="text-gray-600 mb-6">DashBoard</p>

            <button
              onClick={() => navigate("/warehouse")}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Open
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
