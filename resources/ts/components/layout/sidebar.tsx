import React,{useState} from 'react';
import {SidebarTab} from './sidebarTab';
import {sidebarComponents} from './sidebarData';
export const Sidebar = (props) => {
const [components, setItems] = useState(sidebarComponents);
    return (
        <div className="min-h-full">
            <ul>
                {components.map((component,index) => (
                    <SidebarTab key={index} name={component.name} onClick={() => props.onTabClick(component.url)} img={component.img}></SidebarTab>
                ))}
            </ul>
        </div>
    );
};
