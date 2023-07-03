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
import { Select, DatePicker, Radio, InputNumber} from 'antd';
import { Rola } from "../../types/enums/Rola";
const { Option } = Select;



interface ColumnPraksaProps extends ColProps {
    children: React.ReactNode
}

const ColumnPraksa = (props: ColumnPraksaProps) => {
    return (
        <Col {...props} xs={{ span: 24, offset: 0 }} sm={{ span: 18, offset: 0 }} lg={{ span: 14, offset: 0 }} xl={{ span: 10, offset: 0 }} xxl={{ span: 9, offset: 0 }}>
            {props.children}
        </Col>
    )
}


function Praksa() {
    const { prakseStore } = useStore();
    const { korisniciStore } = useStore();
    const { currentUserStore } = useStore();
    const { kompanijeStore } = useStore();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [handleValidationErrors] = useServerValidations(form); //koristimo server side validation na formi za E-mail

    // na loadu selectamo korisnika
    useEffect(() => {
        if (id) prakseStore.SelectPraksa(id);
    }, [id, prakseStore]);


    // kada se selectedKorisnik promijeni resetamo form fieldove
    useEffect(() => {
        form.resetFields()
    }, [form, prakseStore.selectedPraksa]);

    // form submit i odustani
    const onSubmit = async (values: any) => {
        try {
            const res = await prakseStore.CreateOrUpdate(id, values);
            if (res) {
                router.navigate("/prakse");
            }
        } catch (e) {
            handleValidationErrors(e);
        }
    }

    const onOdustani = () => {
        prakseStore.setSelectedPraksa(undefined);
        navigate(-1);
    }

    useEffect(() => {
        if (!korisniciStore.fetchedKorisnici) {
            korisniciStore.GetAll();
        }
    }, [korisniciStore]);

    useEffect(() => {
        if (!kompanijeStore.fetchedKompanije) {
            kompanijeStore.GetAll();
        }
    }, [kompanijeStore]);

    const onValuesChange = (changedValues: any) => {
        Object.keys(changedValues).forEach(key => {
            if (changedValues[key] === '') {
                form.setFieldsValue({ [key]: null });
            }
        }
        );
    }


    //render
    if (prakseStore.isFetchingPractice && prakseStore.selectedPraksa === undefined) return <Loading text="Dohvaćamo podatke..." />
    if (korisniciStore.isFetchingUser) return <Loading text="Dohvaćamo podatke..." />
    if (kompanijeStore.isFetchingCompany) return <Loading text="Dohvaćamo podatke..." />


    return (
        <Fragment>
            <Form
                form={form}
                labelCol={{ sm: { span: 7 }, md: { span: 7 }, lg: { span: 8 }, xl: { span: 7 }, xxl: { span: 7 } }}
                onFinish={async (values: any) => await onSubmit(values)}
                autoComplete="off"
                layout="horizontal"
                initialValues={prakseStore.selectedPraksa}
                onValuesChange={onValuesChange}
            >
                <Row>
                    <Col span={24} style={{ marginBottom: "20px" }}>
                        <TitleWithBackButton title={id ? "Izmjena prakse" : "Nova praksa"} />
                    </Col>

                    <ColumnPraksa>
                        <Form.Item
                            label="Student"
                            name="id_student"
                            rules={[
                                { required: true, message: 'Molimo odaberite studenta' },
                            ]}
                        >
                            <Select placeholder="Odaberite studenta">
                                {currentUserStore.korisnik?.role.includes(Rola.Student) && currentUserStore.korisnik.user_id ?
                                    (<Option key={currentUserStore.korisnik.user_id} value={currentUserStore.korisnik.user_id}>
                                        {`${korisniciStore.getKorisnik(currentUserStore.korisnik.user_id)?.name} ${korisniciStore.getKorisnik(currentUserStore.korisnik.user_id)?.surname}`}
                                    </Option>) :
                                    (
                                        korisniciStore.korisnici.map((korisnik) => (
                                            (korisnik.role.includes(Rola.Student)  && 
                                            <Option key={korisnik.id_user} value={korisnik.id_user}>
                                                {`${korisnik.name} ${korisnik.surname}`}
                                            </Option>)
                                        ))
                                    )}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Kompanija"
                            name="id_company"
                            rules={[
                                { required: true, message: 'Molimo unesite kompaniju' },
                            ]}
                        >
                            <Select placeholder="Odaberite kompaniju">
                                {kompanijeStore.kompanije.map((kompanija) => (
                                    <Option key={kompanija.id_company} value={kompanija.id_company}>
                                        { kompanija.name }
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Akademska godina"
                            name="academic_year"
                            rules={[
                                { required: true, message: 'Molimo unesite akademsku godinu' },
                            ]}
                            labelCol={{ offset:1} }
                        >
                            <Input
                                placeholder="Akademska godina" name="academic_year"

                            />
                        </Form.Item>
                        <Form.Item
                            label="Studij"
                            name="study"
                            rules={[
                                { required: true, message: 'Molimo unesite studij' },
                            ]}

                        >
                            <Radio.Group>
                                <Radio value="Preddiplomski">Preddiplomski</Radio>
                                <Radio value="Diplomski">Diplomski</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label="Datum početka"
                            name="begin_date"
                            rules={[
                                { required: true, message: 'Molimo unesite datum početka prakse' },
                            ]}
                        >
                        
                            <DatePicker
                                placeholder="Datum početka" name="begin_date" format="DD.MM.YYYY"

                            />
                        </Form.Item>

                        <Form.Item
                            label="Datum završetka"
                            name="end_date"   
                        >
                            <DatePicker 
                                placeholder="Datum završetka" name="end_date" format="DD.MM.YYYY"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Pozicija"
                            name="position"
                        >
                            <Input
                                placeholder="Pozicija" name="position"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Odrađeni sati"
                            name="hours_worked"
                            rules={
                                [
                                    {type: "number", message:"Odrađeni sati moraju biti broj."},
                                ]
                            }
                        >
                            <InputNumber
                                style={{ width: '200px' }} placeholder="Odrađeni sati" name="hours_worked" 
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mentor"
                            name="mentor"
                        >
                            <Input
                                placeholder="Mentor" name="mentor"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Komentar mentora"
                            name="mentor_comment"
                            labelCol={{ offset: 1 }}
                        >
                            <Input.TextArea
                                placeholder="Komentar mentora" name="mentor_comment"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Opis poslova/Dnevnik prakse"
                            name="job_description_practice_diary"
                            labelCol={{ span:24}}
                        >
                        
                            <Input.TextArea
                                placeholder="Opis poslova/Dnevnik prakse" name="job_description_practice_diary" style={{ height: "200px"}}
                               
                            />
                        </Form.Item>

                        {prakseStore.selectedPraksa && <Form.Item
                            name="rowVersion"
                            hidden
                        />
                        }
                        
                    </ColumnPraksa>
                </Row>
                <Row>
                    <ColumnPraksa style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Form.Item>
                            <RedButton disabled={prakseStore.isloading} onClick={() => onOdustani()} style={{ marginRight: "10px" }}>Odustani</RedButton>
                            <GreenButton loading={prakseStore.isloading} htmlType="submit">{id ? "Izmijeni" : "Dodaj"}</GreenButton>
                        </Form.Item>
                    </ColumnPraksa>
                </Row>
            </Form>
        </Fragment>
    )
}

export default observer(Praksa);
