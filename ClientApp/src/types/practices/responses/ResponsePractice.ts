export interface ResponsePractice {
    id_practice: string;
    id_student: string;
    id_company: string;
    academic_year: string;
    study: string;
    begin_date: Date;
    end_date: Date | null;
    position: string | null;
    hours_worked: number | null;
    mentor: string | null;
    mentor_comment: string | null;
    job_description_practice_diary: string | null;
}
