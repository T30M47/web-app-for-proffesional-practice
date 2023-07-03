import Button from "antd/lib/button/button";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../store";
import KompanijeDataTable from "./KompanijeDataTable";

function Kompanije() {
    const { kompanijeStore } = useStore();

    useEffect(() => {
        if (!kompanijeStore.fetchedKompanije) {
            kompanijeStore.GetAll();
        }
    }, [kompanijeStore]);

    return (
        <Row>
            <Col span={24}>
                <Row style={{ marginBottom: "40px" }}>
                    <Col span={24}>
                        <Button disabled={kompanijeStore.isloading} onClick={() => kompanijeStore.novaKompanija()}>Nova kompanija</Button>
                        <Button style={{ marginLeft: "10px" }} disabled={kompanijeStore.isloading} onClick={(e) => kompanijeStore.GetAll()}>Osvježi</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <KompanijeDataTable data={toJS(kompanijeStore.kompanije)} isLoading={kompanijeStore.isloading} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default observer(Kompanije);
