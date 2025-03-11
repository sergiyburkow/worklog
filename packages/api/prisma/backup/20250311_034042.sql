--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Homebrew)
-- Dumped by pg_dump version 15.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS tasks_project_id_fkey;
ALTER TABLE IF EXISTS ONLY public.task_logs DROP CONSTRAINT IF EXISTS task_logs_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.task_logs DROP CONSTRAINT IF EXISTS task_logs_task_id_fkey;
ALTER TABLE IF EXISTS ONLY public.task_logs DROP CONSTRAINT IF EXISTS task_logs_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public."UserTokens" DROP CONSTRAINT IF EXISTS "UserTokens_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."UserSkills" DROP CONSTRAINT IF EXISTS "UserSkills_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."UserSkills" DROP CONSTRAINT IF EXISTS "UserSkills_skill_id_fkey";
ALTER TABLE IF EXISTS ONLY public."TaskLogStatusHistory" DROP CONSTRAINT IF EXISTS "TaskLogStatusHistory_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."TaskLogStatusHistory" DROP CONSTRAINT IF EXISTS "TaskLogStatusHistory_task_log_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Projects" DROP CONSTRAINT IF EXISTS "Projects_client_id_fkey";
ALTER TABLE IF EXISTS ONLY public."ProjectUsers" DROP CONSTRAINT IF EXISTS "ProjectUsers_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."ProjectUsers" DROP CONSTRAINT IF EXISTS "ProjectUsers_project_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Products" DROP CONSTRAINT IF EXISTS "Products_project_id_fkey";
ALTER TABLE IF EXISTS ONLY public."ClientContacts" DROP CONSTRAINT IF EXISTS "ClientContacts_client_id_fkey";
DROP INDEX IF EXISTS public."Users_email_key";
DROP INDEX IF EXISTS public."Skills_name_key";
DROP INDEX IF EXISTS public."Products_code_project_id_key";
ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS tasks_pkey;
ALTER TABLE IF EXISTS ONLY public.task_logs DROP CONSTRAINT IF EXISTS task_logs_pkey;
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_pkey";
ALTER TABLE IF EXISTS ONLY public."UserTokens" DROP CONSTRAINT IF EXISTS "UserTokens_pkey";
ALTER TABLE IF EXISTS ONLY public."UserSkills" DROP CONSTRAINT IF EXISTS "UserSkills_pkey";
ALTER TABLE IF EXISTS ONLY public."TaskLogStatusHistory" DROP CONSTRAINT IF EXISTS "TaskLogStatusHistory_pkey";
ALTER TABLE IF EXISTS ONLY public."Skills" DROP CONSTRAINT IF EXISTS "Skills_pkey";
ALTER TABLE IF EXISTS ONLY public."Projects" DROP CONSTRAINT IF EXISTS "Projects_pkey";
ALTER TABLE IF EXISTS ONLY public."ProjectUsers" DROP CONSTRAINT IF EXISTS "ProjectUsers_pkey";
ALTER TABLE IF EXISTS ONLY public."Products" DROP CONSTRAINT IF EXISTS "Products_pkey";
ALTER TABLE IF EXISTS ONLY public."Clients" DROP CONSTRAINT IF EXISTS "Clients_pkey";
ALTER TABLE IF EXISTS ONLY public."ClientContacts" DROP CONSTRAINT IF EXISTS "ClientContacts_pkey";
DROP TABLE IF EXISTS public.tasks;
DROP TABLE IF EXISTS public.task_logs;
DROP TABLE IF EXISTS public."Users";
DROP TABLE IF EXISTS public."UserTokens";
DROP TABLE IF EXISTS public."UserSkills";
DROP TABLE IF EXISTS public."TaskLogStatusHistory";
DROP TABLE IF EXISTS public."Skills";
DROP TABLE IF EXISTS public."Projects";
DROP TABLE IF EXISTS public."ProjectUsers";
DROP TABLE IF EXISTS public."Products";
DROP TABLE IF EXISTS public."Clients";
DROP TABLE IF EXISTS public."ClientContacts";
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."TaskType";
DROP TYPE IF EXISTS public."TaskStatus";
DROP TYPE IF EXISTS public."TaskLogStatus";
DROP TYPE IF EXISTS public."TaskLogApprovalStatus";
DROP TYPE IF EXISTS public."ProjectUserRole";
DROP TYPE IF EXISTS public."ProjectStatus";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: maestro
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO maestro;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: maestro
--

COMMENT ON SCHEMA public IS '';


--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: maestro
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'PLANNED',
    'NEW',
    'IN_PROGRESS',
    'ON_HOLD',
    'COMPLETED',
    'SHIPPED',
    'REJECTED',
    'FINISHED'
);


ALTER TYPE public."ProjectStatus" OWNER TO maestro;

--
-- Name: ProjectUserRole; Type: TYPE; Schema: public; Owner: maestro
--

CREATE TYPE public."ProjectUserRole" AS ENUM (
    'MANAGER',
    'QA',
    'ENGINEER',
    'PADAWAN'
);


ALTER TYPE public."ProjectUserRole" OWNER TO maestro;

--
-- Name: TaskLogApprovalStatus; Type: TYPE; Schema: public; Owner: maestro
--

CREATE TYPE public."TaskLogApprovalStatus" AS ENUM (
    'APPROVED',
    'NEEDS_FIXES',
    'ON_HOLD'
);


ALTER TYPE public."TaskLogApprovalStatus" OWNER TO maestro;

--
-- Name: TaskLogStatus; Type: TYPE; Schema: public; Owner: maestro
--

CREATE TYPE public."TaskLogStatus" AS ENUM (
    'NEW',
    'IN_PROGRESS',
    'COMPLETED',
    'ON_HOLD'
);


ALTER TYPE public."TaskLogStatus" OWNER TO maestro;

--
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: maestro
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'NEW',
    'IN_PROGRESS',
    'COMPLETED',
    'ON_HOLD'
);


ALTER TYPE public."TaskStatus" OWNER TO maestro;

--
-- Name: TaskType; Type: TYPE; Schema: public; Owner: maestro
--

CREATE TYPE public."TaskType" AS ENUM (
    'PRODUCT',
    'GENERAL'
);


ALTER TYPE public."TaskType" OWNER TO maestro;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: maestro
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'PROJECT_MANAGER',
    'ENGINEER',
    'QA',
    'GUEST'
);


ALTER TYPE public."UserRole" OWNER TO maestro;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ClientContacts; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."ClientContacts" (
    id text NOT NULL,
    client_id text NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    telegram text,
    whatsapp text,
    signal text,
    messenger text,
    instagram text,
    facebook text
);


ALTER TABLE public."ClientContacts" OWNER TO maestro;

--
-- Name: Clients; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."Clients" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    address text,
    contact_info text
);


ALTER TABLE public."Clients" OWNER TO maestro;

--
-- Name: Products; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."Products" (
    id text NOT NULL,
    code text NOT NULL,
    project_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Products" OWNER TO maestro;

--
-- Name: ProjectUsers; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."ProjectUsers" (
    user_id text NOT NULL,
    project_id text NOT NULL,
    role public."ProjectUserRole" NOT NULL
);


ALTER TABLE public."ProjectUsers" OWNER TO maestro;

--
-- Name: Projects; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."Projects" (
    id text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    deadline timestamp(3) without time zone NOT NULL,
    actual_end_date timestamp(3) without time zone,
    status public."ProjectStatus" DEFAULT 'NEW'::public."ProjectStatus" NOT NULL,
    quantity integer,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Projects" OWNER TO maestro;

--
-- Name: Skills; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."Skills" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Skills" OWNER TO maestro;

--
-- Name: TaskLogStatusHistory; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."TaskLogStatusHistory" (
    id text NOT NULL,
    task_log_id text NOT NULL,
    status public."TaskLogApprovalStatus" NOT NULL,
    user_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TaskLogStatusHistory" OWNER TO maestro;

--
-- Name: UserSkills; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."UserSkills" (
    user_id text NOT NULL,
    skill_id text NOT NULL
);


ALTER TABLE public."UserSkills" OWNER TO maestro;

--
-- Name: UserTokens; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."UserTokens" (
    id text NOT NULL,
    user_id text NOT NULL,
    jwt_token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserTokens" OWNER TO maestro;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."Users" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    password_hash text NOT NULL,
    role public."UserRole" DEFAULT 'ENGINEER'::public."UserRole" NOT NULL
);


ALTER TABLE public."Users" OWNER TO maestro;

--
-- Name: task_logs; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public.task_logs (
    id text NOT NULL,
    user_id text NOT NULL,
    task_id text NOT NULL,
    product_id text,
    completed_at timestamp(3) without time zone,
    registered_at timestamp(3) without time zone NOT NULL,
    time_spent numeric(65,30)
);


ALTER TABLE public.task_logs OWNER TO maestro;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public.tasks (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    estimated_time numeric(65,30) NOT NULL,
    complexity integer,
    tags text,
    type public."TaskType" DEFAULT 'GENERAL'::public."TaskType" NOT NULL,
    project_id text NOT NULL
);


ALTER TABLE public.tasks OWNER TO maestro;

--
-- Data for Name: ClientContacts; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."ClientContacts" (id, client_id, name, email, phone, telegram, whatsapp, signal, messenger, instagram, facebook) FROM stdin;
\.


--
-- Data for Name: Clients; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Clients" (id, name, description, address, contact_info) FROM stdin;
\.


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Products" (id, code, project_id, created_at) FROM stdin;
\.


--
-- Data for Name: ProjectUsers; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."ProjectUsers" (user_id, project_id, role) FROM stdin;
\.


--
-- Data for Name: Projects; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Projects" (id, name, client_id, start_date, deadline, actual_end_date, status, quantity, updated_at) FROM stdin;
\.


--
-- Data for Name: Skills; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Skills" (id, name) FROM stdin;
\.


--
-- Data for Name: TaskLogStatusHistory; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."TaskLogStatusHistory" (id, task_log_id, status, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: UserSkills; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."UserSkills" (user_id, skill_id) FROM stdin;
\.


--
-- Data for Name: UserTokens; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."UserTokens" (id, user_id, jwt_token, expires_at) FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Users" (id, name, email, phone, password_hash, role) FROM stdin;
cf598e30-c2b0-4496-aecf-207afbce94ea	Cray Flatline	cray@sscgroup.net	\N	$2b$10$O0ra1Fo87xrdIBX0d.M6We6.4xjqF/g9ZlbAwUNbFOIioDinzioUm	ADMIN
\.


--
-- Data for Name: task_logs; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public.task_logs (id, user_id, task_id, product_id, completed_at, registered_at, time_spent) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public.tasks (id, name, description, estimated_time, complexity, tags, type, project_id) FROM stdin;
\.


--
-- Name: ClientContacts ClientContacts_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."ClientContacts"
    ADD CONSTRAINT "ClientContacts_pkey" PRIMARY KEY (id);


--
-- Name: Clients Clients_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Clients"
    ADD CONSTRAINT "Clients_pkey" PRIMARY KEY (id);


--
-- Name: Products Products_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (id);


--
-- Name: ProjectUsers ProjectUsers_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."ProjectUsers"
    ADD CONSTRAINT "ProjectUsers_pkey" PRIMARY KEY (user_id, project_id);


--
-- Name: Projects Projects_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Projects_pkey" PRIMARY KEY (id);


--
-- Name: Skills Skills_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Skills"
    ADD CONSTRAINT "Skills_pkey" PRIMARY KEY (id);


--
-- Name: TaskLogStatusHistory TaskLogStatusHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."TaskLogStatusHistory"
    ADD CONSTRAINT "TaskLogStatusHistory_pkey" PRIMARY KEY (id);


--
-- Name: UserSkills UserSkills_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."UserSkills"
    ADD CONSTRAINT "UserSkills_pkey" PRIMARY KEY (user_id, skill_id);


--
-- Name: UserTokens UserTokens_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."UserTokens"
    ADD CONSTRAINT "UserTokens_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: task_logs task_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public.task_logs
    ADD CONSTRAINT task_logs_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: Products_code_project_id_key; Type: INDEX; Schema: public; Owner: maestro
--

CREATE UNIQUE INDEX "Products_code_project_id_key" ON public."Products" USING btree (code, project_id);


--
-- Name: Skills_name_key; Type: INDEX; Schema: public; Owner: maestro
--

CREATE UNIQUE INDEX "Skills_name_key" ON public."Skills" USING btree (name);


--
-- Name: Users_email_key; Type: INDEX; Schema: public; Owner: maestro
--

CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);


--
-- Name: ClientContacts ClientContacts_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."ClientContacts"
    ADD CONSTRAINT "ClientContacts_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public."Clients"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Products Products_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public."Projects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectUsers ProjectUsers_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."ProjectUsers"
    ADD CONSTRAINT "ProjectUsers_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public."Projects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectUsers ProjectUsers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."ProjectUsers"
    ADD CONSTRAINT "ProjectUsers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Projects Projects_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Projects_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public."Clients"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TaskLogStatusHistory TaskLogStatusHistory_task_log_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."TaskLogStatusHistory"
    ADD CONSTRAINT "TaskLogStatusHistory_task_log_id_fkey" FOREIGN KEY (task_log_id) REFERENCES public.task_logs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TaskLogStatusHistory TaskLogStatusHistory_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."TaskLogStatusHistory"
    ADD CONSTRAINT "TaskLogStatusHistory_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSkills UserSkills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."UserSkills"
    ADD CONSTRAINT "UserSkills_skill_id_fkey" FOREIGN KEY (skill_id) REFERENCES public."Skills"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSkills UserSkills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."UserSkills"
    ADD CONSTRAINT "UserSkills_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserTokens UserTokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."UserTokens"
    ADD CONSTRAINT "UserTokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_logs task_logs_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public.task_logs
    ADD CONSTRAINT task_logs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: task_logs task_logs_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public.task_logs
    ADD CONSTRAINT task_logs_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_logs task_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public.task_logs
    ADD CONSTRAINT task_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tasks tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public."Projects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: maestro
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

