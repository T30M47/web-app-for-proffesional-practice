export interface RequestUpdateUser {
    id_user: string;
    username: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    is_admin: boolean;
    jmbag: string | null;
    role: string[];
}
