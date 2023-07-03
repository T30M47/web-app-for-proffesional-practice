import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import { useStore } from "../../store";
import { Rola } from "../../types/enums/Rola";
import Unauthorized from "../lib/errors/Unauthorized";

type ProtectedRouteProps = {
    requiredRole?: Rola[] | null,
    redirectPath?: string,
    children: JSX.Element
}

const ProtectedRoute = ({ requiredRole = null, redirectPath = '/login', children }: ProtectedRouteProps) => {
    const { currentUserStore } = useStore();

    if (!currentUserStore.isLoggedIn) {
        return <Navigate to={redirectPath} replace />;
    }
    if (requiredRole != null && !currentUserStore.korisnikImaRolu(requiredRole)) {
        return <Unauthorized />;
    }
    return children;
};

export default observer(ProtectedRoute);
