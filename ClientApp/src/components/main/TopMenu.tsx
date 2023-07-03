import LoginOutlined from '@ant-design/icons/lib/icons/LoginOutlined';
import LogoutOutlined from '@ant-design/icons/lib/icons/LogoutOutlined';
import MenuFoldOutlined from '@ant-design/icons/lib/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/lib/icons/MenuUnfoldOutlined';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import UsergroupAddOutlined from '@ant-design/icons/lib/icons/UsergroupAddOutlined';
import Col from 'antd/lib/col';
import Menu, { MenuProps } from 'antd/lib/menu';
import Row from 'antd/lib/row';
import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import CurrentUserStore from '../../stores/CurrentUserStore';
import { Rola } from '../../types/enums/Rola';
import { MainTitle } from '../lib/MainTitle';
import { MenuDrawerButton } from '../lib/buttons/MenuDrawerButton';

const menuItems = (currentUserStore: CurrentUserStore): MenuProps['items'] => {
    let items: MenuProps['items'] = [];
   

    if (currentUserStore.isLoggedIn) {
        items.push(
            {
                label: (
                    <Fragment>
                        <NavLink to={"/profil"}>
                            <UserOutlined style={{ marginRight: "7px" }} />
                            {currentUserStore.korisnik?.username}
                        </NavLink>
                    </Fragment>
                ),
                key: '/profil',
            },
        )
        if (currentUserStore.korisnikImaRolu([Rola.Administrator, Rola.Student, Rola.Profesor, Rola.Asistent]))  {
            items.push(
                {
                    label: (
                        <Fragment>
                            <NavLink to={"/korisnici"}>
                                <UsergroupAddOutlined style={{ marginRight: "7px" }} />
                                Korisnici
                            </NavLink>
                        </Fragment>
                    ),
                    key: '/korisnici',

                },
            )
        }
        if (currentUserStore.korisnikImaRolu([Rola.Administrator, Rola.Student, Rola.Profesor, Rola.Asistent])){
            items.push(
                {
                    label: (
                        <Fragment>
                            <NavLink to={"/kompanije"}>
                                <UsergroupAddOutlined style={{ marginRight: "7px" }} />
                                Kompanije
                            </NavLink>
                        </Fragment>
                    ),
                    key: '/kompanije',

                },
            )
        }
        if (currentUserStore.korisnikImaRolu([Rola.Administrator, Rola.Student, Rola.Profesor, Rola.Asistent])) {
            items.push(
                {
                    label: (
                        <Fragment>
                            <NavLink to={"/prakse"}>
                                <UsergroupAddOutlined style={{ marginRight: "7px" }} />
                                Prakse
                            </NavLink>
                        </Fragment>
                    ),
                    key: '/prakse',

                },
            )
        }

        items.push(
            {
                label: (
                    <Fragment>
                        <NavLink to={"/login"} onClick={() => currentUserStore.logout()}>
                            <LogoutOutlined style={{ marginRight: "7px" }} />
                            Odjava
                        </NavLink>
                    </Fragment>
                ),
                key: '/logout',
            },
        )
    } else {
        items.push(
            {
                label: (
                    <Fragment>
                        <NavLink to={"/login"}>
                            <LoginOutlined style={{ marginRight: "7px" }} />
                            Prijava
                        </NavLink>
                    </Fragment>
                ),
                key: '/login',
            },
        )
    }
    return items;
}

function TopMenu() {
    const location = useLocation();
    const { appStore, currentUserStore } = useStore();

    return (
        <Row>
            <Col xs={{ span: 3, offset: 0 }} sm={{ span: 4, offset: 0 }} md={{ span: 6, offset: 0 }} style={{ display: "flex" }}>
                <MenuDrawerButton type="primary" onClick={() => appStore.toggleIsSideMenuCollapsed()}>
                    {appStore.isSideMenuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </MenuDrawerButton>
                <NavLink to={"/"}>
                    <MainTitle>
                        Evidencija stručne prakse
                    </MainTitle>
                </NavLink>
            </Col>
            <Col xs={{ span: 20, offset: 1 }} sm={{ span: 16, offset: 4 }} md={{ span: 14, offset: 4 }}>
                <div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ color: 'white', display: "flex", justifyContent: "flex-end" }}
                        selectedKeys={[location.pathname]}
                        items={menuItems(currentUserStore)}
                    />
                </div>
            </Col>
        </Row>
    )
}

export default observer(TopMenu);
