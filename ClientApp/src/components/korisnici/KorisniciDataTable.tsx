import { Col, Input, Popconfirm, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { defaultSort } from '../../lib/sorter';
import { useStore } from '../../store';
import { ResponseUser } from '../../types/users/responses/ResponseUser';
import { BlueButton, RedButton } from '../lib/buttons/Buttons';
import Tag from 'antd/lib/tag';
import { useState } from 'react';
import { Rola, RoleColors } from '../../types/enums/Rola';

type KorisniciDataTableProps = {
    data: ResponseUser[],
    isLoading: boolean
}

function KorisniciDataTable({ data, isLoading }: KorisniciDataTableProps) {
    const { korisniciStore } = useStore();
    const { currentUserStore } = useStore();

    const student = currentUserStore.korisnik;

    const [upit, postaviUpit] = useState('');
    

    const columns: ColumnsType<ResponseUser> = [
        {
            title: 'Korisničko ime',
            dataIndex: 'username',
            sorter: (a: ResponseUser, b: ResponseUser) => defaultSort(a.username, b.username),
            responsive: ["xs", "sm"]
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a: ResponseUser, b: ResponseUser) => defaultSort(a.email, b.email),
            responsive: ["md"]

        },
        {
            title: 'Ime',
            dataIndex: 'name',
            sorter: (a: ResponseUser, b: ResponseUser) => defaultSort(a.name, b.name),
            responsive: ["xs", "sm"]
        },
        {
            title: 'Prezime',
            dataIndex: 'surname',
            sorter: (a: ResponseUser, b: ResponseUser) => defaultSort(a.surname, b.surname),
            responsive: ["xs", "sm"]
        },
        {
            title: 'JMBAG',
            dataIndex: 'jmbag',
            sorter: (a: ResponseUser, b: ResponseUser) => defaultSort(a.surname, b.surname),
            responsive: ["md"]
        },
         {
             title: 'Role',
             dataIndex: 'role',
             align: "center",
             render: role => (
                 <Row>
                     <Col span={24}>
                         {role?.map((rola: Rola) => {
                             return (
                                 <Tag color={RoleColors.get(rola)} key={rola} style={{ marginBottom: "5px" }}>
                                     {rola.toString()}
                                 </Tag>
                             );
                         })}
                     </Col>
                 </Row>
             ),
             responsive: ["xl"]
         },
        {
            title: 'Akcija',
            key: 'action',
            align: "center",
            render: (text, record) => {
                const studentId = student?.user_id === record.id_user;
                const isAdministrator = student?.role.includes(Rola.Administrator);
                const isProfesor = student?.role.includes(Rola.Profesor);
      
                    return (
                        <Row>
                            <Col span={24}>
                                {(studentId || isAdministrator || (isProfesor && (!record.role.includes(Rola.Administrator) && !record.role.includes(Rola.Profesor)))) && (
                                    <NavLink to={`/korisnici/${record.id_user}`}>
                                        <BlueButton style={{ width: "70px", margin: "2.5px" }}>Uredi</BlueButton>
                                    </NavLink>
                                )}
                                {(( isAdministrator || (isProfesor && (!record.role.includes(Rola.Administrator) && !record.role.includes(Rola.Profesor))) ) &&
                                    <Popconfirm
                                        title="Jeste li sigurni da želite izbrisati korisnika?"
                                        onConfirm={() => korisniciStore.DeleteKorisnika(record.id_user)}
                                        okText="Potvrdi"
                                        cancelText="Odustani"
                                    >
                                        <RedButton style={{ width: "70px", margin: "2.5px" }}>Izbriši</RedButton>
                                    </Popconfirm>
                                )}
                            </Col>
                        </Row>
                    );
                }
          },
       
    ];

    const filtrirano = data.filter((unos) => {
        const korisnik = korisniciStore.korisnici.find((korisnik) => korisnik.id_user === unos.id_user);
        const ime = korisnik ? `${korisnik.name} ${korisnik.surname}` : '';
        return ime.toLowerCase().includes(upit.toLowerCase());
    });

    return (
        <>
         <div style={{display:'flex', justifyContent:'flex-end'} }>
            <Input.Search
            placeholder="Pretraži studenta po imenu:"
            value={upit}
            onChange={(e) => postaviUpit(e.target.value)}
            style={{ marginBottom: '20px', width: '600px' }}
                />
        </div>
            <Table rowKey="user_id" columns={columns} dataSource={filtrirano} loading={isLoading} />
        </>
    )
}

export default observer(KorisniciDataTable);
