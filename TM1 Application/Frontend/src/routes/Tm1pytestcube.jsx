import React, { useEffect } from 'react'
import { BackendURL } from '../config.js'
import Logo from '../images/companylogo.png'
import LogoutButton from '../component/LogoutButton.jsx'
import { getFromLocalStorage } from '../helper/localstoragehelper.js'
import HomeButton from '../component/HomeButton.jsx'

export default function Tm1pytestcube({ setIsAuthenticated }) {
    const [viewData, setViewData] = React.useState(null); // null = loading

    const username = getFromLocalStorage('username')
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${BackendURL}/api/v1/cube/getData`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            setIsAuthenticated(true);
            setViewData(data.view);
        };

        fetchData();
    }, []);

    if (!viewData) return <div>Loading...</div>;

    const columns = Object.keys(viewData);
    const rows = Object.keys(viewData[columns[0]]);
const updateCell = (column, row, value) => {
  setViewData(prev => ({
    ...prev,
    [column]: {
      ...prev[column],
      [row]: value,
    },
  }))
}
  const sendData = async () => {
    const temp = viewData
    setViewData(null)
  const response = await fetch(`${BackendURL}/api/v1/cube/setData`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      view: viewData
    })
  })

  const data = await response.json()
  setViewData(temp)
  if(data.success){
    alert("Data Added Successfully")
  }else{
    alert("Error!!!!!!!!!!!!")
  }
}
const validateValue = (value) => {
  if (value === '') return true

  return !isNaN(Number(value))
}

      
   return (
    <>        <header className="welcome-header relative z-20 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="Logo" className="h-10 w-auto object-contain" />
                <span className="text-base font-semibold text-slate-800">TM1 Data Entry Demo</span>
              </div>
    
              <div className="flex items-center gap-3">
                {/* Username pill */}
                {username && (
                  <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-slate-400">
                      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-sm text-slate-600 font-medium">{username}</span>
                  </div>
                )}
                <HomeButton />
                <LogoutButton setIsAuthenticated={setIsAuthenticated} />
              </div>
            </header>
    
  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-lg">
  <table className="min-w-full border-collapse">
    <thead className="bg-slate-100">
      <tr>
        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 border-r border-slate-300">
          Row
        </th>

        {columns.map((col) => (
          <th
            key={col}
            className="px-6 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap border-r border-slate-300"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {rows.map((row, rowIndex) => (
        <tr
          key={row}
          className={`
            hover:bg-blue-50 transition-colors
            ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
          `}
        >
          <td className="px-6 py-3 font-medium text-slate-800 whitespace-nowrap border-r border-b border-slate-200">
            {row}
          </td>

          {columns.map((col) => (
            <td
              key={`${row}-${col}`}
              className="border-r border-b border-slate-200 p-1"
            >
              <input
                type="text"
                value={viewData[col][row]}
                className="
                  w-full
                  px-3
                  py-2
                  rounded-md
                  bg-transparent
                  border border-transparent
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-200
                  focus:outline-none
                "
                onChange={(e) => {
                  updateCell(col, row, e.target.value)
                }}
                onBlur={(e) => {
                  const value = e.target.value.trim()

                  if (!validateValue(value)) {
                    alert(`"${value}" is not a valid numeric value`)

                    setViewData(prev => ({
                      ...prev,
                      [col]: {
                        ...prev[col],
                        [row]: '',
                      },
                    }))

                    return
                  }

                  updateCell(col, row, value)
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
  <div className="flex justify-end mt-6">
  <button
    onClick={sendData}
    className="
      px-6 py-3
      bg-blue-600
      text-white
      font-semibold
      rounded-xl
      shadow-md
      hover:bg-blue-700
      hover:shadow-lg
      active:scale-[0.98]
      transition-all
      duration-200
    "
  >
    Send Data
  </button>
</div>
  
   </>
)   
}