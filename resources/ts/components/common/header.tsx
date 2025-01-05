import React from "react";
import {HeaderProps} from '../interface/props';
export const Header: React.FC<HeaderProps> = ({ ItemArray }) => {
    return (
        <thead className="sticky top-0 bg-white z-10">
            <tr className="bg-gray-200">
                {ItemArray.map((Item, index) => (
                    <th key={index} className="border border-gray-300 px-0.5 py-0.5">
                        <div className="text-center" style={{ fontSize: 'clamp(1rem, 1.5vw, 0.25rem)' , whiteSpace: 'nowrap'}}>
                            {Item.display}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
};
