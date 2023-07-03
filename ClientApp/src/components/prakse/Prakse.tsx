import Button from "antd/lib/button/button";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../store";
import PrakseDataTable from "./PrakseDataTable";

function Prakse() {
    const { prakseStore } = useStore();

    useEffect(() => {
        if (!prakseStore.fetchedPrakse) {
            prakseStore.GetAll();
        }
    }, [prakseStore]);

    return (
        <Row>
            <Col span={24}>
                <Row style={{ marginBottom: "40px" }}>
                    <Col span={24}>
                        <Button disabled={prakseStore.isloading} onClick={() => prakseStore.novaPraksa()}>Nova praksa</Button>
                        <Button style={{ marginLeft: "10px" }} disabled={prakseStore.isloading} onClick={(e) => prakseStore.GetAll()}>Osvježi</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <PrakseDataTable data={toJS(prakseStore.prakse)} isLoading={prakseStore.isloading} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default observer(Prakse);
