import { Result } from 'antd';
import Button from 'antd/lib/button';
import { NavLink } from 'react-router-dom';

function Unauthorized() {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Nemate potrebnu dozvolu za pristup."
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

export default Unauthorized;
