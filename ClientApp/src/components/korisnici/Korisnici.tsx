import Button from "antd/lib/button/button";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../store";
import KorisniciDataTable from "./KorisniciDataTable";
import { Rola } from "../../types/enums/Rola";

function Korisnici() {
    const { korisniciStore } = useStore();
    const { currentUserStore } = useStore(); 

    useEffect(() => {
        if (!korisniciStore.fetchedKorisnici) {
            korisniciStore.GetAll();
        }
    }, [korisniciStore]);

    return (
        <Row>
            <Col span={24}>
                <Row style={{ marginBottom: "40px" }}>
                    <Col span={24}>
                        {currentUserStore.korisnik?.role.includes(Rola.Administrator) && (
                            <Button disabled={korisniciStore.isloading} onClick={() => korisniciStore.noviKorisnik()}>Novi korisnik</Button>
                        )}
                        <Button style={{ marginLeft: "10px" }} disabled={korisniciStore.isloading} onClick={(e) => korisniciStore.GetAll()}>Osvježi</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <KorisniciDataTable data={toJS(korisniciStore.korisnici)} isLoading={korisniciStore.isloading} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default observer(Korisnici);
