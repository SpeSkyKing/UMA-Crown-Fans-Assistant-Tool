import React from 'react';
export const SidebarTab = ({name,onClick,img}) => {
    return (
        <li style={{ backgroundImage: `url(/storage/image/SidebarTab/${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
        className={`block w-full text-center text-2xl font-bold py-4 rounded-xl border-2 border-gray-300 
        bg-transparent text-purple-500 transition-all duration-300 hover:bg-pink-200 cursor-pointer
        hover:text-white hover:scale-105 hover:shadow-lg active:bg-pink-300 mb-4 mt-8`}>
            <a onClick={onClick}>
                {name}
            </a>
        </li>
    );
};