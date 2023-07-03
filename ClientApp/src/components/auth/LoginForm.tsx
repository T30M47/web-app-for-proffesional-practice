import { Col, Row, Typography } from 'antd';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Title from 'antd/lib/typography/Title';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { Navigate } from 'react-router-dom';


function LoginForm() {
    const { currentUserStore } = useStore();

    // form submit i odustani
    const onSubmit = async (values: any) => {
        await currentUserStore.login({ username: values.username, password: values.password, rememberMe: values.remember });
    }

    if (currentUserStore.isLoggedIn) {
        return <Navigate to = '/' />;
    }

    return (
        <Row>
            <Col xs={{ span: 24, offset: 0 }} md={{ span: 16, offset: 4 }} lg={{ span: 14, offset: 5 }} xl={{ span: 12, offset: 6 }} xxl={{ span: 8, offset: 8 }}>
                <Row>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 18, offset: 3 }} xl={{ span: 16, offset: 4 }}>
                        <div style={{ textAlign: "center" }}>
                            <Title level={3} style={{ marginBottom: "5px" }}>Evidencija stručne prakse</Title>
                            <Typography.Text type="secondary">Molimo prijavite se</Typography.Text>
                        </div>
                        <Form
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onSubmit}
                            autoComplete="off"
                            style={{ marginTop: "40px" }}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    { required: true, message: 'Molimo unesite korisničko ime' },
                                ]}

                            >
                                <Input placeholder="Korisničko ime" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Molimo unesite lozinku' }
                                ]}
                            >
                                <Input.Password placeholder="Lozinka" />
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>Zapamti me</Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Button style={{ width: "100%" }} htmlType="submit" loading={currentUserStore.isLoggingIn}>
                                    Prijava
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>

    );
}

export default observer(LoginForm);
