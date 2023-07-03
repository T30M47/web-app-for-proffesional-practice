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
import RoleSelect from "./RoleSelect";
import { Rola } from "../../types/enums/Rola";


interface ColumnKorisnikProps extends ColProps {
    children: React.ReactNode
}

const ColumnKorisnik = (props: ColumnKorisnikProps) => {
    return (
        <Col {...props} xs={{ span: 24, offset: 0 }} sm={{ span: 18, offset: 0 }} lg={{ span: 14, offset: 0 }} xl={{ span: 10, offset: 0 }} xxl={{ span: 9, offset: 0 }}>
            {props.children}
        </Col>
    )
}


function Korisnik() {
    const { korisniciStore } = useStore();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [handleValidationErrors] = useServerValidations(form); //koristimo server side validation na formi za E-mail
    const { currentUserStore } = useStore();

    // na loadu selectamo korisnika
    useEffect(() => {
        if (id) korisniciStore.SelectKorisnik(id);
    }, [id, korisniciStore]);


    // kada se selectedKorisnik promijeni resetamo form fieldove
    useEffect(() => {
        form.resetFields()
    }, [form, korisniciStore.selectedKorisnik]);

    // form submit i odustani
    const onSubmit = async (values: any) => {
        try {
            const res = await korisniciStore.CreateOrUpdate(id, values);
            if (res) {
                router.navigate("/korisnici");
            }
        } catch (e) {
            handleValidationErrors(e);
        }
    }

    const onOdustani = () => {
        korisniciStore.setSelectedKorisnik(undefined);
        navigate(-1);
    }

    //render
    if (korisniciStore.isFetchingUser && korisniciStore.selectedKorisnik === undefined) return <Loading text="Dohvaćamo podatke..." />

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
                initialValues={korisniciStore.selectedKorisnik}
                onValuesChange={onValuesChange}
            >
                <Row>
                    <Col span={24} style={{ marginBottom: "20px" }}>
                        <TitleWithBackButton title={id ? "Izmjena korisnika" : "Novi korisnik"} />
                    </Col>

                    <ColumnKorisnik>
                        <Form.Item
                            label="Korisničko ime"
                            name="username"
                            rules={[
                                { required: true, message: 'Molimo unesite korisničko ime' },
                            ]}
                        >
                            <Input
                                placeholder="Korisničko ime" name="username"

                            />
                        </Form.Item>
                        <Form.Item
                            label="E-mail"
                            name="email"
                            rules={[
                                { required: true, message: 'Molimo unesite E-mail korisnika' },
                                { type: 'email', message: 'Molimo unesite ispravnu E-mail adresu' },
                            ]}
                        >
                            <Input
                                placeholder="Email korisnika" name="email"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ime"
                            name="name"
                            rules={[
                                { required: true, message: 'Molimo unesite puno ime korisnika' },
                            ]}
                        >
                            <Input
                                placeholder="Puno ime korisnika" name="ime"

                            />
                        </Form.Item>
                        <Form.Item
                            label="Prezime"
                            name="surname"
                            rules={[
                                { required: true, message: 'Molimo unesite puno prezime korisnika' },
                            ]}

                        >
                            <Input
                                placeholder="Prezime korisnika" name="surname"
                            />
                        </Form.Item>
                        <Form.Item
                            label="JMBAG"
                            name="jmbag"
                            rules={[
                                { pattern: /^[0-9]*$/, message: 'JMBAG mora sadržavati samo brojeve.' },
                                { pattern: /^\d{10}$/, message:'JMBAG mora sadržavati točno 10 znamenki.'}
                            ]}
                        >
                            <Input
                                placeholder="JMBAG" name="JMBAG" 

                            />
                        </Form.Item>

                         <Form.Item
                            label="Lozinka"
                            name="password"
                            rules={[
                                { required: id ? false : true, message: 'Molimo unesite lozinku' }
                            ]}
                        >
                            <Input.Password
                                placeholder="Lozinka"
                            />
                        </Form.Item>
                        

                         <Form.Item
                            label="Potvrdite lozinku"
                            name="passwordConfirmation"
                            dependencies={['password']}
                            rules={[
                                { required: id ? false : true, message: 'Molimo ponovite lozinku' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Lozinke ne odgovaraju'));
                                    },
                                })
                            ]}
                        >
                            <Input.Password
                                placeholder="Lozinka"
                            />
                        </Form.Item>
                        

                        {korisniciStore.selectedKorisnik && <Form.Item
                            name="rowVersion"
                            hidden
                        />
                        }

                        {!currentUserStore.korisnik?.role.includes(Rola.Administrator) ? (
                        <RoleSelect disabled = {true}/>):(<RoleSelect disabled={false}/>)}
                    </ColumnKorisnik>
                </Row>
                <Row>
                    <ColumnKorisnik style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Form.Item>
                            <RedButton disabled={korisniciStore.isloading} onClick={() => onOdustani()} style={{ marginRight: "10px" }}>Odustani</RedButton>
                            <GreenButton loading={korisniciStore.isloading} htmlType="submit">{id ? "Izmijeni" : "Dodaj"}</GreenButton>
                        </Form.Item>
                    </ColumnKorisnik>
                </Row>
            </Form>
        </Fragment>
    )
}

export default observer(Korisnik);
