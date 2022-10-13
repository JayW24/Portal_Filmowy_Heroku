import React from 'react';
import { Link } from 'react-router-dom';

function NavbarItems(props) {
    // navbar items
    var navbarData = [
        //single navbar items
        { name: 'Filmy', url: '/filmy/order=rating:-1/page=1' },
        { name: 'Seriale', url: '/seriale/order=rating:-1/page=1' },
        { name: 'Premiery', url: '/premiery/order=rating:-1/page=1' },
        { name: 'Aktorzy', url: '/aktorzy/order=rating:-1/page=1' },
        { name: 'Kontakt', url: '/contact' },
        //dropdown navbar item - an example just in case you would like to use it in future
        /*{
            name: 'Filmy', url: '/filmy/order=rating:1/page=1', children: [
                { name: 'Filmy', url: '/filmy/order=rating:1/page=1' },
                { name: 'Filmy', url: '/filmy/order=rating:1/page=1' },
                { name: 'Filmy', url: '/filmy/order=rating:1/page=1' }
            ]
        }*/
    ];
    return (
        <>
            {navbarData.map((navbarItem, index) => {
                if (!navbarItem.children) {
                    return navbarItem = (
                        <li key={`${navbarItem.name}-${index}`} onClick={props.executeScroll} className="nav-item">
                            <Link className="nav-link" to={navbarItem.url}>{navbarItem.name}</Link>
                        </li>
                    )
                }
                else {
                    return navbarItem = (
                        <li key={`${navbarItem.name}-${index}`} className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="www.example.com" id="navbardrop" data-toggle="dropdown">
                                Dropdown link
                            </a>
                            <div className="dropdown-menu">
                                {navbarItem.children.map((child, index) => <Link key={`${child.name}-${index}`} onClick={props.executeScroll} className="dropdown-item" to={child.url}>{child.name}</Link>)}
                            </div>
                        </li>
                    )
                }
            })}
        </>
    )
}

export default NavbarItems;