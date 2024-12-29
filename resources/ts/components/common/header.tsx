import React from "react";
import {HeaderProps,Item} from '../interface/Interface';

export const Header: React.FC<HeaderProps> = ({ ItemArray }) => {
    return (
        <thead className="sticky top-0 bg-white z-10">
            <tr className="bg-gray-200">
                {ItemArray.map((Item,index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">
                        {Item.display}
                    </th>
                ))}
            </tr>
        </thead>
    );
};
