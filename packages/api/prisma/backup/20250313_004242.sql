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
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
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
DROP TABLE IF EXISTS public._prisma_migrations;
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
    'GENERAL',
    'INTERMEDIATE'
);


ALTER TYPE public."TaskType" OWNER TO maestro;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: maestro
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'PROJECT_MANAGER',
    'WORKER',
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
    role public."ProjectUserRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
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
    role public."UserRole" DEFAULT 'WORKER'::public."UserRole" NOT NULL,
    "callSign" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastName" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO maestro;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO maestro;

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
    project_id text NOT NULL,
    status public."TaskStatus" DEFAULT 'NEW'::public."TaskStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
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
44090811-4903-469d-8a14-40c07c817c1c	Генерал Черешня			
\.


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Products" (id, code, project_id, created_at) FROM stdin;
\.


--
-- Data for Name: ProjectUsers; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."ProjectUsers" (user_id, project_id, role, "isActive") FROM stdin;
38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	MANAGER	t
5d759a32-b650-4801-9bdd-f5565943dc01	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
1554f0d4-f870-4c35-805e-90cd37b2e47f	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
54b4ceec-7c75-4aff-8b08-6333b1849cf8	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
d5c43a0c-6249-49e4-8d04-22024aa8193a	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
4ac2b819-a667-4371-9396-d42cb622a0ea	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
\.


--
-- Data for Name: Projects; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Projects" (id, name, client_id, start_date, deadline, actual_end_date, status, quantity, updated_at) FROM stdin;
f26cc409-bfb4-453f-82fe-9e7fe5fc4847	524 каміки з тепловізійною камерою	44090811-4903-469d-8a14-40c07c817c1c	2025-03-07 00:00:00	2025-04-07 00:00:00	\N	IN_PROGRESS	524	2025-03-12 19:17:30.677
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

COPY public."Users" (id, name, email, phone, password_hash, role, "callSign", "createdAt", "lastName", "updatedAt") FROM stdin;
38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	Сергій	cray@sscgroup.net	\N	$2b$10$X7H2FrU5viqsA72NKAAB.OYjkTJAkC2ZUz2aCn2D9j1yA9xk5rskq	ADMIN	\N	2025-03-11 22:29:13.458	\N	2025-03-11 22:29:13.458
5d759a32-b650-4801-9bdd-f5565943dc01	Саня	sasha.kozlov2010@gmail.com	+380939923942	$2b$10$.U.uGd/Y8SNLwxVTXPYTE.Y806KPAs7dL0GA3QsZ/1F3TEve0rJVW	WORKER	\N	2025-03-11 20:35:02.865	\N	2025-03-11 20:35:02.865
d5c43a0c-6249-49e4-8d04-22024aa8193a	Максим	guardiamax660@gmail.com	+380972461180	$2b$10$Xtg86ymOytfnR9sBL3xHwO.hFzEq8euTAGEUoC20i1d59iocTtGVC	WORKER	\N	2025-03-12 17:30:42.285	\N	2025-03-12 17:30:42.285
1554f0d4-f870-4c35-805e-90cd37b2e47f	Олексій	alex59.kovalenko@gmail.com	+380671053855	$2b$10$PuerEQ4q8smo.9sv8HRGAeW2Cr7bMn7dFoYro68A24xX3CqCLuE/W	WORKER	\N	2025-03-12 17:43:36.474	\N	2025-03-12 17:43:36.474
54b4ceec-7c75-4aff-8b08-6333b1849cf8	Артем	artemsaliychuk88@gmail.com	+380930334823	$2b$10$F9u80sXxUfm/XSuooA.Isef5qK8AHwu5v7ZXUyREYziormsxfOf6K	WORKER	\N	2025-03-12 17:47:36.911	\N	2025-03-12 17:47:36.911
4ac2b819-a667-4371-9396-d42cb622a0ea	Богдан	Garrik2000@ukr.net	+380677803740	$2b$10$GUzCLCVXpHhVSfedrokYrOvJtG2J6l6TWnYerURD86tcAYBfo3rsW	WORKER	\N	2025-03-12 18:29:31.83	\N	2025-03-12 18:29:31.83
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
cdf4f293-29bc-420c-98e9-e1f0b63f8bc0	181e574e741b083046d130a04f3546e9437a6271715c8038b217c32faba831a0	2025-03-11 21:00:26.551056+02	20250311185548_init	\N	\N	2025-03-11 21:00:26.527354+02	1
27678790-6062-4457-b690-420e1a08a8eb	1c1b130ec8dc442d4aecbb9ced2ce08f358664dea2cf9f64cba0c33510dc1e4d	2025-03-11 21:00:40.602124+02	20250311190040_init	\N	\N	2025-03-11 21:00:40.598352+02	1
d8f9eb37-912f-41ee-9302-637f08bfbeda	b3a9f3ad98d50adf6a5a10c416ba838fbfab35191e94592da371b28d1f26b798	2025-03-11 22:29:13.461293+02	20250311202841_add_lastname_and_callsign_to_user	\N	\N	2025-03-11 22:29:13.456924+02	1
0b1a20b2-0f89-45db-a702-4dd2403d34e1	ca61ff661612b158e33b46574b1a327d1a3a73012e672588cedff622f8f5bca6	2025-03-11 22:30:58.576343+02	20250311203058_	\N	\N	2025-03-11 22:30:58.574308+02	1
f9dc2125-26c6-4a68-8b36-ab3bf9478bfa	c43bdefcee5bf8082f7f84ae0d93c3a4c334a92cdb92efbc655a5db01b010af8	2025-03-12 20:26:26.724616+02	20250312182626_add_status_to_task	\N	\N	2025-03-12 20:26:26.719914+02	1
d5a2cc6e-80e9-430d-aa70-6a76c3c2659f	4e8fa8b29b48ff0979db0487bb2357566739d4ad7df47867b8c6952d80b44074	2025-03-12 21:07:00.648005+02	20250312190700_add_is_active_to_project_user	\N	\N	2025-03-12 21:07:00.643689+02	1
\.


--
-- Data for Name: task_logs; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public.task_logs (id, user_id, task_id, product_id, completed_at, registered_at, time_spent) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public.tasks (id, name, description, estimated_time, complexity, tags, type, project_id, status, created_at, updated_at) FROM stdin;
b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	Збірка рами	Результат: \nЗібрана рама, з променями, стійками, болтами на стек, моторами і неусадженою термозбіжкою на промінях	12.000000000000000000000000000000	\N	\N	PRODUCT	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
ccc27a15-e2e3-4629-bb95-cef43e631311	Пайка моторів	Напаяні мотори, гребінкою, промиті і пролаковані контакти	12.000000000000000000000000000000	5	\N	PRODUCT	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
f1afec29-3685-4132-8230-b7d39ce4d9a3	Фінальна збірка	Установка втх\nустановка ПК\nУстановка камери\nУстановка РХ\nКришка і стяжки	23.000000000000000000000000000000	7	\N	PRODUCT	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
1b33a79e-9790-49bc-8bb3-c7efc8d20832	Налаштування		15.000000000000000000000000000000	\N	\N	PRODUCT	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
7cf25d99-7da4-4437-86dc-3bb79b7db073	Обліт		10.000000000000000000000000000000	\N	\N	PRODUCT	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
b984449d-3e0c-43fb-9209-e3a5fd7f3733	Усадка термозбіжок		3.000000000000000000000000000000	\N	\N	PRODUCT	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
0290a525-b422-4a2d-9a9c-48a0ed38de78	Розпаковка рам		0.000000000000000000000000000000	5	\N	GENERAL	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
cf2f35ed-f1c6-424e-80b8-04fc1a082a60	Сортування болтів		0.000000000000000000000000000000	\N	\N	GENERAL	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
f1ef797a-b1ed-46fa-9341-6b661cd4848a	Порізка термозбіжки		0.000000000000000000000000000000	\N	\N	GENERAL	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
406f31ba-96a2-4328-aca2-2ead65149553	Натягання термозбіжок на проміні		0.000000000000000000000000000000	\N	\N	GENERAL	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
3e3e8139-1872-429e-a284-014f912d309c	Тонка пайка	ELRS припаяний до ПК. Припаяний дріт ПІ	15.000000000000000000000000000000	4	\N	INTERMEDIATE	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
2bd3b08c-5ef4-4da0-b178-1676cd40db25	Пайка силових дротів	ESC з силовими дротами і конденсатором. Промитий. Пролакований	10.000000000000000000000000000000	4	\N	INTERMEDIATE	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	NEW	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
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
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


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

