import Menu, { MenuProps } from "antd/lib/menu";
import { observer } from "mobx-react-lite";
import { NavLink, useLocation } from "react-router-dom";

const menuItems: MenuProps['items'] = [
    {
        label: <NavLink to={"/"}>Naslovnica</NavLink>,
        key: '/',
    },
    {
        label: 'Kategorije',
        key: '/kategorije',
        children: [
            {
                key: 'korisnici',
                label: <NavLink to={"/korisnici"}>Popis korisnika</NavLink>,
            },
            {
                key: 'kompanije',
                label: <NavLink to={"/kompanije"}>Popis kompanija</NavLink>,
            },
            {
                key: 'prakse',
                label: <NavLink to={"/prakse"}>Popis praksi</NavLink>,
            },
        ],
    },
    
];

function SideNavigation() {
    const location = useLocation();

    return (
        <Menu
            selectedKeys={[location.pathname]}
            mode="inline"
            items={menuItems}
        />
    );
};

export default observer(SideNavigation);
