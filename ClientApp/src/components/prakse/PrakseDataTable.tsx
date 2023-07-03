import { Col, Input, Popconfirm, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { defaultSort } from '../../lib/sorter';
import { useStore } from '../../store';
import { ResponsePractice } from '../../types/practices/responses/ResponsePractice';
import { BlueButton, RedButton } from '../lib/buttons/Buttons';
import { useEffect, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';
import { Rola } from '../../types/enums/Rola';
const { Option } = Select;

type PrakseDataProps = {
    data: ResponsePractice[],
    isLoading: boolean
}

function PrakseDataTable({ data, isLoading }: PrakseDataProps) {
    const { prakseStore } = useStore();
    const { korisniciStore } = useStore();
    const { kompanijeStore } = useStore();
    const { currentUserStore } = useStore();

    const student = currentUserStore.korisnik;



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

    const renderKorisnik = useMemo(() => {
        return (id_student: string) => {
            const korisnik = korisniciStore.korisnici.find((korisnik) => korisnik.id_user === id_student);
            if (korisnik) return `${korisnik.name} ${korisnik.surname}`;
            else return '';
        };
    }, [korisniciStore.korisnici]
    )

    const [upit, postaviUpit] = useState('');
    const [odabranaAkGod, postaviOdabranuAkGod] = useState('');

    const columns: ColumnsType<ResponsePractice> = [
        {
            title: 'Student',
            dataIndex: 'id_student',
            sorter: (a: ResponsePractice, b: ResponsePractice) => defaultSort(a.id_student, b.id_student),
            responsive: ["xs", "sm"],
            render: renderKorisnik
        },
        {
            title: 'Kompanija',
            dataIndex: 'id_company',
            sorter: (a: ResponsePractice, b: ResponsePractice) => defaultSort(a.id_company, b.id_company),
            responsive: ["xs", "sm"],
            render: (id_company: string) => {
                const kompanija = kompanijeStore.kompanije.find((kompanija) => kompanija.id_company === id_company)
                return kompanija?.name
            }

        },
        {
            title: 'Akademska godina',
            dataIndex: 'academic_year',
            sorter: (a: ResponsePractice, b: ResponsePractice) => defaultSort(a.academic_year, b.academic_year),
            responsive: [ "sm"],
            width: '13%'
        },
        {
            title: 'Studij',
            dataIndex: 'study',
            sorter: (a: ResponsePractice, b: ResponsePractice) => defaultSort(a.study, b.study),
            responsive: ["md"]
        },
        {
            title: 'Datum početka prakse',
            dataIndex: 'begin_date',
            sorter: (a: ResponsePractice, b: ResponsePractice) => defaultSort(a.begin_date, b.begin_date),
            responsive: ["md"],
            width: "15%",
            render: (date: Dayjs) => date ? date.format('DD.MM.YYYY.') : "",
        },
        {
            title: 'Datum završetka prakse',
            dataIndex: 'end_date',
            sorter: (a: ResponsePractice, b: ResponsePractice) => defaultSort(a.end_date, b.end_date),
            responsive: ["xl"],
            width: "15%",
            render: (date: Dayjs) => date ? date.format('DD.MM.YYYY.') : "",
        },
        {
            title: 'Odrađeni sati',
            dataIndex: 'hours_worked',
            sorter: (a: ResponsePractice, b: ResponsePractice) => defaultSort(a.hours_worked, b.hours_worked),
            responsive: ["xl"],
            width: "10%"
        },

        {
            title: 'Akcija',
            key: 'action',
            align: "center",
            width: "13%",
            render: (text, record) => {
                const studentId = student?.user_id === record.id_student;
                const isNotStudent = student?.role.includes(Rola.Administrator) || student?.role.includes(Rola.Profesor) || student?.role.includes(Rola.Asistent);
                if (studentId || isNotStudent) {
                    return (
                        <Row>
                            <Col span={24}>
                                <NavLink to={`/prakse/${record.id_practice}`}>
                                    <BlueButton style={{ width: "70px", margin: "2px" }}>Uredi</BlueButton>
                                </NavLink>
                                <Popconfirm
                                    title="Jeste li sigurni da želite izbrisati praksu?"
                                    onConfirm={() => prakseStore.DeletePraksu(record.id_practice)}
                                    okText="Potvrdi"
                                    cancelText="Odustani"
                                >
                                    <RedButton style={{ width: "70px", margin:"2px" }}>Izbriši</RedButton>
                                </Popconfirm>
                            </Col>
                        </Row >
                    )
                }
            },
        },
    ];

    const filtrirano = data.filter((unos) => {
        const korisnik = korisniciStore.korisnici.find((korisnik) => korisnik.id_user === unos.id_student);
        const ime = korisnik ? `${korisnik.name} ${korisnik.surname}` : '';
        return ime.toLowerCase().includes(upit.toLowerCase());
    });

    const filtriranoAkGod = odabranaAkGod ? filtrirano.filter((praksa) => praksa.academic_year === odabranaAkGod) : filtrirano;
    const jedinstveneAkademskeGodine = (Array.from(new Set(prakseStore.prakse.map((praksa) => praksa.academic_year)))).sort();


    return (
        <>
            <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Col >
                <div>
                    <Select placeholder="Filter po akademskoj godini"
                        value={odabranaAkGod}
                        onChange={postaviOdabranuAkGod}
                        style={{ marginBottom: '20px', width: '200px' }}>
                        <Option value="">Sve akademske godine</Option>
                        {jedinstveneAkademskeGodine.map((praksa) => (
                            <Option key={praksa} value={praksa} >
                                {praksa}
                            </Option>
                        ))}
                    </Select>
                    </div>
                </Col>
                <Col>
                <div >
                    <Input.Search
                        placeholder="Pretraži praksu po imenu studenta:"
                        value={upit}
                        onChange={(e) => postaviUpit(e.target.value)}
                        style={{ marginBottom: '20px', width: '400px' }}
                    />
                </div>
                </Col>

            </Row>
            <Table rowKey="practice_id" columns={columns} dataSource={filtriranoAkGod} loading={isLoading} />
        </>
    )
}

export default observer(PrakseDataTable);


