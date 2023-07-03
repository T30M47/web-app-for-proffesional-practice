import { Result } from 'antd';
import Button from 'antd/lib/button';
import { NavLink } from 'react-router-dom';

function NotFound() {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Prekopali smo svuda, ali ovo nismo uspjeli pronaći."
            extra={
                <Button>
                    <NavLink to={"/"}>
                        Povratak na početnu stranicu
                    </NavLink>
                </Button>
            }
        />
    )
}

export default NotFound;
