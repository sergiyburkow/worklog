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

--
-- Data for Name: Clients; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Clients" (id, name, description, address, contact_info) FROM stdin;
44090811-4903-469d-8a14-40c07c817c1c	Генерал Черешня			
\.


--
-- Data for Name: ClientContacts; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."ClientContacts" (id, client_id, name, email, phone, telegram, whatsapp, signal, messenger, instagram, facebook) FROM stdin;
\.


--
-- Data for Name: Projects; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Projects" (id, name, client_id, start_date, deadline, actual_end_date, status, quantity, updated_at) FROM stdin;
f26cc409-bfb4-453f-82fe-9e7fe5fc4847	524 каміки з тепловізійною камерою	44090811-4903-469d-8a14-40c07c817c1c	2025-03-07 00:00:00	2025-04-07 00:00:00	\N	IN_PROGRESS	524	2025-03-14 15:58:01.233
\.


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Products" (id, code, project_id, created_at) FROM stdin;
542f9cbd-3754-459a-8f89-53dddfb068db	00001	f26cc409-bfb4-453f-82fe-9e7fe5fc4847	2025-03-12 22:57:13.167
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
\.


--
-- Data for Name: Skills; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public."Skills" (id, name) FROM stdin;
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
-- Data for Name: task_logs; Type: TABLE DATA; Schema: public; Owner: maestro
--

COPY public.task_logs (id, user_id, task_id, product_id, completed_at, registered_at, time_spent, quantity) FROM stdin;
00ff1a08-a318-47ef-8d53-bfa133c84206	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-11 15:37:00	21.000000000000000000000000000000	\N
9a954dc4-71af-4a8c-90a6-0f92b4b3ec15	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-12 15:38:00	32.000000000000000000000000000000	\N
b7eca10b-1bbe-4b9f-954b-16764c0b25c6	d5c43a0c-6249-49e4-8d04-22024aa8193a	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-13 15:38:00	16.000000000000000000000000000000	\N
bb14e3fa-dbcb-431a-a28f-d4fbf330fd2c	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-07 15:58:00	41.000000000000000000000000000000	\N
9eca3365-6b2c-486f-b9dc-b3c5d8123284	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-10 15:58:00	60.000000000000000000000000000000	\N
28144bbc-7509-4e44-9ad5-102edbeacda5	f5eeadc7-c8f8-4ff1-b205-945afd554a96	2bd3b08c-5ef4-4da0-b178-1676cd40db25	\N	\N	2025-03-11 15:58:00	80.000000000000000000000000000000	\N
6359f91c-8dae-4df1-86ff-d57c186ed23d	f5eeadc7-c8f8-4ff1-b205-945afd554a96	3e3e8139-1872-429e-a284-014f912d309c	\N	\N	2025-03-11 16:00:00	3.000000000000000000000000000000	\N
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
-- PostgreSQL database dump complete
--

