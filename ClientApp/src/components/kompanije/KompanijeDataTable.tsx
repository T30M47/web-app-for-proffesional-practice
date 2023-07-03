import { Col, Input, Popconfirm, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { defaultSort } from '../../lib/sorter';
import { useStore } from '../../store';
import { Company } from '../../types/companies/Company';
import { BlueButton, RedButton } from '../lib/buttons/Buttons';
import { useState } from 'react';
import { Rola } from '../../types/enums/Rola';


type KompanijeDataProps = {
    data: Company[],
    isLoading: boolean
}

function KompanijeDataTable({ data, isLoading }: KompanijeDataProps) {
    const { kompanijeStore } = useStore();
    const { currentUserStore } = useStore();
    const student = currentUserStore.korisnik;
    const [upit, postaviUpit] = useState('');

    const columns: ColumnsType<Company> = [
        {
            title: 'Naziv kompanije',
            dataIndex: 'name',
            sorter: (a: Company, b: Company) => defaultSort(a.name, b.name),
            responsive: ["xs", "sm"],
        },
        {
            title: 'Adresa',
            dataIndex: 'address',
            sorter: (a: Company, b: Company) => defaultSort(a.address, b.address),
            responsive: ["xs", "sm"],
        },
        {
            title: 'Grad',
            dataIndex: 'city',
            sorter: (a: Company, b: Company) => defaultSort(a.city, b.city),
            responsive: ["xs", "sm"],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a: Company, b: Company) => defaultSort(a.city, b.city),
            responsive: ["md"],
        },
        
        {
            title: 'Akcija',
            key: 'action',
            align: "center",
            render: (text, record) => {
                const isNotStudent = student?.role.includes(Rola.Administrator) || student?.role.includes(Rola.Profesor) || student?.role.includes(Rola.Asistent);
                return(
                <Row>
                    <Col span={24}>
                        <NavLink to={`/kompanije/${record.id_company}`}>
                            <BlueButton style={{ width: "70px", margin:"2.5px" }}>Uredi</BlueButton>
                            </NavLink>
                            {isNotStudent &&(
                                <Popconfirm
                                    title="Jeste li sigurni da želite izbrisati kompaniju?"
                                    onConfirm={() => kompanijeStore.DeleteKompaniju(record.id_company)}
                                    okText="Potvrdi"
                                    cancelText="Odustani"
                                >
                                    <RedButton style={{ width: "70px", margin: "2.5px" }}>Izbriši</RedButton>
                                </Popconfirm>
                            )}
                    </Col>
                    </Row>
                )
           },
        },
    ];

    const filtrirano = data.filter((unos) => {
        const kompanija = kompanijeStore.kompanije.find((kompanija) => kompanija.id_company === unos.id_company);
        const naziv = kompanija ? `${kompanija.name}` : '';
        return naziv.toLowerCase().includes(upit.toLowerCase());
    });

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Input.Search
                    placeholder="Pretraži kompaniju po nazivu:"
                    value={upit}
                    onChange={(e) => postaviUpit(e.target.value)}
                    style={{ marginBottom: '20px', width: '600px' }}
                />
            </div>
            <Table rowKey="company_id" columns={columns} dataSource={filtrirano} loading={isLoading} />
        </>
    )
}

export default observer(KompanijeDataTable);
