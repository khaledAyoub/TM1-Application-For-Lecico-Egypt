import React from "react";
import LogoutButton from "../component/LogoutButton.jsx";
import { useNavigate } from "react-router-dom";
import Logo from "../images/companylogo.png";
import { getFromLocalStorage } from "../helper/localstoragehelper.js";
import HomeButton from "../component/HomeButton.jsx";
export default function Header({ setIsAuthenticated, backBtton }) {
  const username = getFromLocalStorage("username");

  return (
    <header className="welcome-header relative z-20 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-3">
        <img src={Logo} alt="Logo" className="h-10 w-auto object-contain" />
        <span className="text-base font-semibold text-slate-800">
          TM1 Data Entry Demo
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Username pill */}
        {username && (
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="text-slate-400"
            >
              <circle
                cx="8"
                cy="5"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm text-slate-600 font-medium">
              {username}
            </span>
          </div>
        )}
        {backBtton && <HomeButton />}{" "}
        <LogoutButton setIsAuthenticated={setIsAuthenticated} />
      </div>
    </header>
  );
}
