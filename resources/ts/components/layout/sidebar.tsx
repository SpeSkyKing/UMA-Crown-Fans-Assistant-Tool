import React,{useState} from 'react';
import {SidebarTab} from './sidebarTab';
import {sidebarComponents} from './sidebarData';
import {SidebarProps} from '../interface/props';
export const Sidebar:React.FC<SidebarProps> = ({onTabClick}) => {
const [components, setItems] = useState(sidebarComponents);

    const changeTab = (content:string) => {
        onTabClick(content);
    };
    return (
        <div className="min-h-full">
            <ul>
                {components.map((component,index) => (
                    <SidebarTab key={index} name={component.name} onClick={changeTab} img={component.img} url={component.url} />
                ))}
            </ul>
        </div>
    );
};
