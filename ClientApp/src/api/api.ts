import { RequestSession } from "../types/sessions/requests/RequestSession";
import { ResponseSession } from "../types/sessions/responses/ResponseSession";
import { RequestUpdateUser } from "../types/users/requests/RequestUpdateUser";
import { RequestUser } from "../types/users/requests/RequestUser";
import { SessionRequestUser } from "../types/users/requests/SessionRequestUser";
import { ResponseUser } from "../types/users/responses/ResponseUser";
import { Company } from "../types/companies/Company";
import { RequestPractice } from "../types/practices/requests/RequestPractice";
import { ResponsePractice } from "../types/practices/responses/ResponsePractice";
import agent from "./agent";

const sessions = {
    login: (req: SessionRequestUser) => agent.post<ResponseSession>("/sessions/login", req),
    logout: (req: RequestSession) => agent.post<null>("/sessions/Logout", req),
    refreshToken: (req: RequestSession) => agent.post<ResponseSession>("/sessions/refresh-token", req)
}

const users = {
    GetAll: () => agent.get<ResponseUser[]>("/users"),
    GetUser: (id_user: string) => agent.get<ResponseUser>(`/users/${id_user}`),
    AddUser: (req: RequestUser) => agent.post<ResponseUser>('/users', req),
    UpdateUser: (id_user: string, req: RequestUpdateUser) => agent.put<ResponseUser>(`/users/${id_user}`, req),
    RemoveUser: (id_user: string) => agent.delete<null>(`/users/${id_user}`)
}

const companies = {
    GetAll: () => agent.get<Company[]>("/companies"),
    GetCompany: (id_company: string) => agent.get<Company>(`/companies/${id_company}`),
    AddCompany: (req: Company) => agent.post<Company>('/companies', req),
    UpdateCompany: (id_company: string, req: Company) => agent.put<Company>(`/companies/${id_company}`, req),
    RemoveCompany: (id_company: string) => agent.delete<null>(`/companies/${id_company}`)
}

const practices = {
    GetAll: () => agent.get<ResponsePractice[]>("/practices"),
    GetPractice: (id_practice: string) => agent.get<ResponsePractice>(`/practices/${id_practice}`),
    GetPracticeAY: (academic_year: string) => agent.get<ResponsePractice[]>(`/practices/AY?Academic_year=${academic_year}`),
    AddPractice: (req: RequestPractice) => agent.post<ResponsePractice>('/practices', req),
    UpdatePractice: (id_practice: string, req: RequestPractice) => agent.put<ResponsePractice>(`/practices/${id_practice}`, req),
    RemovePractice: (id_practice: string) => agent.delete<null>(`/practices/${id_practice}`)
}

const api = {
    sessions: sessions,
    users: users,
    companies: companies,
    practices: practices
}

export default api;
