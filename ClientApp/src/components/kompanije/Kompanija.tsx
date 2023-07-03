import Col, { ColProps } from "antd/lib/col";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Row from "antd/lib/row";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useServerValidations } from "../../lib/hooks/useServerValidations";
import { useStore } from "../../store";
import Loading from "../lib/Loading";
import TitleWithBackButton from "../lib/TitleWithBackButton";
import { GreenButton, RedButton } from "../lib/buttons/Buttons";
import { router } from "../main/Routes";



interface ColumnKompanijaProps extends ColProps {
    children: React.ReactNode
}

const ColumnKompanija = (props: ColumnKompanijaProps) => {
    return (
        <Col {...props} xs={{ span: 24, offset: 0 }} sm={{ span: 18, offset: 0 }} lg={{ span: 14, offset: 0 }} xl={{ span: 10, offset: 0 }} xxl={{ span: 9, offset: 0 }}>
            {props.children}
        </Col>
    )
}


function Kompanija() {
    const { kompanijeStore } = useStore();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [handleValidationErrors] = useServerValidations(form); //koristimo server side validation na formi za E-mail

    // na loadu selectamo korisnika
    useEffect(() => {
        if (id) kompanijeStore.SelectKompaniju(id);
    }, [id, kompanijeStore]);


    // kada se selectedKorisnik promijeni resetamo form fieldove
    useEffect(() => {
        form.resetFields()
    }, [form, kompanijeStore.selectedKompanija]);

    // form submit i odustani
    const onSubmit = async (values: any) => {
        try {
            const res = await kompanijeStore.CreateOrUpdate(id, values);
            if (res) {
                router.navigate("/kompanije");
            }          
        } catch (e) {
            handleValidationErrors(e);
        }
    }

    const onOdustani = () => {
        kompanijeStore.setSelectedKompanija(undefined);
        navigate(-1);
    }

    //render
    if (kompanijeStore.isFetchingCompany && kompanijeStore.selectedKompanija === undefined) return <Loading text="Dohvaćamo podatke..." />

    const onValuesChange = (changedValues: any) => {
        Object.keys(changedValues).forEach(key => {
            if (changedValues[key] === '') {
                form.setFieldsValue({ [key]: null });
            }
        }
        );
    }

    return (
        <Fragment>
            <Form
                form={form}
                labelCol={{ sm: { span: 7 }, md: { span: 7 }, lg: { span: 8 }, xl: { span: 7 }, xxl: { span: 7 } }}
                onFinish={async (values: any) => await onSubmit(values)}
                autoComplete="off"
                layout="horizontal"
                initialValues={kompanijeStore.selectedKompanija}
                onValuesChange={onValuesChange}
            >
                <Row>
                    <Col span={24} style={{ marginBottom: "20px" }}>
                        <TitleWithBackButton title={id ? "Izmjena kompanije" : "Nova kompanija"} />
                    </Col>

                    <ColumnKompanija>
                        <Form.Item
                            label="Naziv kompanije"
                            name="name"
                            rules={[
                                { required: true, message: 'Molimo unesite naziv kompanije' },
                            ]}
                        >
                            <Input
                                placeholder="Naziv kompanije" name="name"

                            />
                        </Form.Item>
                        <Form.Item
                            label="Adresa"
                            name="address"
                        >
                            <Input
                                placeholder="Adresa kompanije" name="address"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Grad"
                            name="city"
                        >
                            <Input
                                placeholder="Grad u kojem se kompanija nalazi" name="city"

                            />
                        </Form.Item>
                        <Form.Item
                            label="E-mail"
                            name="email"
                            rules={[
                                { type: 'email', message:'Molimo unesite ispravnu E-mail adresu ' },
                            ]}

                        >
                            <Input
                                placeholder="Email kompanije" name="email"
                            />
                        </Form.Item>
                        
                        

                        {kompanijeStore.selectedKompanija && <Form.Item
                            name="rowVersion"
                            hidden
                        />
                        }
                      
                    </ColumnKompanija>
                </Row>
                <Row>
                    <ColumnKompanija style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Form.Item>
                            <RedButton disabled={kompanijeStore.isloading} onClick={() => onOdustani()} style={{ marginRight: "10px" }}>Odustani</RedButton>
                            <GreenButton loading={kompanijeStore.isloading} htmlType="submit">{id ? "Izmijeni" : "Dodaj"}</GreenButton>
                        </Form.Item>
                    </ColumnKompanija>
                </Row>
            </Form>
        </Fragment>
    )
}

export default observer(Kompanija);
