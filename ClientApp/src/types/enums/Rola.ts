export enum Rola {
    Student = "Student",
    Asistent = "Asistent",
    Profesor = "Profesor",
    Administrator = "Administrator"
}

export const RoleColors = new Map<string, string>([
    [Rola.Student, 'green'],
    [Rola.Asistent, 'geekblue'],
    [Rola.Profesor, 'volcano'],
    [Rola.Administrator, 'red'],
]);
