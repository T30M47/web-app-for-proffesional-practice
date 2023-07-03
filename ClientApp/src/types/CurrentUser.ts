import { Rola } from "./enums/Rola"

export type CurrentUser = {
    user_id: string | null,
    username: string | null,
    email: string | null,
    role: Rola[]
}
