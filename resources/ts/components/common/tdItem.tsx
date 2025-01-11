import React from "react";
export const TdItem: React.FC<{content:string}> = ({ content }) => {
    return (
        <td className="border border-gray-500 px-1 py-0.5 text-center text-black font-semibold" style={{ fontSize: 'clamp(1rem, 1.5vw, 0.25rem)' , whiteSpace: 'nowrap'}}>
            <div className="flex flex-wrap justify-center items-center">
                {content}
            </div>
        </td>
    );
};
