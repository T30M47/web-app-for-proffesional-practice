using Dapper;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection.Metadata;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Migrations
{
    internal static class Migrations
    {
        private static async Task UpdateTo1(NpgsqlConnection cn, int version)
        {
            if (cn.State != ConnectionState.Open) await cn.OpenAsync();
            using (NpgsqlTransaction tr = cn.BeginTransaction())
            {
                // companies
                await cn.ExecuteAsync(@"CREATE TABLE public.companies (
                                            id_company character varying(50) NOT NULL,
                                            name character varying(255) NOT NULL,
                                            address character varying(255),
                                            city character varying(255),
                                            email character varying(255)
                                        );", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.companies ADD CONSTRAINT ""Companies_pkey"" PRIMARY KEY (id_company);", null, tr);


                // practices
                await cn.ExecuteAsync(@"CREATE TABLE public.practices (
                                            id_practice character varying(50) NOT NULL,
                                            id_student character varying(50) NOT NULL,
                                            id_company character varying(50) NOT NULL,
                                            academic_year character varying(50) NOT NULL,
                                            study character varying(50) NOT NULL,
                                            begin_date date NOT NULL,
                                            end_date date,
                                            ""position"" character varying(255),
                                            hours_worked integer,
                                            mentor character varying(255),
                                            mentor_comment text,
                                            job_description_practice_diary text
                                        );", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.practices ADD CONSTRAINT ""Practices_pkey"" PRIMARY KEY (id_practice);", null, tr);

                // sessions
                await cn.ExecuteAsync(@"CREATE TABLE public.sessions (
                                            refreshtoken character varying(255) NOT NULL,
                                            id_user character varying(50) NOT NULL
                                        );", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.sessions ADD CONSTRAINT ""Sessions_pkey"" PRIMARY KEY (refreshtoken);", null, tr);


                // users
                await cn.ExecuteAsync(@"CREATE TABLE public.users (
                                            id_user character varying(50) NOT NULL,
                                            username character varying(255) NOT NULL,
                                            email character varying(255) NOT NULL,
                                            name character varying(255) NOT NULL,
                                            surname character varying(255) NOT NULL,
                                            password_hash character varying(255) NOT NULL,
                                            jmbag character(10)
                                        );", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.users ADD CONSTRAINT ""Users_pkey"" PRIMARY KEY (id_user);", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE public.users ADD CONSTRAINT jmbag_check CHECK ((length(jmbag) = 10)) NOT VALID;", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.users ADD CONSTRAINT unique_username UNIQUE (username);", null, tr);

                // user roles
                await cn.ExecuteAsync(@"CREATE TABLE public.user_roles (
                                            id_user character varying(50) NOT NULL,
                                            id_role int NOT NULL
                                        );", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.user_roles ADD CONSTRAINT ""User_Roles_pkey"" PRIMARY KEY (id_user, id_role);", null, tr);


                //fk
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.practices ADD CONSTRAINT id_company_fkey FOREIGN KEY (id_company) REFERENCES public.companies(id_company) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.practices ADD CONSTRAINT id_student_fkey FOREIGN KEY (id_student) REFERENCES public.users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.user_roles ADD CONSTRAINT id_role_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;", null, tr);
                await cn.ExecuteAsync(@"ALTER TABLE ONLY public.sessions ADD CONSTRAINT id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;", null, tr);

                //parametri
                await cn.ExecuteAsync(@"CREATE TABLE public.parameters (DBVersion int NOT NULL);", null, tr);


                // uvijek na kraju migracije
                await cn.ExecuteAsync(@"INSERT INTO parameters(DBVersion) VALUES(@version)", new {version = version }, tr);
                await tr.CommitAsync();
            }
        }
    }
}
