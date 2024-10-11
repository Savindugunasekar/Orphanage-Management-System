import { useState } from "react";
import { FaChartBar, FaInbox, FaUser, FaCalendarAlt, FaSearch, FaFolder, FaCog } from "react-icons/fa";

const SideBar = () => {
    const [open, setOpen] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const Menus = [
        { title: "Dashboard", icon: <FaChartBar /> },
        { title: "Inbox", icon: <FaInbox /> },
        { title: "Accounts", icon: <FaUser />, gap: true },
        { title: "Schedule", icon: <FaCalendarAlt /> },
        { title: "Search", icon: <FaSearch /> },
        { title: "Files", icon: <FaFolder />, gap: true },
        { title: "Setting", icon: <FaCog /> },
    ];

    return (
        <div className={`fixed ${open ? "w-72" : "w-20"} bg-orange-400 h-screen p-5 pt-8 duration-300`}>
            <button
                className={`absolute cursor-pointer -right-3 top-9 w-7 h-7 border-dark-purple border-2 rounded-full flex items-center justify-center bg-white ${!open && "rotate-180"}`}
                onClick={() => setOpen(!open)}
            >
                <span className="text-black">⮘</span>
            </button>
            <div className="flex gap-x-4 items-center">
                <div className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}>
                    <FaChartBar className="text-white" size={30} />
                </div>
                <h1 className={`origin-left font-medium text-xl duration-200 text-white ${!open && "scale-0"}`}>
                    Designer
                </h1>
            </div>
            <ul className="pt-6">
                {Menus.map((Menu, index) => (
                    <li
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`flex rounded-md p-2 cursor-pointer text-black items-center gap-x-4 
                            ${Menu.gap ? "mt-9" : "mt-2"} 
                            ${index === activeIndex ? "bg-white text-dark-purple" : "hover:bg-light-white"}`}
                    >
                        <span>{Menu.icon}</span>
                        <span className={`${!open && "hidden"} origin-left duration-200`}>
                            {Menu.title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar;
