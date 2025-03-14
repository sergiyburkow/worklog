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
    quantity integer
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
    updated_at timestamp(3) without time zone NOT NULL
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
bbafa0b4-6b4a-45c4-8357-f455f20ae06d	00024	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:35:25.764
f008fc7d-cf2f-486f-852b-a2e88e86113f	00243	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-14 20:39:32.654
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
\.


--
-- Data for Name: Projects; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Projects" (id, name, client_id, start_date, deadline, actual_end_date, status, quantity, updated_at) FROM stdin;
f26cc409-bfb4-453f-82fe-9e7fe5fc4847	524 каміки з тепловізійною камерою	44090811-4903-469d-8a14-40c07c817c1c	2025-03-07 00:00:00	2025-04-07 00:00:00	\N	IN_PROGRESS	524	2025-03-14 16:56:48.344
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
5d759a32-b650-4801-9bdd-f5565943dc01	Саня	sasha.kozlov2010@gmail.com	+380939923942	$2b$10$.U.uGd/Y8SNLwxVTXPYTE.Y806KPAs7dL0GA3QsZ/1F3TEve0rJVW	WORKER	\N	2025-03-11 20:35:02.865	\N	2025-03-11 20:35:02.865
d5c43a0c-6249-49e4-8d04-22024aa8193a	Максим	guardiamax660@gmail.com	+380972461180	$2b$10$Xtg86ymOytfnR9sBL3xHwO.hFzEq8euTAGEUoC20i1d59iocTtGVC	WORKER	\N	2025-03-12 17:30:42.285	\N	2025-03-12 17:30:42.285
1554f0d4-f870-4c35-805e-90cd37b2e47f	Олексій	alex59.kovalenko@gmail.com	+380671053855	$2b$10$PuerEQ4q8smo.9sv8HRGAeW2Cr7bMn7dFoYro68A24xX3CqCLuE/W	WORKER	\N	2025-03-12 17:43:36.474	\N	2025-03-12 17:43:36.474
54b4ceec-7c75-4aff-8b08-6333b1849cf8	Артем	artemsaliychuk88@gmail.com	+380930334823	$2b$10$F9u80sXxUfm/XSuooA.Isef5qK8AHwu5v7ZXUyREYziormsxfOf6K	WORKER	\N	2025-03-12 17:47:36.911	\N	2025-03-12 17:47:36.911
4ac2b819-a667-4371-9396-d42cb622a0ea	Богдан	Garrik2000@ukr.net	+380677803740	$2b$10$GUzCLCVXpHhVSfedrokYrOvJtG2J6l6TWnYerURD86tcAYBfo3rsW	WORKER	\N	2025-03-12 18:29:31.83	\N	2025-03-12 18:29:31.83
38e25bbe-008e-48d7-bdea-d8b04e7ffbb6	Сергій	cray@sscgroup.net	\N	$2b$10$X7H2FrU5viqsA72NKAAB.OYjkTJAkC2ZUz2aCn2D9j1yA9xk5rskq	ADMIN	\N	2025-03-11 22:29:13.458	\N	2025-03-14 15:04:45.567
f5eeadc7-c8f8-4ff1-b205-945afd554a96	Ігор	wellman3033@gmail.com	+380934927212	$2b$10$t7ydu2tHpRV2cUuSPoycROq/mzRTVq5jYfDpnXZ.J8zM1oBoUII9.	WORKER	\N	2025-03-14 15:56:56.798	\N	2025-03-14 15:56:56.798
76269788-c718-4340-bd29-6634790ddddc	Олена	none1@none.com	+380678160270	$2b$10$kXl7cnvhk0hZAYnnWH3Lxu6QG6nxCs1/bPVdNE9KX4ZRXJBUbMyp6	WORKER	\N	2025-03-14 16:56:18	\N	2025-03-14 16:56:18
\.


--
-- Data for Name: task_logs; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public.task_logs (id, user_id, task_id, product_id, completed_at, registered_at, time_spent, quantity) FROM stdin;
00ff1a08-a318-47ef-8d53-bfa133c84206	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-11 15:37:00	\N	21
28144bbc-7509-4e44-9ad5-102edbeacda5	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-11 15:58:00	\N	80
6359f91c-8dae-4df1-86ff-d57c186ed23d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-11 16:00:00	\N	3
9a954dc4-71af-4a8c-90a6-0f92b4b3ec15	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-12 15:38:00	\N	32
9eca3365-6b2c-486f-b9dc-b3c5d8123284	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-10 15:58:00	\N	60
b7eca10b-1bbe-4b9f-954b-16764c0b25c6	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-13 15:38:00	\N	16
bb14e3fa-dbcb-431a-a28f-d4fbf330fd2c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-07 15:58:00	\N	41
26708232-e34c-4723-bea0-2194faa17bdd	76269788-c718-4340-bd29-6634790ddddc	0290a525-b422-4a2d-9a9c-48a0ed38de78	\N	\N	2025-03-07 16:56:00	6.000000000000000000000000000000	\N
0aa9b0fe-6a6b-4f9b-a472-26e829799e42	76269788-c718-4340-bd29-6634790ddddc	cf2f35ed-f1c6-424e-80b8-04fc1a082a60	\N	\N	2025-03-10 16:57:00	7.000000000000000000000000000000	\N
ba701086-daf1-47fe-b893-f59291b668e1	76269788-c718-4340-bd29-6634790ddddc	cf2f35ed-f1c6-424e-80b8-04fc1a082a60	\N	\N	2025-03-11 16:58:00	2.000000000000000000000000000000	\N
d4475a5f-b4c6-4bc5-abd0-5318b9b9284e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7456c229-7da8-42a9-b3bc-97014383302d	\N	2025-03-14 17:35:00	\N	\N
1e99b315-d6f8-46c3-a00b-e4c0a4b353e9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3ec95bbe-0b3b-4af7-ba25-f78e1edacecd	\N	2025-03-14 17:52:00	\N	\N
6035450f-2817-4c4f-b1c6-c8a2aefbe2b9	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-14 17:51:00	\N	35
7fa61f97-6421-48bc-88ee-443c9a53486e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a3df2442-c261-4de7-bde3-fb42f86e8f11	\N	2025-03-14 18:45:00	\N	\N
c6f1c578-7076-44a1-8337-69196a3d9499	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	19fdeb63-b801-4314-a4ce-c704059948d1	\N	2025-03-14 18:45:00	\N	\N
60d95c0b-1214-401d-a9e8-94d56bab538d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	65231940-0759-434a-96b7-3dc15a03336e	\N	2025-03-14 18:45:00	\N	\N
5fc150ba-3094-4e5c-b0c2-e1f1e8894aca	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	fed79343-1c21-433f-9d45-390cd4003d69	\N	2025-03-14 18:45:00	\N	\N
9fa8bd45-b901-4d30-b2d8-970a6ca51b91	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f6c1869a-ef18-41aa-a7c1-7d5f3153790e	\N	2025-03-14 18:45:00	\N	\N
f7d8dafa-0576-4630-8525-ab85c90b6757	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	d3981126-c996-457f-9b9a-2421e3f2aa9e	\N	2025-03-14 18:45:00	\N	\N
37a540bc-95ba-4757-ad33-2f66f721b505	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	479e767b-b238-45ae-8451-d722372e30bc	\N	2025-03-14 18:54:00	\N	\N
eaa7def9-5a08-4a22-9b7b-465d9fb73dd5	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	18b1be25-b82f-4016-be4a-24ad1211dbcc	\N	2025-03-14 18:54:00	\N	\N
8763cc2b-4053-4d7d-8022-5d03c6d7a1ae	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	9d4cee0f-b79b-4ce2-9e80-ea96dbf7763b	\N	2025-03-14 18:54:00	\N	\N
c1c8bdd0-6b94-47ed-980f-bc61f8301331	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ce5e7b34-5efe-4ba9-b460-c135588b088f	\N	2025-03-14 18:54:00	\N	\N
337ce62b-ac1a-4e47-9331-34ec990d6575	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	bad7a9f0-4b12-4a69-a931-d08380e575e8	\N	2025-03-14 18:54:00	\N	\N
19902d84-96b0-4c37-adea-6213b99993c2	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8eb6c572-5b1a-47b4-9ea6-b1e31f84815f	\N	2025-03-14 18:54:00	\N	\N
cb6ed60a-46b9-4b09-944b-9abaa6732e26	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	412bc072-99ba-4811-a2d9-9e1bd1f49705	\N	2025-03-14 18:57:00	\N	\N
e440990c-ec44-4667-b74c-65df5da8b1c0	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	751c6384-02dc-45b1-9df0-81fb810e2301	\N	2025-03-14 18:57:00	\N	\N
de94ea60-6ab2-431e-a840-3e2ccab2b30c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	93975bc5-c8f0-4c51-86d7-29926d2f24b9	\N	2025-03-14 18:57:00	\N	\N
3e936b7a-6620-4963-94a1-c67f9e1f3f82	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7d9981a3-b99b-4036-85ec-2ddc6517bf42	\N	2025-03-14 19:12:00	\N	\N
bf4be59e-ada6-4cb3-a148-66503684c063	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e5fc2cb3-7620-4112-be4b-a1abddde0365	\N	2025-03-14 19:12:00	\N	\N
a6639af0-b4c7-42a9-aa85-93551b64c61b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	33b56818-edf7-42bd-93d3-fa92f66274fa	\N	2025-03-14 19:12:00	\N	\N
ec970ed4-f2b7-4ab4-acbd-a85857a250e8	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	4dac4fab-0b3f-47f4-8039-5eb68885b867	\N	2025-03-14 19:12:00	\N	\N
05e5ded2-e513-41a5-a3d1-46fe366e7604	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	74a33cba-fc25-46a5-a998-f04326faa001	\N	2025-03-14 19:12:00	\N	\N
87c228c4-f96d-4e38-bb0e-97ff872c8aee	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	98525d40-eee6-4aeb-bd86-2cdeecf6f444	\N	2025-03-14 19:13:00	\N	\N
efbaf7e4-2fc8-488c-8368-20ad6d71d2fa	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e2d7e9d4-dcb8-47bd-b745-b9dc380cc1a3	\N	2025-03-14 19:13:00	\N	\N
a271925e-8154-45e0-835f-6024b72f2f6b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a1be233c-73f5-441a-8406-af1669469c73	\N	2025-03-14 19:13:00	\N	\N
fae058c3-9bc1-4ebf-bcec-f33ce750f681	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	1614bb2d-bc03-4b20-9f62-9457f3f56e34	\N	2025-03-14 19:13:00	\N	\N
56c7a29f-54db-4594-82fd-0deda15388fc	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f8e2af02-0e7b-49a6-8905-e3b873f0469f	\N	2025-03-14 19:13:00	\N	\N
c9318670-e30b-458e-9ffd-d579e20e9cbf	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	44a24f03-8bbf-4002-b4ce-a7ac6ad21926	\N	2025-03-14 19:13:00	\N	\N
de8fe67f-07dc-4603-bcec-0ed6639bf4e1	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	364282fa-7253-4420-b2bc-4e12e51985f9	\N	2025-03-14 19:13:00	\N	\N
9f5840eb-3323-452d-b1be-e54de4c66d83	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e24613b2-3592-4332-a332-361d72a6e948	\N	2025-03-14 19:13:00	\N	\N
e05bfc8e-d16e-49b8-b1b2-659973ffb67e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8985e007-5aea-41ae-83d9-104ff755fca3	\N	2025-03-14 19:13:00	\N	\N
a8fb5cea-2940-406a-9b46-e32767cd1c61	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f69dd59d-a3af-4519-a7c5-a9cd7d7aef8e	\N	2025-03-14 19:15:00	\N	\N
f66df0a4-34e6-4c75-8991-620f20de9ec9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	86d850c9-aab5-40f8-8b92-c78a8d676861	\N	2025-03-14 19:15:00	\N	\N
a69c2ae7-dba9-4583-ba83-9bd6ea4c0237	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	b8a5def4-3743-4bcb-85d6-0dfaef34861a	\N	2025-03-14 19:15:00	\N	\N
e54aad4c-820f-4302-a436-c789049d9b50	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	c7b9094d-7b2b-4e6c-bfd0-9ff0b27e50cb	\N	2025-03-14 19:15:00	\N	\N
b47eddeb-45a8-4ed7-bbbd-9502b279ef23	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	ebd7c4b8-1263-4177-a75d-a7cd0f722b87	\N	2025-03-14 20:04:00	\N	\N
e1e1a9cc-5851-4c52-8c66-498b6bf9b386	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	e0ab9d68-aecb-4f5f-bc23-d5ac6c400fad	\N	2025-03-14 20:04:00	\N	\N
126dd3f0-7835-4545-856d-de7cc0f3bfb1	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	1d357105-a6c6-499a-af09-f9160e2d478b	\N	2025-03-14 20:04:00	\N	\N
8acc9871-0b31-4f4f-a9f5-e3752a9eea42	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	ac41d8ea-e738-419e-a693-56f2f8a423d9	\N	2025-03-12 20:07:00	\N	\N
56b8e3df-0a89-4e6e-89bb-8404b41bf7f8	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fae0fe25-a965-4f09-8c33-e88baca7a64b	\N	2025-03-12 20:07:00	\N	\N
6a64838f-2c78-4abc-a21d-f147ed8bd8e1	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	61bce086-4d3a-430b-bfa8-87e4f1d29a08	\N	2025-03-12 20:07:00	\N	\N
02e58fb7-bc34-48da-8693-f41899dae208	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	a3068a89-90a9-4327-8e3d-2c5ca0b30e4b	\N	2025-03-12 20:07:00	\N	\N
0af1eba3-f562-4301-a661-7b4482b3e5e3	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fd52e3a7-a30b-4647-822b-57206fd5388f	\N	2025-03-12 20:07:00	\N	\N
4bfffc85-e256-44d2-bdd5-533ec262935b	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	828b3c79-f2e8-4b43-b544-8c32d7048d9c	\N	2025-03-12 20:07:00	\N	\N
7c65ae1e-f900-409c-b2f4-9c4b81e7317c	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	06d5e6ac-8a7c-40f8-8069-65b26a142a6b	\N	2025-03-12 20:07:00	\N	\N
047b4a94-d207-4967-8fe7-0832a87cfed4	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3be028d9-01a3-4ab9-a1f5-9c05aff3e2d7	\N	2025-03-14 20:04:00	\N	\N
4f425169-d6ef-46d8-b095-0c3a59d7e6ce	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	d24ca3d6-4562-4d12-9daf-cdbc11df1ff3	\N	2025-03-14 20:04:00	\N	\N
e114a3eb-0a8b-45a2-9c9a-1b4005a6b9fa	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7ddba26c-08f2-4181-8ec6-982f51a57743	\N	2025-03-14 20:04:00	\N	\N
b8e0e7aa-a067-4c37-887e-19e529186fb2	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	9dd3c831-e3fc-435a-92f2-d7376b3bae0b	\N	2025-03-12 20:07:00	\N	\N
dab9d69b-1726-42ed-beef-6628e27f0d19	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	97c72fb4-f254-4cda-901b-23216aff55b7	\N	2025-03-12 20:07:00	\N	\N
24858ab5-1415-4b70-b81f-7fb0b76e1299	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	cb526458-ae1f-4a84-a7a9-e7031f612074	\N	2025-03-12 20:07:00	\N	\N
6066f305-1e8a-43d6-94c0-d36a3a6c895f	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	07874060-cff6-40ec-9b52-ec7121ef8051	\N	2025-03-12 20:07:00	\N	\N
f2eddaeb-9166-47f5-991c-f80577a0a65e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	2a3c987a-729e-4b40-b887-0d1a49f55670	\N	2025-03-14 20:04:00	\N	\N
342962b1-3f03-4529-adf7-a20c675abbfd	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	69bfe62d-1e43-4caf-8ca7-66b59cf0945f	\N	2025-03-14 20:04:00	\N	\N
699387ff-c62f-4290-b9f1-ed23d96b76da	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	bcefc7c3-f6af-417e-865a-6eeff78f928c	\N	2025-03-12 20:07:00	\N	\N
fbf9d56e-aea8-4582-8e77-176eb93d9272	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	c46da7e2-d9b7-4402-ae77-ed1bacf11bf2	\N	2025-03-12 20:07:00	\N	\N
a934a7b2-6a12-4df2-83c4-a464389809bb	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	fe5858af-d539-4e9e-bb94-e99f834bc71b	\N	2025-03-12 20:07:00	\N	\N
a7dc7666-8213-4ff8-9815-601cb19fb7f3	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	94d4fe13-aaed-4a41-b1b3-e2f4a6c7bc23	\N	2025-03-12 20:07:00	\N	\N
64a9ef55-9466-4b5f-b1a1-4031f48f2a3d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	76c316e9-683e-411b-8435-3db00497136a	\N	2025-03-14 20:04:00	\N	\N
2c7a5973-9a60-480d-9682-b3326e0af5b6	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	797368ee-d7fa-438b-b06e-b60c67479032	\N	2025-03-14 20:04:00	\N	\N
f0089f65-778d-4a29-8de5-4602066abafd	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	640e79ba-ceb6-4639-9c63-5d7ae0bad4a6	\N	2025-03-12 20:07:00	\N	\N
093dfa36-8c89-40f5-9557-044b53a0354c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	8a7d8753-a54a-4b10-8a72-1e11ca415b5b	\N	2025-03-14 20:23:00	\N	\N
163f1192-63f5-4870-97ba-c7a3714023b8	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	41482a61-e322-42ef-a5fc-6d525c2542a6	\N	2025-03-11 20:30:00	\N	\N
1e28ffe3-9f8b-4ce7-b7cf-c466a7fffcf7	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a733b4f4-38c9-4720-8388-4dc47d1343de	\N	2025-03-11 20:30:00	\N	\N
ee448009-e33c-4ef7-a853-cd874ec50df3	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a51c1b7f-9f48-4ff0-ba6d-e9ddd3c0eab6	\N	2025-03-11 20:30:00	\N	\N
ba1b80f8-289e-48b6-8545-684abc0bc3ec	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a3ab5bd5-e345-4cd7-8c46-998665bb3e05	\N	2025-03-11 20:30:00	\N	\N
a3ba331b-2a1a-4de4-a142-ed12e3d7c1c9	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	bbafa0b4-6b4a-45c4-8357-f455f20ae06d	\N	2025-03-10 20:33:00	\N	\N
aa923495-d071-4dff-8196-f243b76ad153	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	86feb425-d462-4b9c-9eb7-f4d2ff0c8696	\N	2025-03-12 20:38:00	\N	\N
f0d68c20-96e3-484f-b960-8b375b65212f	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	9867c7ff-d3bd-4efc-b2b7-ea425350757b	\N	2025-03-11 20:30:00	\N	\N
c600125a-8983-4c2c-aa73-cee66fd5fa95	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3ce8216a-1065-4346-a89b-e72df6d96ce5	\N	2025-03-11 20:30:00	\N	\N
2389726f-be5b-4896-bb25-a27c0a4e656b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	dd902aca-2a6b-47d7-9a55-83ebd5e6af79	\N	2025-03-11 20:30:00	\N	\N
05721d6a-5582-446d-9c73-9d8eaf5f394e	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	7c236248-e0e2-4282-b9f9-29e938492539	\N	2025-03-11 20:30:00	\N	\N
a8670c57-6234-44f5-861c-1dcea1f74a87	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	6dac48c7-4f4e-4e3b-b4e0-0007a2531cf6	\N	2025-03-10 20:33:00	\N	\N
6fe8b4bf-c4c3-4e0e-b87b-24c34ac2e560	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	d332d327-ef27-4775-9683-c23d324abbf4	\N	2025-03-11 20:30:00	\N	\N
2e4d58e2-1adf-4b3a-9f31-1ae7e47af099	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	aa501665-626a-408b-90f6-5bd87b7f54f1	\N	2025-03-10 20:33:00	\N	\N
c0b9fca2-9945-4661-9df9-4f283fcf7db0	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	5f00191a-e560-43ec-8ec1-793ccf929ef8	\N	2025-03-11 20:30:00	\N	\N
750f0b39-2288-4bfe-9601-88cbd41bcb12	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	fa95754b-4c40-4267-9432-53731574a5d3	\N	2025-03-11 20:30:00	\N	\N
373fbc41-fb6e-4671-809c-e84e09a5f9be	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	26352e3f-39b3-4861-bd56-46280b0e7ca0	\N	2025-03-11 20:30:00	\N	\N
34903443-9b11-4823-bd61-697fd6d76c6b	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	fca2efaf-aaa7-4f57-a79b-b2d97c45722a	\N	2025-03-11 20:30:00	\N	\N
1b514a5a-797e-4982-b8da-31eef1831aba	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f323147f-dc1c-4116-b9f9-08994fbc61ce	\N	2025-03-10 20:33:00	\N	\N
025d9b3c-6210-4544-99c6-3eb6df190d71	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	a1c53153-0c6a-44d9-a114-f890828648bf	\N	2025-03-10 20:33:00	\N	\N
897d25d7-ea8f-4d5f-9065-f681072fd7ff	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	3726f467-8872-4e1f-9ba2-374a59cc176a	\N	2025-03-10 20:33:00	\N	\N
00dac22f-317d-44c3-a098-154338744b87	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	6383b850-30a2-4fc8-942d-7639fe4bc4c0	\N	2025-03-10 20:33:00	\N	\N
872071e0-0592-4246-a97a-7315edfbdcab	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	96431ba6-25c7-4474-9832-586672953cd6	\N	2025-03-10 20:33:00	\N	\N
b7cfbd00-3303-4cba-921e-12d491735991	4ac2b819-a667-4371-9396-d42cb622a0ea	b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	f008fc7d-cf2f-486f-852b-a2e88e86113f	\N	2025-03-12 20:38:00	\N	\N
2cba56f3-d04c-493a-a498-153ca41af3a1	f5eeadc7-c8f8-4ff1-b205-945afd554a96	ccc27a15-e2e3-4629-bb95-cef43e631311	f66035ca-88b2-4751-ae44-4bfc3df3ddd9	\N	2025-03-14 19:15:00	\N	\N
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public.tasks (id, name, description, type, status, complexity, tags, estimated_time, project_id, created_at, updated_at) FROM stdin;
b42a1f15-1e3a-4153-80c0-15a5c9fbbdfb	Збірка рами	Результат: \nЗібрана рама, з променями, стійками, болтами на стек, моторами і неусадженою термозбіжкою на промінях	PRODUCT	NEW	\N	\N	12.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
ccc27a15-e2e3-4629-bb95-cef43e631311	Пайка моторів	Напаяні мотори, гребінкою, промиті і пролаковані контакти	PRODUCT	NEW	5	\N	12.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
f1afec29-3685-4132-8230-b7d39ce4d9a3	Фінальна збірка	Установка втх\nустановка ПК\nУстановка камери\nУстановка РХ\nКришка і стяжки	PRODUCT	NEW	7	\N	23.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
1b33a79e-9790-49bc-8bb3-c7efc8d20832	Налаштування		PRODUCT	NEW	\N	\N	15.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
7cf25d99-7da4-4437-86dc-3bb79b7db073	Обліт		PRODUCT	NEW	\N	\N	10.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
b984449d-3e0c-43fb-9209-e3a5fd7f3733	Усадка термозбіжок		PRODUCT	NEW	\N	\N	3.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
0290a525-b422-4a2d-9a9c-48a0ed38de78	Розпаковка рам		GENERAL	NEW	5	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
cf2f35ed-f1c6-424e-80b8-04fc1a082a60	Сортування болтів		GENERAL	NEW	\N	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
f1ef797a-b1ed-46fa-9341-6b661cd4848a	Порізка термозбіжки		GENERAL	NEW	\N	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
406f31ba-96a2-4328-aca2-2ead65149553	Натягання термозбіжок на проміні		GENERAL	NEW	\N	\N	0.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
3e3e8139-1872-429e-a284-014f912d309c	Тонка пайка	ELRS припаяний до ПК. Припаяний дріт ПІ	INTERMEDIATE	NEW	4	\N	15.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
2bd3b08c-5ef4-4da0-b178-1676cd40db25	Пайка силових дротів	ESC з силовими дротами і конденсатором. Промитий. Пролакований	INTERMEDIATE	NEW	4	\N	10.000000000000000000000000000000	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-13 00:33:45.533	2025-03-13 00:33:45.533
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

