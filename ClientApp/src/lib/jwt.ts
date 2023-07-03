import { decodeToken } from "react-jwt";
import { CurrentUser } from "../types/CurrentUser";
import { Rola } from "../types/enums/Rola";

type JWTTokenData = {
    user_id: string,
    username: string,
    email: string,
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": Rola[],
}


export const JWTParse = (token: string | null): CurrentUser | null => {
    try {
        if (token == null) {
            return null;
        }
        const currentUser = (decodeToken(token) as JWTTokenData)
        return {
            user_id: currentUser.user_id,
            username: currentUser.username,
            email: currentUser.email,
            role: currentUser["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}
