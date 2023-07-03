import Button from "antd/lib/button";
import Result from "antd/lib/result";
import { NavLink } from "react-router-dom";


function Error() {
    return (
        <Result
            status="warning"
            title="Došlo je do greške. Molimo prijavite problem!"
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

export default Error;
