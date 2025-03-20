--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
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
ALTER TABLE IF EXISTS ONLY public."Payments" DROP CONSTRAINT IF EXISTS "Payments_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Payments" DROP CONSTRAINT IF EXISTS "Payments_project_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Payments" DROP CONSTRAINT IF EXISTS "Payments_created_by_id_fkey";
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
ALTER TABLE IF EXISTS ONLY public."Payments" DROP CONSTRAINT IF EXISTS "Payments_pkey";
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
DROP TABLE IF EXISTS public."Payments";
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
-- Name: Payments; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public."Payments" (
    id text NOT NULL,
    user_id text NOT NULL,
    project_id text NOT NULL,
    created_by_id text NOT NULL,
    amount numeric(65,30) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payments" OWNER TO maestro;

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
    email text,
    phone text,
    password_hash text,
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
    time_spent numeric(65,30),
    quantity integer,
    cost numeric(65,30) DEFAULT 0 NOT NULL
);


ALTER TABLE public.task_logs OWNER TO maestro;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: maestro
--

CREATE TABLE public.tasks (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    type public."TaskType" DEFAULT 'GENERAL'::public."TaskType" NOT NULL,
    status public."TaskStatus" DEFAULT 'NEW'::public."TaskStatus" NOT NULL,
    complexity integer,
    tags text,
    estimated_time numeric(65,30),
    project_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    cost numeric(65,30) DEFAULT 0 NOT NULL
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
-- Data for Name: Payments; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Payments" (id, user_id, project_id, created_by_id, amount, date, created_at, updated_at) FROM stdin;
1145dcc6-b135-49f7-b1b1-926c19e787df	fd20320c-4120-4bd4-bd82-379fe35b122c	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	800.000000000000000000000000000000	2025-03-08 00:00:00	2025-03-16 20:54:44.13	2025-03-16 20:54:44.13
3b0ac9f9-7694-4520-9a61-f84fa13c8990	54b4ceec-7c75-4aff-8b08-6333b1849cf8	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	800.000000000000000000000000000000	2025-03-08 00:00:00	2025-03-16 20:55:11.335	2025-03-16 20:55:11.335
4ffdbe29-ff83-4173-bb91-73359012889d	1554f0d4-f870-4c35-805e-90cd37b2e47f	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	400.000000000000000000000000000000	2025-03-10 00:00:00	2025-03-16 20:57:10.934	2025-03-16 20:57:10.934
d39ca02c-0919-48e4-91fb-5d5acb60f475	54b4ceec-7c75-4aff-8b08-6333b1849cf8	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	2100.000000000000000000000000000000	2025-03-11 00:00:00	2025-03-16 20:57:54.104	2025-03-16 20:57:54.104
dcb1461b-9328-4d1e-969b-00e42bb7954c	54b4ceec-7c75-4aff-8b08-6333b1849cf8	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	600.000000000000000000000000000000	2025-03-12 00:00:00	2025-03-16 20:58:15.356	2025-03-16 20:58:15.356
61ca4d7b-8bf2-4d67-b614-d222c1674bee	fd20320c-4120-4bd4-bd82-379fe35b122c	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	700.000000000000000000000000000000	2025-03-16 00:00:00	2025-03-16 20:59:52.821	2025-03-16 20:59:52.821
75430705-1a05-4387-9e48-ac5340af4827	9df2de45-7495-4302-910e-96bacfdd32e2	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	750.000000000000000000000000000000	2025-03-16 00:00:00	2025-03-16 21:00:06.755	2025-03-16 21:00:06.755
4463fa41-65db-4045-9797-5c9cf14dfa50	54b4ceec-7c75-4aff-8b08-6333b1849cf8	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	2625.000000000000000000000000000000	2025-03-16 00:00:00	2025-03-16 20:59:30.619	2025-03-17 14:43:16.911
eb866084-5e61-4cf3-a6e2-6ffb064c62f7	54b4ceec-7c75-4aff-8b08-6333b1849cf8	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	2325.000000000000000000000000000000	2025-03-17 00:00:00	2025-03-17 14:44:33.864	2025-03-17 14:44:33.864
d4de35f1-f536-4655-9b5d-532c9c908470	fd20320c-4120-4bd4-bd82-379fe35b122c	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	150.000000000000000000000000000000	2025-03-17 00:00:00	2025-03-17 14:50:47.165	2025-03-17 14:50:47.165
92d88472-a646-4ff5-ad7a-caf6535f970b	660d4215-4046-459c-b212-0c6a512b1526	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	775.000000000000000000000000000000	2025-03-17 00:00:00	2025-03-17 20:03:18.784	2025-03-17 20:03:18.784
acc40581-5222-4a06-b6d8-688736db525b	10d00b42-11d8-4648-8bc0-da0c9aeeec08	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	450.000000000000000000000000000000	2025-03-18 00:00:00	2025-03-19 08:23:39.681	2025-03-19 08:23:39.681
c3009ad4-2f2f-449c-a216-63887b02331f	10d00b42-11d8-4648-8bc0-da0c9aeeec08	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	300.000000000000000000000000000000	2025-03-18 00:00:00	2025-03-19 08:23:50.12	2025-03-19 08:23:50.12
212c22bf-ce5d-4056-a960-4ae03b5064ed	10d00b42-11d8-4648-8bc0-da0c9aeeec08	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	400.000000000000000000000000000000	2025-03-19 00:00:00	2025-03-19 14:07:30.468	2025-03-19 14:07:30.468
6578c0b3-87e6-4092-985b-867dcc5db7e0	54b4ceec-7c75-4aff-8b08-6333b1849cf8	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	1400.000000000000000000000000000000	2025-03-20 00:00:00	2025-03-20 11:47:21.977	2025-03-20 11:47:21.977
7299992c-fe5a-4df7-a532-9c7e89fea28f	fd20320c-4120-4bd4-bd82-379fe35b122c	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	1450.000000000000000000000000000000	2025-03-20 00:00:00	2025-03-20 11:56:18.961	2025-03-20 11:56:18.961
\.


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Products" (id, code, project_id, created_at) FROM stdin;
542f9cbd-3754-459a-8f89-53dddfb068db	00001	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-12 22:57:13.167
7456c229-7da8-42a9-b3bc-97014383302d	00169	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 17:37:26.959
3ec95bbe-0b3b-4af7-ba25-f78e1edacecd	00170	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 17:53:38.303
19fdeb63-b801-4314-a4ce-c704059948d1	00046	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:32:22.342
a3df2442-c261-4de7-bde3-fb42f86e8f11	00047	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:32:22.394
d3981126-c996-457f-9b9a-2421e3f2aa9e	00307	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:32:22.394
65231940-0759-434a-96b7-3dc15a03336e	00048	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:32:22.394
fed79343-1c21-433f-9d45-390cd4003d69	00049	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:32:22.394
f6c1869a-ef18-41aa-a7c1-7d5f3153790e	00050	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:32:22.394
479e767b-b238-45ae-8451-d722372e30bc	00232	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:56:41.857
18b1be25-b82f-4016-be4a-24ad1211dbcc	00230	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:56:41.841
9d4cee0f-b79b-4ce2-9e80-ea96dbf7763b	00248	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:56:41.891
8eb6c572-5b1a-47b4-9ea6-b1e31f84815f	00288	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:56:41.892
ce5e7b34-5efe-4ba9-b460-c135588b088f	00237	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:56:41.892
bad7a9f0-4b12-4a69-a931-d08380e575e8	00214	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:56:41.892
412bc072-99ba-4811-a2d9-9e1bd1f49705	00223	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:57:56.115
751c6384-02dc-45b1-9df0-81fb810e2301	00224	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:57:56.129
93975bc5-c8f0-4c51-86d7-29926d2f24b9	00225	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 18:57:56.131
7d9981a3-b99b-4036-85ec-2ddc6517bf42	00289	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:13:50.924
e5fc2cb3-7620-4112-be4b-a1abddde0365	00497	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:13:50.942
33b56818-edf7-42bd-93d3-fa92f66274fa	00494	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:13:50.969
4dac4fab-0b3f-47f4-8039-5eb68885b867	00493	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:13:50.97
74a33cba-fc25-46a5-a998-f04326faa001	00498	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:13:50.97
98525d40-eee6-4aeb-bd86-2cdeecf6f444	00295	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:15:35.938
e2d7e9d4-dcb8-47bd-b745-b9dc380cc1a3	00294	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:15:35.954
a1be233c-73f5-441a-8406-af1669469c73	00220	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:15:35.959
1614bb2d-bc03-4b20-9f62-9457f3f56e34	00021	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:15:35.964
f8e2af02-0e7b-49a6-8905-e3b873f0469f	00219	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:15:35.967
44a24f03-8bbf-4002-b4ce-a7ac6ad21926	00218	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:15:35.967
364282fa-7253-4420-b2bc-4e12e51985f9	00216	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:15:35.98
e24613b2-3592-4332-a332-361d72a6e948	00229	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:15:35.991
8985e007-5aea-41ae-83d9-104ff755fca3	00212	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:15:35.993
f69dd59d-a3af-4519-a7c5-a9cd7d7aef8e	00090	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:16:46.014
86d850c9-aab5-40f8-8b92-c78a8d676861	00129	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:16:46.037
f66035ca-88b2-4751-ae44-4bfc3df3ddd9	00089	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:16:46.041
c7b9094d-7b2b-4e6c-bfd0-9ff0b27e50cb	00221	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:16:46.043
b8a5def4-3743-4bcb-85d6-0dfaef34861a	00222	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 19:16:46.044
ebd7c4b8-1263-4177-a75d-a7cd0f722b87	00210	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.645
e0ab9d68-aecb-4f5f-bc23-d5ac6c400fad	00209	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.621
1d357105-a6c6-499a-af09-f9160e2d478b	00296	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.646
3be028d9-01a3-4ab9-a1f5-9c05aff3e2d7	00226	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.685
76c316e9-683e-411b-8435-3db00497136a	00207	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.685
2a3c987a-729e-4b40-b887-0d1a49f55670	00208	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.685
d24ca3d6-4562-4d12-9daf-cdbc11df1ff3	00217	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.735
69bfe62d-1e43-4caf-8ca7-66b59cf0945f	00211	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.741
797368ee-d7fa-438b-b06e-b60c67479032	00215	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.742
7ddba26c-08f2-4181-8ec6-982f51a57743	00228	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:07:12.744
fae0fe25-a965-4f09-8c33-e88baca7a64b	00247	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.726
ac41d8ea-e738-419e-a693-56f2f8a423d9	00241	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.736
640e79ba-ceb6-4639-9c63-5d7ae0bad4a6	00278	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.745
61bce086-4d3a-430b-bfa8-87e4f1d29a08	00280	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.747
9dd3c831-e3fc-435a-92f2-d7376b3bae0b	00281	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.75
bcefc7c3-f6af-417e-865a-6eeff78f928c	00279	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.747
c46da7e2-d9b7-4402-ae77-ed1bacf11bf2	00282	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.799
a3068a89-90a9-4327-8e3d-2c5ca0b30e4b	00246	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.801
97c72fb4-f254-4cda-901b-23216aff55b7	00245	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.802
fd52e3a7-a30b-4647-822b-57206fd5388f	00283	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.807
cb526458-ae1f-4a84-a7a9-e7031f612074	00284	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.81
fe5858af-d539-4e9e-bb94-e99f834bc71b	00285	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.81
94d4fe13-aaed-4a41-b1b3-e2f4a6c7bc23	00287	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.84
828b3c79-f2e8-4b43-b544-8c32d7048d9c	00240	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.849
07874060-cff6-40ec-9b52-ec7121ef8051	00244	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.85
06d5e6ac-8a7c-40f8-8069-65b26a142a6b	00286	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:10:51.848
8a7d8753-a54a-4b10-8a72-1e11ca415b5b	00005	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:24:04.178
9867c7ff-d3bd-4efc-b2b7-ea425350757b	00291	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:09.954
41482a61-e322-42ef-a5fc-6d525c2542a6	00290	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:09.939
3ce8216a-1065-4346-a89b-e72df6d96ce5	00227	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.006
5f00191a-e560-43ec-8ec1-793ccf929ef8	00249	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.007
d332d327-ef27-4775-9683-c23d324abbf4	00213	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.006
a733b4f4-38c9-4720-8388-4dc47d1343de	00231	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.008
fa95754b-4c40-4267-9432-53731574a5d3	00017	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.06
f323147f-dc1c-4116-b9f9-08994fbc61ce	00011	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:35:25.775
26352e3f-39b3-4861-bd56-46280b0e7ca0	00022	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.075
a51c1b7f-9f48-4ff0-ba6d-e9ddd3c0eab6	00233	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.078
a3ab5bd5-e345-4cd7-8c46-998665bb3e05	00018	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.082
aa501665-626a-408b-90f6-5bd87b7f54f1	00019	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:35:25.764
fca2efaf-aaa7-4f57-a79b-b2d97c45722a	00016	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.08
dd902aca-2a6b-47d7-9a55-83ebd5e6af79	00023	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.082
7c236248-e0e2-4282-b9f9-29e938492539	00235	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:33:10.118
a1c53153-0c6a-44d9-a114-f890828648bf	00020	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:35:25.764
6dac48c7-4f4e-4e3b-b4e0-0007a2531cf6	00025	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:35:25.775
3726f467-8872-4e1f-9ba2-374a59cc176a	00261	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:35:25.775
6383b850-30a2-4fc8-942d-7639fe4bc4c0	00266	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:35:25.988
96431ba6-25c7-4474-9832-586672953cd6	00271	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:35:25.995
86feb425-d462-4b9c-9eb7-f4d2ff0c8696	00242	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:39:32.674
69519a0e-1a44-442f-ba33-0c0a78f270f5	00262	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 10:08:48.572
516443c7-5d0e-48f2-9d60-41c3a25b1e35	00303	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.889
af0b583f-2864-436e-a71a-1cc742eebcf0	00298	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.896
d4b85bbd-2e35-44ad-879d-20aeddb99f5e	00369	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:40:05.27
fb3514d3-4b69-4ac7-9ba8-2c0c7ad09ee9	00029	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.297
4a5aa9ad-3a59-4594-8ad8-da7796878eb8	00037	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.403
c9a5cac5-ed26-46ba-ac18-1bee0edd3588	00319	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.084
2b34aa58-7e1b-4b73-9eeb-e25300b8761d	00013	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.119
5f312fe0-c5a9-418c-96b8-c306e8b5767d	00311	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.13
6d0843c4-bfcc-4433-b011-e4e580c4006e	00316	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.132
e66bd16e-aac9-4bbb-8e5d-f61af44958b7	00312	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.136
3a0cea96-5730-4368-828e-27af67dcc61e	00328	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.202
bce072c5-9af2-440c-be5f-4d320bf53025	00318	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.207
87dc519d-6043-4317-8055-bee34f5a62e3	00314	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.21
87e843c9-919e-494c-b97e-af43b527eeaf	00315	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.216
763bffc7-0bd4-4393-b714-17e4cc997325	00325	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:45:19.941
9851a928-8412-45cc-84b0-edb006948221	00323	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:45:19.969
05c689df-f760-43e9-949e-14af70814138	00321	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:45:19.976
1bd6ad93-a944-4fad-b979-40be6f237849	00028	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.297
f5839b70-98fe-4102-95f8-a3015970f6a7	00036	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.369
1ce1f86e-598f-4d6d-99d4-c21e625a6929	00035	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.411
f791d191-82f4-4cc5-b9a6-5479f2d2ee5d	00310	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.126
6d73b709-f40a-44d9-81d4-26fe3533ef76	00313	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.209
c3739846-78cf-4eca-aecf-3a430766707c	00322	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:45:19.984
75773861-0f7d-42d4-afa8-e7a0cc3f24d5	00320	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:45:19.988
1e9b4eae-8e88-4cd5-ab20-2183f1ec1c37	00327	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:45:20.029
4708aea0-01ec-4f5b-ad62-7da675b22c19	00505	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:46:27.733
d8d30b88-0225-467d-82ed-b4991c61e7de	00509	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:46:27.744
fb0a7aae-0c93-4022-a939-6d25bfd50f1f	00030	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.299
0247d8b4-c286-4961-97ae-9b665a7f95ff	00317	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:26:00.17
a94de110-cef8-4a08-b40c-2aa1d9b45bc1	00324	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:45:19.985
ae687765-c4e4-4367-9d20-7b6691da8706	00329	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:45:20.028
7dad6b41-4936-4d96-b676-4f83b8d21c81	00507	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:46:27.744
e212dbd6-6c7a-4b60-a2ad-c7280868a9de	00032	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.301
0a03a698-e5f6-45c3-babf-2f6bdac9cc49	00031	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.303
0a4c6115-9f88-4fb0-8086-f6f1ac57ce25	00038	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.411
4a774c08-cfa6-4276-b39a-1f4266e2af24	00002	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:39:08.073
8bf717be-a485-476b-8092-c537f9fbddfc	00293	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:05:45.273
510949b2-9090-44b4-83e8-4dfd8c45c522	00523	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:05:45.324
18789c6a-44db-402c-a568-ebf93737ca07	00499	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:05:45.327
a25147a7-50cc-42ed-bc93-b0f1ddb70a6e	00034	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.352
a081caa0-5184-4cab-96dc-f6c6601a67d8	00274	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.744
f4c13db0-4d2a-4efc-af90-63d667521d86	00275	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.756
21d970f0-e925-4a19-b17f-dd81ce6d9daf	00277	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.764
fab4c2bf-fb2f-4569-b149-5af5674d25fb	00004	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:39:08.088
fae46393-32a8-4d5d-8fa2-f5c7f54cff95	00003	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:39:08.118
c3e39e97-511d-4a67-b917-8c71b8529aca	00008	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:39:08.119
9673760c-3911-4a2f-9f42-58c7075616c4	00524	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:05:45.32
07e23ad7-52e6-41c2-bd42-694582dabdf2	00033	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:53:29.352
fc532c16-f1af-4acd-98aa-b1f8c4a857e1	00267	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.711
ae36cc75-9261-4233-8a40-b7bab4768a39	00269	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.734
afe243bd-2e38-40fe-b9d1-dde7a5c177ae	00270	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.736
bb6461e0-752b-43cb-9d11-5531e6d496d2	00276	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.762
65f6fb36-a693-46d0-b51c-eaf476660e8a	00006	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:39:08.119
e735a3d4-274d-4c51-a981-2e4061a9e557	00026	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:41:09.954
f2ca3dd5-bde0-4ddf-b2a7-ab0beb3f475c	00522	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:05:45.326
eb54f7f4-a917-4957-bd25-d6b948b32052	00264	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.698
fdbd466d-50a6-41dc-8a7f-a159b7afdef6	00263	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.698
c6a7b73f-0e96-4e06-8d65-38948045c58c	00265	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.703
b454a4ea-9e07-42ec-a4d1-d4296fd4ef5f	00007	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:39:08.125
14e7f593-78ef-4a0e-932d-e494cb9b67e3	00010	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:39:08.143
d7b35298-f8c8-44b0-a9da-767e035c4a63	00508	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:58:31.416
1d022e76-533c-4892-86aa-ea46d2d5cff1	00387	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:58:31.456
5a1ecaad-a3d1-4baa-96f0-4894c86950ea	00487	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:58:31.469
44b880cd-9703-4f24-89a6-67f51a383745	00500	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:58:31.489
af0d574f-a957-4df2-acb2-c48bd92e6225	00514	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:58:31.51
c48ff7d9-df4a-432f-90a7-c819ce939054	00268	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.71
4cbd9cc6-da15-446e-8790-7fb11569e41f	00009	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:39:08.14
0f3189b2-bbd0-4729-86f9-f0af994e9fb3	00512	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:58:31.471
86dcde4e-f6b7-4983-b40b-df07916cc108	00506	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 18:01:28.018
d3118a3a-2929-40fb-8ba9-3cc1d3f5144a	00272	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.741
bcbdbccf-5f80-44c3-abc2-52dca2530751	00273	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:54:49.743
8d6da4e9-0b7f-4dd5-98ca-32f6f8c13486	00015	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:41:09.867
dac90798-e4d8-4b23-a871-307fe2661b3b	00012	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:41:09.865
29e36c8a-9e1c-40a0-be39-ccd5855dffbe	00513	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:58:31.483
c9d1dfee-08d5-483d-a6ee-5f88433eb803	00518	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 18:01:27.95
afc5de0c-c1c0-486f-9aca-2c7ceecc5a2d	00372	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 18:01:28.008
0f3c990c-abc1-4f30-ad54-245bcde12e84	00519	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 18:01:28.017
69fe599d-55c6-43dc-8ea8-3d262c3e9ce9	00517	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 18:01:28.019
32d8f0c8-2812-4774-a2db-dec48765fbc3	00239	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:16:29.324
8f8d80a4-89cc-4bac-8a04-9d34835db309	00014	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:41:09.865
441e2985-08be-460b-99bc-29422a6330a6	00027	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:41:09.955
3fa37fb0-732e-448b-b8a6-26590da8e2a7	00511	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:58:31.483
996b74cd-268f-4f16-a183-3d4fdb7e9ab9	00388	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 17:58:51.168
6953b2c8-01a6-4e7f-a809-d3aeac589ec0	00238	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:16:29.348
b58192d8-e35b-4f9c-aaa6-24140e8272fc	00495	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:16:29.387
e6a9f377-3d07-43b9-985a-fbbcc05f1a87	00250	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.64
c47373a3-5ce1-429a-a6c8-a576f7a1e1a7	00386	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 19:57:31.899
deeadf52-62d8-4aed-992f-2c634c544bde	00496	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:16:29.389
e62c2e3c-2995-4af5-a63b-fb5d58239718	00251	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.642
78777afd-8e5c-4f3a-a7e8-1186c15235f3	00382	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 19:57:31.915
efb9d3db-5eed-4b48-8d24-4f246c240626	00378	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 19:57:31.92
c578feab-ebc5-439c-bfee-4c774e4f9d7e	00380	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 19:57:31.928
ae0397c6-4b2c-4e6f-9c2a-732ec396c598	00415	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:24.815
88652b5c-bebe-49c5-8b10-bf9298d40195	00423	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:24.921
d39f621b-b7a2-42f4-b9a1-6c75e8ac101c	00417	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:24.936
2a8a107c-523a-4d99-aeaa-9925b85bc8c2	00418	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:25.005
b1bbd045-abd9-40da-a78b-5f60db643670	00419	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:25.11
818c6968-9ecd-4db5-a900-5afab0406640	00422	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:25.112
37dd3c90-b0db-470c-bbf8-99467e275d1a	00252	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.643
65e7aec2-0754-4dc0-80f4-b1e132be3ec9	00259	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.702
8e34d7d4-6016-4999-ad80-a219e869cab7	00260	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.714
1cdfb879-1bdb-40db-a05e-09f4f52a6b1d	002611	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.717
5a713f0e-8a71-47be-88b7-c158afd7856c	00379	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 19:59:07.493
a76cc3d5-e677-47f3-9f02-ebb0c79503ff	00414	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:24.928
79198527-71fe-43d3-93ec-fe3d6c64d20c	00416	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:25.004
390c631b-e6a4-4eb4-b372-9a991d5c2de1	00420	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:25.11
94f2c522-108d-4c34-94c3-43c835a9d390	00254	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.65
d1b8dc06-58c0-46cb-932e-0bd1909afeef	00256	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.692
f037594b-dac4-436b-9b01-8c33936527ff	00257	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.692
36fe0791-bd99-437f-b0eb-62d884cbfb30	00258	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.699
fa0df1ef-18bb-4511-abfd-fc8869f68a2c	00421	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:24:25.129
ee54808d-253c-4cbf-876f-81420a6ebd64	00253	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.687
774c26fe-4d31-4326-a372-b57fe7ecdf27	00408	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:43.589
f1d08523-5712-47ce-9b39-f862f5cbc0b1	00255	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 15:47:18.688
a7f4f78d-f4b6-48c5-85e5-32aedeca5266	00407	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:43.646
3a0b5de5-a2a5-4aa8-adac-46711fff9760	00405	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:43.65
ca2b58c3-1725-4f12-9142-6b8e5e4bb211	00411	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:44.052
8613cc8e-6c0c-4fbb-9b08-e050ab303f59	00409	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:44.066
2ccdfc5c-ed2a-4f09-83d8-251affcdc23f	00367	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:40:05.222
ffea8819-4b03-4592-bd3f-ee0ded58ab97	00371	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:40:05.246
e7b7eb6b-baf2-49a4-88c0-55af78cd5ba3	00406	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:43.648
51d56b56-6de6-4a70-acac-941904743202	00413	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:43.822
23667994-9046-417f-a79a-f939987a902a	00404	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:43.976
87f66827-72ea-4601-8074-90df4112bf9e	00412	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:44.051
182c2e51-4702-4273-ab5a-7c64200c0746	00410	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:38:44.066
c873be22-757a-4150-9331-24c138246bae	00370	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:40:05.242
24d815a4-7649-44c1-8b67-a93752b0bf8d	00306	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.826
dab18118-e41b-435f-bece-0073eec25748	00305	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.827
8a77644e-8d6d-4f59-b04e-b8f7f80d46b4	00304	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.839
84b66909-d79c-4906-9c86-7f3d24139942	00301	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.844
3998df44-aa1d-42cc-9fd2-cdf5ef055b3a	00330	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.848
52851dc1-9bc7-4b9f-9156-074d3a005be3	00331	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.851
a10cf89d-c57f-4a62-9fb1-119edefe636f	00302	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.893
47bdea20-40d4-4418-a120-39c54be0b69c	00300	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.895
e21e46cf-2383-46a6-b841-5cd8585310a0	00297	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.897
17026669-dc68-4a75-ad81-958098618536	00308	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.911
8df3c997-06e6-4d60-b941-8a19a6cbf8de	00309	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 14:50:31.916
9949fcb5-995d-4ce4-8177-b7aab0a3691b	00368	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 16:40:05.269
bbafa0b4-6b4a-45c4-8357-f455f20ae06d	00024	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:35:25.764
f008fc7d-cf2f-486f-852b-a2e88e86113f	00243	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:39:32.654
4092c9d7-0d27-4f8b-b709-2d034316cf9f	00236	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:09:50.629
4b7be85f-fa73-4690-80a9-134396072ea1	00167	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:56.714
a4b081ad-6b6b-49e4-a137-02aea607baa8	00044	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:56.859
feebff86-7409-49bc-86f8-a27bcd3e8a6b	00136	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:56.872
6e2c82d2-ecde-4410-a887-bca4672da762	00166	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:56.875
39b03a84-d4d6-4459-8a96-e4197e7c1b62	00164	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:56.881
7a928090-8c51-4cec-b944-28c588e72e91	00138	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:56.88
ece3c653-738c-40be-a965-e1066489852f	00137	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:56.905
94836ad4-647e-479d-a979-16eb6c0b3462	00163	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:57.06
b46fe90a-b116-423e-be0b-3f14c6534407	00162	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:57.215
d7f2f539-941e-4f68-aae3-4e7bea8b52ec	00085	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:43:57.217
37acb6c7-20e4-4329-ac44-d1d32ff14a06	00086	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.051
68ad43c7-b9f7-42ee-af06-53634a1af791	00087	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.059
cd54b10c-bc9f-4c71-a7e9-89ee8c3f7546	00130	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.06
cf3bb057-66b9-4aad-8a3b-869704a9769e	00058	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.091
375fbef1-25e8-458e-8b5f-828a651d6b90	00059	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.091
0fda1c49-6a03-42d6-be80-f8b90d98b793	00060	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.091
f7c67a16-7727-4b6d-b809-718330b8299c	00039	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.116
2085e5f1-987f-44be-ad37-33cd4ab46560	00099	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.127
3069a201-0b9d-4db3-9a1f-583d59ef9cd6	00100	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.131
b56420c3-a3c1-4e18-8d2d-4793bad2877a	00081	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:46:32.135
86b5d390-e77f-408a-876d-44ecd1550afc	00126	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.762
b654fd7a-00de-4aaa-b45f-6a256a049563	00042	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.782
b24c723e-8c4e-4d0d-8203-7a8bdb10379c	00043	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.785
ee8bdec3-3240-4f5b-9517-6f371a527c40	00123	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.785
b3494d34-77f5-4380-ac6b-efabbb9d02cd	00127	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.785
2d6ec42b-2dec-4d8e-83ee-7e63737e1f8c	00122	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.786
27a2708b-d8a3-4d08-8860-c597580e033f	00128	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.842
c87c24df-5996-46bd-8e6d-509008332355	00125	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.842
21b52893-e5b1-4df2-afb2-a76c873f6d44	00121	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.85
3032b175-eb46-484a-af52-1f8703bfc7ab	00124	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:48:48.858
c353594d-7aef-43e5-87b0-8e8b5544954f	00139	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:50:47.138
8fb30073-9be3-40e7-9af4-af8418ebf5f4	00040	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:50:47.139
59a41589-aa24-44bd-aa47-04cac282c058	00083	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:50:47.138
b3c643b4-005b-4630-8402-5f40e3ffa30d	00084	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:50:47.178
f83dd9dc-10fe-4e85-aa3e-ca79a0d17271	00082	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:50:47.178
80e781ff-f974-4cde-a397-b4d20f7b7cea	00041	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:50:47.179
bfb9721d-cb5d-471f-83c1-8f6acda80079	00140	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:50:47.229
f18ccc1b-3155-4484-a937-9bbc86c895ed	00165	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:50:47.236
90d62fb0-336a-4b21-968b-ee74556f8688	00168	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:50:47.24
78532087-872d-464c-b15e-6a60134e3922	00066	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.439
48562621-0222-4b1b-994a-9a370f2c3d1d	00065	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.466
c122112d-528b-498b-b871-7f7999aa2bd4	00045	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.468
9366d779-11b6-4127-9097-420789813a8a	00061	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.47
6ea77c7f-1c8f-475e-aeab-4313638d964d	00064	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.471
89216a31-f050-4032-9a47-3f844451becd	00063	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.475
e9fa3095-2f68-4a32-ad41-524f4abea24c	00062	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.566
607cc9b0-6522-42be-80d1-f08ae774c849	00178	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.57
f65b9d92-86e7-4e70-9fdf-a7cd654b28d4	00179	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.572
23b402fa-fff1-4b0b-835c-e3e31d6b8647	00161	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.576
6c3b9069-f83c-435d-ac3c-b980a805b808	00180	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 11:59:24.577
f352b9a0-86c8-4465-b428-d3b3b261b916	00336	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:20:58.898
670ba5c4-55a8-4dfa-99a0-5d45e0a4c78f	00333	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:20:58.91
218893c7-8e8e-48c1-9fcf-d650a208d3b7	00335	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:20:58.945
873a7cc6-5046-482f-becd-20cf731a5088	00334	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:20:58.945
67e62aee-e56e-4fd8-8588-390b37cb224c	00332	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:20:58.949
f4aba19c-e3eb-4580-812b-716abbaa5360	00326	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:31:30.698
58d23f14-98d1-4104-a3fa-2b48c7d4143f	00350	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:31:30.72
7565af79-e09d-42c0-ad7c-87752275baad	00202	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:31:30.723
c49a0aa0-cb0b-4d11-9fb9-e35ef654ac60	00203	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:31:30.741
080db78c-5793-4c41-9468-9881a795ac2e	00349	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:31:30.744
cbcaa009-e4f4-45d0-9342-817caaa6ebea	00348	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 12:31:30.758
9b8a4fb7-9095-4b89-85fe-7f6029f6bd48	00485	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 13:09:12.272
60ad0476-2b10-4d05-b29d-d412f839d08f	00484	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 13:09:12.294
009b99f8-c02c-4332-8b7d-222aab1ac91b	00483	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 13:09:12.316
a1aa5344-39b9-4715-824c-90b9238248bd	00205	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 15:25:44.064
5850e14f-6dff-4bd7-89c5-5086e481aa46	00206	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 15:25:44.071
cd31d962-8562-4424-be00-3b3d2e23e4cc	00204	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 15:25:44.108
16d85379-5978-49e8-8ffa-07ccb7b3bcbc	00299	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 15:25:44.115
4ca68895-7403-4bc5-a812-820fc8c6a2dd	00374	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 15:54:06.326
46c504dc-bbbc-40c8-8da3-119a22e379ce	00376	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 15:54:06.346
cba7d640-028b-4946-acd6-1296d5d82c14	00375	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 15:54:06.346
40579df2-4e3b-4462-8c05-b7f46b12e9b0	00381	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 15:54:06.35
f9ebce31-8e5d-437e-b3ee-634f4c3ce014	00521	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 15:54:06.35
260dea68-39b1-4b08-a86c-d8a1467a4f78	00397	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 09:21:30.309
fb255fb4-f253-46e8-bc30-54a400703e6d	00398	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 09:21:30.471
658362fb-1b9a-4f9e-bc08-55bea8df4ea5	00396	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 09:21:30.472
ed4bbea1-f970-475f-980b-193c8568a4be	00395	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 09:21:30.602
0eba2acf-ca9c-4a2e-bf6e-7083d1cbc258	00394	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 09:21:30.679
fcf4d541-421c-4987-b95a-f49949ddbbac	00482	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 11:50:52.848
37c6aba9-e209-440e-b230-f55022802352	00401	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 11:50:52.864
cc23cbdc-e585-41eb-844d-345625695720	00400	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 11:50:52.893
0b7c5a27-21c9-4ca5-a5d2-a169269ce8b0	00359	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 12:00:58.037
c92e3031-91f8-438e-85aa-8d1eeff98491	00364	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 12:00:58.05
f1172350-f5c5-44f5-9404-57a8e59c1335	00437	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 12:00:58.06
a4387687-5053-4bc4-894b-5adb3b53b54c	00520	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 12:58:30.739
13a49993-4583-4168-b8cc-9528b8e8452b	00429	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 14:39:34.585
a2ffcab7-cfc9-47d8-81da-96235775aea2	00433	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 14:39:34.6
dfcc7cee-cea8-49cd-8fb1-78e7e43cb907	00516	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 14:39:34.606
55b421e0-48af-4894-8424-294c80a2082c	00393	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 14:39:34.597
4286b3c9-c585-40d2-82fe-f40981b68d1d	00453	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 14:39:34.617
1bcad361-f303-40f5-be1f-ab3f2e1ff288	00389	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 14:39:34.617
fbdb7cd3-8ab9-457e-bb69-d91b091867f7	00457	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 14:39:34.664
b0f32ebd-b420-4d2a-9c06-3397eedb4ea0	00432	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 14:39:34.667
d330a920-e193-4559-84c0-e322041ab5b0	00430	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 14:39:34.667
037c27d7-33e5-4a6c-bc84-e0f6beb58973	00441	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.146
ea12ef62-4ab0-45de-9800-050b9ff38ea6	00439	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.284
e0ffc428-a86d-4a6a-856c-30baae712e64	00358	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.307
e2c27354-3f8d-4975-9b4e-f3857917e45b	00440	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.387
96c8b347-40a4-43a5-a7f8-b25ac84b7d66	00438	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.391
7f211079-eda9-49f0-a2c1-5dbefdf96b3d	00384	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.391
9d61c135-325d-401b-9772-b6ace3c6233a	00366	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.498
59f6a0fb-a81e-42d4-9f61-bc336769d36f	00473	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.571
c5729014-e7a2-41ec-b4d2-7e018f243a59	00356	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.571
bcad4dc4-9406-4c93-a39a-cfe5a460e888	00365	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.572
1b28039e-3936-4677-9746-41a8bf36fbcc	00357	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.594
f2b5c084-181f-4915-b924-114f1f351121	00383	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.596
9ea71122-80cf-490d-aa34-324bf258110f	00385	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:18:54.597
bd434c89-dd96-431f-a47f-89a3afb034a5	00481	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 15:58:27.353
431c0443-4ff7-414c-bb5e-fd20b3d2c226	D0	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:47:16.586
a8c19ec9-6c95-4355-b647-3839a7525130	00469	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:47:16.62
2c45216d-1555-4aff-bac2-eac2a69c3752	00470	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:47:16.629
ed76d785-3b90-4b3d-a749-884b04987289	00467	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:47:16.632
d03148b4-6f9d-450f-b8bf-22ebbe9f2f54	00446	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:47:16.637
198e390c-4662-49d3-a8c0-aa09736ef900	00468	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:47:16.635
a9d91a16-4af8-4815-b9eb-fdc2125e789f	00466	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:47:16.655
8a69441d-baef-4a58-ac1d-58be0151c328	00471	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:47:16.672
0051c9dd-e270-410e-b11e-9b537244b1fe	00347	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:49:31.302
47c749a8-7695-4b06-9594-19cef3454b7f	00346	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:49:31.336
1f82c552-e987-467b-93d2-fa92befb9843	00345	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:49:31.372
41c01561-57a4-481f-b00b-2bad3d320eab	00344	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:49:31.4
2ed4abc2-81ba-4d8a-bbf2-273575358280	00343	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:49:31.408
53ff865e-ea34-428f-8615-88e6fe2097d3	00465	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:50:33.428
a5c6f7ae-6050-4338-9881-a6a283126cec	00464	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:50:33.472
1278b63a-4dc3-45c9-b467-6684366ba0c2	00489	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:50:33.566
ae3ad43f-80a6-4348-a6ab-8de9cf7f0c4f	00463	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:50:33.602
cb6aa4d5-202f-4d04-8e92-7238ccc0810b	00490	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 16:53:10.336
38469fb1-74ef-456c-91b7-e6c120742ecb	00502	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:12:39.502
b2c4bb15-e08e-4c3f-98d2-6572148510ac	00425	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.297
754bf2d5-c1d8-4f20-a244-e91ea192aeaa	00472	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.305
11a6f0e3-cc3f-4069-bde0-fee4d6d4ba28	00475	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.308
6c993d2e-d281-4f4b-affb-f16487dc346d	00428	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.323
c9652271-6339-494d-90b1-dd047130eeeb	00492	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.323
55884b8d-bf7f-43b3-91ee-5f5680e727be	00424	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.307
111b61a3-175b-46e5-a9cd-7ea744836b1e	00474	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.387
db36a051-710a-4ce3-a7c4-6d1fbadbf566	00354	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.392
56a58bf6-db34-4b15-a4ea-4d59fbcc1581	00373	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.396
0ed0515c-6af6-4199-b7ef-e06528c38c3f	532375	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.399
75b07e7e-44f4-4a15-ba4f-f06579a7ef7f	00403	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.401
801a35cb-d494-4510-b9c6-c22fae2b2449	00426	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.402
752633cc-ba92-467f-a476-15b04b811a2f	00427	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-18 18:38:05.438
8e865bdb-235e-480e-ae91-efe0ade2cd18	00069	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.293
f6840f51-cb16-4ce4-aa6a-86c9a2ab7715	00181	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.307
e60e3774-9226-4826-97e9-e96432bbe954	00108	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.303
bdb6d1eb-79c3-4d8f-9ffd-8e533d822249	00182	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.321
3318780f-98a9-493e-bea8-1c24f2de6f3f	00135	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.321
18d61d89-81de-4045-b1d0-1f9da8ae82eb	00187	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.323
cb02c030-9637-433b-9a36-ec9173c2810c	00185	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.364
8febd9b7-b464-4bf0-ab32-98d46132f0dc	00186	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.37
e8147f93-b96d-46f9-9559-a97e3482bde1	00171	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.372
5a420719-1675-4704-abad-82d7b9800f2d	00190	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.374
eaa863da-4c80-4adb-af14-f5213056b752	00189	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.376
efdf9a86-7492-4792-9d6b-7d09226b2ed6	00184	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.377
7809c983-b341-4447-b027-0e0cc3be1e42	00188	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:16:49.406
b812f223-4f78-497b-a239-1aab49ea1743	00051	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.39
8667e55e-cdb8-4290-85c9-0a33c7c58c4f	00134	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.4
e9137478-bc48-4bc9-940a-66e362511406	00175	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.407
9fed86df-566a-4b4a-b669-3f1c815ad2a8	00173	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.408
c693f9f1-cd12-4fce-9e77-2b7569001178	00067	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.412
84ceee2a-a15b-4ae3-8f41-3bf65bfd8aa8	00070	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.412
2cd71195-ebc0-409d-861d-4d29ccdd6f48	00172	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.438
021f2b34-a023-4c86-aab6-5eecb514cd14	00174	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.442
053f30e9-caa0-4102-9f0e-1234cd963f5d	00068	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.45
c0dc060e-0cac-41b2-9504-2775f0ac1913	00110	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.454
2b90c347-ccbb-4063-be02-c0d8bd36c59a	00109	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.455
09702fca-870b-423a-8635-7e6a3f83d576	00056	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.459
cc6b5a8d-50b1-46ff-bf2b-145757d7ac76	00055	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.476
a6149242-4bf0-4556-a4e8-664c722a5534	00054	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.485
8eedab9b-faff-489d-8f56-982525e10ee6	00052	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.496
5217d488-8cfa-4ee2-9af0-981f05318927	00057	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.498
5f6f06bf-879a-40f4-8ef7-a99b2e0626cc	00053	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:20:37.5
3ddec079-f238-404a-8594-d2780ef4ca0d	00098	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.226
d45b0693-aa99-4849-a670-ec69b51ca834	00177	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.236
815a2092-5b28-48b3-a39b-d0f2647634af	00097	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.235
fe52227c-d3da-4c3d-b89f-c4352936871f	00176	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.243
8fa35416-821b-4a69-b693-487427f96c36	00092	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.249
597cd14c-97f5-43e6-838c-58ba7ca039bc	00091	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.251
b41dfe19-2337-4169-8169-94a7b1ca8d18	00093	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.283
40cf10b5-6ad8-4208-a9ed-8155a95a9353	00096	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.289
1ff3662d-0148-454e-8f65-0b1ec5b70032	00094	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.289
54a995d2-9a6a-42cd-a569-b295899c186e	00095	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:22:37.29
ba6e7544-984d-47ac-a1e8-c26d64c5a8c2	00074	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.898
01fd8dcb-da68-4a68-a119-944d33520b79	00080	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.912
cfb3d350-c06d-4408-9abf-af0c82d671f0	00072	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.917
89e5a30c-88ed-4941-bdd7-fdcfe627cab7	00078	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.919
bbf281e3-0c50-4255-b508-102039774180	00076	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.92
13e29c62-7177-4248-a647-822da60485c4	00075	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.923
ca09d925-d5f3-40c2-9c23-9581ff82e0ce	00077	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.944
46c340c9-22b9-4903-b567-f0d5302a6769	00079	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.952
ea801e71-1799-48a7-b7e8-32a835a75c2b	00071	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.955
05ea3990-aa69-4b52-8a74-e08c9d35ab68	00073	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:39:57.958
ef98dd4a-d281-4b0c-8023-17d323aea4b5	00201	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 10:42:43.192
1a27aa9a-f1af-4efd-a79c-7381eaddcb71	00442	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 12:55:53.328
3db729b9-3447-47f8-a15d-5cefcdb20735	00443	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 12:55:53.343
a6ada56a-1c02-4006-b9fa-066521f947f2	00101	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 12:55:53.519
74461b69-567a-452c-9d43-ae84e0e89617	00462	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 12:55:53.522
31a25b9a-23bf-4b71-8e7e-252afe515001	00351	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 12:55:53.546
99776805-077d-4fcf-8652-bbb9337c9a2b	00112	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 12:55:53.546
6561682c-6e32-465c-8aa0-fa4749336841	00461	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:08.384
a2894922-f746-4130-b88b-ca59df8594d1	00486	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:08.443
bb99c055-372c-448e-998f-917aae842622	00337	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:38.383
720bcec3-0fc8-4e06-af79-00c40ebbf651	00339	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:38.392
71f3330d-883b-4657-b368-2c5e284a5c60	00445	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:36:26.508
040e24fc-b0fc-417e-b88a-0abd8bdf95d1	00444	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:36:26.543
3b1f404a-90a1-4610-9b85-42c03b617993	00111	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:36:26.55
ddd9d0da-4bff-4b4c-ba0e-3eaa957ee2e9	00133	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:36:26.553
63d20d3c-77f9-4343-a7de-f2d0a0ea75e0	00510	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:08.415
3a62ae48-d57b-4a99-b65e-a5a85186be6d	00377	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:08.442
c4e5310b-d6d2-4080-aead-92ed134bf1c6	00342	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:38.387
06fa12f8-d8b4-4035-9289-7500ed94b4fa	00341	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:38.39
bbf1c852-b2b5-40f9-bb0c-84ac43e99f70	00120	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:36:26.548
fc2df53e-4204-4c44-9816-6d6bcd758134	00157	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:36:26.562
c89f09f9-ef40-4546-837c-a79818a83678	00155	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:36:26.578
8cb075b7-87b3-4659-9f29-4249209a3a06	00154	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:36:26.596
4e758872-ec5d-476f-ae37-88df6d56cf5d	00141	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:36:26.607
31b8d89b-9901-4367-8202-d66a2e1d3ed2	00390	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.881
2ee1a629-8b0c-4cab-90c8-8382d051af74	00504	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.9
bbc99bf6-ce4c-4f43-b3d1-6b3e7660b9d0	00435	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.908
d70cbb22-9a6f-41c7-b9e8-8f621605a966	00391	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.917
13c78c6e-5291-4dc2-bd88-735c18eff6be	00361	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:40:57.268
70c8dbe1-43e4-4a6e-b0ea-eec87bcd2e4c	00355	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:40:57.362
f0e00657-e89a-4928-80eb-ba36772aedc6	00434	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.918
08fceb77-47bb-4e55-8369-d647d72fc8cd	00459	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.971
3839663a-3317-43ea-9758-ce36db59b060	00455	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.983
39e95ac4-a283-472d-9d72-6e7a6a95ace7	00456	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.992
8d348576-9388-4d95-bf07-e241da516c55	00353	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:40:57.362
a556ab62-5e4f-4b65-8740-5367087cc0a4	00197	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.023
2fe88f61-f4e5-4dae-b098-30db7de1278b	00118	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.025
9fd58b6f-d5f1-4aca-8be0-47ca89f68806	00460	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.919
59f49012-0ead-486f-bdd7-a8a4ba533865	00454	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.944
000b1ceb-1818-466c-acdd-387a685ac3a5	00515	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.966
98df8283-4c56-47c8-b6aa-effe4e8e955d	00431	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:19:41.969
e47e0f54-6959-4b16-83bb-a631a1ed0150	00113	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:23.936
59e44938-ce42-453b-8f24-9d48cef256d8	00200	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:23.968
b80dbd71-a655-4db4-ba29-bfa073401e65	00116	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.023
84977836-f444-44ee-aa14-8d1b37e58ade	00183	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 07:43:28.25
68f75732-4301-488f-b4de-b9dc31e2602c	00115	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.034
e37f5e14-0198-472f-9d2e-d39318f1c5c2	00199	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.042
ef98a5a4-249b-4ebc-9fec-8860af21db74	00119	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.061
072a6e0a-06f4-4079-a5ed-0845f80622c2	00144	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.068
51a61085-4f15-46ea-9b94-1a5734edfa65	00198	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.091
5fbbb6c8-e641-45df-a4b7-0858e5804b7a	00114	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.093
6e6f893d-ba9c-4a4f-a83c-563e2f8b2acf	00117	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:16.832
9187a2db-25c5-432d-8b25-6eef60a122bc	00106	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:17.073
cc3ee514-2621-41b1-8df2-82a678cc1d09	00450	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 07:43:28.27
f7de6661-7792-4d8d-a45c-457ab785cbfa	00148	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:43:24.041
d911d4e3-9bd9-491c-8e29-7318b4f6abc3	00159	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:16.829
1a47223c-49e5-4fab-b895-3f21e0c85734	00193	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:17.094
bea32b03-149b-4648-951f-d9dc8213cdce	00194	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:17.095
c782c53d-92d5-4973-9732-320d27419b4b	00195	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:17.107
b25ad092-5e7e-401c-894e-44da86bb45f5	00449	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 07:43:28.295
02b26305-3d57-47e3-9ae9-3b0e8609ebb4	00150	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:16.694
483bc314-b21a-4e11-ac74-7273a7ccc3ed	00149	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:16.812
68caa459-3a41-40df-8c19-a1e54bcad78d	00160	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:16.82
6f2ca0b5-c363-4573-8124-fc443a02df77	00151	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:48:16.829
515d73ed-14ae-46ad-b5d0-bf070bdeab94	00102	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 07:43:28.296
9228165d-6c5f-4cee-add2-f76216321ed7	00103	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:49:40.202
563d96a6-8e38-430e-babf-ee0c2f4d7fde	00196	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:49:40.265
601736a1-dd30-46a0-ac7a-a64a0b1c5209	00143	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 07:43:28.296
d2112b7f-8baf-4bb2-8687-58573f87e3ed	00152	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:49:40.259
25972fb9-fbe4-4e78-95aa-3e05f0355c72	00147	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 07:43:28.296
e1d0be60-8007-41b7-a617-33a4349a3542	00131	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:49:40.267
f1fcf9c1-760f-48bc-bfb3-763adb2ddf2b	00011524	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 08:51:11.622
dd186fdb-039d-4dd2-acca-b60fb2473aa6	00192	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:49:40.265
4a96fd2b-d16f-4dcb-a384-8f420ab68a43	00480	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 09:31:07.721
c8f636ac-2f52-4e49-9ef9-11bfa7ff8e17	00156	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 09:31:07.739
c9a3a9c2-3063-409b-971c-314770d7de3d	00362	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:57:40.878
102db12f-d883-49de-a170-a9472f078bcb	00476	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:59:13.575
7bb2df56-adaa-4dbd-b090-80eea8b112d5	00488	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:59:13.624
3b6daea4-13ff-4785-a5d6-0f1ad244749a	00436	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:59:13.642
8a69cd25-ec92-4fc0-b287-c108ad7f4c90	505779	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 11:57:19.794
40f36a92-85ca-4c2f-a47d-a55d3b1feadf	00491	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:59:13.624
31ae7e9b-5a43-4387-b0a1-0a54d4e51cbf	00191	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:59:13.642
bc68be2f-986c-4e92-b0fa-f3ab30bcc4e2	00399	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 15:59:13.647
6e762d4b-4e64-491c-827a-a07ebb83c52b	18731702	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 13:25:48.377
f3912ad0-bb46-4f02-91a8-14518c75ff9d	00402	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:01:55.48
80dbd375-c3f5-4aab-9250-52dfc57c4559	00132	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 14:10:39.291
e29d06aa-e1f7-4639-9afb-55fc6da62335	00392	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:08.381
b008220f-bbbe-4263-9f10-62fa3cb7646b	00145	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 14:13:47.131
5716687c-e31c-4887-9b77-91160a8f525d	00501	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:08.392
098d911b-a6c2-45da-8ea3-145b547bd4a3	00447	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 14:31:39.08
3dae56cb-db5f-45bc-98cf-6ad25e7b2c0b	00104	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 14:31:39.083
0e87e667-8e98-4395-ab44-9efff926e2eb	00146	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 14:31:39.116
1250e1e4-92ef-495b-acff-086b2a895501	00458	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:08.379
f62ecde9-5b31-497d-98bb-e15c19bcfcae	00448	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 14:31:39.076
239489c5-4c3a-4e9a-bc67-df5b08f89821	00158	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 14:31:39.116
f414baa4-cc45-479d-b478-678b6f661975	00503	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:08.388
5a548147-e51f-45fe-a5ad-74fa438c46ef	00338	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:38.387
2afa7c80-bb79-4217-8fe2-b0ca0f8df5d6	00153	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:38.392
06669d3a-997a-424a-a1b2-dccd2ca5afff	00340	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 16:13:38.411
9b54d325-6a79-4209-88c0-d0ce48b061e1	00452	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-20 14:31:39.072
4d746de4-8524-4018-9099-1c4a9be37997	00363	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 12:55:53.52
df19594e-fc90-4c2f-b005-2900dcd4986c	00352	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 12:55:53.543
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
f5eeadc7-c8f8-4ff1-b205-945afd554a96	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
76269788-c718-4340-bd29-6634790ddddc	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
fd20320c-4120-4bd4-bd82-379fe35b122c	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	PADAWAN	t
3f9c715a-0971-4054-b91b-ec8ba514e701	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
9df2de45-7495-4302-910e-96bacfdd32e2	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
660d4215-4046-459c-b212-0c6a512b1526	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
c21f4b63-85fe-40da-ba6c-e96061234e60	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
b4add140-6cbf-4fce-8316-6977f64d7006	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
72daa82f-9f4a-460b-b940-e0918910c3db	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
10d00b42-11d8-4648-8bc0-da0c9aeeec08	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
d9f35efc-fa21-4518-820a-7e1e3da39e73	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
28dadfb7-8d24-4db5-8b45-189c648a4868	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
77da06d4-4ec4-4111-9e3f-0eb5f0952053	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	ENGINEER	t
\.


--
-- Data for Name: Projects; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Projects" (id, name, client_id, start_date, deadline, actual_end_date, status, quantity, updated_at) FROM stdin;
f26cc409-bfb4-453f-82fe-9e7fe5fc4847	524 каміки з тепловізійною камерою	44090811-4903-469d-8a14-40c07c817c1c	2025-03-07 00:00:00	2025-04-07 00:00:00	\N	IN_PROGRESS	524	2025-03-18 16:44:54.652
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
38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	Сергій	cray@sscgroup.net	\N	$2b$10$X7H2FrU5viqsA72NKAAB.OYjkTJAkC2ZUz2aCn2D9j1yA9xk5rskq	ADMIN	\N	2025-03-11 22:29:13.458	\N	2025-03-14 15:04:45.567
fd20320c-4120-4bd4-bd82-379fe35b122c	Ангелина	\N	\N	\N	GUEST	\N	2025-03-15 11:23:56.326	\N	2025-03-15 11:23:56.326
1554f0d4-f870-4c35-805e-90cd37b2e47f	Олексій	alex59.kovalenko@gmail.com	+380671053855	$2b$10$PuerEQ4q8smo.9sv8HRGAeW2Cr7bMn7dFoYro68A24xX3CqCLuE/W	WORKER	\N	2025-03-12 17:43:36.474	Коваленко	2025-03-15 15:20:48.112
d5c43a0c-6249-49e4-8d04-22024aa8193a	Максим	guardiamax660@gmail.com	+380972461180	$2b$10$Xtg86ymOytfnR9sBL3xHwO.hFzEq8euTAGEUoC20i1d59iocTtGVC	WORKER	\N	2025-03-12 17:30:42.285	Сидоренко	2025-03-15 15:21:00.55
76269788-c718-4340-bd29-6634790ddddc	Олена	none1@none.com	+380678160270	$2b$10$kXl7cnvhk0hZAYnnWH3Lxu6QG6nxCs1/bPVdNE9KX4ZRXJBUbMyp6	WORKER	\N	2025-03-14 16:56:18	Павлова	2025-03-15 15:21:10.076
f5eeadc7-c8f8-4ff1-b205-945afd554a96	Ігор	wellman3033@gmail.com	+380934927212	$2b$10$t7ydu2tHpRV2cUuSPoycROq/mzRTVq5jYfDpnXZ.J8zM1oBoUII9.	WORKER	\N	2025-03-14 15:56:56.798	Почекайло	2025-03-15 15:21:42.29
3f9c715a-0971-4054-b91b-ec8ba514e701	Петро	\N	\N	\N	GUEST	\N	2025-03-15 15:22:22.109	Семікин	2025-03-15 15:22:22.109
9df2de45-7495-4302-910e-96bacfdd32e2	Анатолій	\N	\N	\N	GUEST	\N	2025-03-15 17:00:08.494	Носач	2025-03-15 17:00:08.494
660d4215-4046-459c-b212-0c6a512b1526	Віктор 	\N	+380503112501	\N	GUEST	\N	2025-03-15 19:54:57.588	Лісунов	2025-03-15 19:54:57.588
46a5b565-c2de-4dcb-bb3e-f2cb77e63678	Надія	\N	\N	\N	GUEST	\N	2025-03-17 10:16:04.818	Мартиненко	2025-03-17 10:16:04.818
54b4ceec-7c75-4aff-8b08-6333b1849cf8	Артем	artemsaliychuk88@gmail.com	+380930334823	$2b$10$F9u80sXxUfm/XSuooA.Isef5qK8AHwu5v7ZXUyREYziormsxfOf6K	GUEST	\N	2025-03-12 17:47:36.911	Салійчук	2025-03-17 10:47:18.688
c21f4b63-85fe-40da-ba6c-e96061234e60	Ярослав	\N	+380633410768	\N	GUEST	\N	2025-03-17 12:16:51.903	Білоусов	2025-03-17 12:16:51.903
b4add140-6cbf-4fce-8316-6977f64d7006	Сергій	\N	‪+380 99 906 3161‬	\N	GUEST	\N	2025-03-17 12:28:05.674	Бронжуков	2025-03-17 12:28:05.674
10d00b42-11d8-4648-8bc0-da0c9aeeec08	Добрий Самарянин	\N	\N	\N	GUEST	\N	2025-03-17 14:32:07.642	\N	2025-03-17 14:32:07.642
72daa82f-9f4a-460b-b940-e0918910c3db	Іра	\N	\N	\N	GUEST	\N	2025-03-17 15:51:56.701	Дралюк	2025-03-17 15:51:56.701
1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	Петро	\N	‪+380680746989‬	\N	GUEST	Байкер	2025-03-17 10:46:58.892	Ворончук	2025-03-17 19:15:37.259
4ac2b819-a667-4371-9396-d42cb622a0ea	Богдан	Garrik2000@ukr.net	+380677803740	$2b$10$GUzCLCVXpHhVSfedrokYrOvJtG2J6l6TWnYerURD86tcAYBfo3rsW	WORKER	\N	2025-03-12 18:29:31.83	Андрієць	2025-03-17 19:59:06.099
d9f35efc-fa21-4518-820a-7e1e3da39e73	Валентин	shadowszxc@icloud.com	+380961879008	$2b$10$RllRW9Axa7t0YIoFBJ.sdeXAyPSIpbL9SVT0Qa7qqOZoIebrHFsVS	ADMIN	\N	2025-03-17 17:41:36.742	Паска	2025-03-18 09:41:09.098
28dadfb7-8d24-4db5-8b45-189c648a4868	UL FPV	\N	\N	\N	GUEST	\N	2025-03-18 11:44:39.067	\N	2025-03-18 11:44:39.067
77da06d4-4ec4-4111-9e3f-0eb5f0952053	Анастасія	\N	\N	\N	GUEST	\N	2025-03-18 16:44:37.226	Мошковська	2025-03-18 16:44:37.226
5d759a32-b650-4801-9bdd-f5565943dc01	Саня	sasha.kozlov2010@gmail.com	+380939923942	$2b$10$.U.uGd/Y8SNLwxVTXPYTE.Y806KPAs7dL0GA3QsZ/1F3TEve0rJVW	ADMIN	\N	2025-03-11 20:35:02.865	Козлов	2025-03-20 09:14:58.695
74a5c039-8a93-45fc-9da3-cabae703bdbd	Дмитро	\N	+380935419595	\N	GUEST	\N	2025-03-20 17:58:19.137	Петришен	2025-03-20 17:58:19.137
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
dfe94c74-4e7a-46fa-a796-392271eb9b9e	ccd84632c4bd60e464f4954517c6f91a4645b5f868bc36247b2514e54b048fbc	2025-03-17 11:37:57.691563+02	20250313101033_init	\N	\N	2025-03-17 11:37:57.670376+02	1
0838ac88-21ed-454b-a502-09db171b6dd6	94da2df308c6c11884c1771e674f3258c85d4f0a57b1697dfdb48dbf10fe31bc	2025-03-17 11:37:57.692661+02	20250314162524_add_quantity_to_task_logs	\N	\N	2025-03-17 11:37:57.691851+02	1
f726600d-e14c-4006-8634-13d79949b719	47b3253152c6104e3fe75c35cc8c217f29a1747b777f80a3e2ade965a436d9d7	2025-03-17 11:37:57.693648+02	20250315103944_make_email_and_password_optional	\N	\N	2025-03-17 11:37:57.692889+02	1
597dc44f-6152-4f4d-9c4c-8d083de20065	a922dc0cee5de1c2d884ea04dfe48772677ce8bf58e4a5ea09e7ba5d27dfc07d	2025-03-17 11:37:57.697159+02	20250317091416_add_payments_table	\N	\N	2025-03-17 11:37:57.693894+02	1
2c817687-4a46-42e2-89f0-b0c069fec506	72e34ab434ef3a81fdbc1b5437dd59373a27754c9850a25c7849671f8dd27a5d	2025-03-17 11:37:57.698128+02	20250317093750_make_cost_nullable	\N	\N	2025-03-17 11:37:57.697416+02	1
844e2785-a8c1-496f-82d2-239acc6ddc81	6790605f04ddcc9c7e92f86e21e6b23977b83ef0a738bf50836686affc024745	2025-03-17 11:40:00.734205+02	20250317094000_make_cost_non_nullable	\N	\N	2025-03-17 11:40:00.731888+02	1
\.


--
-- Data for Name: task_logs; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public.task_logs (id, user_id, task_id, product_id, completed_at, registered_at, time_spent, quantity, cost) FROM stdin;
c6d82983-b5ba-4d18-a6b6-d10ada2066dc	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	5f00191a-e560-43ec-8ec1-793ccf929ef8	\N	2025-03-14 10:25:00	\N	\N	0.000000000000000000000000000000
f9a9399c-733b-40de-80d7-ae7de4222288	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bad7a9f0-4b12-4a69-a931-d08380e575e8	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
127c8930-a400-48aa-8a9c-dbc1560e3a23	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a51c1b7f-9f48-4ff0-ba6d-e9ddd3c0eab6	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
1fa85634-9630-4bda-9d24-c50b60df6769	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ce5e7b34-5efe-4ba9-b460-c135588b088f	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
d5ec7603-7590-489d-b7fc-4d97aa3d08df	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6e2c82d2-ecde-4410-a887-bca4672da762	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
b6af0d20-3769-490a-a242-7873227209eb	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cd54b10c-bc9f-4c71-a7e9-89ee8c3f7546	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
2a1b77d1-ff62-4d46-9e2b-887453164c2f	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b654fd7a-00de-4aaa-b45f-6a256a049563	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
b716e80c-7163-4d6b-b699-a8dd0073e74c	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	78532087-872d-464c-b15e-6a60134e3922	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
f98860dd-b3f8-4703-b99c-fd4fc4f72212	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6c3b9069-f83c-435d-ac3c-b980a805b808	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
a2310bc3-0410-4b3a-9770-dcacd051ccd7	c21f4b63-85fe-40da-ba6c-e96061234e60	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	67e62aee-e56e-4fd8-8588-390b37cb224c	\N	2025-03-17 12:20:00	\N	\N	0.000000000000000000000000000000
7507ccca-3b50-48e0-8101-bdbec0ba528e	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	1614bb2d-bc03-4b20-9f62-9457f3f56e34	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
92975e15-9b5b-4e6d-99c1-0ad979a610b6	c21f4b63-85fe-40da-ba6c-e96061234e60	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	60ad0476-2b10-4d05-b29d-d412f839d08f	\N	2025-03-17 13:08:00	\N	\N	0.000000000000000000000000000000
638f8c58-d191-4ec0-b5c5-fc5889652d0a	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	fca2efaf-aaa7-4f57-a79b-b2d97c45722a	\N	2025-03-13 13:45:00	\N	\N	0.000000000000000000000000000000
6668b52a-a2d4-427a-bcee-bac66e6973fb	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	32d8f0c8-2812-4774-a2db-dec48765fbc3	\N	2025-03-17 14:54:00	\N	\N	0.000000000000000000000000000000
6f325d6d-6e8a-4d88-bd13-dac9d225f01a	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	e6a9f377-3d07-43b9-985a-fbbcc05f1a87	\N	2025-03-17 14:54:00	\N	\N	0.000000000000000000000000000000
1878879b-1245-4316-8d3f-5e635b963d0b	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	0a03a698-e5f6-45c3-babf-2f6bdac9cc49	\N	2025-03-17 14:54:00	\N	\N	0.000000000000000000000000000000
d8d497b7-b9e6-4d57-adb3-00b60c35eed3	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	47bdea20-40d4-4418-a120-39c54be0b69c	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
cc5cb28a-cff5-413d-a041-107e867ab56a	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a1aa5344-39b9-4715-824c-90b9238248bd	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
c3f4e3c8-42f7-470e-bfab-cbc2f3024f11	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	5850e14f-6dff-4bd7-89c5-5086e481aa46	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
5381da73-040c-4526-8ebd-ce6e324f1925	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e21e46cf-2383-46a6-b841-5cd8585310a0	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
353f7c28-f6c6-4083-8eaa-3579ec8bff36	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a10cf89d-c57f-4a62-9fb1-119edefe636f	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
2050e564-ff90-445d-a3ac-ce2ecb9e1f17	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	29e36c8a-9e1c-40a0-be39-ccd5855dffbe	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
0b404bad-b1e7-4172-b4e9-6c63981493c8	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	390c631b-e6a4-4eb4-b372-9a991d5c2de1	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
772daa7c-a478-4d9d-8f5b-64ae4a7bf30c	72daa82f-9f4a-460b-b940-e0918910c3db	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f9ebce31-8e5d-437e-b3ee-634f4c3ce014	\N	2025-03-17 15:52:00	\N	\N	0.000000000000000000000000000000
ec3a0eb0-67b5-459d-a157-46e73227b835	b4add140-6cbf-4fce-8316-6977f64d7006	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-18 10:00:00	\N	12	0.000000000000000000000000000000
88242ad7-eb4d-4bae-9c80-bf9ca0e2e26c	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fb0a7aae-0c93-4022-a939-6d25bfd50f1f	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
0901bf9f-1b02-4dda-9096-56921cf256f9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8613cc8e-6c0c-4fbb-9b08-e050ab303f59	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
9a277d36-7ca0-48dd-9f92-d08ffab7e078	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	48562621-0222-4b1b-994a-9a370f2c3d1d	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
4aba0718-407f-4e7d-9f2a-1b0b0f38466f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	fae0fe25-a965-4f09-8c33-e88baca7a64b	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
c84afa5e-6031-4b17-acd9-d79dc150944a	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	60ad0476-2b10-4d05-b29d-d412f839d08f	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
dfb929de-0899-4b59-9d98-4df447f94e58	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	3ce8216a-1065-4346-a89b-e72df6d96ce5	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
d914ed42-0a6f-4577-9098-4097d639b09e	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	dfcc7cee-cea8-49cd-8fb1-78e7e43cb907	\N	2025-03-18 14:36:00	\N	\N	0.000000000000000000000000000000
9b1629fa-b91e-414d-a252-8a620f7822dc	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	fb255fb4-f253-46e8-bc30-54a400703e6d	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
f86f10fe-68c0-4057-98b2-199b0bf820b3	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	0f3c990c-abc1-4f30-ad54-245bcde12e84	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
355c831a-1c44-4452-b868-5b89c9d7337f	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	7a928090-8c51-4cec-b944-28c588e72e91	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
d0eb2e5a-9fff-4eac-9f5a-14391e50cbfa	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	7f211079-eda9-49f0-a2c1-5dbefdf96b3d	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
f8fa67ad-a84f-4d99-8072-175794a910c3	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	59f6a0fb-a81e-42d4-9f61-bc336769d36f	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
71d3dc2e-ae88-4d5c-be41-a7c26ce9322c	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9ea71122-80cf-490d-aa34-324bf258110f	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
35489890-8ed7-4caf-be1a-36e0d8a72376	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cc23cbdc-e585-41eb-844d-345625695720	\N	2025-03-18 15:57:00	\N	\N	0.000000000000000000000000000000
06724144-01e8-436d-b6b0-20f8a2b4d42f	b4add140-6cbf-4fce-8316-6977f64d7006	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-18 16:03:00	\N	9	0.000000000000000000000000000000
3ebf26b3-c8cc-4bf4-a6d7-2b056f469e1c	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	d332d327-ef27-4775-9683-c23d324abbf4	\N	2025-03-14 10:25:00	\N	\N	0.000000000000000000000000000000
53001f8c-460b-4fbb-94a9-dde00d2c9438	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	9867c7ff-d3bd-4efc-b2b7-ea425350757b	\N	2025-03-14 10:25:00	\N	\N	0.000000000000000000000000000000
f1ee153f-900a-415d-aa5f-b105d4f69b72	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d332d327-ef27-4775-9683-c23d324abbf4	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
53ebcc24-14e8-484c-8488-d116c5be64ef	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	7c236248-e0e2-4282-b9f9-29e938492539	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
c8b65986-f5cc-482f-85a6-8507bad51aad	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9d4cee0f-b79b-4ce2-9e80-ea96dbf7763b	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
f273d79d-1d08-4d83-b26a-f1ff529035e6	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4092c9d7-0d27-4f8b-b709-2d034316cf9f	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
2d73ca1d-e183-4c92-b0fc-09bfa90c2306	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	7a928090-8c51-4cec-b944-28c588e72e91	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
61492289-929e-4550-8dc1-c543508c3914	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b46fe90a-b116-423e-be0b-3f14c6534407	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
436f065f-82ee-4e6d-961e-bce17fb74b81	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	68ad43c7-b9f7-42ee-af06-53634a1af791	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
5c94251b-31b9-477e-bb3d-875066f01469	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	86b5d390-e77f-408a-876d-44ecd1550afc	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
118c8014-8d14-4aae-8e6d-c1b344a87308	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c87c24df-5996-46bd-8e6d-509008332355	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
73a2505a-60ea-4599-9da5-51a7476a11b1	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	21b52893-e5b1-4df2-afb2-a76c873f6d44	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
50164d1d-4794-47d2-bedc-d08449c34ebc	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3032b175-eb46-484a-af52-1f8703bfc7ab	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
6ffb1432-dcbf-44d0-9d67-6b33bddfdba4	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	48562621-0222-4b1b-994a-9a370f2c3d1d	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
d754f13f-aa63-4b6d-a2f0-a304ddea3b85	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	f4aba19c-e3eb-4580-812b-716abbaa5360	\N	2025-03-17 12:30:00	\N	\N	0.000000000000000000000000000000
d6e7a545-3c7a-44c6-81d9-3f460381b1f2	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	52851dc1-9bc7-4b9f-9156-074d3a005be3	\N	2025-03-17 12:30:00	\N	\N	0.000000000000000000000000000000
a5ea19a1-b7b6-4758-9d8f-72271c7ae6d2	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	c49a0aa0-cb0b-4d11-9fb9-e35ef654ac60	\N	2025-03-17 12:30:00	\N	\N	0.000000000000000000000000000000
3d70f065-d8b4-4641-99b8-5c32baa9be2b	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	44a24f03-8bbf-4002-b4ce-a7ac6ad21926	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
a3f1ca65-f74c-4963-8b78-db2d4e46a11d	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	86d850c9-aab5-40f8-8b92-c78a8d676861	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
7f495e53-583c-48d6-b4c7-0988770a53bc	c21f4b63-85fe-40da-ba6c-e96061234e60	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	009b99f8-c02c-4332-8b7d-222aab1ac91b	\N	2025-03-17 13:08:00	\N	\N	0.000000000000000000000000000000
90444e15-7729-412e-ba44-75950e04b92a	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	0a4c6115-9f88-4fb0-8086-f6f1ac57ce25	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
a624e735-cb09-415a-bedb-1cb926106d82	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	f5839b70-98fe-4102-95f8-a3015970f6a7	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
fcd6f1a1-b8f5-4e5d-be1a-9c69030331a6	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	d1b8dc06-58c0-46cb-932e-0bd1909afeef	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
7f28f4e9-6d0e-46c3-9528-3a19c3889473	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	a3ab5bd5-e345-4cd7-8c46-998665bb3e05	\N	2025-03-13 13:45:00	\N	\N	0.000000000000000000000000000000
f4a805b7-a824-4b48-b24f-98f020f51cc3	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	f4c13db0-4d2a-4efc-af90-63d667521d86	\N	2025-03-17 14:54:00	\N	\N	0.000000000000000000000000000000
495d5f00-e5e7-466a-a66a-23e718e5798d	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	37dd3c90-b0db-470c-bbf8-99467e275d1a	\N	2025-03-17 14:54:00	\N	\N	0.000000000000000000000000000000
8ca19253-0ffd-4d02-9272-1aed80e4fd46	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	751c6384-02dc-45b1-9df0-81fb810e2301	\N	2025-03-17 15:00:00	\N	\N	0.000000000000000000000000000000
99b4ec17-6100-4325-be86-ad487b6f013f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	af0b583f-2864-436e-a71a-1cc742eebcf0	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
6c5bf3e4-99f9-4166-ab4e-5025985290b1	72daa82f-9f4a-460b-b940-e0918910c3db	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cba7d640-028b-4946-acd6-1296d5d82c14	\N	2025-03-17 15:52:00	\N	\N	0.000000000000000000000000000000
f3dd06ba-d7e3-4bf9-a85d-6314d799c4c8	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	fed79343-1c21-433f-9d45-390cd4003d69	\N	2025-03-17 10:15:00	\N	\N	0.000000000000000000000000000000
1cf374ac-a223-4609-a3a9-f2c78943b18c	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	ce5e7b34-5efe-4ba9-b460-c135588b088f	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
1854dd02-3bf4-4604-8b6c-9ecc22bf855f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	ee54808d-253c-4cbf-876f-81420a6ebd64	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
06e08c4c-1709-4f6e-9fd4-abe8f574f8b9	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	1bd6ad93-a944-4fad-b979-40be6f237849	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
5b11d8c0-8c38-483a-a0d6-8dcdea4fa50a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	8e34d7d4-6016-4999-ad80-a219e869cab7	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
2fe57554-bd6f-4738-984c-fa7420290b5a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	1ce1f86e-598f-4d6d-99d4-c21e625a6929	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
e059eb4e-bbec-4128-8a31-206bf2c248fd	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	0a03a698-e5f6-45c3-babf-2f6bdac9cc49	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
da5c347a-2d2a-4acc-aa55-389cbb3cf571	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f4c13db0-4d2a-4efc-af90-63d667521d86	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
98a26801-b19a-4917-a62b-7a07361247ac	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	9b8a4fb7-9095-4b89-85fe-7f6029f6bd48	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
9e881aba-84bc-4b75-9fc7-44602dc1da27	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c122112d-528b-498b-b871-7f7999aa2bd4	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
a2be1168-05f1-49a4-82e3-9fe70555fe3d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ac41d8ea-e738-419e-a693-56f2f8a423d9	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
fc99f90c-bff3-4e5c-89d6-ce3bb6366b06	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	3ce8216a-1065-4346-a89b-e72df6d96ce5	\N	2025-03-14 10:25:00	\N	\N	0.000000000000000000000000000000
590f9d98-3598-45c7-b9a3-602afa25e8e2	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a733b4f4-38c9-4720-8388-4dc47d1343de	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
b7eeeaa0-1b93-49b5-b680-ac8341f8da8b	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5f00191a-e560-43ec-8ec1-793ccf929ef8	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
d333a00c-dc5a-43f7-a60e-735ba0969d1d	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ece3c653-738c-40be-a965-e1066489852f	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
09cff83a-ed52-4cd8-b9b5-77b00b92de41	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	94836ad4-647e-479d-a979-16eb6c0b3462	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
cdaec055-64a8-47fb-b158-2e2433335f71	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d7f2f539-941e-4f68-aae3-4e7bea8b52ec	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
45ec9513-5e01-4cb3-beb1-f356828da5e9	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	37acb6c7-20e4-4329-ac44-d1d32ff14a06	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
b71b4ac7-7618-4985-a9b4-337db45f69f1	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b3494d34-77f5-4380-ac6b-efabbb9d02cd	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
0e19c9fe-db94-4571-a05f-1bdf484e3155	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c122112d-528b-498b-b871-7f7999aa2bd4	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
f22a0819-cc81-49d1-97ff-0d3b8a4a0e84	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6ea77c7f-1c8f-475e-aeab-4313638d964d	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
0fd0720e-7f69-4c14-bf24-ed82b7008624	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	89216a31-f050-4032-9a47-3f844451becd	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
b9845d52-22b7-4ce3-ae65-d22a888b9445	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	607cc9b0-6522-42be-80d1-f08ae774c849	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
116b3f38-7288-49a2-91ef-0d04bfbc1b84	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f65b9d92-86e7-4e70-9fdf-a7cd654b28d4	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
2d9503b8-9eab-4d30-afe4-d18f1d97acb5	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	58d23f14-98d1-4104-a3fa-2b48c7d4143f	\N	2025-03-17 12:30:00	\N	\N	0.000000000000000000000000000000
28c25078-704a-446e-b6ec-89e32af45028	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	f8e2af02-0e7b-49a6-8905-e3b873f0469f	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
2e2f9654-97d5-4d51-87ac-0b32992c3b10	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	c7b9094d-7b2b-4e6c-bfd0-9ff0b27e50cb	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
a436bea7-7e45-4656-95c7-2136bc27bfbd	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	f69dd59d-a3af-4519-a7c5-a9cd7d7aef8e	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
ae4ee5c4-3840-420a-9438-12ba7d527b75	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	f66035ca-88b2-4751-ae44-4bfc3df3ddd9	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
a7f9bdaa-1842-4634-ae6c-9a662debaa28	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	ae36cc75-9261-4233-8a40-b7bab4768a39	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
dc350f68-8475-4f6f-b2f5-ae0617cf1e48	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	dd902aca-2a6b-47d7-9a55-83ebd5e6af79	\N	2025-03-13 13:45:00	\N	\N	0.000000000000000000000000000000
e55358df-9d60-4267-9496-c5208406ac07	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	c48ff7d9-df4a-432f-90a7-c819ce939054	\N	2025-03-17 14:54:00	\N	\N	0.000000000000000000000000000000
9a098858-2018-4745-923b-ce9501604af3	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	a25147a7-50cc-42ed-bc93-b0f1ddb70a6e	\N	2025-03-17 14:54:00	\N	\N	0.000000000000000000000000000000
7a46743d-4eb1-4e47-b2f5-a595d9a630ef	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	e62c2e3c-2995-4af5-a63b-fb5d58239718	\N	2025-03-17 14:54:00	\N	\N	0.000000000000000000000000000000
4238dac4-e9a5-4061-b66b-9b241caf10dd	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	58d23f14-98d1-4104-a3fa-2b48c7d4143f	\N	2025-03-17 15:00:00	\N	\N	0.000000000000000000000000000000
fccc5d97-276c-49ae-89c0-eb7d93fb5608	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	412bc072-99ba-4811-a2d9-9e1bd1f49705	\N	2025-03-17 15:00:00	\N	\N	0.000000000000000000000000000000
f3273032-38ff-48a2-b1d9-9ea9c42588a7	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8df3c997-06e6-4d60-b941-8a19a6cbf8de	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
acb13091-e0eb-4e94-a773-f02eda720328	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	cd31d962-8562-4424-be00-3b3d2e23e4cc	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
232053cf-060b-48c2-b280-5a7945990845	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8a77644e-8d6d-4f59-b04e-b8f7f80d46b4	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
bb9b27e0-7249-4ae8-af8b-fb9fb77b3035	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	16d85379-5978-49e8-8ffa-07ccb7b3bcbc	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
12464459-e2a6-4a9a-8dbf-a0550e0b2e07	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7dad6b41-4936-4d96-b676-4f83b8d21c81	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
e02be5c3-b644-4bd1-bf31-73e1117ee389	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	75773861-0f7d-42d4-afa8-e7a0cc3f24d5	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
eccf6645-4823-4b91-81c5-b7560cf51445	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	86feb425-d462-4b9c-9eb7-f4d2ff0c8696	\N	2025-03-17 16:09:00	\N	\N	0.000000000000000000000000000000
84060037-886f-4761-9e78-151539c36ad6	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	07874060-cff6-40ec-9b52-ec7121ef8051	\N	2025-03-17 16:09:00	\N	\N	0.000000000000000000000000000000
7be63fba-79c3-4bc8-bd75-8f3ef330a59a	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	a3068a89-90a9-4327-8e3d-2c5ca0b30e4b	\N	2025-03-17 16:09:00	\N	\N	0.000000000000000000000000000000
9905d834-5874-40df-806e-0d023de3e10e	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	d3981126-c996-457f-9b9a-2421e3f2aa9e	\N	2025-03-17 10:15:00	\N	\N	0.000000000000000000000000000000
70c3fbe5-3f43-459a-8d14-aa69af1be2df	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	18b1be25-b82f-4016-be4a-24ad1211dbcc	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
2451f36a-4786-4234-a649-abee7b8b2d10	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	8f8d80a4-89cc-4bac-8a04-9d34835db309	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
b0c79469-fbe1-431c-9889-4fca2922428a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f5839b70-98fe-4102-95f8-a3015970f6a7	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
2c179abe-4c03-47bf-b0b6-f335ef670418	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	441e2985-08be-460b-99bc-29422a6330a6	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
966f0f84-2ca8-43fb-9d6a-2441c9597b7d	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	93975bc5-c8f0-4c51-86d7-29926d2f24b9	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
6888243f-35e0-4a44-85c7-2a9f2790815f	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	a733b4f4-38c9-4720-8388-4dc47d1343de	\N	2025-03-14 10:25:00	\N	\N	0.000000000000000000000000000000
79c04d18-6647-4b70-bb4b-9200f8d58910	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	479e767b-b238-45ae-8451-d722372e30bc	\N	2025-03-12 11:05:00	\N	\N	0.000000000000000000000000000000
1dab6daf-a1f2-418f-9c9f-32a2eaee43f3	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cf3bb057-66b9-4aad-8a3b-869704a9769e	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
160a619a-c23f-48bd-b053-41d43871ece2	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ee8bdec3-3240-4f5b-9517-6f371a527c40	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
1886068d-f4b9-4640-8564-a2a2771d4f1f	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8fb30073-9be3-40e7-9af4-af8418ebf5f4	\N	2025-03-17 11:48:00	\N	\N	0.000000000000000000000000000000
00f8a754-973b-4e09-b4ec-7724e9120805	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b3c643b4-005b-4630-8402-5f40e3ffa30d	\N	2025-03-17 11:48:00	\N	\N	0.000000000000000000000000000000
31caf58c-2ddd-4046-b606-c88fa6a93520	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9366d779-11b6-4127-9097-420789813a8a	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
3500bd53-51a2-49db-9f21-e5ba5568a39c	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e9fa3095-2f68-4a32-ad41-524f4abea24c	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
7d19063e-dd02-4be4-bbd1-fb25a99acfb6	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	23b402fa-fff1-4b0b-835c-e3e31d6b8647	\N	2025-03-15 11:57:00	\N	\N	0.000000000000000000000000000000
ac1663d3-751c-4e4f-a8bd-6c0ce42156fb	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	7565af79-e09d-42c0-ad7c-87752275baad	\N	2025-03-17 12:30:00	\N	\N	0.000000000000000000000000000000
f504b6f8-432e-457e-8d1a-d185e856dca8	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	e5fc2cb3-7620-4112-be4b-a1abddde0365	\N	2025-03-17 12:56:00	\N	\N	0.000000000000000000000000000000
6a83e8b7-eebf-4954-bf56-1e11e935fa1c	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	4dac4fab-0b3f-47f4-8039-5eb68885b867	\N	2025-03-17 12:56:00	\N	\N	0.000000000000000000000000000000
9fe8716b-47ed-4642-9709-45cf3b65da59	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	1ce1f86e-598f-4d6d-99d4-c21e625a6929	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
24679483-071a-41aa-ad34-8836d0d202da	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	fa95754b-4c40-4267-9432-53731574a5d3	\N	2025-03-13 13:45:00	\N	\N	0.000000000000000000000000000000
8a886599-958b-4214-a226-e482be591026	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	7565af79-e09d-42c0-ad7c-87752275baad	\N	2025-03-17 15:00:00	\N	\N	0.000000000000000000000000000000
d7657b8c-11f0-46eb-a6a1-857ed896753f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	0247d8b4-c286-4961-97ae-9b665a7f95ff	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
fa116ad4-d8ee-4525-9387-2461e3756c8b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3998df44-aa1d-42cc-9fd2-cdf5ef055b3a	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
400f17ae-aa75-4d00-a472-a83de3956d30	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	4708aea0-01ec-4f5b-ad62-7da675b22c19	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
1596ab6e-a89f-46af-aa03-d06f9dd84e96	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3fa37fb0-732e-448b-b8a6-26590da8e2a7	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
e83fb7bf-0457-4812-bc57-ad84a1c0995a	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	44b880cd-9703-4f24-89a6-67f51a383745	\N	2025-03-17 15:23:00	\N	\N	0.000000000000000000000000000000
08b19623-8bb1-4453-ac60-120bb6339356	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	818c6968-9ecd-4db5-a900-5afab0406640	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
0c8470d0-2e63-456d-a252-16c389442b51	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a94de110-cef8-4a08-b40c-2aa1d9b45bc1	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
49f0f958-b63d-494e-92ba-0bab52aad781	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a7f4f78d-f4b6-48c5-85e5-32aedeca5266	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
fb85068b-be58-4e52-ade1-ad01d7a08af1	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	f008fc7d-cf2f-486f-852b-a2e88e86113f	\N	2025-03-17 16:09:00	\N	\N	0.000000000000000000000000000000
e82d2532-659d-4b2b-ae17-5a696b19d3e9	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	640e79ba-ceb6-4639-9c63-5d7ae0bad4a6	\N	2025-03-17 16:09:00	\N	\N	0.000000000000000000000000000000
961626a0-320d-4455-b376-9192a6ea2d3f	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	94d4fe13-aaed-4a41-b1b3-e2f4a6c7bc23	\N	2025-03-17 16:09:00	\N	\N	0.000000000000000000000000000000
cf56ab95-35cd-446e-a9ec-d14cb52baf91	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	deeadf52-62d8-4aed-992f-2c634c544bde	\N	2025-03-17 10:15:00	\N	\N	0.000000000000000000000000000000
cee49a74-d92c-43c8-a456-abe1c1e70fa5	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	7ddba26c-08f2-4181-8ec6-982f51a57743	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
41974897-1c65-4bbb-b532-870f831598c4	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f1172350-f5c5-44f5-9404-57a8e59c1335	\N	2025-03-18 12:00:00	\N	\N	0.000000000000000000000000000000
f18aa537-8fcd-4024-b39d-e070c0310e30	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	32d8f0c8-2812-4774-a2db-dec48765fbc3	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
a09ed07f-cde5-4dc9-b9f7-c2c7fd59712a	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a2ffcab7-cfc9-47d8-81da-96235775aea2	\N	2025-03-18 14:36:00	\N	\N	0.000000000000000000000000000000
1334e049-6b71-4462-90e2-3a99ccfd8c5f	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d330a920-e193-4559-84c0-e322041ab5b0	\N	2025-03-18 14:36:00	\N	\N	0.000000000000000000000000000000
cd208d5f-ae26-484e-84d5-179176899156	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	658362fb-1b9a-4f9e-bc08-55bea8df4ea5	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
689b8a8b-8753-47aa-a1e1-ecae607a7b6e	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	efb9d3db-5eed-4b48-8d24-4f246c240626	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
2330a896-ef8f-4db7-8577-93f33e57a924	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	afc5de0c-c1c0-486f-9aca-2c7ceecc5a2d	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
3c5e8536-13fe-4c06-bda0-2aded8a9057d	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	ece3c653-738c-40be-a965-e1066489852f	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
79201952-e145-40e6-95e8-0799f25cad2d	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	96c8b347-40a4-43a5-a7f8-b25ac84b7d66	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
60954345-4e44-4e5d-9177-1eeea91ee6a9	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9d61c135-325d-401b-9772-b6ace3c6233a	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
775c6eb7-a033-438d-b4fc-152f620609cb	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bcad4dc4-9406-4c93-a39a-cfe5a460e888	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
9eca3365-6b2c-486f-b9dc-b3c5d8123284	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-10 15:58:00	\N	60	0.000000000000000000000000000000
a5935f36-9f2c-469f-a662-fb5d65af6af5	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	7c236248-e0e2-4282-b9f9-29e938492539	\N	2025-03-14 10:25:00	\N	\N	0.000000000000000000000000000000
21c72a48-ad7d-4116-8bbf-af67551b3c9e	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	0290a525-b422-4a2d-9a9c-48a0ed38de78	\N	\N	2025-03-10 11:30:00	4.000000000000000000000000000000	\N	0.000000000000000000000000000000
ecd9842e-a05b-4e06-a478-7f3e0518c591	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	375fbef1-25e8-458e-8b5f-828a651d6b90	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
fead8a52-c37d-4686-aab9-34702e9a691f	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b56420c3-a3c1-4e18-8d2d-4793bad2877a	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
ac8f9108-2e28-4442-bc2a-3b6e950ba5bb	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b24c723e-8c4e-4d0d-8203-7a8bdb10379c	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
02b3b3ae-d5e7-4796-8928-bcc7c8013f4b	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	27a2708b-d8a3-4d08-8860-c597580e033f	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
7cf708bb-febf-4ce0-a9db-a4b9bb4ba86c	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	59a41589-aa24-44bd-aa47-04cac282c058	\N	2025-03-17 11:48:00	\N	\N	0.000000000000000000000000000000
30663d2c-1de9-4382-9f6b-bbf204193a21	c21f4b63-85fe-40da-ba6c-e96061234e60	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f352b9a0-86c8-4465-b428-d3b3b261b916	\N	2025-03-17 12:20:00	\N	\N	0.000000000000000000000000000000
4f768ac3-dfda-4eff-b81d-5f2782d2bf1d	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	17026669-dc68-4a75-ad81-958098618536	\N	2025-03-17 12:30:00	\N	\N	0.000000000000000000000000000000
6b28ea7d-952d-4c1b-83fd-ff5e9f5ba69f	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	fb0a7aae-0c93-4022-a939-6d25bfd50f1f	\N	2025-03-17 12:56:00	\N	\N	0.000000000000000000000000000000
41feeded-cb90-4d30-96b1-df1c75ceb9bf	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	8e34d7d4-6016-4999-ad80-a219e869cab7	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
4c236cec-1324-4f44-b95e-d88c7936bba3	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	07e23ad7-52e6-41c2-bd42-694582dabdf2	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
b57585fb-70ad-4810-96bb-8fd4cf4abd72	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	fdbd466d-50a6-41dc-8a7f-a159b7afdef6	\N	2025-03-17 13:13:00	\N	\N	0.000000000000000000000000000000
746028a6-3c1f-4263-973a-36cba104ad95	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	94f2c522-108d-4c34-94c3-43c835a9d390	\N	2025-03-17 13:13:00	\N	\N	0.000000000000000000000000000000
07554065-a3b6-4d7e-afc4-3c469e65e351	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	26352e3f-39b3-4861-bd56-46280b0e7ca0	\N	2025-03-13 13:45:00	\N	\N	0.000000000000000000000000000000
70632e7b-014f-4147-8e8c-10dcafc71648	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	17026669-dc68-4a75-ad81-958098618536	\N	2025-03-17 15:00:00	\N	\N	0.000000000000000000000000000000
b000fb0a-afa7-48cb-844a-47d9cde8a6a0	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	b24c723e-8c4e-4d0d-8203-7a8bdb10379c	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
ae0afa17-393a-4ba3-a70b-29cb9e704537	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	23667994-9046-417f-a79a-f939987a902a	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
dfb13289-f2a5-4d77-875d-dd8bbf1f8ded	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	828b3c79-f2e8-4b43-b544-8c32d7048d9c	\N	2025-03-17 16:09:00	\N	\N	0.000000000000000000000000000000
8e822db6-e732-44c9-91f3-b471016ea49a	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	24d815a4-7649-44c1-8b67-a93752b0bf8d	\N	2025-03-17 16:09:00	\N	\N	0.000000000000000000000000000000
f9ddcdcb-5bf5-4efa-ace4-b55c1e039a01	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	f6c1869a-ef18-41aa-a7c1-7d5f3153790e	\N	2025-03-17 10:15:00	\N	\N	0.000000000000000000000000000000
455f5303-f07b-44ef-9142-942579e9bce1	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	4a5aa9ad-3a59-4594-8ad8-da7796878eb8	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
47a2eccb-e5b5-43ab-a30e-c6dd740dfc04	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	ae36cc75-9261-4233-8a40-b7bab4768a39	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
8d175a38-3372-4008-9da7-59a701bbc892	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	e212dbd6-6c7a-4b60-a2ad-c7280868a9de	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
3fa212bf-804c-49fa-b685-44aa2690dcc5	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	9d4cee0f-b79b-4ce2-9e80-ea96dbf7763b	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
d2b49fb4-8158-4fb4-a832-7042ae3b383f	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c92e3031-91f8-438e-85aa-8d1eeff98491	\N	2025-03-18 12:00:00	\N	\N	0.000000000000000000000000000000
ceda428d-9b6c-49b9-8822-2ef609452835	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	c48ff7d9-df4a-432f-90a7-c819ce939054	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
f7c73e51-4fcc-44a8-a290-87e739d68f9f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	37dd3c90-b0db-470c-bbf8-99467e275d1a	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
f171e593-7a19-4508-a83b-cf566036cdcf	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	0a4c6115-9f88-4fb0-8086-f6f1ac57ce25	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
d18c9e10-3c3c-46db-81c3-60d9c0693d39	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	6383b850-30a2-4fc8-942d-7639fe4bc4c0	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
f5fa59ae-4fa2-4034-acf4-073bb8060d53	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f323147f-dc1c-4116-b9f9-08994fbc61ce	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
10cf8f0c-4597-4a3f-9fc8-899a2c581832	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fa95754b-4c40-4267-9432-53731574a5d3	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
018d3d7e-7bce-48a2-874f-9bb813e11266	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f037594b-dac4-436b-9b01-8c33936527ff	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
09b49c3d-a03e-42ee-9431-8b1f0e17c52a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	d3118a3a-2929-40fb-8ba9-3cc1d3f5144a	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
faef65e8-5ebf-49f7-b399-27a32dd7dba1	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	55b421e0-48af-4894-8424-294c80a2082c	\N	2025-03-18 14:36:00	\N	\N	0.000000000000000000000000000000
5563033e-3028-4421-8d0e-baa66b0de108	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	037c27d7-33e5-4a6c-bc84-e0f6beb58973	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
4d45db77-2cd8-4ea0-b7b3-2af8da9106a5	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c5729014-e7a2-41ec-b4d2-7e018f243a59	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
d9779b76-e2a8-4baf-8907-a6ea6d314b59	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f2b5c084-181f-4915-b924-114f1f351121	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
96e3ef5c-a9dd-45ff-ae3c-e6cc0ac20a1d	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bd434c89-dd96-431f-a47f-89a3afb034a5	\N	2025-03-18 15:57:00	\N	\N	0.000000000000000000000000000000
b7eca10b-1bbe-4b9f-954b-16764c0b25c6	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-13 15:38:00	\N	16	0.000000000000000000000000000000
bd87e605-7c95-4a5e-85d5-bb7da18f8ab2	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	a51c1b7f-9f48-4ff0-ba6d-e9ddd3c0eab6	\N	2025-03-14 10:25:00	\N	\N	0.000000000000000000000000000000
0e7774a3-f8f5-4d15-a5d0-b18108c71eb5	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	41482a61-e322-42ef-a5fc-6d525c2542a6	\N	2025-03-14 10:25:00	\N	\N	0.000000000000000000000000000000
3f1b5d42-04f0-47e2-8d24-ed8613971422	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	cf2f35ed-f1c6-424e-80b8-04fc1a082a60	\N	\N	2025-03-11 11:30:00	7.000000000000000000000000000000	\N	0.000000000000000000000000000000
65321291-7c3b-4d58-968f-00aae9f677f1	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0fda1c49-6a03-42d6-be80-f8b90d98b793	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
271cc261-6d16-46a5-92ef-12cf2f57756f	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f7c67a16-7727-4b6d-b809-718330b8299c	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
43d98c50-50db-430a-9bff-ad67ed154cef	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2085e5f1-987f-44be-ad37-33cd4ab46560	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
9ddb75be-f310-409a-84d9-79ac44951801	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3069a201-0b9d-4db3-9a1f-583d59ef9cd6	\N	2025-03-20 11:44:00	\N	\N	0.000000000000000000000000000000
65212f44-7d03-4c80-86d9-d15d1b4aa28c	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2d6ec42b-2dec-4d8e-83ee-7e63737e1f8c	\N	2025-03-13 11:46:00	\N	\N	0.000000000000000000000000000000
7a76e9ee-c1b2-4040-b902-51fe3e96b79e	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c353594d-7aef-43e5-87b0-8e8b5544954f	\N	2025-03-17 11:48:00	\N	\N	0.000000000000000000000000000000
53acff7a-3af0-4a17-b823-d0c555987f38	c21f4b63-85fe-40da-ba6c-e96061234e60	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	670ba5c4-55a8-4dfa-99a0-5d45e0a4c78f	\N	2025-03-17 12:20:00	\N	\N	0.000000000000000000000000000000
44a44659-dae7-46d7-88ff-29e3301a2195	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	080db78c-5793-4c41-9468-9881a795ac2e	\N	2025-03-17 12:30:00	\N	\N	0.000000000000000000000000000000
f338632a-bdd4-46c3-8534-f9b03199a145	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	cbcaa009-e4f4-45d0-9342-817caaa6ebea	\N	2025-03-17 12:30:00	\N	\N	0.000000000000000000000000000000
036f22ea-199d-46e2-b56d-1426e2acba1c	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	dab18118-e41b-435f-bece-0073eec25748	\N	2025-03-17 12:30:00	\N	\N	0.000000000000000000000000000000
84cbf602-f806-4b4f-bd83-314994fb8e7a	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	33b56818-edf7-42bd-93d3-fa92f66274fa	\N	2025-03-17 12:56:00	\N	\N	0.000000000000000000000000000000
a0d355c6-c488-45a6-b339-b4523acccce2	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	e212dbd6-6c7a-4b60-a2ad-c7280868a9de	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
cf7814c2-9a71-4590-a31f-a30206f58bbb	54b4ceec-7c75-4aff-8b08-6333b1849cf8	cf2f35ed-f1c6-424e-80b8-04fc1a082a60	\N	\N	2025-03-08 14:19:00	8.000000000000000000000000000000	\N	0.000000000000000000000000000000
46a9e1fb-ab9a-4fd1-bc9c-599d198de250	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	f4aba19c-e3eb-4580-812b-716abbaa5360	\N	2025-03-17 15:04:00	\N	\N	0.000000000000000000000000000000
79341d78-301a-4331-891b-e19ab9cf606a	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	af0d574f-a957-4df2-acb2-c48bd92e6225	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
bd93d529-6e13-4051-81a3-fa528cc7fa62	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c3739846-78cf-4eca-aecf-3a430766707c	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
ffac2f6f-a545-44e6-b06f-5743b059066a	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	cb526458-ae1f-4a84-a7a9-e7031f612074	\N	2025-03-17 15:29:00	\N	\N	0.000000000000000000000000000000
6e13723b-88c4-44a2-8ec2-bce27f7cae2b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-17 17:17:00	\N	20	0.000000000000000000000000000000
419749ed-0eef-4e4f-b6a5-fe07b8e9f3bb	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	260dea68-39b1-4b08-a86c-d8a1467a4f78	\N	2025-03-15 09:20:00	\N	\N	0.000000000000000000000000000000
0cd32df1-cf44-4606-9588-8bc0f376b929	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fb255fb4-f253-46e8-bc30-54a400703e6d	\N	2025-03-15 09:20:00	\N	\N	0.000000000000000000000000000000
bdfa75ce-162d-486b-9454-3cdea465925e	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	b58192d8-e35b-4f9c-aaa6-24140e8272fc	\N	2025-03-17 10:15:00	\N	\N	0.000000000000000000000000000000
18427d89-1178-4d96-a04a-40a66392d697	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	e5fc2cb3-7620-4112-be4b-a1abddde0365	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
9f1a2416-feb5-444d-be23-8c524fa34d6e	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	8d6da4e9-0b7f-4dd5-98ca-32f6f8c13486	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
b394cc99-2de2-4410-a5ca-475b9d30631b	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	b454a4ea-9e07-42ec-a4d1-d4296fd4ef5f	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
b9427a64-c8fe-442a-ae58-98b4253e052d	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	74a33cba-fc25-46a5-a998-f04326faa001	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
5bec5b77-7df6-4d97-ba96-f9172192f11f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	4dac4fab-0b3f-47f4-8039-5eb68885b867	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
1b7f7fac-6bb7-4e68-ad6a-5b9564b5f5ec	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	a25147a7-50cc-42ed-bc93-b0f1ddb70a6e	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
7c06818f-26f5-423e-84bf-1b3ca393a536	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	33b56818-edf7-42bd-93d3-fa92f66274fa	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
fca0a27c-8f17-45ac-94ad-38f23f24e4a1	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0b7c5a27-21c9-4ca5-a5d2-a169269ce8b0	\N	2025-03-18 12:00:00	\N	\N	0.000000000000000000000000000000
75728881-991c-4164-81c3-512062da4f67	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	a081caa0-5184-4cab-96dc-f6c6601a67d8	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
d68d11c4-e6ca-4f42-b1b8-a39fad3ed851	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	d1b8dc06-58c0-46cb-932e-0bd1909afeef	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
08cd0562-a344-403d-89cc-4236cf2c2fc5	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	3726f467-8872-4e1f-9ba2-374a59cc176a	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
2466be3d-626b-4af6-bf68-53d4f2cad25a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	c6a7b73f-0e96-4e06-8d65-38948045c58c	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
ec3c0409-f84b-4f04-a1f0-0c2ec193516a	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	51d56b56-6de6-4a70-acac-941904743202	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
3656e5c8-01ba-4f2e-8cac-d6b248f281fe	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	260dea68-39b1-4b08-a86c-d8a1467a4f78	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
789c9bf8-2b6c-4de4-a3f6-481cdc27f7e5	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ea12ef62-4ab0-45de-9800-050b9ff38ea6	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
69434116-8ba7-45dc-92b2-a716368b1390	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1b28039e-3936-4677-9746-41a8bf36fbcc	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
3388af5a-564f-407b-8283-3d84b48221be	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4b7be85f-fa73-4690-80a9-134396072ea1	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
3df6436c-44e4-4ab7-be25-fc1b3a6849cc	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a4b081ad-6b6b-49e4-a137-02aea607baa8	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
fc5294f4-9e32-4706-a823-c8e696e3a5f3	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	39b03a84-d4d6-4459-8a96-e4197e7c1b62	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
3756360d-0ba8-4daa-a3fd-0e9ee1d45ff6	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	80e781ff-f974-4cde-a397-b4d20f7b7cea	\N	2025-03-17 11:48:00	\N	\N	0.000000000000000000000000000000
c7aa7f80-8b84-4fac-8816-170b2932759b	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bfb9721d-cb5d-471f-83c1-8f6acda80079	\N	2025-03-17 11:48:00	\N	\N	0.000000000000000000000000000000
02305351-6d27-4401-aada-60d9ff2169f7	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	90d62fb0-336a-4b21-968b-ee74556f8688	\N	2025-03-17 11:48:00	\N	\N	0.000000000000000000000000000000
cfa81c3c-341d-4f76-90c8-14ef1305f7b6	c21f4b63-85fe-40da-ba6c-e96061234e60	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	218893c7-8e8e-48c1-9fcf-d650a208d3b7	\N	2025-03-17 12:20:00	\N	\N	0.000000000000000000000000000000
104e7dff-ac11-4107-9d91-cc5727df767d	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	e24613b2-3592-4332-a332-361d72a6e948	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
77755518-80f8-4834-a274-28b87c93ce45	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	8985e007-5aea-41ae-83d9-104ff755fca3	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
9c300b2d-0ae8-436b-9e22-d1b22af65843	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	74a33cba-fc25-46a5-a998-f04326faa001	\N	2025-03-17 12:56:00	\N	\N	0.000000000000000000000000000000
c9cbd907-33ce-4df8-826f-f9295c73e26b	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	4a5aa9ad-3a59-4594-8ad8-da7796878eb8	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
4e1d4bda-b60a-413b-97f2-3ec6754e0967	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	ee54808d-253c-4cbf-876f-81420a6ebd64	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
d9c38e02-d9e2-4dda-9f7f-10ad5b837386	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	a081caa0-5184-4cab-96dc-f6c6601a67d8	\N	2025-03-17 13:11:00	\N	\N	0.000000000000000000000000000000
c8a511f3-8b2e-4c4f-9d6f-0471bbb71f06	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	f1d08523-5712-47ce-9b39-f862f5cbc0b1	\N	2025-03-17 13:13:00	\N	\N	0.000000000000000000000000000000
13cda2e1-5a9a-4075-bf1a-9a4523b7263a	54b4ceec-7c75-4aff-8b08-6333b1849cf8	f3588791-91aa-430c-9d12-d8c43892c4cd	\N	\N	2025-03-11 14:20:00	21.000000000000000000000000000000	\N	0.000000000000000000000000000000
b46a19eb-67fc-4f2c-a892-ac67ef380b83	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	2a8a107c-523a-4d99-aeaa-9925b85bc8c2	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
5f9ee918-8373-4a9e-a516-6aa639579209	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	0f3189b2-bbd0-4729-86f9-f0af994e9fb3	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
0597e69a-3076-40b0-8415-28a47dbc01ed	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c873be22-757a-4150-9331-24c138246bae	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
04dd82ee-5035-4ce5-b5db-1fb06b5b0b9b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ae0397c6-4b2c-4e6f-9c2a-732ec396c598	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
9e229573-5098-4049-ac9f-261e775d05d6	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	d39f621b-b7a2-42f4-b9a1-6c75e8ac101c	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
0e7c78ed-3d93-404d-aba2-bb712922e522	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f791d191-82f4-4cc5-b9a6-5479f2d2ee5d	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
7aea2dd2-b823-47b6-b1b3-072a0ce777c0	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c9a5cac5-ed26-46ba-ac18-1bee0edd3588	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
d6aff599-7139-4070-a2e7-eb398a34f8a0	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	84b66909-d79c-4906-9c86-7f3d24139942	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
24ef1cc3-1a53-400e-8e29-85ab9dc99d19	72daa82f-9f4a-460b-b940-e0918910c3db	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4ca68895-7403-4bc5-a812-820fc8c6a2dd	\N	2025-03-17 15:52:00	\N	\N	0.000000000000000000000000000000
1c446994-397b-43f6-8ff4-0cefe0ca8e9b	72daa82f-9f4a-460b-b940-e0918910c3db	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	46c504dc-bbbc-40c8-8da3-119a22e379ce	\N	2025-03-17 15:52:00	\N	\N	0.000000000000000000000000000000
a6dbab7f-41c8-4aac-9cf6-643bf8dc5b5b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-18 09:17:00	\N	40	0.000000000000000000000000000000
c7013a51-7392-49ec-937a-e1ed35c82801	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	4092c9d7-0d27-4f8b-b709-2d034316cf9f	\N	2025-03-17 10:15:00	\N	\N	0.000000000000000000000000000000
17c3ba3e-788e-4c31-a5fa-0632d1af3b8e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	009b99f8-c02c-4332-8b7d-222aab1ac91b	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
ae887e97-29a0-4201-a4cc-17facb28e7c9	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a4387687-5053-4bc4-894b-5adb3b53b54c	\N	2025-03-18 12:58:00	\N	\N	0.000000000000000000000000000000
86ce9375-6fad-4b94-b4c3-6b9c6997cf88	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	65f6fb36-a693-46d0-b51c-eaf476660e8a	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
888c7395-0d99-4658-8149-459a01827485	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	479e767b-b238-45ae-8451-d722372e30bc	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
6f0df01f-3448-43cf-9734-779cda5a0e41	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	07e23ad7-52e6-41c2-bd42-694582dabdf2	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
377514eb-4ae2-4cf9-a5bc-058d73ba16d2	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	a1c53153-0c6a-44d9-a114-f890828648bf	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
6bcfa0ff-55a0-4bcb-8a06-8904707a0a6c	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	797368ee-d7fa-438b-b06e-b60c67479032	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
e9cf91bb-3864-4d96-a684-752f2ff5721e	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	aa501665-626a-408b-90f6-5bd87b7f54f1	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
0feaa077-4341-40fa-b3cb-dc5b3a648865	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	5a713f0e-8a71-47be-88b7-c158afd7856c	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
79951c6e-b03c-41b3-886b-4172ff8211f4	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e0ffc428-a86d-4a6a-856c-30baae712e64	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
aca0e2e3-156a-4c92-b75c-2c29402304c6	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	37c6aba9-e209-440e-b230-f55022802352	\N	2025-03-18 15:57:00	\N	\N	0.000000000000000000000000000000
5f32a970-1260-4432-a4ac-3612e3e26fe6	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fcf4d541-421c-4987-b95a-f49949ddbbac	\N	2025-03-18 15:57:00	\N	\N	0.000000000000000000000000000000
bef3497c-d8f1-4072-acb8-6b13ec8c1170	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	37c6aba9-e209-440e-b230-f55022802352	\N	2025-03-18 16:33:00	\N	\N	0.000000000000000000000000000000
82fe3eda-45f8-4da7-b3f8-9c7ca5179bc6	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	feebff86-7409-49bc-86f8-a27bcd3e8a6b	\N	2025-03-16 11:41:00	\N	\N	0.000000000000000000000000000000
66fc472e-2ac8-40e6-a9fa-7b752767655a	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f83dd9dc-10fe-4e85-aa3e-ca79a0d17271	\N	2025-03-17 11:48:00	\N	\N	0.000000000000000000000000000000
2bf4b619-2412-4612-a532-2f75a26ea63a	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f18ccc1b-3155-4484-a937-9bbc86c895ed	\N	2025-03-17 11:48:00	\N	\N	0.000000000000000000000000000000
30d9711f-f646-46f7-a483-3388b8f79e85	c21f4b63-85fe-40da-ba6c-e96061234e60	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	873a7cc6-5046-482f-becd-20cf731a5088	\N	2025-03-17 12:20:00	\N	\N	0.000000000000000000000000000000
bf498500-3e7a-4895-99e8-f6e7dd392e97	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	f1afec29-3685-4132-8230-b7d39ce4d9a3	364282fa-7253-4420-b2bc-4e12e51985f9	\N	2025-03-17 12:50:00	\N	\N	0.000000000000000000000000000000
88c4debd-7c09-4387-9f37-48f80b1fe2b0	c21f4b63-85fe-40da-ba6c-e96061234e60	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9b8a4fb7-9095-4b89-85fe-7f6029f6bd48	\N	2025-03-17 13:08:00	\N	\N	0.000000000000000000000000000000
0d316af2-ec80-4a56-85e1-c1237884f9b7	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	36fe0791-bd99-437f-b0eb-62d884cbfb30	\N	2025-03-17 13:13:00	\N	\N	0.000000000000000000000000000000
af558e6b-fbbf-4843-a1f5-9956aae946be	54b4ceec-7c75-4aff-8b08-6333b1849cf8	406f31ba-96a2-4328-aca2-2ead65149553	\N	\N	2025-03-12 14:20:00	6.000000000000000000000000000000	\N	0.000000000000000000000000000000
4613d85d-a128-43ec-a0a4-259ca89ba0b3	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ffea8819-4b03-4592-bd3f-ee0ded58ab97	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
425262c1-8140-4cfa-bc5d-aa0c0e49822f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	774c26fe-4d31-4326-a372-b57fe7ecdf27	\N	2025-03-17 15:20:00	\N	\N	0.000000000000000000000000000000
63384d00-d59b-4142-a5a0-b212155db4f7	72daa82f-9f4a-460b-b940-e0918910c3db	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	40579df2-4e3b-4462-8c05-b7f46b12e9b0	\N	2025-03-17 15:52:00	\N	\N	0.000000000000000000000000000000
eaf6b88e-072d-474c-b60f-93ea04cfe520	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	658362fb-1b9a-4f9e-bc08-55bea8df4ea5	\N	2025-03-15 09:20:00	\N	\N	0.000000000000000000000000000000
665213a1-fe2a-425f-ad00-15f5816437e7	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ed4bbea1-f970-475f-980b-193c8568a4be	\N	2025-03-15 09:20:00	\N	\N	0.000000000000000000000000000000
95859a88-1ad3-4748-b5d1-93e771f46397	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0eba2acf-ca9c-4a2e-bf6e-7083d1cbc258	\N	2025-03-15 09:20:00	\N	\N	0.000000000000000000000000000000
7b220c82-28c5-458e-94e7-6b22276318ae	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	8a7d8753-a54a-4b10-8a72-1e11ca415b5b	\N	2025-03-18 10:32:00	\N	\N	0.000000000000000000000000000000
23310238-2611-4324-8756-b496beb8e969	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	89216a31-f050-4032-9a47-3f844451becd	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
2614c130-8072-4dae-8651-8bad4a091f9b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	61bce086-4d3a-430b-bfa8-87e4f1d29a08	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
f5f0d6f0-0b68-47be-920a-2268178c811e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	d7b35298-f8c8-44b0-a9da-767e035c4a63	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
a9bb26b4-e3a6-4080-b885-048c0a855c50	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	182c2e51-4702-4273-ab5a-7c64200c0746	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
4f49c2b6-8335-4613-99b8-be1b26f6e9a4	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	87f66827-72ea-4601-8074-90df4112bf9e	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
2b6a2391-9ddb-44ed-8050-dca64bf47676	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	9366d779-11b6-4127-9097-420789813a8a	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
98f577af-c402-4121-b424-7b402b6031ff	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	6ea77c7f-1c8f-475e-aeab-4313638d964d	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
77d91ba9-2f2a-4f4c-94a3-15f36f079a80	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	78532087-872d-464c-b15e-6a60134e3922	\N	2025-03-18 11:51:00	\N	\N	0.000000000000000000000000000000
0c49ebfb-d744-4455-baac-61b65b7b6226	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	dd902aca-2a6b-47d7-9a55-83ebd5e6af79	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
4cbf88e2-0fbe-48a7-8ba4-cea4e1c55181	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	bad7a9f0-4b12-4a69-a931-d08380e575e8	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
56281032-9a40-4d7a-94e1-e7e5be03651e	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	bbafa0b4-6b4a-45c4-8357-f455f20ae06d	\N	2025-03-18 12:57:00	\N	\N	0.000000000000000000000000000000
d6d08dcc-77c1-4ecd-af9c-58dd040bfcd3	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	13a49993-4583-4168-b8cc-9528b8e8452b	\N	2025-03-18 14:36:00	\N	\N	0.000000000000000000000000000000
b1245070-0029-4ef0-8efd-6bfd5c4eb6b5	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4286b3c9-c585-40d2-82fe-f40981b68d1d	\N	2025-03-18 14:36:00	\N	\N	0.000000000000000000000000000000
9f21e227-f2e8-483c-b584-63e3c344b664	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1bcad361-f303-40f5-be1f-ab3f2e1ff288	\N	2025-03-18 14:36:00	\N	\N	0.000000000000000000000000000000
e5bb04e8-e447-4cc4-a09d-8fb98bb8b18f	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fbdb7cd3-8ab9-457e-bb69-d91b091867f7	\N	2025-03-18 14:36:00	\N	\N	0.000000000000000000000000000000
ab0d312f-1e1d-4276-a407-7d2939a3ca04	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b0f32ebd-b420-4d2a-9c06-3397eedb4ea0	\N	2025-03-18 14:36:00	\N	\N	0.000000000000000000000000000000
8cf48a8b-3eab-43df-bcd9-9c468c520211	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	ca2b58c3-1725-4f12-9142-6b8e5e4bb211	\N	2025-03-18 15:05:00	\N	\N	0.000000000000000000000000000000
145d2138-e65b-4c69-a209-8cb7fc1af5a8	72daa82f-9f4a-460b-b940-e0918910c3db	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-18 15:10:00	\N	11	0.000000000000000000000000000000
08bc4509-5e92-47b3-9ee2-431f9a1b98d9	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e2c27354-3f8d-4975-9b4e-f3857917e45b	\N	2025-03-18 15:16:00	\N	\N	0.000000000000000000000000000000
01589172-868f-4c90-84ac-215918dfe13e	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	\N	\N	2025-03-18 11:49:00	\N	\N	0.000000000000000000000000000000
00ff1a08-a318-47ef-8d53-bfa133c84206	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-11 15:37:00	\N	21	0.000000000000000000000000000000
28144bbc-7509-4e44-9ad5-102edbeacda5	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-11 15:58:00	\N	80	0.000000000000000000000000000000
6359f91c-8dae-4df1-86ff-d57c186ed23d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-11 16:00:00	\N	3	0.000000000000000000000000000000
9a954dc4-71af-4a8c-90a6-0f92b4b3ec15	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-12 15:38:00	\N	32	0.000000000000000000000000000000
bb14e3fa-dbcb-431a-a28f-d4fbf330fd2c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-07 15:58:00	\N	41	0.000000000000000000000000000000
26708232-e34c-4723-bea0-2194faa17bdd	76269788-c718-4340-bd29-6634790ddddc	0290a525-b422-4a2d-9a9c-48a0ed38de78	\N	\N	2025-03-07 16:56:00	6.000000000000000000000000000000	\N	0.000000000000000000000000000000
0aa9b0fe-6a6b-4f9b-a472-26e829799e42	76269788-c718-4340-bd29-6634790ddddc	cf2f35ed-f1c6-424e-80b8-04fc1a082a60	\N	\N	2025-03-10 16:57:00	7.000000000000000000000000000000	\N	0.000000000000000000000000000000
ba701086-daf1-47fe-b893-f59291b668e1	76269788-c718-4340-bd29-6634790ddddc	cf2f35ed-f1c6-424e-80b8-04fc1a082a60	\N	\N	2025-03-11 16:58:00	2.000000000000000000000000000000	\N	0.000000000000000000000000000000
d4475a5f-b4c6-4bc5-abd0-5318b9b9284e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7456c229-7da8-42a9-b3bc-97014383302d	\N	2025-03-14 17:35:00	\N	\N	0.000000000000000000000000000000
1e99b315-d6f8-46c3-a00b-e4c0a4b353e9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3ec95bbe-0b3b-4af7-ba25-f78e1edacecd	\N	2025-03-14 17:52:00	\N	\N	0.000000000000000000000000000000
6035450f-2817-4c4f-b1c6-c8a2aefbe2b9	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-14 17:51:00	\N	35	0.000000000000000000000000000000
7fa61f97-6421-48bc-88ee-443c9a53486e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a3df2442-c261-4de7-bde3-fb42f86e8f11	\N	2025-03-14 18:45:00	\N	\N	0.000000000000000000000000000000
c6f1c578-7076-44a1-8337-69196a3d9499	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	19fdeb63-b801-4314-a4ce-c704059948d1	\N	2025-03-14 18:45:00	\N	\N	0.000000000000000000000000000000
60d95c0b-1214-401d-a9e8-94d56bab538d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	65231940-0759-434a-96b7-3dc15a03336e	\N	2025-03-14 18:45:00	\N	\N	0.000000000000000000000000000000
5fc150ba-3094-4e5c-b0c2-e1f1e8894aca	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	fed79343-1c21-433f-9d45-390cd4003d69	\N	2025-03-14 18:45:00	\N	\N	0.000000000000000000000000000000
9fa8bd45-b901-4d30-b2d8-970a6ca51b91	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f6c1869a-ef18-41aa-a7c1-7d5f3153790e	\N	2025-03-14 18:45:00	\N	\N	0.000000000000000000000000000000
f7d8dafa-0576-4630-8525-ab85c90b6757	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	d3981126-c996-457f-9b9a-2421e3f2aa9e	\N	2025-03-14 18:45:00	\N	\N	0.000000000000000000000000000000
37a540bc-95ba-4757-ad33-2f66f721b505	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	479e767b-b238-45ae-8451-d722372e30bc	\N	2025-03-14 18:54:00	\N	\N	0.000000000000000000000000000000
eaa7def9-5a08-4a22-9b7b-465d9fb73dd5	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	18b1be25-b82f-4016-be4a-24ad1211dbcc	\N	2025-03-14 18:54:00	\N	\N	0.000000000000000000000000000000
8763cc2b-4053-4d7d-8022-5d03c6d7a1ae	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	9d4cee0f-b79b-4ce2-9e80-ea96dbf7763b	\N	2025-03-14 18:54:00	\N	\N	0.000000000000000000000000000000
c1c8bdd0-6b94-47ed-980f-bc61f8301331	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ce5e7b34-5efe-4ba9-b460-c135588b088f	\N	2025-03-14 18:54:00	\N	\N	0.000000000000000000000000000000
337ce62b-ac1a-4e47-9331-34ec990d6575	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	bad7a9f0-4b12-4a69-a931-d08380e575e8	\N	2025-03-14 18:54:00	\N	\N	0.000000000000000000000000000000
19902d84-96b0-4c37-adea-6213b99993c2	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8eb6c572-5b1a-47b4-9ea6-b1e31f84815f	\N	2025-03-14 18:54:00	\N	\N	0.000000000000000000000000000000
cb6ed60a-46b9-4b09-944b-9abaa6732e26	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	412bc072-99ba-4811-a2d9-9e1bd1f49705	\N	2025-03-14 18:57:00	\N	\N	0.000000000000000000000000000000
e440990c-ec44-4667-b74c-65df5da8b1c0	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	751c6384-02dc-45b1-9df0-81fb810e2301	\N	2025-03-14 18:57:00	\N	\N	0.000000000000000000000000000000
de94ea60-6ab2-431e-a840-3e2ccab2b30c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	93975bc5-c8f0-4c51-86d7-29926d2f24b9	\N	2025-03-14 18:57:00	\N	\N	0.000000000000000000000000000000
3e936b7a-6620-4963-94a1-c67f9e1f3f82	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7d9981a3-b99b-4036-85ec-2ddc6517bf42	\N	2025-03-14 19:12:00	\N	\N	0.000000000000000000000000000000
bf4be59e-ada6-4cb3-a148-66503684c063	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e5fc2cb3-7620-4112-be4b-a1abddde0365	\N	2025-03-14 19:12:00	\N	\N	0.000000000000000000000000000000
a6639af0-b4c7-42a9-aa85-93551b64c61b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	33b56818-edf7-42bd-93d3-fa92f66274fa	\N	2025-03-14 19:12:00	\N	\N	0.000000000000000000000000000000
ec970ed4-f2b7-4ab4-acbd-a85857a250e8	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	4dac4fab-0b3f-47f4-8039-5eb68885b867	\N	2025-03-14 19:12:00	\N	\N	0.000000000000000000000000000000
05e5ded2-e513-41a5-a3d1-46fe366e7604	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	74a33cba-fc25-46a5-a998-f04326faa001	\N	2025-03-14 19:12:00	\N	\N	0.000000000000000000000000000000
87c228c4-f96d-4e38-bb0e-97ff872c8aee	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	98525d40-eee6-4aeb-bd86-2cdeecf6f444	\N	2025-03-14 19:13:00	\N	\N	0.000000000000000000000000000000
efbaf7e4-2fc8-488c-8368-20ad6d71d2fa	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e2d7e9d4-dcb8-47bd-b745-b9dc380cc1a3	\N	2025-03-14 19:13:00	\N	\N	0.000000000000000000000000000000
a271925e-8154-45e0-835f-6024b72f2f6b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a1be233c-73f5-441a-8406-af1669469c73	\N	2025-03-14 19:13:00	\N	\N	0.000000000000000000000000000000
fae058c3-9bc1-4ebf-bcec-f33ce750f681	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	1614bb2d-bc03-4b20-9f62-9457f3f56e34	\N	2025-03-14 19:13:00	\N	\N	0.000000000000000000000000000000
56c7a29f-54db-4594-82fd-0deda15388fc	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f8e2af02-0e7b-49a6-8905-e3b873f0469f	\N	2025-03-14 19:13:00	\N	\N	0.000000000000000000000000000000
c9318670-e30b-458e-9ffd-d579e20e9cbf	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	44a24f03-8bbf-4002-b4ce-a7ac6ad21926	\N	2025-03-14 19:13:00	\N	\N	0.000000000000000000000000000000
de8fe67f-07dc-4603-bcec-0ed6639bf4e1	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	364282fa-7253-4420-b2bc-4e12e51985f9	\N	2025-03-14 19:13:00	\N	\N	0.000000000000000000000000000000
9f5840eb-3323-452d-b1be-e54de4c66d83	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e24613b2-3592-4332-a332-361d72a6e948	\N	2025-03-14 19:13:00	\N	\N	0.000000000000000000000000000000
e05bfc8e-d16e-49b8-b1b2-659973ffb67e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8985e007-5aea-41ae-83d9-104ff755fca3	\N	2025-03-14 19:13:00	\N	\N	0.000000000000000000000000000000
a8fb5cea-2940-406a-9b46-e32767cd1c61	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f69dd59d-a3af-4519-a7c5-a9cd7d7aef8e	\N	2025-03-14 19:15:00	\N	\N	0.000000000000000000000000000000
f66df0a4-34e6-4c75-8991-620f20de9ec9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	86d850c9-aab5-40f8-8b92-c78a8d676861	\N	2025-03-14 19:15:00	\N	\N	0.000000000000000000000000000000
a69c2ae7-dba9-4583-ba83-9bd6ea4c0237	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	b8a5def4-3743-4bcb-85d6-0dfaef34861a	\N	2025-03-14 19:15:00	\N	\N	0.000000000000000000000000000000
e54aad4c-820f-4302-a436-c789049d9b50	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c7b9094d-7b2b-4e6c-bfd0-9ff0b27e50cb	\N	2025-03-14 19:15:00	\N	\N	0.000000000000000000000000000000
fa5d5d59-51cc-41f0-a2ea-485575d61066	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	542f9cbd-3754-459a-8f89-53dddfb068db	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
42346b95-d5a7-4656-a217-eaea894985fd	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4cbd9cc6-da15-446e-8790-7fb11569e41f	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
98c8aca0-56d4-4d1e-9bec-177339b0ce60	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	14e7f593-78ef-4a0e-932d-e494cb9b67e3	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
b2db74d9-ec71-44ed-b025-9e8324ab9d0a	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	d3118a3a-2929-40fb-8ba9-3cc1d3f5144a	\N	2025-03-15 20:00:00	\N	\N	0.000000000000000000000000000000
b47eddeb-45a8-4ed7-bbbd-9502b279ef23	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ebd7c4b8-1263-4177-a75d-a7cd0f722b87	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
e1e1a9cc-5851-4c52-8c66-498b6bf9b386	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e0ab9d68-aecb-4f5f-bc23-d5ac6c400fad	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
126dd3f0-7835-4545-856d-de7cc0f3bfb1	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	1d357105-a6c6-499a-af09-f9160e2d478b	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
8acc9871-0b31-4f4f-a9f5-e3752a9eea42	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ac41d8ea-e738-419e-a693-56f2f8a423d9	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
56b8e3df-0a89-4e6e-89bb-8404b41bf7f8	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fae0fe25-a965-4f09-8c33-e88baca7a64b	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
6a64838f-2c78-4abc-a21d-f147ed8bd8e1	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	61bce086-4d3a-430b-bfa8-87e4f1d29a08	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
02e58fb7-bc34-48da-8693-f41899dae208	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a3068a89-90a9-4327-8e3d-2c5ca0b30e4b	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
0af1eba3-f562-4301-a661-7b4482b3e5e3	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fd52e3a7-a30b-4647-822b-57206fd5388f	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
4bfffc85-e256-44d2-bdd5-533ec262935b	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	828b3c79-f2e8-4b43-b544-8c32d7048d9c	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
7c65ae1e-f900-409c-b2f4-9c4b81e7317c	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	06d5e6ac-8a7c-40f8-8069-65b26a142a6b	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
cf07010a-e47a-4742-9c29-577e3f299165	76269788-c718-4340-bd29-6634790ddddc	f1afec29-3685-4132-8230-b7d39ce4d9a3	bbafa0b4-6b4a-45c4-8357-f455f20ae06d	\N	2025-03-13 10:08:00	\N	\N	0.000000000000000000000000000000
06fd7639-647f-4d14-b5bf-358974f13bf2	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8a7d8753-a54a-4b10-8a72-1e11ca415b5b	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
d04882c6-bb4d-4811-b876-f3ac6efe2380	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	1bd6ad93-a944-4fad-b979-40be6f237849	\N	2025-03-15 20:00:00	\N	\N	0.000000000000000000000000000000
047b4a94-d207-4967-8fe7-0832a87cfed4	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3be028d9-01a3-4ab9-a1f5-9c05aff3e2d7	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
4f425169-d6ef-46d8-b095-0c3a59d7e6ce	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	d24ca3d6-4562-4d12-9daf-cdbc11df1ff3	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
e114a3eb-0a8b-45a2-9c9a-1b4005a6b9fa	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7ddba26c-08f2-4181-8ec6-982f51a57743	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
b8e0e7aa-a067-4c37-887e-19e529186fb2	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9dd3c831-e3fc-435a-92f2-d7376b3bae0b	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
dab9d69b-1726-42ed-beef-6628e27f0d19	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	97c72fb4-f254-4cda-901b-23216aff55b7	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
24858ab5-1415-4b70-b81f-7fb0b76e1299	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cb526458-ae1f-4a84-a7a9-e7031f612074	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
6066f305-1e8a-43d6-94c0-d36a3a6c895f	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	07874060-cff6-40ec-9b52-ec7121ef8051	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
6fec31a1-8585-4f7f-91ae-4c947a7084c9	76269788-c718-4340-bd29-6634790ddddc	f1afec29-3685-4132-8230-b7d39ce4d9a3	6383b850-30a2-4fc8-942d-7639fe4bc4c0	\N	2025-03-13 10:08:00	\N	\N	0.000000000000000000000000000000
7d2090e5-db05-47e7-82b6-8c2e86680760	76269788-c718-4340-bd29-6634790ddddc	f1afec29-3685-4132-8230-b7d39ce4d9a3	69519a0e-1a44-442f-ba33-0c0a78f270f5	\N	2025-03-13 10:08:00	\N	\N	0.000000000000000000000000000000
33db5f56-7efe-4b2f-a616-77c8618bd736	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4a774c08-cfa6-4276-b39a-1f4266e2af24	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
50f3b8c8-5ed3-421e-8421-9527a1948a7d	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b454a4ea-9e07-42ec-a4d1-d4296fd4ef5f	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
733bd96a-e4fb-4ee2-91ed-51ad82106990	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	441e2985-08be-460b-99bc-29422a6330a6	\N	2025-03-15 20:00:00	\N	\N	0.000000000000000000000000000000
f2eddaeb-9166-47f5-991c-f80577a0a65e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	2a3c987a-729e-4b40-b887-0d1a49f55670	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
342962b1-3f03-4529-adf7-a20c675abbfd	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	69bfe62d-1e43-4caf-8ca7-66b59cf0945f	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
699387ff-c62f-4290-b9f1-ed23d96b76da	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bcefc7c3-f6af-417e-865a-6eeff78f928c	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
fbf9d56e-aea8-4582-8e77-176eb93d9272	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c46da7e2-d9b7-4402-ae77-ed1bacf11bf2	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
a934a7b2-6a12-4df2-83c4-a464389809bb	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fe5858af-d539-4e9e-bb94-e99f834bc71b	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
a7dc7666-8213-4ff8-9815-601cb19fb7f3	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	94d4fe13-aaed-4a41-b1b3-e2f4a6c7bc23	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
c258b400-1fb2-480a-b052-e39d2c63750f	76269788-c718-4340-bd29-6634790ddddc	f1afec29-3685-4132-8230-b7d39ce4d9a3	96431ba6-25c7-4474-9832-586672953cd6	\N	2025-03-13 10:08:00	\N	\N	0.000000000000000000000000000000
e80ee3ce-d520-4db0-b7b7-b7310f50e844	76269788-c718-4340-bd29-6634790ddddc	f1afec29-3685-4132-8230-b7d39ce4d9a3	aa501665-626a-408b-90f6-5bd87b7f54f1	\N	2025-03-13 10:08:00	\N	\N	0.000000000000000000000000000000
be53313a-2f74-454a-8372-f66ddf348b0d	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fab4c2bf-fb2f-4569-b149-5af5674d25fb	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
b018862a-0296-4574-b999-d43c32fd00d6	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	65f6fb36-a693-46d0-b51c-eaf476660e8a	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
866433c5-09d9-4882-bfb6-7f9c2c5f0c84	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	bcbdbccf-5f80-44c3-abc2-52dca2530751	\N	2025-03-15 20:00:00	\N	\N	0.000000000000000000000000000000
64a9ef55-9466-4b5f-b1a1-4031f48f2a3d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	76c316e9-683e-411b-8435-3db00497136a	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
2c7a5973-9a60-480d-9682-b3326e0af5b6	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	797368ee-d7fa-438b-b06e-b60c67479032	\N	2025-03-14 20:04:00	\N	\N	0.000000000000000000000000000000
f0089f65-778d-4a29-8de5-4602066abafd	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	640e79ba-ceb6-4639-9c63-5d7ae0bad4a6	\N	2025-03-12 20:07:00	\N	\N	0.000000000000000000000000000000
c25498bf-da0c-4546-81ad-c803364f25f1	76269788-c718-4340-bd29-6634790ddddc	f1afec29-3685-4132-8230-b7d39ce4d9a3	f323147f-dc1c-4116-b9f9-08994fbc61ce	\N	2025-03-13 10:08:00	\N	\N	0.000000000000000000000000000000
30bdae16-c6ab-4785-a3a2-9c211682c519	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c3e39e97-511d-4a67-b917-8c71b8529aca	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
820d717b-9585-4b22-98e5-a04954543605	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f323147f-dc1c-4116-b9f9-08994fbc61ce	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
3207a497-fcdd-4755-ab92-7aac91e568e1	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1614bb2d-bc03-4b20-9f62-9457f3f56e34	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
07ce08e1-8717-48d9-86b7-229bdb580ca7	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bbafa0b4-6b4a-45c4-8357-f455f20ae06d	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
6d318148-f8c9-4392-bcef-b2812bd21fac	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	e735a3d4-274d-4c51-a981-2e4061a9e557	\N	2025-03-15 20:00:00	\N	\N	0.000000000000000000000000000000
b4738490-6dc4-4246-b9fd-cd21e3e5f894	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	65e7aec2-0754-4dc0-80f4-b1e132be3ec9	\N	2025-03-15 20:00:00	\N	\N	0.000000000000000000000000000000
093dfa36-8c89-40f5-9557-044b53a0354c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8a7d8753-a54a-4b10-8a72-1e11ca415b5b	\N	2025-03-14 20:23:00	\N	\N	0.000000000000000000000000000000
fcfba719-44af-4046-bb15-1eef3b55e09c	76269788-c718-4340-bd29-6634790ddddc	f1afec29-3685-4132-8230-b7d39ce4d9a3	3726f467-8872-4e1f-9ba2-374a59cc176a	\N	2025-03-13 10:08:00	\N	\N	0.000000000000000000000000000000
c860dfcc-d4ce-40ff-b3fa-4fbcb126f19e	76269788-c718-4340-bd29-6634790ddddc	f1afec29-3685-4132-8230-b7d39ce4d9a3	6dac48c7-4f4e-4e3b-b4e0-0007a2531cf6	\N	2025-03-13 10:08:00	\N	\N	0.000000000000000000000000000000
15fafe5c-bcf7-48d9-94ad-73ef57adbbac	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fae46393-32a8-4d5d-8fa2-f5c7f54cff95	\N	2025-03-15 15:35:00	\N	\N	0.000000000000000000000000000000
29d39c86-c26c-4e27-a05c-d88048b24e37	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fca2efaf-aaa7-4f57-a79b-b2d97c45722a	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
fdc51429-8428-4f22-9e96-38e717f66a56	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8d6da4e9-0b7f-4dd5-98ca-32f6f8c13486	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
bf4ea384-6644-4fb1-928e-6eb0a994e619	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8f8d80a4-89cc-4bac-8a04-9d34835db309	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
8f424f8f-72fd-4ef4-aacb-60945f839015	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e735a3d4-274d-4c51-a981-2e4061a9e557	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
78682693-bf7d-4cd1-a9d4-fc8a77d12a8e	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	65f6fb36-a693-46d0-b51c-eaf476660e8a	\N	2025-03-13 15:42:00	\N	\N	0.000000000000000000000000000000
f8d1b6d5-a917-4b9b-81b7-177a9e160612	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	4cbd9cc6-da15-446e-8790-7fb11569e41f	\N	2025-03-13 15:42:00	\N	\N	0.000000000000000000000000000000
7089d14a-1b5c-440a-be0c-9e60146195e8	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	dac90798-e4d8-4b23-a871-307fe2661b3b	\N	2025-03-15 20:00:00	\N	\N	0.000000000000000000000000000000
940457cc-9d6a-44f6-a9a1-c130f9428056	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	afe243bd-2e38-40fe-b9d1-dde7a5c177ae	\N	2025-03-15 20:00:00	\N	\N	0.000000000000000000000000000000
7d3d2581-f4c6-4c31-8576-d557391a96ed	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	6953b2c8-01a6-4e7f-a809-d3aeac589ec0	\N	2025-03-15 20:00:00	\N	\N	0.000000000000000000000000000000
163f1192-63f5-4870-97ba-c7a3714023b8	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	41482a61-e322-42ef-a5fc-6d525c2542a6	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
1e28ffe3-9f8b-4ce7-b7cf-c466a7fffcf7	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a733b4f4-38c9-4720-8388-4dc47d1343de	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
ee448009-e33c-4ef7-a853-cd874ec50df3	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a51c1b7f-9f48-4ff0-ba6d-e9ddd3c0eab6	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
ba1b80f8-289e-48b6-8545-684abc0bc3ec	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a3ab5bd5-e345-4cd7-8c46-998665bb3e05	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
a3ba331b-2a1a-4de4-a142-ed12e3d7c1c9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	bbafa0b4-6b4a-45c4-8357-f455f20ae06d	\N	2025-03-10 20:33:00	\N	\N	0.000000000000000000000000000000
aa923495-d071-4dff-8196-f243b76ad153	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	86feb425-d462-4b9c-9eb7-f4d2ff0c8696	\N	2025-03-12 20:38:00	\N	\N	0.000000000000000000000000000000
0964cf3f-9b35-4f99-9c44-f9aa0f2b4e67	76269788-c718-4340-bd29-6634790ddddc	f1afec29-3685-4132-8230-b7d39ce4d9a3	a1c53153-0c6a-44d9-a114-f890828648bf	\N	2025-03-13 10:08:00	\N	\N	0.000000000000000000000000000000
18c895d9-0b7f-4c2d-a4f6-1e47956cab16	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fa95754b-4c40-4267-9432-53731574a5d3	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
2583566d-ac1f-419f-a35b-b5535150f62f	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a1c53153-0c6a-44d9-a114-f890828648bf	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
0da10dea-f13d-4b3b-8ee2-5934e322d558	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	dd902aca-2a6b-47d7-9a55-83ebd5e6af79	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
7c1e363f-bbee-4fff-97fb-83006daec484	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6dac48c7-4f4e-4e3b-b4e0-0007a2531cf6	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
89b4fc5c-629c-4d89-b8c2-c1c54374304d	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	93975bc5-c8f0-4c51-86d7-29926d2f24b9	\N	2025-03-15 20:16:00	\N	\N	0.000000000000000000000000000000
6dcbdd73-f4a2-4bc8-8d77-523a7b804885	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	8d6da4e9-0b7f-4dd5-98ca-32f6f8c13486	\N	2025-03-15 20:16:00	\N	\N	0.000000000000000000000000000000
f0d68c20-96e3-484f-b960-8b375b65212f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	9867c7ff-d3bd-4efc-b2b7-ea425350757b	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
c600125a-8983-4c2c-aa73-cee66fd5fa95	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3ce8216a-1065-4346-a89b-e72df6d96ce5	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
2389726f-be5b-4896-bb25-a27c0a4e656b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	dd902aca-2a6b-47d7-9a55-83ebd5e6af79	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
05721d6a-5582-446d-9c73-9d8eaf5f394e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7c236248-e0e2-4282-b9f9-29e938492539	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
a8670c57-6234-44f5-861c-1dcea1f74a87	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	6dac48c7-4f4e-4e3b-b4e0-0007a2531cf6	\N	2025-03-10 20:33:00	\N	\N	0.000000000000000000000000000000
6778fd14-4467-4900-b46e-b9002c513dd8	fd20320c-4120-4bd4-bd82-379fe35b122c	f3588791-91aa-430c-9d12-d8c43892c4cd	\N	\N	2025-03-08 11:50:00	8.000000000000000000000000000000	\N	0.000000000000000000000000000000
4e7ec870-1ae3-4ba7-85dd-f39e50d8e64e	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fb0a7aae-0c93-4022-a939-6d25bfd50f1f	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
bf958466-39fb-4a19-98f5-3562222a1c9d	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	dac90798-e4d8-4b23-a871-307fe2661b3b	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
324c699f-498c-4430-92a9-6b281241dd88	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a3ab5bd5-e345-4cd7-8c46-998665bb3e05	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
14669464-73d1-49f6-ae21-c3a536b8f5f7	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	aa501665-626a-408b-90f6-5bd87b7f54f1	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
69947fb6-890d-4d6e-928f-ef9f41f72b6d	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	26352e3f-39b3-4861-bd56-46280b0e7ca0	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
ad7c0965-bfe4-49a0-8297-3eb6e4e0d179	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	441e2985-08be-460b-99bc-29422a6330a6	\N	2025-03-13 15:39:00	\N	\N	0.000000000000000000000000000000
43c56c3e-9e51-477c-8bfa-b79a7e8b88c7	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	f037594b-dac4-436b-9b01-8c33936527ff	\N	2025-03-15 20:16:00	\N	\N	0.000000000000000000000000000000
6fe8b4bf-c4c3-4e0e-b87b-24c34ac2e560	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	d332d327-ef27-4775-9683-c23d324abbf4	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
2e4d58e2-1adf-4b3a-9f31-1ae7e47af099	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	aa501665-626a-408b-90f6-5bd87b7f54f1	\N	2025-03-10 20:33:00	\N	\N	0.000000000000000000000000000000
ab812985-88e4-4669-8e8c-1b20f6277033	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0a03a698-e5f6-45c3-babf-2f6bdac9cc49	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
f1518db2-a504-445c-a631-0bf8de5e78a7	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1ce1f86e-598f-4d6d-99d4-c21e625a6929	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
15604a41-67b4-44cd-a563-8396ce814c5f	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	b454a4ea-9e07-42ec-a4d1-d4296fd4ef5f	\N	2025-03-13 15:42:00	\N	\N	0.000000000000000000000000000000
ea2ccaae-aca3-4e35-b64d-45e3b3714116	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	c3e39e97-511d-4a67-b917-8c71b8529aca	\N	2025-03-13 15:42:00	\N	\N	0.000000000000000000000000000000
de5fd310-9ef5-45d7-ac4d-bd6f11e30c53	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	14e7f593-78ef-4a0e-932d-e494cb9b67e3	\N	2025-03-13 15:42:00	\N	\N	0.000000000000000000000000000000
2600c1e9-e0d0-4ce2-8688-59efe61cacd0	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	c6a7b73f-0e96-4e06-8d65-38948045c58c	\N	2025-03-15 20:16:00	\N	\N	0.000000000000000000000000000000
c0b9fca2-9945-4661-9df9-4f283fcf7db0	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	5f00191a-e560-43ec-8ec1-793ccf929ef8	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
750f0b39-2288-4bfe-9601-88cbd41bcb12	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	fa95754b-4c40-4267-9432-53731574a5d3	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
373fbc41-fb6e-4671-809c-e84e09a5f9be	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	26352e3f-39b3-4861-bd56-46280b0e7ca0	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
34903443-9b11-4823-bd61-697fd6d76c6b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	fca2efaf-aaa7-4f57-a79b-b2d97c45722a	\N	2025-03-11 20:30:00	\N	\N	0.000000000000000000000000000000
1b514a5a-797e-4982-b8da-31eef1831aba	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f323147f-dc1c-4116-b9f9-08994fbc61ce	\N	2025-03-10 20:33:00	\N	\N	0.000000000000000000000000000000
bb39c9ac-0b48-4e21-8ee1-dbb7cd0aa6d0	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1bd6ad93-a944-4fad-b979-40be6f237849	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
75e3c116-e50b-4945-9bdd-8ee7407f5c47	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4a5aa9ad-3a59-4594-8ad8-da7796878eb8	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
8dcb83d5-a2bc-4b10-9256-cb3ee3fa068d	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	4a774c08-cfa6-4276-b39a-1f4266e2af24	\N	2025-03-13 15:45:00	\N	\N	0.000000000000000000000000000000
622f6df2-04ab-454c-ba5d-cfd114b11d7e	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e62c2e3c-2995-4af5-a63b-fb5d58239718	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
025d9b3c-6210-4544-99c6-3eb6df190d71	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a1c53153-0c6a-44d9-a114-f890828648bf	\N	2025-03-10 20:33:00	\N	\N	0.000000000000000000000000000000
21beb001-29f9-442a-89ee-25f0efc221e6	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fb3514d3-4b69-4ac7-9ba8-2c0c7ad09ee9	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
79638fb5-5a22-46d6-8cf3-f55a7c12c33e	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a25147a7-50cc-42ed-bc93-b0f1ddb70a6e	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
cc77b90e-944a-43e9-a2c4-2fdaa6cfa584	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f5839b70-98fe-4102-95f8-a3015970f6a7	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
a0f8bc0f-d175-4d70-b9ca-0ebb9dd2cfb8	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fc532c16-f1af-4acd-98aa-b1f8c4a857e1	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
f1d5c4d0-99ad-4b92-80e9-3374eb581777	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	96431ba6-25c7-4474-9832-586672953cd6	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
8f00aa48-03bd-49db-81f1-167a8c4195f1	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bcbdbccf-5f80-44c3-abc2-52dca2530751	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
baf62adf-4b3f-48a9-a88e-120eb743e482	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bb6461e0-752b-43cb-9d11-5531e6d496d2	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
297bebeb-7ce3-4911-9bdd-5f84dbb95078	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	fae46393-32a8-4d5d-8fa2-f5c7f54cff95	\N	2025-03-13 15:45:00	\N	\N	0.000000000000000000000000000000
906488c1-bcde-4bf0-9e72-a1ccbd6df7db	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	542f9cbd-3754-459a-8f89-53dddfb068db	\N	2025-03-13 15:45:00	\N	\N	0.000000000000000000000000000000
5d679f30-8809-4338-bf41-58617a7a2c64	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e6a9f377-3d07-43b9-985a-fbbcc05f1a87	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
897d25d7-ea8f-4d5f-9065-f681072fd7ff	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3726f467-8872-4e1f-9ba2-374a59cc176a	\N	2025-03-10 20:33:00	\N	\N	0.000000000000000000000000000000
00dac22f-317d-44c3-a098-154338744b87	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	6383b850-30a2-4fc8-942d-7639fe4bc4c0	\N	2025-03-10 20:33:00	\N	\N	0.000000000000000000000000000000
872071e0-0592-4246-a97a-7315edfbdcab	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	96431ba6-25c7-4474-9832-586672953cd6	\N	2025-03-10 20:33:00	\N	\N	0.000000000000000000000000000000
b7cfbd00-3303-4cba-921e-12d491735991	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f008fc7d-cf2f-486f-852b-a2e88e86113f	\N	2025-03-12 20:38:00	\N	\N	0.000000000000000000000000000000
b89c18e3-2224-476f-9228-fbfab83032c1	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e212dbd6-6c7a-4b60-a2ad-c7280868a9de	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
32c36cae-50b3-4a40-a01f-43a23204fa81	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0a4c6115-9f88-4fb0-8086-f6f1ac57ce25	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
be722831-8a93-473e-8273-3cd499b355c5	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	94f2c522-108d-4c34-94c3-43c835a9d390	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
339d4ff9-9520-4fbb-a899-1276b3687163	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f037594b-dac4-436b-9b01-8c33936527ff	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
9586aa30-b6c0-42c2-b0bc-2fc0ab521385	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	36fe0791-bd99-437f-b0eb-62d884cbfb30	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
292c6362-ecc5-4111-af3d-201c4c676658	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8e34d7d4-6016-4999-ad80-a219e869cab7	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
e5834831-1b92-4717-a959-195f3bc2677b	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1cdfb879-1bdb-40db-a05e-09f4f52a6b1d	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
7042113e-d093-4aa9-b687-c41f9dcbf7fb	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	07e23ad7-52e6-41c2-bd42-694582dabdf2	\N	2025-03-11 11:51:00	\N	\N	0.000000000000000000000000000000
b6d5adda-3aa7-433b-9cef-bc68ca11110c	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6383b850-30a2-4fc8-942d-7639fe4bc4c0	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
a70f171b-b718-418d-b794-fe764cca0526	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	afe243bd-2e38-40fe-b9d1-dde7a5c177ae	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
1cc6c0b4-1310-458e-8040-63b68d39078b	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a081caa0-5184-4cab-96dc-f6c6601a67d8	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
a66f6caf-6805-407e-a42b-671e1d1d99a5	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f4c13db0-4d2a-4efc-af90-63d667521d86	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
65d07c03-7da6-4dfe-ade0-5331ae590ee1	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	21d970f0-e925-4a19-b17f-dd81ce6d9daf	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
ac59b7d6-5e02-4608-a6f5-028efc8156c7	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	37dd3c90-b0db-470c-bbf8-99467e275d1a	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
e424273b-a9d9-4e2c-9933-97e6fa311b34	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d1b8dc06-58c0-46cb-932e-0bd1909afeef	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
76d498db-3e34-4d35-b285-6be44ad3c9f1	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	65e7aec2-0754-4dc0-80f4-b1e132be3ec9	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
768cddbf-03cb-4680-a14a-61847a954430	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	69519a0e-1a44-442f-ba33-0c0a78f270f5	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
44c3d8a0-c504-47e1-92e7-285b71090fa6	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fdbd466d-50a6-41dc-8a7f-a159b7afdef6	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
37473a49-63c0-41d7-adb2-dbf684e3187e	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ee54808d-253c-4cbf-876f-81420a6ebd64	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
fc5fe8a9-a78a-426e-93bd-f8a2624079f0	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	eb54f7f4-a917-4957-bd25-d6b948b32052	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
bd4be5fa-4113-4fe7-9fba-ce913ce07fd9	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c48ff7d9-df4a-432f-90a7-c819ce939054	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
02867c8d-1fd7-4d76-bd76-396b7c87adcd	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ae36cc75-9261-4233-8a40-b7bab4768a39	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
3af26df2-3103-4c28-b63d-34adc34d23ef	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d3118a3a-2929-40fb-8ba9-3cc1d3f5144a	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
7c9a6914-7654-416d-8525-4be1c665e97f	5d759a32-b650-4801-9bdd-f5565943dc01	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f1d08523-5712-47ce-9b39-f862f5cbc0b1	\N	2025-03-13 15:46:00	\N	\N	0.000000000000000000000000000000
2cceadf7-893c-427a-a42c-59937be626bf	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c6a7b73f-0e96-4e06-8d65-38948045c58c	\N	2025-03-12 11:53:00	\N	\N	0.000000000000000000000000000000
73039d51-054b-4889-9a1e-88300053fdd1	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ffea8819-4b03-4592-bd3f-ee0ded58ab97	\N	2025-03-15 16:38:00	\N	\N	0.000000000000000000000000000000
b5cf5cd9-c542-4725-b204-88feb42de632	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	797368ee-d7fa-438b-b06e-b60c67479032	\N	2025-03-15 13:58:00	\N	\N	0.000000000000000000000000000000
1adbc17b-3371-440c-aaf6-8f0c57aad253	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2ccdfc5c-ed2a-4f09-83d8-251affcdc23f	\N	2025-03-15 16:38:00	\N	\N	0.000000000000000000000000000000
370d3472-0b0a-4aeb-b7bb-9133179c7ad5	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	d24ca3d6-4562-4d12-9daf-cdbc11df1ff3	\N	2025-03-15 13:58:00	\N	\N	0.000000000000000000000000000000
70b10e07-8729-4392-85d1-7efa97f6fc6b	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c873be22-757a-4150-9331-24c138246bae	\N	2025-03-15 16:38:00	\N	\N	0.000000000000000000000000000000
c498a3e3-71f2-4ba9-b0d9-79f16e7438d5	fd20320c-4120-4bd4-bd82-379fe35b122c	f3588791-91aa-430c-9d12-d8c43892c4cd	\N	\N	2025-03-15 16:40:00	4.000000000000000000000000000000	\N	0.000000000000000000000000000000
87907259-7944-451e-9b4f-f8ba3d141254	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	479e767b-b238-45ae-8451-d722372e30bc	\N	2025-03-15 13:58:00	\N	\N	0.000000000000000000000000000000
4aa94ce5-c743-46ce-a8a1-7ee463eee907	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d4b85bbd-2e35-44ad-879d-20aeddb99f5e	\N	2025-03-15 16:38:00	\N	\N	0.000000000000000000000000000000
c3fab6ce-2eda-4a5e-918c-afe72b95fdae	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	ce5e7b34-5efe-4ba9-b460-c135588b088f	\N	2025-03-15 13:58:00	\N	\N	0.000000000000000000000000000000
e226e57a-9ee8-4139-b564-3b385c3f2eaf	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9949fcb5-995d-4ce4-8177-b7aab0a3691b	\N	2025-03-15 16:38:00	\N	\N	0.000000000000000000000000000000
436d0b39-6b6e-473d-86ab-f425fa7536de	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	69bfe62d-1e43-4caf-8ca7-66b59cf0945f	\N	2025-03-15 13:58:00	\N	\N	0.000000000000000000000000000000
2970b6a3-cf37-44d8-a9da-1f66488a527c	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	763bffc7-0bd4-4393-b714-17e4cc997325	\N	2025-03-15 16:43:00	\N	\N	0.000000000000000000000000000000
b784398b-7fbe-481d-96b0-d016bf0eb04f	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	05c689df-f760-43e9-949e-14af70814138	\N	2025-03-15 16:43:00	\N	\N	0.000000000000000000000000000000
1a128e86-b4c1-434e-b7e7-f7e51c3671af	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	7ddba26c-08f2-4181-8ec6-982f51a57743	\N	2025-03-15 13:58:00	\N	\N	0.000000000000000000000000000000
146c3a0d-53f6-40c8-911c-34b8f4c6972e	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	8eb6c572-5b1a-47b4-9ea6-b1e31f84815f	\N	2025-03-15 13:58:00	\N	\N	0.000000000000000000000000000000
0b5a4c2f-a2d7-4604-8b33-4b60ffdd7723	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	bad7a9f0-4b12-4a69-a931-d08380e575e8	\N	2025-03-15 13:58:00	\N	\N	0.000000000000000000000000000000
af2d6069-38de-40b2-9a02-fa760b828e23	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9851a928-8412-45cc-84b0-edb006948221	\N	2025-03-15 16:43:00	\N	\N	0.000000000000000000000000000000
620199fe-354e-4781-97c3-ee066f902360	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9867c7ff-d3bd-4efc-b2b7-ea425350757b	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
d4df81df-8585-460b-b01d-1830b3357c1c	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c3739846-78cf-4eca-aecf-3a430766707c	\N	2025-03-15 16:43:00	\N	\N	0.000000000000000000000000000000
9bbefc4a-9ea1-44fb-9c04-0592058f7f8e	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4708aea0-01ec-4f5b-ad62-7da675b22c19	\N	2025-03-15 16:45:00	\N	\N	0.000000000000000000000000000000
72b00254-357c-4ae1-9399-41479a983906	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8eb6c572-5b1a-47b4-9ea6-b1e31f84815f	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
96be6f78-c262-4aca-8883-56082ef756f3	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	deeadf52-62d8-4aed-992f-2c634c544bde	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
4319408d-e1dd-41e5-a160-0cd9e945d272	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a94de110-cef8-4a08-b40c-2aa1d9b45bc1	\N	2025-03-15 16:43:00	\N	\N	0.000000000000000000000000000000
4b8c3133-14e5-4c67-b914-2de07b818235	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ae687765-c4e4-4367-9d20-7b6691da8706	\N	2025-03-15 16:43:00	\N	\N	0.000000000000000000000000000000
8b349aa8-13ea-4db1-b653-90555480c222	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d8d30b88-0225-467d-82ed-b4991c61e7de	\N	2025-03-15 16:45:00	\N	\N	0.000000000000000000000000000000
e625c113-26f0-4897-a982-9e827bce1f22	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	32d8f0c8-2812-4774-a2db-dec48765fbc3	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
8ab115ef-1324-48f5-8d7b-50bfac76f4f2	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	75773861-0f7d-42d4-afa8-e7a0cc3f24d5	\N	2025-03-15 16:43:00	\N	\N	0.000000000000000000000000000000
0612654f-5201-47bf-b850-0bb10749a7d1	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1e9b4eae-8e88-4cd5-ab20-2183f1ec1c37	\N	2025-03-15 16:43:00	\N	\N	0.000000000000000000000000000000
b5b0c85f-58c0-4a9e-a459-83946bbe289b	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	7dad6b41-4936-4d96-b676-4f83b8d21c81	\N	2025-03-15 16:45:00	\N	\N	0.000000000000000000000000000000
7566b6db-cd0c-4b92-9a8d-6d44f17be601	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	41482a61-e322-42ef-a5fc-6d525c2542a6	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
1eab56f9-e9f1-4157-8ef2-d2db1b763ab6	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4dac4fab-0b3f-47f4-8039-5eb68885b867	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
48a27785-2f4d-47b4-8054-fa1097a6b0f7	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	33b56818-edf7-42bd-93d3-fa92f66274fa	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
105545c5-4c51-41c0-88a1-c1f4dba828a9	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	74a33cba-fc25-46a5-a998-f04326faa001	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
19809b16-1221-48cc-ad2c-489f2fde0058	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	18b1be25-b82f-4016-be4a-24ad1211dbcc	\N	2025-03-15 14:19:00	\N	\N	0.000000000000000000000000000000
af5b9713-4e31-4e86-a31d-ab2a942b56b8	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	fb3514d3-4b69-4ac7-9ba8-2c0c7ad09ee9	\N	2025-03-14 16:54:00	\N	\N	0.000000000000000000000000000000
32318f92-baf3-4f2d-bdbf-7aabc9ba8970	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	7d9981a3-b99b-4036-85ec-2ddc6517bf42	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
a6ae3323-6e95-45a5-a5a1-457c5fa2867e	4ac2b819-a667-4371-9396-d42cb622a0ea	f1afec29-3685-4132-8230-b7d39ce4d9a3	9d4cee0f-b79b-4ce2-9e80-ea96dbf7763b	\N	2025-03-15 14:19:00	\N	\N	0.000000000000000000000000000000
3c5d8e31-4b64-42bb-882d-af16ee190d91	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	fab4c2bf-fb2f-4569-b149-5af5674d25fb	\N	2025-03-14 16:54:00	\N	\N	0.000000000000000000000000000000
46a100ae-46da-46fa-8101-0294bf6593c3	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6953b2c8-01a6-4e7f-a809-d3aeac589ec0	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
3af0180a-7c25-4d4f-b84a-b56c7dfade87	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b58192d8-e35b-4f9c-aaa6-24140e8272fc	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
4c390303-c8c1-47c2-ae84-8575c5bf8dc3	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e5fc2cb3-7620-4112-be4b-a1abddde0365	\N	2025-03-12 14:13:00	\N	\N	0.000000000000000000000000000000
915c8d22-facc-4fb9-aabe-3dcd97198efc	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	8f8d80a4-89cc-4bac-8a04-9d34835db309	\N	2025-03-15 16:55:00	\N	\N	0.000000000000000000000000000000
8450b7fc-c6d4-4a33-94be-54419470f4dd	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	8a7d8753-a54a-4b10-8a72-1e11ca415b5b	\N	2025-03-15 16:55:00	\N	\N	0.000000000000000000000000000000
817815b6-5cda-4efe-98f0-6d40ec6066b4	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ae0397c6-4b2c-4e6f-9c2a-732ec396c598	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
31d5de84-e8f4-4f19-b702-07e5436b25fc	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	88652b5c-bebe-49c5-8b10-bf9298d40195	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
2124a684-5138-4601-ba79-9d2bed26f8f9	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d39f621b-b7a2-42f4-b9a1-6c75e8ac101c	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
1a2ed4f3-eef5-4637-85fb-ff267297624f	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2a8a107c-523a-4d99-aeaa-9925b85bc8c2	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
09852bdd-614d-48de-acaa-6628a841644f	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	818c6968-9ecd-4db5-a900-5afab0406640	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
f0e57487-f91b-410c-a018-aef8b6176693	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8bf717be-a485-476b-8092-c537f9fbddfc	\N	2025-03-15 17:04:00	\N	\N	0.000000000000000000000000000000
3c842cb4-4030-4abf-b579-dfdc2c4d80e8	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	18789c6a-44db-402c-a568-ebf93737ca07	\N	2025-03-15 17:04:00	\N	\N	0.000000000000000000000000000000
6f8732de-ce5a-4399-bae8-bae4ab0c1715	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a76cc3d5-e677-47f3-9f02-ebb0c79503ff	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
cac12706-874a-4465-9d65-6ac6597a2d47	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	79198527-71fe-43d3-93ec-fe3d6c64d20c	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
c066ee85-3bef-40c7-8c8e-f0841d6bc6a3	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	390c631b-e6a4-4eb4-b372-9a991d5c2de1	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
07dc1a06-0a4d-4db0-b716-01df2886962e	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9673760c-3911-4a2f-9f42-58c7075616c4	\N	2025-03-15 17:04:00	\N	\N	0.000000000000000000000000000000
4d0e1c6d-e804-434b-8db6-9977e485844a	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b1bbd045-abd9-40da-a78b-5f60db643670	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
c4cbef49-cd5e-4b56-9dd2-2fa89c5d630e	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	510949b2-9090-44b4-83e8-4dfd8c45c522	\N	2025-03-15 17:04:00	\N	\N	0.000000000000000000000000000000
228c573f-c771-4e9b-b1c1-31ad190633bf	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fa0df1ef-18bb-4511-abfd-fc8869f68a2c	\N	2025-03-15 14:22:00	\N	\N	0.000000000000000000000000000000
c837de17-69eb-43de-ba41-bb10f402ab9b	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f2ca3dd5-bde0-4ddf-b2a7-ab0beb3f475c	\N	2025-03-15 17:04:00	\N	\N	0.000000000000000000000000000000
8af2bda4-b533-4f65-b15d-6ef610100174	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	774c26fe-4d31-4326-a372-b57fe7ecdf27	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
2c2d79d5-3650-4d39-b8ab-99a1a76610d0	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a7f4f78d-f4b6-48c5-85e5-32aedeca5266	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
f42de24d-5722-4adf-93aa-f823ae296309	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d7b35298-f8c8-44b0-a9da-767e035c4a63	\N	2025-03-15 17:57:00	\N	\N	0.000000000000000000000000000000
0b33d554-09d2-43b5-b050-d6ccd3daec1d	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1d022e76-533c-4892-86aa-ea46d2d5cff1	\N	2025-03-15 17:57:00	\N	\N	0.000000000000000000000000000000
2e8b43b9-209d-4e38-8828-ad1cc4a91a23	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5a1ecaad-a3d1-4baa-96f0-4894c86950ea	\N	2025-03-15 17:57:00	\N	\N	0.000000000000000000000000000000
ceeaabc4-ce0a-4f07-8b8d-86f9b773411a	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0f3189b2-bbd0-4729-86f9-f0af994e9fb3	\N	2025-03-15 17:57:00	\N	\N	0.000000000000000000000000000000
1b83cf36-24b5-4682-9e75-2a10472c309c	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	44b880cd-9703-4f24-89a6-67f51a383745	\N	2025-03-15 17:57:00	\N	\N	0.000000000000000000000000000000
45460ace-865a-491e-895d-997929ab009c	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	af0d574f-a957-4df2-acb2-c48bd92e6225	\N	2025-03-15 17:57:00	\N	\N	0.000000000000000000000000000000
2b6daff8-f8f3-4416-9a21-b05b472164ca	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3a0b5de5-a2a5-4aa8-adac-46711fff9760	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
88a4eda1-747c-49e3-83c7-e811c08f2477	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	87f66827-72ea-4601-8074-90df4112bf9e	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
cf902a86-396e-401f-849a-7f7c4f257ade	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8613cc8e-6c0c-4fbb-9b08-e050ab303f59	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
888669aa-dff9-43ce-9b08-49788a5830dd	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	29e36c8a-9e1c-40a0-be39-ccd5855dffbe	\N	2025-03-15 17:57:00	\N	\N	0.000000000000000000000000000000
811da44d-7c62-42b2-8158-41ea01229e4e	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	996b74cd-268f-4f16-a183-3d4fdb7e9ab9	\N	2025-03-15 17:58:00	\N	\N	0.000000000000000000000000000000
7c984226-8992-4502-80f2-7b143d814002	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0f3c990c-abc1-4f30-ad54-245bcde12e84	\N	2025-03-15 18:00:00	\N	\N	0.000000000000000000000000000000
da28e6f4-7b37-4cc2-9f14-486acfb65741	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e7b7eb6b-baf2-49a4-88c0-55af78cd5ba3	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
c36b5ef3-6a6d-4f44-a24c-bce066a86b2f	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	51d56b56-6de6-4a70-acac-941904743202	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
19039aac-9cdc-4103-b8c4-848028798d8c	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	23667994-9046-417f-a79a-f939987a902a	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
988df919-7049-4a47-8ad1-2a9d90e7abaa	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ca2b58c3-1725-4f12-9142-6b8e5e4bb211	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
bfc5e4bc-2cfa-40b9-8b86-6a2a1cef55eb	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	182c2e51-4702-4273-ab5a-7c64200c0746	\N	2025-03-15 14:35:00	\N	\N	0.000000000000000000000000000000
6915c6ba-3f66-4b78-b84a-4da084f8f9b8	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3fa37fb0-732e-448b-b8a6-26590da8e2a7	\N	2025-03-15 17:57:00	\N	\N	0.000000000000000000000000000000
96fb5626-9473-459d-977e-58b1cfbdd58f	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c9d1dfee-08d5-483d-a6ee-5f88433eb803	\N	2025-03-15 18:00:00	\N	\N	0.000000000000000000000000000000
24a4318c-2b23-4a1c-ac58-de6e21d281b4	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	afc5de0c-c1c0-486f-9aca-2c7ceecc5a2d	\N	2025-03-15 18:00:00	\N	\N	0.000000000000000000000000000000
7bd6a617-c7c4-4a26-a13d-6d71cdaa30f4	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	86dcde4e-f6b7-4983-b40b-df07916cc108	\N	2025-03-15 18:00:00	\N	\N	0.000000000000000000000000000000
b046b525-f12d-48de-a2ad-df5d90b4e8cd	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e2d7e9d4-dcb8-47bd-b745-b9dc380cc1a3	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
48767786-dc63-404b-86a8-f4e24314bcd1	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3be028d9-01a3-4ab9-a1f5-9c05aff3e2d7	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
73aa97c1-78a3-4928-aa2e-df955c45294a	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	47bdea20-40d4-4418-a120-39c54be0b69c	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
93a5b679-5042-40af-82b8-620616497d8c	9df2de45-7495-4302-910e-96bacfdd32e2	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	69fe599d-55c6-43dc-8ea8-3d262c3e9ce9	\N	2025-03-15 18:00:00	\N	\N	0.000000000000000000000000000000
b263ec18-caf3-43f1-9224-a31fb9d52a55	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	412bc072-99ba-4811-a2d9-9e1bd1f49705	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
14ae98e4-5d2c-40ca-87db-0605790b9fd1	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	751c6384-02dc-45b1-9df0-81fb810e2301	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
d561be33-3199-4456-9301-26142bbd5f66	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3ce8216a-1065-4346-a89b-e72df6d96ce5	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
2d5533a1-1e48-4dfc-9965-631ff7c1eff1	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a1be233c-73f5-441a-8406-af1669469c73	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
58a60b12-7695-4712-a8bb-3523b5b39450	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c7b9094d-7b2b-4e6c-bfd0-9ff0b27e50cb	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
14d43619-7e5a-4895-922d-15753feb3c51	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b8a5def4-3743-4bcb-85d6-0dfaef34861a	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
e85c8395-944e-47d8-a44b-db971883cf02	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	dab18118-e41b-435f-bece-0073eec25748	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
7d4f92e7-08b6-4499-b69c-7f79898ea2a9	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e24613b2-3592-4332-a332-361d72a6e948	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
2145657c-ead2-4b20-9d35-4e407d4df199	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	52851dc1-9bc7-4b9f-9156-074d3a005be3	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
591cba9a-a608-4e9a-a3d2-de7452fa28f7	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	7ddba26c-08f2-4181-8ec6-982f51a57743	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
307758a2-919d-4896-a952-afa2fdbbebff	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d24ca3d6-4562-4d12-9daf-cdbc11df1ff3	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
8c1e78c9-dd5a-428e-b395-8375e943f9a9	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	797368ee-d7fa-438b-b06e-b60c67479032	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
1e8f1b3f-54f5-4fba-9bd3-fecb15125140	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	44a24f03-8bbf-4002-b4ce-a7ac6ad21926	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
f2adb000-4988-4232-819d-38fc9355b716	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f8e2af02-0e7b-49a6-8905-e3b873f0469f	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
11a752dc-9398-40fe-b593-dc8f92358653	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	364282fa-7253-4420-b2bc-4e12e51985f9	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
8e11b641-af1b-4f8f-9a3e-11b73bde1744	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	516443c7-5d0e-48f2-9d60-41c3a25b1e35	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
86c90650-fc63-491f-919e-e43e053f2ad8	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a10cf89d-c57f-4a62-9fb1-119edefe636f	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
af4a863e-b135-46ed-a100-eebd3357a202	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e21e46cf-2383-46a6-b841-5cd8585310a0	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
4ef48695-043e-4bc0-ac5a-4db1a9c99b09	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d3981126-c996-457f-9b9a-2421e3f2aa9e	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
5dd9e268-1dfa-4204-9e82-3115a50f3abd	660d4215-4046-459c-b212-0c6a512b1526	cf2f35ed-f1c6-424e-80b8-04fc1a082a60	\N	\N	2025-03-15 19:55:00	4.000000000000000000000000000000	\N	0.000000000000000000000000000000
7bcceb67-6033-43a1-bfeb-53d99b75a921	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	93975bc5-c8f0-4c51-86d7-29926d2f24b9	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
b043089d-e1fe-4e7d-933a-b996e82b972c	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c9a5cac5-ed26-46ba-ac18-1bee0edd3588	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
393bd0de-0eeb-44c4-9aa3-9b34996c0fb8	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2b34aa58-7e1b-4b73-9eeb-e25300b8761d	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
62687b83-4d4d-4dce-bec2-9e3ce0eb5aa5	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6d0843c4-bfcc-4433-b011-e4e580c4006e	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
70f5aa97-ff6b-4fe1-801a-ae9db9b8d8b0	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e66bd16e-aac9-4bbb-8e5d-f61af44958b7	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
21d1ecf1-6864-4a8d-b68e-54a4519459b1	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	87dc519d-6043-4317-8055-bee34f5a62e3	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
bfaf62e4-bc10-40b4-88ed-71217a23ce4b	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	87e843c9-919e-494c-b97e-af43b527eeaf	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
29c1487e-dca8-4267-a81f-5459fb9f841a	660d4215-4046-459c-b212-0c6a512b1526	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c47373a3-5ce1-429a-a6c8-a576f7a1e1a7	\N	2025-03-15 19:56:00	\N	\N	0.000000000000000000000000000000
3f72f00f-1386-408e-9ee3-0c81f4ad7ae3	660d4215-4046-459c-b212-0c6a512b1526	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	78777afd-8e5c-4f3a-a7e8-1186c15235f3	\N	2025-03-15 19:56:00	\N	\N	0.000000000000000000000000000000
ae3d5834-7a79-4a4c-ac2c-7a552b6bd425	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	98525d40-eee6-4aeb-bd86-2cdeecf6f444	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
92915ef9-89cf-4c34-a9d0-8574514ca752	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	24d815a4-7649-44c1-8b67-a93752b0bf8d	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
2606363e-ceb9-446c-93e8-c33171df6b11	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8a77644e-8d6d-4f59-b04e-b8f7f80d46b4	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
5aec602c-26eb-4888-b775-6716f48354b6	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	84b66909-d79c-4906-9c86-7f3d24139942	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
1cb07ab0-89af-4452-b656-311360743c4c	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3998df44-aa1d-42cc-9fd2-cdf5ef055b3a	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
1a95625b-d582-4de1-a932-de96e7714403	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8985e007-5aea-41ae-83d9-104ff755fca3	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
aa624f6b-395d-46e9-b05d-d466d1d2db05	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	69bfe62d-1e43-4caf-8ca7-66b59cf0945f	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
674fe20e-9949-451a-b7ca-1eae56d4dcc1	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	18b1be25-b82f-4016-be4a-24ad1211dbcc	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
4a65acba-e790-40df-83a4-10e48000ca88	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	af0b583f-2864-436e-a71a-1cc742eebcf0	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
b849f856-fca5-47dd-9fd4-be45e99c03bb	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	17026669-dc68-4a75-ad81-958098618536	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
bea73c67-4d4a-4487-856c-803050c0ced6	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8df3c997-06e6-4d60-b941-8a19a6cbf8de	\N	2025-03-14 14:47:00	\N	\N	0.000000000000000000000000000000
8305139c-e9fc-44d7-b5b6-e78dfc0ebaeb	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f791d191-82f4-4cc5-b9a6-5479f2d2ee5d	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
7178a2dc-ef50-434f-ad5f-9b92743bc801	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3a0cea96-5730-4368-828e-27af67dcc61e	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
04a1c26d-3b6b-4530-90a4-11295c38ac02	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6d73b709-f40a-44d9-81d4-26fe3533ef76	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
4b69ab10-3cfb-4fb8-9aae-2cba41ca278c	660d4215-4046-459c-b212-0c6a512b1526	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	efb9d3db-5eed-4b48-8d24-4f246c240626	\N	2025-03-15 19:56:00	\N	\N	0.000000000000000000000000000000
cb7e04a0-9436-4389-9910-53d7f34c3837	660d4215-4046-459c-b212-0c6a512b1526	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c578feab-ebc5-439c-bfee-4c774e4f9d7e	\N	2025-03-15 19:56:00	\N	\N	0.000000000000000000000000000000
ab34e681-7ac7-41a5-b88e-4cb5f2925881	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5f312fe0-c5a9-418c-96b8-c306e8b5767d	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
c4aa5f38-e1e1-4899-8be3-b917fef45f4f	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0247d8b4-c286-4961-97ae-9b665a7f95ff	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
5ca6f479-4044-4639-9046-8cd9db6e1b19	3f9c715a-0971-4054-b91b-ec8ba514e701	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bce072c5-9af2-440c-be5f-4d320bf53025	\N	2025-03-15 15:23:00	\N	\N	0.000000000000000000000000000000
4da97687-0990-4505-86bb-c42fdf1fac9b	660d4215-4046-459c-b212-0c6a512b1526	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5a713f0e-8a71-47be-88b7-c158afd7856c	\N	2025-03-15 19:58:00	\N	\N	0.000000000000000000000000000000
2cba56f3-d04c-493a-a498-153ca41af3a1	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f66035ca-88b2-4751-ae44-4bfc3df3ddd9	\N	2025-03-14 19:15:00	\N	\N	0.000000000000000000000000000000
504d5731-d815-4ae7-8790-96372185b324	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	fcf4d541-421c-4987-b95a-f49949ddbbac	\N	2025-03-18 16:33:00	\N	\N	0.000000000000000000000000000000
7c1eb6bc-67bf-461e-9816-763043c186c2	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	0b7c5a27-21c9-4ca5-a5d2-a169269ce8b0	\N	2025-03-18 16:33:00	\N	\N	0.000000000000000000000000000000
28966d44-e040-40b9-b7af-579fa1a90f7f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c92e3031-91f8-438e-85aa-8d1eeff98491	\N	2025-03-18 16:33:00	\N	\N	0.000000000000000000000000000000
2621ecf5-86c9-4c25-8ab6-4053f27a530c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-18 16:33:00	\N	20	0.000000000000000000000000000000
8a9f22cc-b82e-41e8-97af-8361c50277c1	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	431c0443-4ff7-414c-bb5e-fd20b3d2c226	\N	2025-03-18 16:45:00	\N	\N	0.000000000000000000000000000000
8e6e29c4-6f65-40fa-8fb3-81826e5e671c	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a8c19ec9-6c95-4355-b647-3839a7525130	\N	2025-03-18 16:45:00	\N	\N	0.000000000000000000000000000000
577e04c6-9427-49ad-879f-3ed8c211b6c9	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2c45216d-1555-4aff-bac2-eac2a69c3752	\N	2025-03-18 16:45:00	\N	\N	0.000000000000000000000000000000
9c424539-8a1f-413b-a766-5e34fa43f750	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ed76d785-3b90-4b3d-a749-884b04987289	\N	2025-03-18 16:45:00	\N	\N	0.000000000000000000000000000000
b0521171-c692-4929-9c16-42dd5c148a79	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d03148b4-6f9d-450f-b8bf-22ebbe9f2f54	\N	2025-03-18 16:45:00	\N	\N	0.000000000000000000000000000000
a65f1e37-797d-4275-ad21-abede47d1699	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	198e390c-4662-49d3-a8c0-aa09736ef900	\N	2025-03-18 16:45:00	\N	\N	0.000000000000000000000000000000
d01043b6-1b10-4982-8599-4524b6ac117c	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a9d91a16-4af8-4815-b9eb-fdc2125e789f	\N	2025-03-18 16:45:00	\N	\N	0.000000000000000000000000000000
3dc9ba00-0436-4c16-bfea-2d57c8bc4a54	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8a69441d-baef-4a58-ac1d-58be0151c328	\N	2025-03-18 16:45:00	\N	\N	0.000000000000000000000000000000
dc2e2f9b-cd55-429e-83ba-5d7743afd972	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0051c9dd-e270-410e-b11e-9b537244b1fe	\N	2025-03-18 16:48:00	\N	\N	0.000000000000000000000000000000
ba4a4b64-8c54-4d2c-a8c9-47b0b664f0aa	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	47c749a8-7695-4b06-9594-19cef3454b7f	\N	2025-03-18 16:48:00	\N	\N	0.000000000000000000000000000000
ac5f4b5e-fb38-42bb-8c17-d5bf596507a3	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1f82c552-e987-467b-93d2-fa92befb9843	\N	2025-03-18 16:48:00	\N	\N	0.000000000000000000000000000000
1613337f-9c06-4f09-b565-6a29ad682a22	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	41c01561-57a4-481f-b00b-2bad3d320eab	\N	2025-03-18 16:48:00	\N	\N	0.000000000000000000000000000000
051b61ad-045b-4a4f-9077-b7e565d7a6f1	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2ed4abc2-81ba-4d8a-bbf2-273575358280	\N	2025-03-18 16:48:00	\N	\N	0.000000000000000000000000000000
11ef0264-e8d2-4ebc-a1ae-ee7bfd4c9d97	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	53ff865e-ea34-428f-8615-88e6fe2097d3	\N	2025-03-18 16:49:00	\N	\N	0.000000000000000000000000000000
917e60ce-c893-409b-8e39-56b12a0a63a5	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a5c6f7ae-6050-4338-9881-a6a283126cec	\N	2025-03-18 16:49:00	\N	\N	0.000000000000000000000000000000
2f3111f3-8433-42a6-ba3d-10bd5912d08f	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1278b63a-4dc3-45c9-b467-6684366ba0c2	\N	2025-03-18 16:49:00	\N	\N	0.000000000000000000000000000000
42e5b148-f38c-48e1-a730-7d912d784579	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ae3ad43f-80a6-4348-a6ab-8de9cf7f0c4f	\N	2025-03-18 16:49:00	\N	\N	0.000000000000000000000000000000
8f667e80-cbe3-4053-a770-0ed2d52c8b1c	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cb6aa4d5-202f-4d04-8e92-7238ccc0810b	\N	2025-03-18 16:52:00	\N	\N	0.000000000000000000000000000000
2b2b907c-84c1-42fe-9c75-9cfc091da182	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	38469fb1-74ef-456c-91b7-e6c120742ecb	\N	2025-03-18 18:10:00	\N	\N	0.000000000000000000000000000000
39532cea-cb1c-40b5-b79e-213e52c67646	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	754bf2d5-c1d8-4f20-a244-e91ea192aeaa	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
807c698e-da90-43a7-9643-47fd7d7848a4	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b2c4bb15-e08e-4c3f-98d2-6572148510ac	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
f984aff7-1c0a-480b-a985-40845eb6dbcb	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	11a6f0e3-cc3f-4069-bde0-fee4d6d4ba28	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
b7491dbd-34bb-45b9-8b0f-6eab502b31bb	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6c993d2e-d281-4f4b-affb-f16487dc346d	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
274c485a-9cdc-4019-bf49-7be8491bee5c	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c9652271-6339-494d-90b1-dd047130eeeb	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
cf27ea0f-ab41-43e6-b129-c98d02cb7a3a	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	55884b8d-bf7f-43b3-91ee-5f5680e727be	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
eaec7264-9b1d-4a7a-afa5-b69b2a491a30	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	111b61a3-175b-46e5-a9cd-7ea744836b1e	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
a7e94ef4-856c-4899-8b0a-073138f94d1d	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	db36a051-710a-4ce3-a7c4-6d1fbadbf566	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
23431ddc-b041-4929-80b4-8f4168a06add	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	56a58bf6-db34-4b15-a4ea-4d59fbcc1581	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
1b359bc6-d564-4b97-885f-07d4f7519a1b	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0ed0515c-6af6-4199-b7ef-e06528c38c3f	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
c11ecb4c-063e-4147-929f-6ed3f75857de	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	75b07e7e-44f4-4a15-ba4f-f06579a7ef7f	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
53ec5602-8bf6-4e42-8b43-363bb26f8f78	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	801a35cb-d494-4510-b9c6-c22fae2b2449	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
37395674-08c5-479e-bd3d-ecf654679de5	77da06d4-4ec4-4111-9e3f-0eb5f0952053	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	752633cc-ba92-467f-a476-15b04b811a2f	\N	2025-03-18 18:35:00	\N	\N	0.000000000000000000000000000000
72f611d5-1595-4cc9-8813-8572ee3167a0	4ac2b819-a667-4371-9396-d42cb622a0ea	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-18 18:16:00	\N	24	0.000000000000000000000000000000
573c63b9-f052-4fb7-b3eb-b2d05115ed69	10d00b42-11d8-4648-8bc0-da0c9aeeec08	484fa657-471f-4918-85ee-67b544937fb7	\N	\N	2025-03-18 16:22:00	4.500000000000000000000000000000	\N	0.000000000000000000000000000000
f8e51b98-92de-46be-b48c-e6362541924e	10d00b42-11d8-4648-8bc0-da0c9aeeec08	484fa657-471f-4918-85ee-67b544937fb7	\N	\N	2025-03-18 16:23:00	3.000000000000000000000000000000	\N	0.000000000000000000000000000000
f607f00e-b65d-441c-9605-99f0fec6c10d	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f6840f51-cb16-4ce4-aa6a-86c9a2ab7715	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
bcff305e-bd72-49ea-98b4-aa40a22ef802	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8e865bdb-235e-480e-ae91-efe0ade2cd18	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
d4e02bf2-05e3-489c-8e68-9fdcb9e670ca	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e60e3774-9226-4826-97e9-e96432bbe954	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
987efa23-64ea-4c0e-b385-6be11df4007c	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3318780f-98a9-493e-bea8-1c24f2de6f3f	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
899585cf-40c0-44ed-862c-3e7421a11206	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	18d61d89-81de-4045-b1d0-1f9da8ae82eb	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
db75d471-41c5-4463-a724-2de29187d0c2	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bdb6d1eb-79c3-4d8f-9ffd-8e533d822249	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
938a3f6d-3083-4877-9cfb-97a1c11bb9e4	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cb02c030-9637-433b-9a36-ec9173c2810c	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
3edc1d77-5000-44eb-9fdb-6c2437de60ba	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8febd9b7-b464-4bf0-ab32-98d46132f0dc	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
68882731-34e0-41e3-a6e3-68888b5dcfa4	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e8147f93-b96d-46f9-9559-a97e3482bde1	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
fa477411-e3f9-430c-8dc0-b97ab235743c	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5a420719-1675-4704-abad-82d7b9800f2d	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
1428d1e5-cb4a-4f49-a7cd-e75fa8627e5d	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	eaa863da-4c80-4adb-af14-f5213056b752	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
af09022e-f22a-4c4b-b8f1-0f2c790578b7	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	efdf9a86-7492-4792-9d6b-7d09226b2ed6	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
2132438d-35a9-4c0d-8c62-9c6f3c5ab944	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	7809c983-b341-4447-b027-0e0cc3be1e42	\N	2025-03-18 10:14:00	\N	\N	0.000000000000000000000000000000
b81d4a6f-ee8b-4683-8a0d-1698c561df7d	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b812f223-4f78-497b-a239-1aab49ea1743	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
20ca28a5-68d8-4558-9534-e9ddf17a29d8	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8667e55e-cdb8-4290-85c9-0a33c7c58c4f	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
f623a425-8d1a-4b34-b182-1cf00e7c2e5d	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e9137478-bc48-4bc9-940a-66e362511406	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
8f655fdc-a345-4bc1-9a5d-84349334d45b	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9fed86df-566a-4b4a-b669-3f1c815ad2a8	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
ee1adce7-5ca9-4590-888d-d7128e3eefc3	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c693f9f1-cd12-4fce-9e77-2b7569001178	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
50c14bfb-1c45-4be5-8264-af6786f0d43d	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	84ceee2a-a15b-4ae3-8f41-3bf65bfd8aa8	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
e7aefa1a-8e3e-45b2-9b7b-0b81f11c33c9	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2cd71195-ebc0-409d-861d-4d29ccdd6f48	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
d64d4941-4c8a-4224-902b-6eee8aba6f98	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	021f2b34-a023-4c86-aab6-5eecb514cd14	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
9a29a31f-f8c2-4668-ade0-ed6bf457b2a9	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	053f30e9-caa0-4102-9f0e-1234cd963f5d	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
9845ed2a-b822-4fef-93c3-22e13d00e928	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c0dc060e-0cac-41b2-9504-2775f0ac1913	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
33ec3b2a-f445-40a7-a2d8-24b5e34479dc	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2b90c347-ccbb-4063-be02-c0d8bd36c59a	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
11e75948-0096-4efa-86ac-d8370b4b9a2f	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	09702fca-870b-423a-8635-7e6a3f83d576	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
08a5ad33-0104-473a-a37f-e8eb7421265a	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cc6b5a8d-50b1-46ff-bf2b-145757d7ac76	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
4b4c73ad-022a-44dc-ae0b-a41fe499b4b2	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a6149242-4bf0-4556-a4e8-664c722a5534	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
e6318bb1-f768-4199-9ec6-64cfcfb8602b	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8eedab9b-faff-489d-8f56-982525e10ee6	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
2bf18fc0-793f-497a-af67-cf036de8564a	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5217d488-8cfa-4ee2-9af0-981f05318927	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
3fce503b-8848-40ec-83a1-64880d84745a	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5f6f06bf-879a-40f4-8ef7-a99b2e0626cc	\N	2025-03-19 10:17:00	\N	\N	0.000000000000000000000000000000
2e46cb26-6697-413c-8a01-1c8276d9da55	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3ddec079-f238-404a-8594-d2780ef4ca0d	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
00054814-4e38-41cc-9f9a-7d066c784d23	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d45b0693-aa99-4849-a670-ec69b51ca834	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
948e0749-dd91-4951-b084-cc75cd4b0ed0	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fe52227c-d3da-4c3d-b89f-c4352936871f	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
b460608b-ab34-4a0a-a201-d4099a5ca286	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	815a2092-5b28-48b3-a39b-d0f2647634af	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
52d5944a-8a67-4d36-8646-5e5c6f531b74	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8fa35416-821b-4a69-b693-487427f96c36	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
515f852a-dfc6-402d-bfc6-157e3363ad9c	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	597cd14c-97f5-43e6-838c-58ba7ca039bc	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
0a224c50-bb49-4158-b1f1-f58ed85fa450	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b41dfe19-2337-4169-8169-94a7b1ca8d18	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
a13b908c-5cbf-4cf1-b823-dc386b80c00a	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	40cf10b5-6ad8-4208-a9ed-8155a95a9353	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
5fe6e53d-0cc3-4dec-8d0a-062f032b9829	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1ff3662d-0148-454e-8f65-0b1ec5b70032	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
8066e010-347c-4037-a37d-073f557a6d38	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	54a995d2-9a6a-42cd-a569-b295899c186e	\N	2025-03-19 10:21:00	\N	\N	0.000000000000000000000000000000
fbbf22ea-f91b-4731-9d11-af76c6b700d5	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ba6e7544-984d-47ac-a1e8-c26d64c5a8c2	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
aa7cee25-3d2e-4bf3-8511-46d0d64aad94	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	01fd8dcb-da68-4a68-a119-944d33520b79	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
d3be959c-a852-4b00-a3e0-3a5c33e6a1bb	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cfb3d350-c06d-4408-9abf-af0c82d671f0	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
4c118cf5-0a45-4fd0-bf31-95fed8f6d1a0	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	89e5a30c-88ed-4941-bdd7-fdcfe627cab7	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
e61d76d6-fa0c-4be1-973c-ad086111e984	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	13e29c62-7177-4248-a647-822da60485c4	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
e28d24df-ae11-4762-8f91-77182d9b0cba	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ca09d925-d5f3-40c2-9c23-9581ff82e0ce	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
07239e17-b82f-4162-b8d5-0108f7905664	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	46c340c9-22b9-4903-b567-f0d5302a6769	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
135960f2-a402-4897-a09f-087b35c12c46	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ea801e71-1799-48a7-b7e8-32a835a75c2b	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
d4a43c2f-84f4-4bb5-9408-e8fc6dea8324	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	05ea3990-aa69-4b52-8a74-e08c9d35ab68	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
73a8e06c-eae9-40e5-9f15-10dcb59acde5	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ef98dd4a-d281-4b0c-8023-17d323aea4b5	\N	2025-03-19 10:41:00	\N	\N	0.000000000000000000000000000000
9d4743a2-a687-432c-91ae-84aa2f715355	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	bd434c89-dd96-431f-a47f-89a3afb034a5	\N	2025-03-19 10:41:00	\N	\N	0.000000000000000000000000000000
4240dc3a-7993-4247-92b1-bcd0ff8ddeef	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f1172350-f5c5-44f5-9404-57a8e59c1335	\N	2025-03-19 10:41:00	\N	\N	0.000000000000000000000000000000
3014df96-5412-46e9-8d04-2eb008d35c5a	1c16d388-0043-4c57-8cf7-d64fa2bc0c6b	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bbf281e3-0c50-4255-b508-102039774180	\N	2025-03-18 10:38:00	\N	\N	0.000000000000000000000000000000
6efd0e56-cf09-4896-91ae-81117e9124d3	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-19 10:43:00	\N	20	0.000000000000000000000000000000
d65f1ace-f4d4-4638-a478-a29f6c0eb92f	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1a27aa9a-f1af-4efd-a79c-7381eaddcb71	\N	2025-03-19 12:54:00	\N	\N	0.000000000000000000000000000000
d4a439d0-4d8b-46f3-a0df-afc8011589a1	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3db729b9-3447-47f8-a15d-5cefcdb20735	\N	2025-03-19 12:54:00	\N	\N	0.000000000000000000000000000000
dcb0561e-81fd-425c-a394-b3ecb940c4bf	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a6ada56a-1c02-4006-b9fa-066521f947f2	\N	2025-03-19 12:54:00	\N	\N	0.000000000000000000000000000000
45d3819f-537e-46b2-aad7-e39c2f76480b	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	74461b69-567a-452c-9d43-ae84e0e89617	\N	2025-03-19 12:54:00	\N	\N	0.000000000000000000000000000000
590244ee-428f-4efe-8792-552e652563aa	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4d746de4-8524-4018-9099-1c4a9be37997	\N	2025-03-19 12:54:00	\N	\N	0.000000000000000000000000000000
50872520-535c-4976-8827-4670b69d8e67	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	df19594e-fc90-4c2f-b005-2900dcd4986c	\N	2025-03-19 12:54:00	\N	\N	0.000000000000000000000000000000
30192e78-fcf8-495e-84e5-ebaccecfd28e	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	31a25b9a-23bf-4b71-8e7e-252afe515001	\N	2025-03-19 12:54:00	\N	\N	0.000000000000000000000000000000
b455b97a-ab6d-4859-a77d-24ea6c390469	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	99776805-077d-4fcf-8652-bbb9337c9a2b	\N	2025-03-19 12:54:00	\N	\N	0.000000000000000000000000000000
d8075278-b7fe-444a-bfd7-ae830ac1f628	b4add140-6cbf-4fce-8316-6977f64d7006	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-19 14:01:00	\N	30	0.000000000000000000000000000000
e41d2815-2cbc-4cb4-be0c-f8e6d8b025cd	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	40cf10b5-6ad8-4208-a9ed-8155a95a9353	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
45a51482-ed84-4d11-9c3c-6989c3ecae58	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	b41dfe19-2337-4169-8169-94a7b1ca8d18	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
9c604f65-7365-41d7-9f3f-5e32dd2d4f42	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	d45b0693-aa99-4849-a670-ec69b51ca834	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
63af909d-c4d7-4320-b0d4-fea7ca894aa2	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	54a995d2-9a6a-42cd-a569-b295899c186e	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
8d7f1119-e57d-493a-9a3b-cf5349ee0215	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3318780f-98a9-493e-bea8-1c24f2de6f3f	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
f1097225-857a-4392-bfd3-71291cdaaf50	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	815a2092-5b28-48b3-a39b-d0f2647634af	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
d95d1ed4-a1e0-4e93-b4c4-31c9049a763a	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c0dc060e-0cac-41b2-9504-2775f0ac1913	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
75d909e3-849d-45c3-b581-e9000d346869	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	2b90c347-ccbb-4063-be02-c0d8bd36c59a	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
c035ef5b-7f25-4201-b9df-3b201ef6298c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3ddec079-f238-404a-8594-d2780ef4ca0d	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
47abab19-be0f-4ebf-af8c-d4299352dbd6	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	09702fca-870b-423a-8635-7e6a3f83d576	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
b33afae5-04c6-48e2-a73c-d6babafe44ad	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	cc6b5a8d-50b1-46ff-bf2b-145757d7ac76	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
e0d0c22e-ce11-426a-9745-77d30ed8c083	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a6149242-4bf0-4556-a4e8-664c722a5534	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
7172a4b6-d78e-4ff9-b917-99817de00de7	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	597cd14c-97f5-43e6-838c-58ba7ca039bc	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
c95414b4-b2ea-40cf-a256-956c1a3824b9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8fa35416-821b-4a69-b693-487427f96c36	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
7d23fdf6-f30d-4b49-9dd8-f04592944964	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e60e3774-9226-4826-97e9-e96432bbe954	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
630aa6f9-a4ae-4cbe-bb1e-3eabd6a9d1d6	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	5f6f06bf-879a-40f4-8ef7-a99b2e0626cc	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
8f71cb3f-df1b-4286-9762-c552878bec89	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	1ff3662d-0148-454e-8f65-0b1ec5b70032	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
e300798a-cfad-4e1a-9dcc-db0ff88a4ef3	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	fe52227c-d3da-4c3d-b89f-c4352936871f	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
920893f0-a7da-41dc-b5c6-2513429cd007	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8eedab9b-faff-489d-8f56-982525e10ee6	\N	2025-03-19 14:03:00	\N	\N	0.000000000000000000000000000000
ff847a55-82a8-4fa0-8139-1a981434062a	10d00b42-11d8-4648-8bc0-da0c9aeeec08	484fa657-471f-4918-85ee-67b544937fb7	\N	\N	2025-03-19 14:07:00	4.000000000000000000000000000000	\N	0.000000000000000000000000000000
23e61b57-c975-4d5c-b536-3778132aae78	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	71f3330d-883b-4657-b368-2c5e284a5c60	\N	2025-03-19 15:34:00	\N	\N	0.000000000000000000000000000000
f752eed8-06f0-4832-9aa6-4a32f2c8ed38	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	040e24fc-b0fc-417e-b88a-0abd8bdf95d1	\N	2025-03-19 15:34:00	\N	\N	0.000000000000000000000000000000
a60247d6-f612-4daa-9437-565a5eff61cc	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3b1f404a-90a1-4610-9b85-42c03b617993	\N	2025-03-19 15:34:00	\N	\N	0.000000000000000000000000000000
e57d8101-3f10-4e8b-96f9-e951d9b7c144	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ddd9d0da-4bff-4b4c-ba0e-3eaa957ee2e9	\N	2025-03-19 15:34:00	\N	\N	0.000000000000000000000000000000
7b1d7472-34d6-43ce-a43b-719a33ca8b19	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bbf1c852-b2b5-40f9-bb0c-84ac43e99f70	\N	2025-03-19 15:34:00	\N	\N	0.000000000000000000000000000000
58c12c5e-608e-417a-afac-fbecaad9d953	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fc2df53e-4204-4c44-9816-6d6bcd758134	\N	2025-03-19 15:34:00	\N	\N	0.000000000000000000000000000000
451e2084-a9ef-4813-a0c5-f6eac4752c41	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c89f09f9-ef40-4546-837c-a79818a83678	\N	2025-03-19 15:34:00	\N	\N	0.000000000000000000000000000000
b6346e0c-c3ac-422a-8d44-dcd1f72650cb	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8cb075b7-87b3-4659-9f29-4249209a3a06	\N	2025-03-19 15:34:00	\N	\N	0.000000000000000000000000000000
db90b40a-0bb6-4819-a69c-3a77c25964ed	1554f0d4-f870-4c35-805e-90cd37b2e47f	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4e758872-ec5d-476f-ae37-88df6d56cf5d	\N	2025-03-19 15:34:00	\N	\N	0.000000000000000000000000000000
d213bfcb-c57b-4cb3-bd87-82829c397834	b4add140-6cbf-4fce-8316-6977f64d7006	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-19 15:38:00	\N	10	0.000000000000000000000000000000
30bbaeb2-5a60-4898-899f-b1f654e2a80a	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	13c78c6e-5291-4dc2-bd88-735c18eff6be	\N	2025-03-19 15:40:00	\N	\N	0.000000000000000000000000000000
8c888b13-84fd-4e0a-bb4f-0eaeaa23201b	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	70c8dbe1-43e4-4a6e-b0ea-eec87bcd2e4c	\N	2025-03-19 15:40:00	\N	\N	0.000000000000000000000000000000
58d219cd-bb0a-46ee-8af6-2faab42ed949	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	8d348576-9388-4d95-bf07-e241da516c55	\N	2025-03-19 15:40:00	\N	\N	0.000000000000000000000000000000
989dc518-22fe-4ba4-b274-e56d7db9029c	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e47e0f54-6959-4b16-83bb-a631a1ed0150	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
c18a2373-e3f2-4ca0-8b86-16b6ae00cc7e	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	59e44938-ce42-453b-8f24-9d48cef256d8	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
85cdd4e0-91c6-4460-8a42-da4e42d7af6c	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a556ab62-5e4f-4b65-8740-5367087cc0a4	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
fbb754b5-c2af-412d-b594-acf9a8384069	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2fe88f61-f4e5-4dae-b098-30db7de1278b	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
6cfe5d15-416e-468a-a70a-12eeb670b7e8	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b80dbd71-a655-4db4-ba29-bfa073401e65	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
5de2414d-709d-4bb3-9e5a-2c2b5fc3dc3b	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	68f75732-4301-488f-b4de-b9dc31e2602c	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
8f3dcff2-c099-4ced-ad27-a09acf124367	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f7de6661-7792-4d8d-a45c-457ab785cbfa	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
ab56665f-bb4f-4edb-8ee1-6e4818310e73	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e37f5e14-0198-472f-9d2e-d39318f1c5c2	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
2fa5f129-b73d-457e-b89f-15362445ef5f	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ef98a5a4-249b-4ebc-9fec-8860af21db74	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
4402ae0f-3ddb-427b-9a26-605ffb38558c	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	072a6e0a-06f4-4079-a5ed-0845f80622c2	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
74fa3466-be9e-48cf-ab2a-cdc459fc5bc0	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	51a61085-4f15-46ea-9b94-1a5734edfa65	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
8167dfcf-0b51-4a03-b17f-788b48e3307a	54b4ceec-7c75-4aff-8b08-6333b1849cf8	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5fbbb6c8-e641-45df-a4b7-0858e5804b7a	\N	2025-03-19 15:41:00	\N	\N	0.000000000000000000000000000000
f38d2d86-b304-4cca-8137-faf493d72036	fd20320c-4120-4bd4-bd82-379fe35b122c	484fa657-471f-4918-85ee-67b544937fb7	\N	\N	2025-03-19 15:46:00	1.000000000000000000000000000000	\N	0.000000000000000000000000000000
11153df2-7249-49c1-8b11-d9646e8ba8d8	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	02b26305-3d57-47e3-9ae9-3b0e8609ebb4	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
012bc4d2-ffd8-43cf-ac92-ae977ea180fa	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	483bc314-b21a-4e11-ac74-7273a7ccc3ed	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
02886fcd-1fbe-4b9c-b587-53f3861cbed3	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	68caa459-3a41-40df-8c19-a1e54bcad78d	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
1e5f62ca-a2de-43d6-bd36-08f8e259439a	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6f2ca0b5-c363-4573-8124-fc443a02df77	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
2d1cf045-b86c-42f8-9eb4-f89d1a148ec4	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d911d4e3-9bd9-491c-8e29-7318b4f6abc3	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
04468b79-2d99-4119-b124-9b82518d7735	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6e6f893d-ba9c-4a4f-a83c-563e2f8b2acf	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
37c2519c-fd95-401c-bdb3-ce1de955fdf2	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9187a2db-25c5-432d-8b25-6eef60a122bc	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
4898de47-d844-47a5-8c2b-48c083d1fad2	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1a47223c-49e5-4fab-b895-3f21e0c85734	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
738c19c4-95ce-4eac-87b8-2646f2490b57	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bea32b03-149b-4648-951f-d9dc8213cdce	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
19b871c0-a43b-4b79-a1b5-7ebf80d5ed3a	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c782c53d-92d5-4973-9732-320d27419b4b	\N	2025-03-19 15:46:00	\N	\N	0.000000000000000000000000000000
74bc12b2-1e59-4cb4-8874-f5147f833741	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9228165d-6c5f-4cee-add2-f76216321ed7	\N	2025-03-19 15:48:00	\N	\N	0.000000000000000000000000000000
70d40975-b9f8-4da6-a777-76dfdd35267a	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d2112b7f-8baf-4bb2-8687-58573f87e3ed	\N	2025-03-19 15:48:00	\N	\N	0.000000000000000000000000000000
de07c8e9-cba1-4ad6-80e7-690d865bfde8	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	563d96a6-8e38-430e-babf-ee0c2f4d7fde	\N	2025-03-19 15:48:00	\N	\N	0.000000000000000000000000000000
125601fc-9a01-4ef6-831c-bc969b7dd580	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e1d0be60-8007-41b7-a617-33a4349a3542	\N	2025-03-19 15:48:00	\N	\N	0.000000000000000000000000000000
8a4c8d3b-1312-46b0-b738-b7e1d48b90b5	fd20320c-4120-4bd4-bd82-379fe35b122c	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	dd186fdb-039d-4dd2-acca-b60fb2473aa6	\N	2025-03-19 15:48:00	\N	\N	0.000000000000000000000000000000
f6a2aef7-5fd4-487e-8766-929c3a384b2f	28dadfb7-8d24-4db5-8b45-189c648a4868	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c9a3a9c2-3063-409b-971c-314770d7de3d	\N	2025-03-19 15:57:00	\N	\N	0.000000000000000000000000000000
9b5da071-508d-4778-a5f0-38e68fc1c5ad	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	102db12f-d883-49de-a170-a9472f078bcb	\N	2025-03-19 15:57:00	\N	\N	0.000000000000000000000000000000
6edd2654-1066-4244-b6d5-07d2c9a9a44b	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	7bb2df56-adaa-4dbd-b090-80eea8b112d5	\N	2025-03-19 15:57:00	\N	\N	0.000000000000000000000000000000
0b93cae6-90f6-4a20-9a97-062df6e36d27	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	40f36a92-85ca-4c2f-a47d-a55d3b1feadf	\N	2025-03-19 15:57:00	\N	\N	0.000000000000000000000000000000
0dbf39a3-521a-4a68-9d49-6a84cbae6944	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3b6daea4-13ff-4785-a5d6-0f1ad244749a	\N	2025-03-19 15:57:00	\N	\N	0.000000000000000000000000000000
e5f9f61b-7f5d-4a65-814c-2871050b6750	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	31ae7e9b-5a43-4387-b0a1-0a54d4e51cbf	\N	2025-03-19 15:57:00	\N	\N	0.000000000000000000000000000000
7e0a5406-1121-4e37-ab21-a45f60de0e8d	46a5b565-c2de-4dcb-bb3e-f2cb77e63678	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bc68be2f-986c-4e92-b0fa-f3ab30bcc4e2	\N	2025-03-19 15:57:00	\N	\N	0.000000000000000000000000000000
1a9b340f-4942-486c-aeeb-6f188e130a9a	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f3912ad0-bb46-4f02-91a8-14518c75ff9d	\N	2025-03-19 16:00:00	\N	\N	0.000000000000000000000000000000
da7426e2-984c-42cc-b71b-a000ccbacd67	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	1250e1e4-92ef-495b-acff-086b2a895501	\N	2025-03-19 16:12:00	\N	\N	0.000000000000000000000000000000
9c18fd45-ea52-408a-a3a6-ab90bab8c0da	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5716687c-e31c-4887-9b77-91160a8f525d	\N	2025-03-19 16:12:00	\N	\N	0.000000000000000000000000000000
defe257a-f3c3-49d1-bcc4-2087ad596743	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	e29d06aa-e1f7-4639-9afb-55fc6da62335	\N	2025-03-19 16:12:00	\N	\N	0.000000000000000000000000000000
a421a809-f2b6-4bbe-82bb-1068420e6a21	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	6561682c-6e32-465c-8aa0-fa4749336841	\N	2025-03-19 16:12:00	\N	\N	0.000000000000000000000000000000
f5b59750-e28d-4e3d-abc6-280886936a01	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f414baa4-cc45-479d-b478-678b6f661975	\N	2025-03-19 16:12:00	\N	\N	0.000000000000000000000000000000
adbe4f36-620d-43c7-a740-8c0f9feaf826	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	63d20d3c-77f9-4343-a7de-f2d0a0ea75e0	\N	2025-03-19 16:12:00	\N	\N	0.000000000000000000000000000000
2a5d6c23-afa7-48ae-b98a-da3a172ccf85	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3a62ae48-d57b-4a99-b65e-a5a85186be6d	\N	2025-03-19 16:12:00	\N	\N	0.000000000000000000000000000000
73293933-2888-4206-bc29-46197ea296e3	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a2894922-f746-4130-b88b-ca59df8594d1	\N	2025-03-19 16:12:00	\N	\N	0.000000000000000000000000000000
5252e94e-b740-4232-bc55-608d90128163	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bb99c055-372c-448e-998f-917aae842622	\N	2025-03-19 16:13:00	\N	\N	0.000000000000000000000000000000
b2a8b2cc-3bb3-4398-8213-648021069f11	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c4e5310b-d6d2-4080-aead-92ed134bf1c6	\N	2025-03-19 16:13:00	\N	\N	0.000000000000000000000000000000
cd8672d9-4838-4f33-b093-9499f5aeaffa	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	06fa12f8-d8b4-4035-9289-7500ed94b4fa	\N	2025-03-19 16:13:00	\N	\N	0.000000000000000000000000000000
9c943af9-16d7-4dc3-a7ed-b6e9d6f6f471	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	720bcec3-0fc8-4e06-af79-00c40ebbf651	\N	2025-03-19 16:13:00	\N	\N	0.000000000000000000000000000000
3efe5ea0-310d-4908-ae35-dee56a26225e	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2afa7c80-bb79-4217-8fe2-b0ca0f8df5d6	\N	2025-03-19 16:13:00	\N	\N	0.000000000000000000000000000000
a7a07190-c36a-411c-9a94-f82c8466637d	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	06669d3a-997a-424a-a1b2-dccd2ca5afff	\N	2025-03-19 16:13:00	\N	\N	0.000000000000000000000000000000
1cd2492b-1c5d-4d44-b3cc-7a12794963d5	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	5a548147-e51f-45fe-a5ad-74fa438c46ef	\N	2025-03-19 16:13:00	\N	\N	0.000000000000000000000000000000
7aa52553-5efc-4a85-8919-eea7071f0350	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	31b8d89b-9901-4367-8202-d66a2e1d3ed2	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
8c86db0e-435a-4b54-b182-b79fc5a12bf6	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	2ee1a629-8b0c-4cab-90c8-8382d051af74	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
b787f1f9-5211-4dac-89fe-27c8cb551387	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bbc99bf6-ce4c-4f43-b3d1-6b3e7660b9d0	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
98b32665-a140-4539-bf31-9c838d830176	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	d70cbb22-9a6f-41c7-b9e8-8f621605a966	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
e18691e5-ba01-43f5-ac2e-6454874491bb	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f0e00657-e89a-4928-80eb-ba36772aedc6	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
6008e8fe-d2b9-48c5-8e05-fc39e173f4b7	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9fd58b6f-d5f1-4aca-8be0-47ca89f68806	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
19d1aebb-560a-4b11-b039-919de82d71e8	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	59f49012-0ead-486f-bdd7-a8a4ba533865	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
c99d4534-4da0-4dd6-8abe-7959060970e8	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	000b1ceb-1818-466c-acdd-387a685ac3a5	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
7d08ee8e-f7e5-494b-be4f-8124980235a2	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	98df8283-4c56-47c8-b6aa-effe4e8e955d	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
49581017-6e97-48a4-aad1-6d55af675b27	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	08fceb77-47bb-4e55-8369-d647d72fc8cd	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
c2739369-ebd8-4a9e-b737-86e1be9fda3d	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3839663a-3317-43ea-9758-ce36db59b060	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
3ff554c5-c4bd-49f1-b65e-0b6dab604693	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	39e95ac4-a283-472d-9d72-6e7a6a95ace7	\N	2025-03-19 16:14:00	\N	\N	0.000000000000000000000000000000
475abeab-567a-4d3a-8b5a-8f6cb399c4d0	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	71f3330d-883b-4657-b368-2c5e284a5c60	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
eb97f921-8fba-41e6-a0fc-fce104f6776b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	bbf281e3-0c50-4255-b508-102039774180	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
5d1eb1c1-ed4e-4fbc-80e7-c4b901d07a4d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ea801e71-1799-48a7-b7e8-32a835a75c2b	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
afcded51-66fc-47e0-b6f2-5e0557fc209b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	05ea3990-aa69-4b52-8a74-e08c9d35ab68	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
20be285d-ef87-4b22-bec0-7fecae4f343f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	102db12f-d883-49de-a170-a9472f078bcb	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
464e125d-e7e7-4cf4-b537-6599641f3b70	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ba6e7544-984d-47ac-a1e8-c26d64c5a8c2	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
118c6dc9-6049-4f3f-9240-5e0ab38bfeba	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c9a3a9c2-3063-409b-971c-314770d7de3d	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
364d5476-555a-421e-a878-3bd58ab6e47d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7bb2df56-adaa-4dbd-b090-80eea8b112d5	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
8a88600f-1312-4f0d-8f7b-226046f85d24	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	14e7f593-78ef-4a0e-932d-e494cb9b67e3	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
3b08a09d-58a6-450c-8a4b-7fdb9dda612d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	46c340c9-22b9-4903-b567-f0d5302a6769	\N	2025-03-19 17:31:00	\N	\N	0.000000000000000000000000000000
be549aff-c31e-4cdc-a5d4-8a03f427e331	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	040e24fc-b0fc-417e-b88a-0abd8bdf95d1	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
44c3e581-3212-4b6b-ab97-9854c5781609	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	40f36a92-85ca-4c2f-a47d-a55d3b1feadf	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
831dc177-2b6a-40a2-938b-395f484d449c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	bc68be2f-986c-4e92-b0fa-f3ab30bcc4e2	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
5d5075c2-17ab-48fe-9e5f-584ecb1715e4	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3b6daea4-13ff-4785-a5d6-0f1ad244749a	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
8bc4d2c7-6fe4-4c16-8eb6-a15cdc688312	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	97c72fb4-f254-4cda-901b-23216aff55b7	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
db98547e-ea92-4df0-be75-0f7bbb2b1fc9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	31ae7e9b-5a43-4387-b0a1-0a54d4e51cbf	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
8550153c-78a4-4bc9-8329-73ecd713d163	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	13e29c62-7177-4248-a647-822da60485c4	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
395398ae-f555-4021-9dfc-6b639071d17d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ca09d925-d5f3-40c2-9c23-9581ff82e0ce	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
7c19dbe0-3bf4-4a4a-9a77-35367a671b54	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	efdf9a86-7492-4792-9d6b-7d09226b2ed6	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
13204bbb-1362-486e-a740-aab2e2dd6a9f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	01fd8dcb-da68-4a68-a119-944d33520b79	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
53ef57a0-531a-46dc-889f-aee5b743ac53	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	cfb3d350-c06d-4408-9abf-af0c82d671f0	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
e7996f71-7eb0-4db9-a85d-58f05e7f15ef	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7809c983-b341-4447-b027-0e0cc3be1e42	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
74249553-3dc9-460e-b999-8fab88f681d7	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	eaa863da-4c80-4adb-af14-f5213056b752	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
ca4765d3-0f64-4ad3-8283-bc73645da1e9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	89e5a30c-88ed-4941-bdd7-fdcfe627cab7	\N	2025-03-19 17:34:00	\N	\N	0.000000000000000000000000000000
220a2fe7-7f64-467d-ac27-771f44bcb3d9	b4add140-6cbf-4fce-8316-6977f64d7006	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-19 17:41:00	\N	10	0.000000000000000000000000000000
49e09389-a4d6-4fc5-bcc0-0274578b7303	54b4ceec-7c75-4aff-8b08-6333b1849cf8	484fa657-471f-4918-85ee-67b544937fb7	\N	\N	2025-03-19 18:03:00	5.000000000000000000000000000000	\N	0.000000000000000000000000000000
2db2eddd-1fa2-450f-8e26-58d4fe3083ef	fd20320c-4120-4bd4-bd82-379fe35b122c	484fa657-471f-4918-85ee-67b544937fb7	\N	\N	2025-03-19 18:03:00	2.000000000000000000000000000000	\N	0.000000000000000000000000000000
40430ddc-5345-4661-be79-ce49342a71f0	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-18 18:18:00	\N	60	0.000000000000000000000000000000
56a8c43f-8145-4d14-a75d-583855559cf2	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-19 18:19:00	\N	32	0.000000000000000000000000000000
08c0db44-2b42-4d48-8add-f766ad533dd1	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	84977836-f444-44ee-aa14-8d1b37e58ade	\N	2025-03-19 07:41:00	\N	\N	0.000000000000000000000000000000
b9a0a886-c1fc-4cfd-a02f-3b5af13b67e8	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cc3ee514-2621-41b1-8df2-82a678cc1d09	\N	2025-03-19 07:41:00	\N	\N	0.000000000000000000000000000000
6019f776-2af9-4f88-a187-2a47a0f978f8	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b25ad092-5e7e-401c-894e-44da86bb45f5	\N	2025-03-19 07:41:00	\N	\N	0.000000000000000000000000000000
105fbd34-4425-4d00-ace3-44c2d9f9c1da	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	515d73ed-14ae-46ad-b5d0-bf070bdeab94	\N	2025-03-19 07:41:00	\N	\N	0.000000000000000000000000000000
752bad1f-d26f-484d-8265-13580284502d	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	601736a1-dd30-46a0-ac7a-a64a0b1c5209	\N	2025-03-19 07:41:00	\N	\N	0.000000000000000000000000000000
60575c2b-8669-4488-8e54-49998a6a3c5f	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	25972fb9-fbe4-4e78-95aa-3e05f0355c72	\N	2025-03-19 07:41:00	\N	\N	0.000000000000000000000000000000
741e9754-381e-4be1-b798-df0915d37524	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	87f66827-72ea-4601-8074-90df4112bf9e	\N	2025-03-19 08:37:00	\N	\N	0.000000000000000000000000000000
0e16bc57-f5d4-4a3c-b2c1-0fa1cfed8422	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	89216a31-f050-4032-9a47-3f844451becd	\N	2025-03-19 08:37:00	\N	\N	0.000000000000000000000000000000
6b79d55e-9452-4edc-b4b0-0f4003e73fe7	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	60ad0476-2b10-4d05-b29d-d412f839d08f	\N	2025-03-19 08:37:00	\N	\N	0.000000000000000000000000000000
614cb4cc-e270-4483-a82e-22cd9eb92b32	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	d39f621b-b7a2-42f4-b9a1-6c75e8ac101c	\N	2025-03-19 08:37:00	\N	\N	0.000000000000000000000000000000
eb6a0d8f-5f7f-41f9-aa11-b4d1b8e72d15	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	61bce086-4d3a-430b-bfa8-87e4f1d29a08	\N	2025-03-19 08:37:00	\N	\N	0.000000000000000000000000000000
f1df4b10-7fdf-4a9c-bd08-cb602a6eb181	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	009b99f8-c02c-4332-8b7d-222aab1ac91b	\N	2025-03-19 08:37:00	\N	\N	0.000000000000000000000000000000
a6b48148-e466-4085-85ee-76c2ad0c328a	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	d45b0693-aa99-4849-a670-ec69b51ca834	\N	2025-03-19 08:37:00	\N	\N	0.000000000000000000000000000000
c2bb5d91-a36d-4c0e-82e0-da47f21d3988	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	8613cc8e-6c0c-4fbb-9b08-e050ab303f59	\N	2025-03-19 08:37:00	\N	\N	0.000000000000000000000000000000
da1e8574-4436-4635-9406-9e3143ac07e7	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-20 08:39:00	\N	26	0.000000000000000000000000000000
16461564-c41e-49db-927f-990bbbe3e055	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	9366d779-11b6-4127-9097-420789813a8a	\N	2025-03-19 08:39:00	\N	\N	0.000000000000000000000000000000
df2ce7ef-cd76-44f2-8ca3-60ea359a823c	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	44b880cd-9703-4f24-89a6-67f51a383745	\N	2025-03-19 08:39:00	\N	\N	0.000000000000000000000000000000
ae69b2af-f843-4a93-88fe-2b31d4f91dc2	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	ae0397c6-4b2c-4e6f-9c2a-732ec396c598	\N	2025-03-19 08:39:00	\N	\N	0.000000000000000000000000000000
31838390-bb56-4238-930c-f4c1454324dc	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	78532087-872d-464c-b15e-6a60134e3922	\N	2025-03-19 08:39:00	\N	\N	0.000000000000000000000000000000
3a8898ae-5147-4244-9ab2-37463dc4db40	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	6ea77c7f-1c8f-475e-aeab-4313638d964d	\N	2025-03-19 08:39:00	\N	\N	0.000000000000000000000000000000
fcece180-209b-4754-8080-774286362874	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	c873be22-757a-4150-9331-24c138246bae	\N	2025-03-19 08:39:00	\N	\N	0.000000000000000000000000000000
5377d65e-86c9-4023-84ef-08ebc7a0470b	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	d7b35298-f8c8-44b0-a9da-767e035c4a63	\N	2025-03-19 08:39:00	\N	\N	0.000000000000000000000000000000
89436183-9e3d-4ebf-8b93-e114b084fccf	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	fae0fe25-a965-4f09-8c33-e88baca7a64b	\N	2025-03-19 08:39:00	\N	\N	0.000000000000000000000000000000
f8700dfd-5dcf-4303-8668-8539c51e5630	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	390c631b-e6a4-4eb4-b372-9a991d5c2de1	\N	2025-03-19 08:41:00	\N	\N	0.000000000000000000000000000000
ed5819c5-ebd7-4384-87a3-244b011a63ba	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	9b8a4fb7-9095-4b89-85fe-7f6029f6bd48	\N	2025-03-19 08:41:00	\N	\N	0.000000000000000000000000000000
0d266676-8773-4f29-84bb-435a60924e77	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	c122112d-528b-498b-b871-7f7999aa2bd4	\N	2025-03-19 08:41:00	\N	\N	0.000000000000000000000000000000
e24f2054-b5d5-49f9-89de-761ed41fc3f1	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	774c26fe-4d31-4326-a372-b57fe7ecdf27	\N	2025-03-19 08:41:00	\N	\N	0.000000000000000000000000000000
33ca7d62-9017-4cdf-8adc-fea28503cc26	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	f791d191-82f4-4cc5-b9a6-5479f2d2ee5d	\N	2025-03-19 08:41:00	\N	\N	0.000000000000000000000000000000
73a148cf-3f78-431c-bc31-1f64d471d746	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	48562621-0222-4b1b-994a-9a370f2c3d1d	\N	2025-03-19 08:41:00	\N	\N	0.000000000000000000000000000000
9cc28d9c-c738-41c8-bc6b-5f2ad819177a	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	ffea8819-4b03-4592-bd3f-ee0ded58ab97	\N	2025-03-19 08:41:00	\N	\N	0.000000000000000000000000000000
c51680be-7890-4616-ae57-6260773efc6e	5d759a32-b650-4801-9bdd-f5565943dc01	ccc27a15-e2e3-4629-bb95-cef43e631311	dac90798-e4d8-4b23-a871-307fe2661b3b	\N	2025-03-19 08:49:00	\N	\N	0.000000000000000000000000000000
b683198a-1d5c-4446-a1aa-eb36d78ed90e	5d759a32-b650-4801-9bdd-f5565943dc01	ccc27a15-e2e3-4629-bb95-cef43e631311	e735a3d4-274d-4c51-a981-2e4061a9e557	\N	2025-03-19 08:49:00	\N	\N	0.000000000000000000000000000000
435f5ad8-4931-4ced-b5e7-89067620c0b4	5d759a32-b650-4801-9bdd-f5565943dc01	ccc27a15-e2e3-4629-bb95-cef43e631311	eb54f7f4-a917-4957-bd25-d6b948b32052	\N	2025-03-19 08:49:00	\N	\N	0.000000000000000000000000000000
09568f35-705f-4e04-89fc-5b606c4e4c02	5d759a32-b650-4801-9bdd-f5565943dc01	ccc27a15-e2e3-4629-bb95-cef43e631311	69519a0e-1a44-442f-ba33-0c0a78f270f5	\N	2025-03-19 08:49:00	\N	\N	0.000000000000000000000000000000
dd628632-9d2b-456c-92ca-5cef9869db4f	5d759a32-b650-4801-9bdd-f5565943dc01	ccc27a15-e2e3-4629-bb95-cef43e631311	65e7aec2-0754-4dc0-80f4-b1e132be3ec9	\N	2025-03-19 08:49:00	\N	\N	0.000000000000000000000000000000
3ff95488-3c66-49b4-ac18-6b5425275420	5d759a32-b650-4801-9bdd-f5565943dc01	ccc27a15-e2e3-4629-bb95-cef43e631311	f1fcf9c1-760f-48bc-bfb3-763adb2ddf2b	\N	2025-03-19 08:49:00	\N	\N	0.000000000000000000000000000000
a27e3bc6-19d2-4217-93b9-00dda43312bf	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	182c2e51-4702-4273-ab5a-7c64200c0746	\N	2025-03-19 08:51:00	\N	\N	0.000000000000000000000000000000
e7c8776c-7a27-4b35-a018-2b92c0d76d6d	5d759a32-b650-4801-9bdd-f5565943dc01	f1afec29-3685-4132-8230-b7d39ce4d9a3	ac41d8ea-e738-419e-a693-56f2f8a423d9	\N	2025-03-19 08:51:00	\N	\N	0.000000000000000000000000000000
1c7bfcd7-4ce9-49a9-9322-9c9359e41dbd	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	4a96fd2b-d16f-4dcb-a384-8f420ab68a43	\N	2025-03-19 09:29:00	\N	\N	0.000000000000000000000000000000
d14d4183-df1f-4fea-8f9f-3486962ca2c5	10d00b42-11d8-4648-8bc0-da0c9aeeec08	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c8f636ac-2f52-4e49-9ef9-11bfa7ff8e17	\N	2025-03-19 09:29:00	\N	\N	0.000000000000000000000000000000
b4a2f61b-e401-44f1-bb9d-66d6d4f557c5	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	9366d779-11b6-4127-9097-420789813a8a	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
e5289fd8-8f26-47a1-bbf0-a171537b7d41	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	87f66827-72ea-4601-8074-90df4112bf9e	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
b31e12c0-bd1d-4bf0-b15e-682afff9f75b	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	89216a31-f050-4032-9a47-3f844451becd	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
c359c847-344f-4efd-a9cd-76f84aa241f4	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	6ea77c7f-1c8f-475e-aeab-4313638d964d	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
dbd67835-c574-4c39-aa19-0cdaf64aa903	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	ae0397c6-4b2c-4e6f-9c2a-732ec396c598	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
974584d1-3465-4283-b725-8891e889bd86	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	44b880cd-9703-4f24-89a6-67f51a383745	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
0cc0e520-9cab-47c6-9358-0b3b3e852aae	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	60ad0476-2b10-4d05-b29d-d412f839d08f	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
e0eeaf88-5167-4f4c-986c-f3476c7b0115	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	78532087-872d-464c-b15e-6a60134e3922	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
70d07233-38b3-4df3-b2ca-ac8a4c977914	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	d39f621b-b7a2-42f4-b9a1-6c75e8ac101c	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
4d3c5218-3e3b-4d7c-9f93-63c66166ca47	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	009b99f8-c02c-4332-8b7d-222aab1ac91b	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
25c7e1e9-e636-4e24-b39e-dcda87767710	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	61bce086-4d3a-430b-bfa8-87e4f1d29a08	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
45da65b6-ccd0-4229-81bd-4a0168a7c545	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	d45b0693-aa99-4849-a670-ec69b51ca834	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
87eeae55-7f30-4ba1-a21f-733015a247b8	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	d7b35298-f8c8-44b0-a9da-767e035c4a63	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
c65f2508-1e4e-440d-9f1d-08d669a99d91	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	390c631b-e6a4-4eb4-b372-9a991d5c2de1	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
47f1a8a7-0cf3-41d4-a962-4d03cb292585	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	9b8a4fb7-9095-4b89-85fe-7f6029f6bd48	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
bc7f5e9b-99e0-417b-b7d4-45d0f27dca1c	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f791d191-82f4-4cc5-b9a6-5479f2d2ee5d	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
eab5f92f-83e6-473d-a769-75f4c527b4dd	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	c122112d-528b-498b-b871-7f7999aa2bd4	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
f7818c1c-5a7e-4657-84bd-d2ba60ae4af1	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	48562621-0222-4b1b-994a-9a370f2c3d1d	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
3eea1e56-ce31-4b65-9e69-c23ef4524e57	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	a51c1b7f-9f48-4ff0-ba6d-e9ddd3c0eab6	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
faf3b140-f0cf-4a79-8fd3-463f7aeea0d4	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fdbd466d-50a6-41dc-8a7f-a159b7afdef6	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
346a77b1-bd83-4be9-b440-c9945d542380	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	c3e39e97-511d-4a67-b917-8c71b8529aca	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
40bf94d6-f05c-4b0f-b917-35153233d685	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	dac90798-e4d8-4b23-a871-307fe2661b3b	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
791d3919-842e-48cc-99b4-4bd34560ee07	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	e735a3d4-274d-4c51-a981-2e4061a9e557	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
6ebf2d77-d823-4907-9167-0dd6d43bf11e	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	eb54f7f4-a917-4957-bd25-d6b948b32052	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
844d1b78-0bf3-4315-a85b-f9e81ceaa722	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	69519a0e-1a44-442f-ba33-0c0a78f270f5	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
b2fc67dd-52e0-4715-9930-c554912d553f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	6953b2c8-01a6-4e7f-a809-d3aeac589ec0	\N	2025-03-20 11:34:00	\N	\N	0.000000000000000000000000000000
3586fd39-0fcc-48ae-976f-cf2ede0936e9	fd20320c-4120-4bd4-bd82-379fe35b122c	484fa657-471f-4918-85ee-67b544937fb7	\N	\N	2025-03-19 11:55:00	0.500000000000000000000000000000	\N	0.000000000000000000000000000000
0763c870-d451-4a0b-96bd-865d2c20a7ff	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	8a69cd25-ec92-4fc0-b287-c108ad7f4c90	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
0103d65a-e315-4388-b21f-5a2da5ce0d89	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	ffea8819-4b03-4592-bd3f-ee0ded58ab97	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
2d92c973-61d7-4892-89cc-484ae019c3f4	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	69bfe62d-1e43-4caf-8ca7-66b59cf0945f	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
6580b0b4-e1d5-4083-b9d1-96787ae14a00	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	afe243bd-2e38-40fe-b9d1-dde7a5c177ae	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
4371a1cc-ff90-434e-862f-980deabc349d	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fae0fe25-a965-4f09-8c33-e88baca7a64b	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
9444abc8-9ec5-43ff-ba60-47989f0bd686	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	bcbdbccf-5f80-44c3-abc2-52dca2530751	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
d636db5f-bd22-4129-8c7c-c33af6f69a94	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fab4c2bf-fb2f-4569-b149-5af5674d25fb	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
cc7d230d-88a8-4f11-82f8-337a04d11370	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	542f9cbd-3754-459a-8f89-53dddfb068db	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
dc7756a2-fb3d-4a7e-b18e-ce5cd1452133	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	4a774c08-cfa6-4276-b39a-1f4266e2af24	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
cc454594-1d5a-4804-b76b-b3ac688b6264	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	182c2e51-4702-4273-ab5a-7c64200c0746	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
54411b2f-15a2-47c3-86aa-2d4360de9a24	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	ac41d8ea-e738-419e-a693-56f2f8a423d9	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
5c486ccc-8118-4ad2-820a-03e9707e6146	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	94f2c522-108d-4c34-94c3-43c835a9d390	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
7f52782c-07ee-4f2a-9b20-a40a9e41db18	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	d24ca3d6-4562-4d12-9daf-cdbc11df1ff3	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
58c04a62-36ea-4da5-8218-f7395632712a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fb3514d3-4b69-4ac7-9ba8-2c0c7ad09ee9	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
a6a0ea87-6e03-4dd5-b6bd-e5582229452f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	8eb6c572-5b1a-47b4-9ea6-b1e31f84815f	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
c93938b0-3ebd-43da-903d-b89adedab26f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	65e7aec2-0754-4dc0-80f4-b1e132be3ec9	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
3af4e76a-7bff-40ff-8772-613591ce517c	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fae46393-32a8-4d5d-8fa2-f5c7f54cff95	\N	2025-03-20 11:51:00	\N	\N	0.000000000000000000000000000000
dfd73484-786f-4b9a-a214-9e281c8af7bc	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fca2efaf-aaa7-4f57-a79b-b2d97c45722a	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
a1e14beb-6ab0-4390-92d5-1545f1f64cbf	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	8985e007-5aea-41ae-83d9-104ff755fca3	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
62c9d6ee-ee92-4522-b911-a62f5d17b78b	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	e24613b2-3592-4332-a332-361d72a6e948	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
18ac00b4-0ae3-4b3c-82d9-65d7aebadd95	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f4aba19c-e3eb-4580-812b-716abbaa5360	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
3e532c7e-774d-4c8e-98ce-255a40a6ba25	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	86d850c9-aab5-40f8-8b92-c78a8d676861	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
395ae6a5-74ce-4636-bc0e-477a1963a49c	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f66035ca-88b2-4751-ae44-4bfc3df3ddd9	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
4e79ce8c-e1af-4d2f-9871-909edc49a8f1	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	7c236248-e0e2-4282-b9f9-29e938492539	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
f75ac321-02aa-4e57-bc2b-b40bf40458fd	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	d332d327-ef27-4775-9683-c23d324abbf4	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
def01417-0895-4246-9892-624ec42f0b1c	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	26352e3f-39b3-4861-bd56-46280b0e7ca0	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
a9f37c17-358a-4c36-a5cb-00a82237f697	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	c7b9094d-7b2b-4e6c-bfd0-9ff0b27e50cb	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
cd7b5d7c-5c35-4e3e-b051-feb5bb614f16	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	6e762d4b-4e64-491c-827a-a07ebb83c52b	\N	2025-03-20 13:21:00	\N	\N	0.000000000000000000000000000000
e27c05d4-b794-4017-a54d-c7877df46cc5	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	8613cc8e-6c0c-4fbb-9b08-e050ab303f59	\N	2025-03-20 13:28:00	\N	\N	0.000000000000000000000000000000
62e28b1e-e082-4ff1-b1c8-ed00e08cd9d0	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	053f30e9-caa0-4102-9f0e-1234cd963f5d	\N	2025-03-20 13:37:00	\N	\N	0.000000000000000000000000000000
cc9eb61d-1538-4f5e-baef-0b75500f513b	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	8e865bdb-235e-480e-ae91-efe0ade2cd18	\N	2025-03-20 13:37:00	\N	\N	0.000000000000000000000000000000
b0beb5e2-6bc3-4f05-adbe-9f3966ddadae	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	31a25b9a-23bf-4b71-8e7e-252afe515001	\N	2025-03-20 13:37:00	\N	\N	0.000000000000000000000000000000
d4489291-79fb-482d-840e-bfaaa0fe5584	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	b812f223-4f78-497b-a239-1aab49ea1743	\N	2025-03-20 13:37:00	\N	\N	0.000000000000000000000000000000
1e54a793-1a97-40cd-95d5-b2f6eb97f55f	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	df19594e-fc90-4c2f-b005-2900dcd4986c	\N	2025-03-20 13:37:00	\N	\N	0.000000000000000000000000000000
2ac58d51-2c38-4879-bc3d-4f7265dd1699	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	a6ada56a-1c02-4006-b9fa-066521f947f2	\N	2025-03-20 13:37:00	\N	\N	0.000000000000000000000000000000
0ca9ccad-94e6-4ec5-9fdf-d91f0fcca622	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	5217d488-8cfa-4ee2-9af0-981f05318927	\N	2025-03-20 13:37:00	\N	\N	0.000000000000000000000000000000
3129f31e-166e-4fa7-a259-2ce0afc8a0f8	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	e8147f93-b96d-46f9-9559-a97e3482bde1	\N	2025-03-20 13:37:00	\N	\N	0.000000000000000000000000000000
699321f0-7229-41dc-95ce-9f0a9b972700	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	412bc072-99ba-4811-a2d9-9e1bd1f49705	\N	2025-03-20 13:56:00	\N	\N	0.000000000000000000000000000000
2d665661-a7ec-4b5c-a312-8394b018aced	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	9867c7ff-d3bd-4efc-b2b7-ea425350757b	\N	2025-03-20 13:56:00	\N	\N	0.000000000000000000000000000000
4b348699-6a51-45fd-9c0d-c8269995128a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	a3ab5bd5-e345-4cd7-8c46-998665bb3e05	\N	2025-03-20 13:56:00	\N	\N	0.000000000000000000000000000000
8183b41b-5351-418e-b9cc-8ee0b77c440a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	17026669-dc68-4a75-ad81-958098618536	\N	2025-03-20 13:56:00	\N	\N	0.000000000000000000000000000000
bada5349-a57f-431a-a298-03952adb4d7a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	e0ab9d68-aecb-4f5f-bc23-d5ac6c400fad	\N	2025-03-20 13:56:00	\N	\N	0.000000000000000000000000000000
3ccfad23-700a-41b3-9970-a44d19cdaf7a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f1d08523-5712-47ce-9b39-f862f5cbc0b1	\N	2025-03-20 13:56:00	\N	\N	0.000000000000000000000000000000
0e951abd-0fe1-4981-935f-fa5f9b8467fa	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	7565af79-e09d-42c0-ad7c-87752275baad	\N	2025-03-20 13:56:00	\N	\N	0.000000000000000000000000000000
e677723b-aedf-43db-ae6b-9bdf5532923f	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	9228165d-6c5f-4cee-add2-f76216321ed7	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
675fc6ea-dd5a-43f4-9637-7cf557942b33	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	d911d4e3-9bd9-491c-8e29-7318b4f6abc3	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
fd2f2989-3f4d-4fd3-9964-95f386ec0e2e	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	bbf1c852-b2b5-40f9-bb0c-84ac43e99f70	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
f736611e-b7b6-4f2b-b320-131e1deea782	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	2afa7c80-bb79-4217-8fe2-b0ca0f8df5d6	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
cf6642f0-596a-432e-a90f-9813dec0acfa	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	3b1f404a-90a1-4610-9b85-42c03b617993	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
fb4acbf9-ed55-44c1-8c5d-7e6b15d1e12a	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	e1d0be60-8007-41b7-a617-33a4349a3542	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
a468235f-136f-42cc-bacf-90755e9d97a2	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	80dbd375-c3f5-4aab-9250-52dfc57c4559	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
f9a6a38b-233a-4201-ae5d-e2fd06607ff5	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	6c993d2e-d281-4f4b-affb-f16487dc346d	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
464fd909-daee-4c1c-8d8e-5cb225ba249c	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	02b26305-3d57-47e3-9ae9-3b0e8609ebb4	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
2f54d585-7f7b-411b-a5a2-c5ac0298bd0b	4ac2b819-a667-4371-9396-d42cb622a0ea	ccc27a15-e2e3-4629-bb95-cef43e631311	ef98a5a4-249b-4ebc-9fec-8860af21db74	\N	2025-03-20 14:09:00	\N	\N	0.000000000000000000000000000000
ad5df2fa-7a6a-44d9-ae1a-fb95ce787675	4ac2b819-a667-4371-9396-d42cb622a0ea	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-20 14:10:00	\N	10	0.000000000000000000000000000000
3d1e1045-9391-4ba8-bcc3-a1d7a6a7a515	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	bb99c055-372c-448e-998f-917aae842622	\N	2025-03-20 14:12:00	\N	\N	0.000000000000000000000000000000
495c0fac-bc63-4d39-be68-1ff4f569df26	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	c782c53d-92d5-4973-9732-320d27419b4b	\N	2025-03-20 14:12:00	\N	\N	0.000000000000000000000000000000
7f2e19ba-4492-47a3-8db9-b963fcc10cc2	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	563d96a6-8e38-430e-babf-ee0c2f4d7fde	\N	2025-03-20 14:12:00	\N	\N	0.000000000000000000000000000000
48ab80df-9990-471e-85d6-023d398f3237	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	06669d3a-997a-424a-a1b2-dccd2ca5afff	\N	2025-03-20 14:12:00	\N	\N	0.000000000000000000000000000000
a5d70a81-2439-46c4-86b4-83fe2a038113	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	c89f09f9-ef40-4546-837c-a79818a83678	\N	2025-03-20 14:12:00	\N	\N	0.000000000000000000000000000000
65cb4b34-d297-4f55-b53e-99adcebc5106	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	f0e00657-e89a-4928-80eb-ba36772aedc6	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
ad364f76-36b5-4639-9b2c-ff779cbe2f3f	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	515d73ed-14ae-46ad-b5d0-bf070bdeab94	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
c6fddd27-9ba3-421c-850b-7f1da6817777	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	4a96fd2b-d16f-4dcb-a384-8f420ab68a43	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
317b3fc3-4960-4bc4-a661-073e7bb748aa	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	b008220f-bbbe-4263-9f10-62fa3cb7646b	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
2b3075c2-57b2-47cc-9c91-37b910e030dd	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	9b54d325-6a79-4209-88c0-d0ce48b061e1	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
5ba101cd-09dd-41e0-b953-981ddb571cd7	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	b80dbd71-a655-4db4-ba29-bfa073401e65	\N	2025-03-20 14:14:00	\N	\N	0.000000000000000000000000000000
a3c611da-31d3-4e09-aace-b3641a796aa0	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	ddd9d0da-4bff-4b4c-ba0e-3eaa957ee2e9	\N	2025-03-20 14:14:00	\N	\N	0.000000000000000000000000000000
6167dec9-16d8-4355-840e-0ba0fce7e541	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	d70cbb22-9a6f-41c7-b9e8-8f621605a966	\N	2025-03-20 17:01:00	\N	\N	0.000000000000000000000000000000
449da66e-8f53-4051-9877-c5ed85f7e83f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	cb02c030-9637-433b-9a36-ec9173c2810c	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
59d10762-acbe-4b6e-93df-d69fa2f45aef	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	6f2ca0b5-c363-4573-8124-fc443a02df77	\N	2025-03-20 14:14:00	\N	\N	0.000000000000000000000000000000
ad35540a-ae8f-4616-b8d4-8eb984cc037e	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	59f49012-0ead-486f-bdd7-a8a4ba533865	\N	2025-03-20 17:01:00	\N	\N	0.000000000000000000000000000000
d5050296-cfd7-4a3b-8c77-345102a39f20	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	000b1ceb-1818-466c-acdd-387a685ac3a5	\N	2025-03-20 17:01:00	\N	\N	0.000000000000000000000000000000
4f3bb0bd-bb84-4b36-a530-0032b88fa999	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f414baa4-cc45-479d-b478-678b6f661975	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
cdf8aefd-f3a4-45b5-be1d-861e1a5bc725	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	d2112b7f-8baf-4bb2-8687-58573f87e3ed	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
ed5bcb73-fc2a-4d45-a034-8eef41b2c3ae	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	7809c983-b341-4447-b027-0e0cc3be1e42	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
cd995028-5c8c-4131-9388-6c989fa36be7	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	31ae7e9b-5a43-4387-b0a1-0a54d4e51cbf	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
b2f08ea6-b723-4841-982a-61c098c34152	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	84b66909-d79c-4906-9c86-7f3d24139942	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
d6ea02bc-b985-458a-ad5b-53fa1631cf5f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	0247d8b4-c286-4961-97ae-9b665a7f95ff	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
45035da3-95ed-4515-b40c-ae1e29f3be5a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	828b3c79-f2e8-4b43-b544-8c32d7048d9c	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
e60617f4-d23c-422b-b286-b8fc7b9a43a4	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	75b07e7e-44f4-4a15-ba4f-f06579a7ef7f	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
be213932-ed95-4650-8e76-17ca1a403f7f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	d3981126-c996-457f-9b9a-2421e3f2aa9e	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
1a8112da-c418-41a5-ba6b-4de1725b36ee	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	b58192d8-e35b-4f9c-aaa6-24140e8272fc	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
8f27739d-f649-47a6-b586-4463bc73aa23	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	a10cf89d-c57f-4a62-9fb1-119edefe636f	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
1c1cf899-5295-4137-8a28-4716e668b588	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	d2112b7f-8baf-4bb2-8687-58573f87e3ed	\N	2025-03-20 14:14:00	\N	\N	0.000000000000000000000000000000
a0dcc28a-7cb0-4c8d-86e5-3db01245f497	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	98df8283-4c56-47c8-b6aa-effe4e8e955d	\N	2025-03-20 17:01:00	\N	\N	0.000000000000000000000000000000
178b6ff7-f5b2-41ad-83b4-d1903036755e	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	cfb3d350-c06d-4408-9abf-af0c82d671f0	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
39ec5309-a000-4854-9272-835ddb393802	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	eaa863da-4c80-4adb-af14-f5213056b752	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
572aa0d3-573e-4026-87de-57461325ba40	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	71f3330d-883b-4657-b368-2c5e284a5c60	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
54508b0b-5b44-47cd-ae0e-4798a2f522e3	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	b80dbd71-a655-4db4-ba29-bfa073401e65	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
ffab9493-18c6-424a-9c30-fb75663e1313	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f7de6661-7792-4d8d-a45c-457ab785cbfa	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
627e608d-acb2-4883-b7ea-ecdd07126009	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	84ceee2a-a15b-4ae3-8f41-3bf65bfd8aa8	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
57b719e0-fced-438f-99ec-03986277c50c	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	89e5a30c-88ed-4941-bdd7-fdcfe627cab7	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
aeadcbf2-fc3e-4081-acfd-faedc789b18e	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	5fbbb6c8-e641-45df-a4b7-0858e5804b7a	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
d46432c7-94cf-4141-b42e-c23a0e7d5a48	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	3b6daea4-13ff-4785-a5d6-0f1ad244749a	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
2cb3f681-e96e-4f5d-80a2-79472e76be96	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	68caa459-3a41-40df-8c19-a1e54bcad78d	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
4eba77cc-de86-4af6-92b9-922a4df60487	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	1d357105-a6c6-499a-af09-f9160e2d478b	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
b61da624-9f60-456f-851f-30b114aba6eb	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	56a58bf6-db34-4b15-a4ea-4d59fbcc1581	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
e8b10d11-b1e0-4ffc-b3d4-a023e1c0e318	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	6f2ca0b5-c363-4573-8124-fc443a02df77	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
8e0cf72c-3d2e-4f4f-95d9-8c1d63852b1f	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	8e865bdb-235e-480e-ae91-efe0ade2cd18	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
930acb37-d39a-446f-b771-190e36ce88dd	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fc2df53e-4204-4c44-9816-6d6bcd758134	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
5276c048-905f-4a0c-ac02-7e95da7c599e	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	deeadf52-62d8-4aed-992f-2c634c544bde	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
f7674470-1a80-4f25-b515-b669ea165555	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	fed79343-1c21-433f-9d45-390cd4003d69	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
44957a47-bead-40ef-b32c-a918f388c5b4	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	68f75732-4301-488f-b4de-b9dc31e2602c	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
79d566b2-dd73-4de8-883c-b069d21dddd1	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	483bc314-b21a-4e11-ac74-7273a7ccc3ed	\N	2025-03-20 14:14:00	\N	\N	0.000000000000000000000000000000
cef9390d-fa20-42f5-940d-83201c645707	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	bbc99bf6-ce4c-4f43-b3d1-6b3e7660b9d0	\N	2025-03-20 17:01:00	\N	\N	0.000000000000000000000000000000
5556dd14-6d05-480f-8d2a-c148b91f0317	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	b812f223-4f78-497b-a239-1aab49ea1743	\N	2025-03-20 19:51:00	\N	\N	0.000000000000000000000000000000
8c6a2546-1ce8-489b-9964-7495b537975c	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	80dbd375-c3f5-4aab-9250-52dfc57c4559	\N	2025-03-20 14:31:00	\N	\N	0.000000000000000000000000000000
36003c5b-e824-4d5e-b505-d592dbb70902	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9b54d325-6a79-4209-88c0-d0ce48b061e1	\N	2025-03-20 14:31:00	\N	\N	0.000000000000000000000000000000
41598b64-5200-4660-ac05-ec947a5819ef	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	752633cc-ba92-467f-a476-15b04b811a2f	\N	2025-03-20 17:34:00	\N	\N	0.000000000000000000000000000000
b1f58240-4b2e-4ee3-89bf-319183f04aa7	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	e2d7e9d4-dcb8-47bd-b745-b9dc380cc1a3	\N	2025-03-20 19:51:00	\N	\N	0.000000000000000000000000000000
5886e414-423a-4295-aad8-46078eb3cc75	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	b008220f-bbbe-4263-9f10-62fa3cb7646b	\N	2025-03-20 14:31:00	\N	\N	0.000000000000000000000000000000
4cd66288-f9a7-4172-879e-5205e0fb182e	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	94d4fe13-aaed-4a41-b1b3-e2f4a6c7bc23	\N	2025-03-20 17:51:00	\N	\N	0.000000000000000000000000000000
413c57c6-e22a-4cc4-9277-ea46b186ac51	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	640e79ba-ceb6-4639-9c63-5d7ae0bad4a6	\N	2025-03-20 17:51:00	\N	\N	0.000000000000000000000000000000
a131b16f-0bc1-4b9a-9f0e-d180f987af25	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	040e24fc-b0fc-417e-b88a-0abd8bdf95d1	\N	2025-03-20 19:51:00	\N	\N	0.000000000000000000000000000000
34b8e5c1-0986-4074-9482-036869c8fce5	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	098d911b-a6c2-45da-8ea3-145b547bd4a3	\N	2025-03-20 14:31:00	\N	\N	0.000000000000000000000000000000
8f4e48f3-c1c3-4349-9be8-da33c9cfa9e8	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	3be028d9-01a3-4ab9-a1f5-9c05aff3e2d7	\N	2025-03-20 17:51:00	\N	\N	0.000000000000000000000000000000
687b2529-845c-41e0-a503-c4984c062600	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	4a96fd2b-d16f-4dcb-a384-8f420ab68a43	\N	2025-03-20 20:17:00	\N	\N	0.000000000000000000000000000000
2ca227e9-9235-496e-b219-640d7b5ca4f3	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	3dae56cb-db5f-45bc-98cf-6ad25e7b2c0b	\N	2025-03-20 14:31:00	\N	\N	0.000000000000000000000000000000
1c9aef8e-0a08-46da-87bf-246a4f0f312c	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	239489c5-4c3a-4e9a-bc67-df5b08f89821	\N	2025-03-20 14:31:00	\N	\N	0.000000000000000000000000000000
5576e9da-7da8-4372-90ed-a2db4c337a64	76269788-c718-4340-bd29-6634790ddddc	484fa657-471f-4918-85ee-67b544937fb7	\N	\N	2025-03-20 14:31:00	3.000000000000000000000000000000	\N	0.000000000000000000000000000000
0b7a82f9-efaf-4520-8091-cb9c86b5a5d5	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	e21e46cf-2383-46a6-b841-5cd8585310a0	\N	2025-03-20 17:51:00	\N	\N	0.000000000000000000000000000000
f69ff4ef-743d-44e8-8f9e-02684dd27992	10d00b42-11d8-4648-8bc0-da0c9aeeec08	484fa657-471f-4918-85ee-67b544937fb7	\N	\N	2025-03-20 17:56:00	7.500000000000000000000000000000	\N	0.000000000000000000000000000000
2d653c48-4496-4f9f-b0f1-d15b27f1562a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	e9137478-bc48-4bc9-940a-66e362511406	\N	2025-03-20 20:17:00	\N	\N	0.000000000000000000000000000000
30d19abf-16c9-4944-b4d1-6f090b31c5cf	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	31a25b9a-23bf-4b71-8e7e-252afe515001	\N	2025-03-20 20:19:00	\N	\N	0.000000000000000000000000000000
dd9a4a88-1b0b-45d7-a8d4-6074ce8f693b	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	bc68be2f-986c-4e92-b0fa-f3ab30bcc4e2	\N	2025-03-20 20:19:00	\N	\N	0.000000000000000000000000000000
f3063e41-3d6a-449b-ba1d-69072cf04578	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	31b8d89b-9901-4367-8202-d66a2e1d3ed2	\N	2025-03-20 20:19:00	\N	\N	0.000000000000000000000000000000
f2c933ae-1c99-40b0-a4df-925220d4607b	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f62ecde9-5b31-497d-98bb-e15c19bcfcae	\N	2025-03-20 14:31:00	\N	\N	0.000000000000000000000000000000
35ec2e50-8ef2-40a4-9b0c-d673962d428d	76269788-c718-4340-bd29-6634790ddddc	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	0e87e667-8e98-4395-ab44-9efff926e2eb	\N	2025-03-20 14:31:00	\N	\N	0.000000000000000000000000000000
87d6791c-a905-4c5d-9985-f76c6686f230	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-20 18:06:00	\N	66	0.000000000000000000000000000000
3a96790d-e91d-4bd6-823b-83c128e78db5	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c8f636ac-2f52-4e49-9ef9-11bfa7ff8e17	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
50700a94-bc86-4440-be06-40c5bdad3be5	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	9fd58b6f-d5f1-4aca-8be0-47ca89f68806	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
94ff8413-08df-4156-bd64-22c1065cf3f3	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	84977836-f444-44ee-aa14-8d1b37e58ade	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
61d65fb7-0545-4370-89cf-56db84486c4f	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	c782c53d-92d5-4973-9732-320d27419b4b	\N	2025-03-20 20:19:00	\N	\N	0.000000000000000000000000000000
30ae9708-5ea2-4382-a554-f09601a39760	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	ca09d925-d5f3-40c2-9c23-9581ff82e0ce	\N	2025-03-20 20:19:00	\N	\N	0.000000000000000000000000000000
9c39534d-becd-424b-96ab-f3893fce73c8	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	c89f09f9-ef40-4546-837c-a79818a83678	\N	2025-03-20 20:19:00	\N	\N	0.000000000000000000000000000000
2fdf11a3-c938-4a02-86c2-98c50c628250	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	a3068a89-90a9-4327-8e3d-2c5ca0b30e4b	\N	2025-03-20 15:23:00	\N	\N	0.000000000000000000000000000000
473391c1-4aac-412f-b077-6929b6ca426f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	2ee1a629-8b0c-4cab-90c8-8382d051af74	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
67bd1ff7-10d9-463a-bbb6-dc4de3bfb53a	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	1250e1e4-92ef-495b-acff-086b2a895501	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
e98b7b3c-2f27-4f1a-8bb7-8ac5e41d4789	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f3912ad0-bb46-4f02-91a8-14518c75ff9d	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
42ab21c9-c041-424a-ba0a-ed34fbef89fc	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	25972fb9-fbe4-4e78-95aa-3e05f0355c72	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
55b7beb7-31ae-454a-b19a-98888887056f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	31b8d89b-9901-4367-8202-d66a2e1d3ed2	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
5b97e429-9f38-4a73-a785-4b7f533a4bee	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	25972fb9-fbe4-4e78-95aa-3e05f0355c72	\N	2025-03-20 20:19:00	\N	\N	0.000000000000000000000000000000
77f57e2e-99e1-46cc-96a9-00ee27249d78	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	2a8a107c-523a-4d99-aeaa-9925b85bc8c2	\N	2025-03-20 15:23:00	\N	\N	0.000000000000000000000000000000
18724b38-58bb-41b9-a8aa-a9628f1a210e	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f69dd59d-a3af-4519-a7c5-a9cd7d7aef8e	\N	2025-03-20 15:23:00	\N	\N	0.000000000000000000000000000000
ee78bc2b-9a2a-4faa-9c21-1e3f6f341dbc	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	6561682c-6e32-465c-8aa0-fa4749336841	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
cf2e4dc7-e9b7-4520-9b9f-e8f73b5c3112	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e9137478-bc48-4bc9-940a-66e362511406	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
ffc8104e-9a34-407b-8457-ff95ed212ab3	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	5716687c-e31c-4887-9b77-91160a8f525d	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
2a861ba7-e760-483c-96b6-0f8ca73b4e64	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	08fceb77-47bb-4e55-8369-d647d72fc8cd	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
57cc1ab2-212e-4056-9abc-3289a7d6f6b0	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3839663a-3317-43ea-9758-ce36db59b060	\N	2025-03-20 18:07:00	\N	\N	0.000000000000000000000000000000
9783b840-055e-45cb-874f-21b658525589	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f1172350-f5c5-44f5-9404-57a8e59c1335	\N	2025-03-20 20:44:00	\N	\N	0.000000000000000000000000000000
733be34f-d7fc-403a-9138-7826ff95193a	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	e6a9f377-3d07-43b9-985a-fbbcc05f1a87	\N	2025-03-20 15:23:00	\N	\N	0.000000000000000000000000000000
37b5b542-e158-4adb-9fe7-167f566a91f5	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	1614bb2d-bc03-4b20-9f62-9457f3f56e34	\N	2025-03-20 15:23:00	\N	\N	0.000000000000000000000000000000
e5cbbc39-d613-4e9c-8644-2732700c51ff	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	563d96a6-8e38-430e-babf-ee0c2f4d7fde	\N	2025-03-20 18:43:00	\N	\N	0.000000000000000000000000000000
efd8e043-57d1-4ee8-8aab-e7eb93564611	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	0b7c5a27-21c9-4ca5-a5d2-a169269ce8b0	\N	2025-03-20 20:44:00	\N	\N	0.000000000000000000000000000000
36b89a58-3c91-425f-88d0-61430c6a7529	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	f8e2af02-0e7b-49a6-8905-e3b873f0469f	\N	2025-03-20 15:23:00	\N	\N	0.000000000000000000000000000000
1eb53e58-6397-47a7-945e-ff995669f244	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	e62c2e3c-2995-4af5-a63b-fb5d58239718	\N	2025-03-20 15:23:00	\N	\N	0.000000000000000000000000000000
3afc15a1-13e5-4e94-8122-48f210386246	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	bb99c055-372c-448e-998f-917aae842622	\N	2025-03-20 18:43:00	\N	\N	0.000000000000000000000000000000
00809a32-1131-41b7-a77e-235a2737fe98	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	c92e3031-91f8-438e-85aa-8d1eeff98491	\N	2025-03-20 20:44:00	\N	\N	0.000000000000000000000000000000
d03bb426-fc3d-44e4-a967-26d1a19959eb	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	68f75732-4301-488f-b4de-b9dc31e2602c	\N	2025-03-20 15:28:00	\N	\N	0.000000000000000000000000000000
9188e565-85ad-4295-807c-ad33e60769a7	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	56a58bf6-db34-4b15-a4ea-4d59fbcc1581	\N	2025-03-20 15:28:00	\N	\N	0.000000000000000000000000000000
3b1402fd-5e08-4ae7-b5ac-dcb8f1c449e1	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	06669d3a-997a-424a-a1b2-dccd2ca5afff	\N	2025-03-20 18:43:00	\N	\N	0.000000000000000000000000000000
73aefdc2-9593-4ae0-8ee0-3c28f39f1763	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	40f36a92-85ca-4c2f-a47d-a55d3b1feadf	\N	2025-03-20 20:50:00	\N	\N	0.000000000000000000000000000000
21ac3aa9-ba92-4e6a-a61f-9ddbad5b2b74	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	483bc314-b21a-4e11-ac74-7273a7ccc3ed	\N	2025-03-20 20:50:00	\N	\N	0.000000000000000000000000000000
761284b2-ee48-411c-bce2-2e8902685c16	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	75b07e7e-44f4-4a15-ba4f-f06579a7ef7f	\N	2025-03-20 15:28:00	\N	\N	0.000000000000000000000000000000
ba43d39e-464c-4fb2-85d4-569d55a0244e	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	f6c1869a-ef18-41aa-a7c1-7d5f3153790e	\N	2025-03-20 18:43:00	\N	\N	0.000000000000000000000000000000
dab66517-14b0-4b89-9ca1-d1164a6382f0	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	ddd9d0da-4bff-4b4c-ba0e-3eaa957ee2e9	\N	2025-03-20 20:50:00	\N	\N	0.000000000000000000000000000000
f3228c44-22d0-4750-8ccb-f13c6601fe71	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	bd434c89-dd96-431f-a47f-89a3afb034a5	\N	2025-03-20 20:50:00	\N	\N	0.000000000000000000000000000000
243118ea-72ff-4795-be30-97456c893080	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	f7de6661-7792-4d8d-a45c-457ab785cbfa	\N	2025-03-20 15:28:00	\N	\N	0.000000000000000000000000000000
5bd8f869-c70e-4b73-b010-fdf2742f94a0	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	13c78c6e-5291-4dc2-bd88-735c18eff6be	\N	2025-03-20 19:03:00	\N	\N	0.000000000000000000000000000000
f0a4daf5-56d8-4f48-a1ab-41a4b619be91	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	97c72fb4-f254-4cda-901b-23216aff55b7	\N	2025-03-20 19:03:00	\N	\N	0.000000000000000000000000000000
c8e50b36-227f-4fcd-bb4f-3f297e00c879	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	e8147f93-b96d-46f9-9559-a97e3482bde1	\N	2025-03-20 20:50:00	\N	\N	0.000000000000000000000000000000
58c49736-932d-453d-999e-f107dd6f2e00	d5c43a0c-6249-49e4-8d04-22024aa8193a	ccc27a15-e2e3-4629-bb95-cef43e631311	752633cc-ba92-467f-a476-15b04b811a2f	\N	2025-03-20 15:28:00	\N	\N	0.000000000000000000000000000000
391bf5bd-8110-4fca-9639-fa218718d47a	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	01fd8dcb-da68-4a68-a119-944d33520b79	\N	2025-03-20 19:03:00	\N	\N	0.000000000000000000000000000000
73eb7c2a-b866-4a2e-8688-62da5b79aa19	38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	380a0334-7940-4e82-b8b4-a2af00f0aace	5217d488-8cfa-4ee2-9af0-981f05318927	\N	2025-03-20 20:50:00	\N	\N	0.000000000000000000000000000000
e5bb72e9-187a-4158-b7fa-13bf1c0200ed	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	a2894922-f746-4130-b88b-ca59df8594d1	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
420df68e-78d4-4971-83fa-f27a5ccdb461	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	601736a1-dd30-46a0-ac7a-a64a0b1c5209	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
19d9ace7-db3a-4266-9022-95005167ae06	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	13c78c6e-5291-4dc2-bd88-735c18eff6be	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
eab47905-7260-4e8e-867b-9ec90fad4d39	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	df19594e-fc90-4c2f-b005-2900dcd4986c	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
15dfe8f2-bc6d-45ff-84f2-f6458c40b558	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	a556ab62-5e4f-4b65-8740-5367087cc0a4	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
a6404ca8-e91b-4f8c-baad-b6d790c765e7	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	b25ad092-5e7e-401c-894e-44da86bb45f5	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
c33aac52-6caa-4fb8-8ff6-62a23b592052	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	f414baa4-cc45-479d-b478-678b6f661975	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
cc809a85-8f92-46db-8739-185b85c45b3c	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	cc3ee514-2621-41b1-8df2-82a678cc1d09	\N	2025-03-20 16:38:00	\N	\N	0.000000000000000000000000000000
6ea8d0b6-8221-4424-926a-37f663dbb093	d9f35efc-fa21-4518-820a-7e1e3da39e73	380a0334-7940-4e82-b8b4-a2af00f0aace	4092c9d7-0d27-4f8b-b709-2d034316cf9f	\N	2025-03-20 19:35:00	\N	\N	0.000000000000000000000000000000
6ff2fe79-79fb-4568-b77c-4bb0755bdc2a	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	5fbbb6c8-e641-45df-a4b7-0858e5804b7a	\N	2025-03-20 14:12:00	\N	\N	0.000000000000000000000000000000
32d812a9-e0a9-47fa-aa78-04d5c862df4c	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	fc2df53e-4204-4c44-9816-6d6bcd758134	\N	2025-03-20 14:12:00	\N	\N	0.000000000000000000000000000000
57c7b9b1-045c-4bc5-b5b4-c3bfee4e2cac	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	b008220f-bbbe-4263-9f10-62fa3cb7646b	\N	2025-03-20 14:12:00	\N	\N	0.000000000000000000000000000000
bb521d06-9b4d-449c-bab1-3c546e84f6f8	b4add140-6cbf-4fce-8316-6977f64d7006	ccc27a15-e2e3-4629-bb95-cef43e631311	68caa459-3a41-40df-8c19-a1e54bcad78d	\N	2025-03-20 14:12:00	\N	\N	0.000000000000000000000000000000
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public.tasks (id, name, description, type, status, complexity, tags, estimated_time, project_id, created_at, updated_at, cost) FROM stdin;
b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	Збірка рами	Результат: \nЗібрана рама, з променями, стійками, болтами на стек, моторами і неусадженою термозбіжкою на промінях	PRODUCT	NEW	\N	\N	12.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
ccc27a15-e2e3-4629-bb95-cef43e631311	Пайка моторів	Напаяні мотори, гребінкою, промиті і пролаковані контакти	PRODUCT	NEW	5	\N	12.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
f1afec29-3685-4132-8230-b7d39ce4d9a3	Фінальна збірка	Установка втх\nустановка ПК\nУстановка камери\nУстановка РХ\nКришка і стяжки	PRODUCT	NEW	7	\N	23.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
7cf25d99-7da4-4437-86dc-3bb79b7db073	Обліт		PRODUCT	NEW	\N	\N	10.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
b984449d-3e0c-43fb-9209-e3a5fd7f3733	Усадка термозбіжок		PRODUCT	NEW	\N	\N	3.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
0290a525-b422-4a2d-9a9c-48a0ed38de78	Розпаковка рам		GENERAL	NEW	5	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
cf2f35ed-f1c6-424e-80b8-04fc1a082a60	Сортування болтів		GENERAL	NEW	\N	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
f1ef797a-b1ed-46fa-9341-6b661cd4848a	Порізка термозбіжки		GENERAL	NEW	\N	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
406f31ba-96a2-4328-aca2-2ead65149553	Натягання термозбіжок на проміні		GENERAL	NEW	\N	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
3e3e8139-1872-429e-a284-014f912d309c	Тонка пайка	ELRS припаяний до ПК. Припаяний дріт ПІ	INTERMEDIATE	NEW	4	\N	15.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
2bd3b08c-5ef4-4da0-b178-1676cd40db25	Пайка силових дротів	ESC з силовими дротами і конденсатором. Промитий. Пролакований	INTERMEDIATE	NEW	4	\N	10.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533	0.000000000000000000000000000000
f3588791-91aa-430c-9d12-d8c43892c4cd	Нарізка моторів		GENERAL	NEW	\N	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-15 11:36:18.926	2025-03-15 11:36:18.926	0.000000000000000000000000000000
380a0334-7940-4e82-b8b4-a2af00f0aace	Налаштування ESC + FC		PRODUCT	NEW	\N	\N	4.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-17 19:17:50.584	2025-03-18 09:42:54.568	0.000000000000000000000000000000
484fa657-471f-4918-85ee-67b544937fb7	Помічні роботи		GENERAL	NEW	1	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-19 08:15:39.021	2025-03-19 08:15:39.021	0.000000000000000000000000000000
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
-- Name: Payments Payments_pkey; Type: CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_pkey" PRIMARY KEY (id);


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
-- Name: Payments Payments_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_created_by_id_fkey" FOREIGN KEY (created_by_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payments Payments_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public."Projects"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payments Payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maestro
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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

