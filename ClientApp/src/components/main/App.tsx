import Sider from 'antd/lib/layout/Sider';
import Layout, { Header } from 'antd/lib/layout/layout';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useWindowDimensions } from '../../lib/hooks/WindowDimensions';
import { useStore } from '../../store';
import Loading from '../lib/Loading';
import MainContent from '../lib/MainContent';
import './App.less';
import SideNavigation from './SideNavigation';
import TopMenu from './TopMenu';

function App() {
    const { width } = useWindowDimensions();
    const { appStore, currentUserStore } = useStore();
    const lokacija = useLocation();
    const naslovnica = lokacija.pathname === "/";

    // micemo meni ako je width manji od 960
    useEffect(() => {
        appStore.setIsSideMenuCollapsed(width <= 960);
    }, [appStore, width]);

    //logout na close ako nismo stavili remember me
    useEffect(() => {
        window.onbeforeunload = (event) => !currentUserStore.rememberMe && currentUserStore.logout();
    }, [currentUserStore]);

    return (
        <Layout style={{ height: "100vh" }}>
            <Header style={{ padding: width >= 960 ? "0px 20px 0px 24px" : "0px 0px 0px 5px" }}>
                <TopMenu />
            </Header>
            <Layout style={{ height: "100vh", overflow: "auto" }}>
                <Sider
                    theme="light"
                    width={appStore.isSideMenuCollapsed ? 0 : 256}
                >
                    <SideNavigation />
                </Sider>
                <MainContent>
                    {appStore.isLoading ? (<Loading text={appStore.loadingText} />) : naslovnica ? (
                        <div>
                            <h1 style={{ fontWeight: 'bold', fontSize: '25px', display: 'flex', justifyContent: 'center' }}>
                                Dobrodošli na web aplikaciju za evidenciju stručne prakse studenata.
                            </h1>
                            <br />
                            <br />
                            <p style={{ fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'left' }}>
                                Mogućnosti u aplikaciji:
                            </p>
                            <ul style={{ fontSize: '18px', display: 'block', justifyContent: 'left' }}>
                                <li>Upravljanje podacima korisnika</li>
                                <li>Unos i upravljanje podacima kompanija</li>
                                <li>Unos i upravljanje podacima stručnih praksi studenata</li>
                            </ul>
                            <p style={{ fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'left' }}>
                                Početne upute:
                            </p>
                            <p style={{ fontSize: '18px', display: 'block', justifyContent: 'left', paddingBottom: '100px' }}>
                            Nakon što ste zaprimili početnu lozinku za Vaš račun od administratora, prijavite se u aplikaciju te u tablici korisnika ažurirajte svoje podatke i postavite novu lozinku.
                            </p>
                        </div>
                    ):(<Outlet/>)}
                </MainContent>
            </Layout>
        </Layout>
    );
}

export default observer(App);
