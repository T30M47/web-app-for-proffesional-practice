export interface ResponseUser {
    id_user: string;
    username: string;
    email: string;
    name: string;
    surname: string;
    is_admin: boolean;
    jmbag: string | null;
    role: string[];
}