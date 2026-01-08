--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:imn3mljuTAkhva5qYF2l+Q==$PwxzPxUYD8extls7u4l7kx0AW4sWHthsUXRsKl+RaUs=:iQeDZB14L1RBJw+3yM4deuuwPYWTl41PsceXQCdYSYc=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "magna" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: magna; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE magna WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE magna OWNER TO postgres;

\connect magna

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AuthType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AuthType" AS ENUM (
    'LOCAL',
    'EXTERNAL',
    'OIDC'
);


ALTER TYPE public."AuthType" OWNER TO postgres;

--
-- Name: ElementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ElementType" AS ENUM (
    'supplier',
    'input',
    'process',
    'output',
    'customer'
);


ALTER TYPE public."ElementType" OWNER TO postgres;

--
-- Name: Level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Level" AS ENUM (
    'level_one',
    'level_two',
    'level_three'
);


ALTER TYPE public."Level" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'INFO',
    'SUCCESS',
    'WARNING',
    'ERROR',
    'VALIDATION_REQUEST',
    'VALIDATION_APPROVED',
    'VALIDATION_REJECTED'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: ProcessType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProcessType" AS ENUM (
    'SIPOC',
    'FIP',
    'MODELIZE_VISUAL',
    'BPMN'
);


ALTER TYPE public."ProcessType" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN',
    'EDITOR'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: SettingCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SettingCategory" AS ENUM (
    'APPEARANCE',
    'NOTIFICATIONS',
    'WORKSPACE',
    'BPMN_EDITOR',
    'DIAGRAM_EDITOR',
    'SECURITY',
    'PERFORMANCE',
    'INTEGRATIONS',
    'SYSTEM',
    'ORGANIZATION'
);


ALTER TYPE public."SettingCategory" OWNER TO postgres;

--
-- Name: SettingDataType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SettingDataType" AS ENUM (
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'JSON',
    'ENUM',
    'COLOR',
    'URL',
    'EMAIL',
    'PASSWORD'
);


ALTER TYPE public."SettingDataType" OWNER TO postgres;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Status" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING'
);


ALTER TYPE public."Status" OWNER TO postgres;

--
-- Name: ValidationRequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ValidationRequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."ValidationRequestStatus" OWNER TO postgres;

--
-- Name: ValidationResponseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ValidationResponseStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."ValidationResponseStatus" OWNER TO postgres;

--
-- Name: WorkspaceLevelStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorkspaceLevelStatus" AS ENUM (
    'DRAFT',
    'PENDING_VALIDATION',
    'IN_VALIDATION',
    'VALIDATED',
    'REJECTED',
    'IN_DEVELOPMENT',
    'DEPLOYED'
);


ALTER TYPE public."WorkspaceLevelStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AppSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AppSetting" (
    setting_id text NOT NULL,
    "documentId" uuid NOT NULL,
    category public."SettingCategory" NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    label text NOT NULL,
    description text,
    "dataType" public."SettingDataType" NOT NULL,
    "isRequired" boolean DEFAULT false NOT NULL,
    "isSecret" boolean DEFAULT false NOT NULL,
    "defaultValue" jsonb,
    "validationRules" jsonb,
    "isEditable" boolean DEFAULT true NOT NULL,
    "isVisible" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "updatedBy" text
);


ALTER TABLE public."AppSetting" OWNER TO postgres;

--
-- Name: Bpmn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bpmn" (
    bpmn_id text NOT NULL,
    "documentId" uuid NOT NULL,
    title text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    workspace_level_id text NOT NULL,
    "bpmnXml" text,
    created_by_user_id text NOT NULL
);


ALTER TABLE public."Bpmn" OWNER TO postgres;

--
-- Name: Fip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Fip" (
    fip_id text NOT NULL,
    "documentId" uuid NOT NULL,
    process_leader text,
    process_sponsor text,
    purpose text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    workspace_level_id text NOT NULL
);


ALTER TABLE public."Fip" OWNER TO postgres;

--
-- Name: FipIndicator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FipIndicator" (
    indicator_id text NOT NULL,
    "documentId" uuid NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    description text,
    "position" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    fip_id text NOT NULL
);


ALTER TABLE public."FipIndicator" OWNER TO postgres;

--
-- Name: FipIndicatorElement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FipIndicatorElement" (
    element_id text NOT NULL,
    "documentId" uuid NOT NULL,
    name text NOT NULL,
    description text,
    "position" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    indicator_id text NOT NULL
);


ALTER TABLE public."FipIndicatorElement" OWNER TO postgres;

--
-- Name: Group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Group" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."Status" DEFAULT 'ACTIVE'::public."Status" NOT NULL
);


ALTER TABLE public."Group" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    notification_id text NOT NULL,
    "documentId" uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type public."NotificationType" DEFAULT 'INFO'::public."NotificationType" NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    sender_id text,
    receiver_id text NOT NULL,
    workspace_level_id text,
    validation_request_id text,
    metadata jsonb,
    "actionUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: OidcToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OidcToken" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "idToken" text NOT NULL,
    "accessToken" text NOT NULL,
    "refreshToken" text,
    "expiresAt" timestamp(3) without time zone,
    jti text,
    scope text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OidcToken" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    name text NOT NULL,
    label text NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: SipocComment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocComment" (
    comment_id integer NOT NULL,
    "documentId" uuid NOT NULL,
    sipoc_id text NOT NULL,
    user_id integer NOT NULL,
    comment_text text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    parent_comment_id integer,
    "user" integer NOT NULL
);


ALTER TABLE public."SipocComment" OWNER TO postgres;

--
-- Name: SipocComment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SipocComment_comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SipocComment_comment_id_seq" OWNER TO postgres;

--
-- Name: SipocComment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SipocComment_comment_id_seq" OWNED BY public."SipocComment".comment_id;


--
-- Name: SipocConnection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocConnection" (
    connection_id text NOT NULL,
    "documentId" uuid NOT NULL,
    source_element_id text NOT NULL,
    target_element_id text NOT NULL,
    description text,
    status text DEFAULT 'active'::text NOT NULL,
    source_sipoc_id text NOT NULL,
    target_sipoc_id text NOT NULL
);


ALTER TABLE public."SipocConnection" OWNER TO postgres;

--
-- Name: SipocDiagram; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocDiagram" (
    sipoc_id text NOT NULL,
    "documentId" uuid NOT NULL,
    title text NOT NULL,
    description text,
    process_owner text,
    department text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    is_template boolean DEFAULT false NOT NULL,
    "createdBy" text NOT NULL,
    workspace_level_id text
);


ALTER TABLE public."SipocDiagram" OWNER TO postgres;

--
-- Name: SipocElement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocElement" (
    id text NOT NULL,
    "documentId" uuid NOT NULL,
    type public."ElementType" NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "position" integer NOT NULL,
    "globalOrder" integer,
    flow_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "contactInfo" text,
    "qualityCriteria" text,
    "responsibleRole" text,
    duration text,
    sipoc_id text NOT NULL
);


ALTER TABLE public."SipocElement" OWNER TO postgres;

--
-- Name: SipocHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocHistory" (
    history_id integer NOT NULL,
    "documentId" uuid NOT NULL,
    sipoc_id text NOT NULL,
    changed_by integer NOT NULL,
    changed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    previous_version integer,
    change_description text,
    change_type text,
    "changedBy" integer NOT NULL
);


ALTER TABLE public."SipocHistory" OWNER TO postgres;

--
-- Name: SipocHistory_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SipocHistory_history_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SipocHistory_history_id_seq" OWNER TO postgres;

--
-- Name: SipocHistory_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SipocHistory_history_id_seq" OWNED BY public."SipocHistory".history_id;


--
-- Name: SipocPermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocPermission" (
    permission_id integer NOT NULL,
    "documentId" uuid NOT NULL,
    sipoc_id text NOT NULL,
    user_id integer NOT NULL,
    permission_level text NOT NULL,
    granted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    granted_by integer NOT NULL,
    "user" integer NOT NULL
);


ALTER TABLE public."SipocPermission" OWNER TO postgres;

--
-- Name: SipocPermission_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SipocPermission_permission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SipocPermission_permission_id_seq" OWNER TO postgres;

--
-- Name: SipocPermission_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SipocPermission_permission_id_seq" OWNED BY public."SipocPermission".permission_id;


--
-- Name: SipocTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocTag" (
    sipoc_id text NOT NULL,
    tag_id integer NOT NULL,
    "documentId" uuid NOT NULL
);


ALTER TABLE public."SipocTag" OWNER TO postgres;

--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    tag_id integer NOT NULL,
    "documentId" uuid NOT NULL,
    name text NOT NULL,
    color text
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: Tag_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tag_tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tag_tag_id_seq" OWNER TO postgres;

--
-- Name: Tag_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tag_tag_id_seq" OWNED BY public."Tag".tag_id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text,
    "firstName" text,
    "lastName" text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "authType" public."AuthType" DEFAULT 'LOCAL'::public."AuthType" NOT NULL,
    "externalId" text,
    "orangeId" text,
    "oidcProfile" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    "groupId" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserSetting" (
    user_setting_id text NOT NULL,
    "documentId" uuid NOT NULL,
    user_id text NOT NULL,
    setting_key text NOT NULL,
    value jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserSetting" OWNER TO postgres;

--
-- Name: ValidationResponse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ValidationResponse" (
    response_id text NOT NULL,
    "documentId" uuid NOT NULL,
    validation_id text NOT NULL,
    validator_user_id text NOT NULL,
    status public."ValidationResponseStatus" DEFAULT 'PENDING'::public."ValidationResponseStatus" NOT NULL,
    feedback text,
    responded_at timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ValidationResponse" OWNER TO postgres;

--
-- Name: Workspace; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Workspace" (
    workspace_id text NOT NULL,
    "documentId" uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_by_user_id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Workspace" OWNER TO postgres;

--
-- Name: WorkspaceLevel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkspaceLevel" (
    level_id text NOT NULL,
    "documentId" uuid NOT NULL,
    title text NOT NULL,
    description text,
    level public."Level" DEFAULT 'level_one'::public."Level" NOT NULL,
    status public."WorkspaceLevelStatus" DEFAULT 'DRAFT'::public."WorkspaceLevelStatus" NOT NULL,
    "processType" public."ProcessType" DEFAULT 'MODELIZE_VISUAL'::public."ProcessType" NOT NULL,
    "imagePath" text,
    version text,
    workspace_id text,
    parent_id text,
    created_by_user_id text NOT NULL
);


ALTER TABLE public."WorkspaceLevel" OWNER TO postgres;

--
-- Name: WorkspaceLevelEdge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkspaceLevelEdge" (
    workspace_level_edge_id text NOT NULL,
    "documentId" uuid NOT NULL,
    edge_id text,
    source text,
    target text,
    type text,
    label text,
    workspace_level_id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."WorkspaceLevelEdge" OWNER TO postgres;

--
-- Name: WorkspaceLevelFavorite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkspaceLevelFavorite" (
    favorite_id text NOT NULL,
    user_id text NOT NULL,
    workspace_level_id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WorkspaceLevelFavorite" OWNER TO postgres;

--
-- Name: WorkspaceLevelNode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkspaceLevelNode" (
    workspace_level_node_id text NOT NULL,
    "documentId" uuid NOT NULL,
    title text,
    type text,
    "subType" text,
    "position" jsonb,
    width integer,
    height integer,
    workspace_level_id text NOT NULL,
    node_id text NOT NULL,
    has_sub_process boolean,
    cropped_image_url text,
    shape_name text,
    related_to_level_id text,
    related_to_level_type text,
    related_to_process_type public."ProcessType",
    bpmn_type text,
    "boxStyle" jsonb,
    "textStyle" jsonb,
    parent_node_id text,
    extent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isContainer" boolean DEFAULT false,
    "handleConfig" text,
    lane text
);


ALTER TABLE public."WorkspaceLevelNode" OWNER TO postgres;

--
-- Name: WorkspaceLevelValidation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkspaceLevelValidation" (
    validation_id text NOT NULL,
    "documentId" uuid NOT NULL,
    workspace_level_id text NOT NULL,
    requested_by_user_id text NOT NULL,
    requested_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at timestamp(3) without time zone,
    status public."ValidationRequestStatus" DEFAULT 'PENDING'::public."ValidationRequestStatus" NOT NULL,
    message text
);


ALTER TABLE public."WorkspaceLevelValidation" OWNER TO postgres;

--
-- Name: _GroupPermissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_GroupPermissions" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_GroupPermissions" OWNER TO postgres;

--
-- Name: SipocComment comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocComment" ALTER COLUMN comment_id SET DEFAULT nextval('public."SipocComment_comment_id_seq"'::regclass);


--
-- Name: SipocHistory history_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocHistory" ALTER COLUMN history_id SET DEFAULT nextval('public."SipocHistory_history_id_seq"'::regclass);


--
-- Name: SipocPermission permission_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocPermission" ALTER COLUMN permission_id SET DEFAULT nextval('public."SipocPermission_permission_id_seq"'::regclass);


--
-- Name: Tag tag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag" ALTER COLUMN tag_id SET DEFAULT nextval('public."Tag_tag_id_seq"'::regclass);


--
-- Data for Name: AppSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AppSetting" (setting_id, "documentId", category, key, value, label, description, "dataType", "isRequired", "isSecret", "defaultValue", "validationRules", "isEditable", "isVisible", "sortOrder", "createdAt", "updatedAt", "updatedBy") FROM stdin;
\.


--
-- Data for Name: Bpmn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bpmn" (bpmn_id, "documentId", title, description, "createdAt", "updatedAt", workspace_level_id, "bpmnXml", created_by_user_id) FROM stdin;
\.


--
-- Data for Name: Fip; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Fip" (fip_id, "documentId", process_leader, process_sponsor, purpose, "createdAt", "updatedAt", workspace_level_id) FROM stdin;
a0a9cfd0-292c-4e3d-846a-be8b9a9131b5	9c9923f9-cd5d-4d3d-8e0b-91a3be1cdc6c			test	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	055dda1f-7af4-43d0-b1f1-d7771461a902
\.


--
-- Data for Name: FipIndicator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FipIndicator" (indicator_id, "documentId", title, type, description, "position", "createdAt", "updatedAt", fip_id) FROM stdin;
3aca2331-a9fe-4da9-99e4-ed3c93d6719c	f8a6a06d-e63b-4e18-85e3-bf4e5336b752	Attentes Clients	client_expectations		0	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
098af6f5-54a0-4458-9831-1632f6aa6045	7fcddab5-953f-427a-b01b-e1e6a6924dbc	Activités	activities		1	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
0401c438-1e00-40d7-948b-f2d8ef285fc3	4f8d5176-6b9c-4eef-aff2-20b34383b703	Interactions	interactions		2	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
e846cf34-2fa1-4ceb-b9cd-059f3107286e	5bcc4e39-a9cd-4f6a-92b0-a52337c935b2	Contraintes	constraints		3	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
15b5b8ef-f3dd-4476-aa0e-40a9499c829a	757ff936-2726-4993-b475-1791f1352c44	Risques	risks		4	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
d046dd17-0b3e-4956-b0e3-fe476fdc37f0	8457df08-239a-4587-bed4-6b7d1c49d7fa	Ressources	resources		5	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
a6b2536f-f6a7-40b9-89da-1cb7caa1884e	aeadc16a-d679-427b-a24d-b9d464fada09	Acteurs	actors		6	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
f782f9d3-e21d-4837-ab8f-6445c62c7165	84a1387d-2626-4258-a194-6933fdd80f45	Instances de Pilotage	steering_instances		7	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
0ea0bc1a-e155-45ef-b53f-98c967292573	9db2f854-cdd0-475b-a7d4-b200d03253b0	Noms des KPI	kpi_nme		8	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
57e32de8-02b1-4638-902b-06eff8ca6273	5f5b24d1-6e87-4dce-a52f-09d8b247d23a	Performance KPI	kpi_performance		9	2025-11-19 16:10:23.755	2025-11-19 16:10:23.755	a0a9cfd0-292c-4e3d-846a-be8b9a9131b5
\.


--
-- Data for Name: FipIndicatorElement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FipIndicatorElement" (element_id, "documentId", name, description, "position", "createdAt", "updatedAt", indicator_id) FROM stdin;
\.


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Group" (id, name, "createdAt", "updatedAt", status) FROM stdin;
4537225a-3747-4939-9f41-089c50960fe5	Admin	2025-11-19 16:09:46.881	2025-11-19 16:09:46.881	ACTIVE
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	Manager	2025-11-19 16:09:46.909	2025-11-19 16:09:46.909	ACTIVE
cbf2a106-b266-427a-ad1c-c7585948a540	Viewer	2025-11-19 16:09:46.938	2025-11-19 16:09:46.938	ACTIVE
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (notification_id, "documentId", title, message, type, "isRead", sender_id, receiver_id, workspace_level_id, validation_request_id, metadata, "actionUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OidcToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OidcToken" (id, "userId", "idToken", "accessToken", "refreshToken", "expiresAt", jti, scope, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, name, label) FROM stdin;
4256edcc-3e3d-4251-ab29-98f29b8a6120	create:sipoc	Create SIPOC diagrams
e1bf996a-c6fa-411c-865c-a8b776b5b81b	view:sipoc	View SIPOC diagrams
208b78a9-1087-4319-9a35-b0a346854acc	edit:sipoc	Edit SIPOC diagrams
e84b2065-bb63-4fce-b265-b7cfea8052b2	delete:user	Delete users
96f5fc4e-a915-4f11-b0bd-4763ab229966	create:users	Create users
0b1e81d7-353e-4261-bc02-1a6364a28c8e	view:users	View users
944784ea-ab03-4058-a135-297453749124	edit:users	Edit users
9d0705d2-6e1a-4eb1-96a9-140c4dae37ac	delete:users	Delete users
a3ef69e2-f4a4-44a1-b628-4f9585dfc2d4	create:groups	Create groups
612172b0-403c-4506-badc-cf9584f9e345	view:groups	View groups
aceaaadf-13f9-4bfd-9741-6cd34238a14f	edit:groups	Edit groups
1f3bfeed-8312-4ff5-a475-3905f1f17767	delete:groups	Delete groups
809637a1-db69-4d74-b059-7527b2c9efc4	create:workspace	Create workspace
9093f0e4-f52e-4ed2-913f-e8b8d4dbbd6b	view:workspace	View workspace
75167b72-142c-45fe-a1ff-2fd8e44a8e53	edit:workspace	Edit workspace
80b9b713-065e-4f89-9cdb-c0c4812109ad	delete:workspace	Delete workspace
a7381cfa-a0cb-4716-aece-fb3cdd01f2d0	create:workspace-level	Create Process Level
09b3e634-8313-4d2f-a4d9-56f5d598a0b1	view:workspace-level	View Process Level
66bea0cc-17b8-4bd2-8144-55a6d3dffbe3	edit:workspace-level	Edit Process Level
6d543295-90e3-4819-aad6-1c67be3bc29c	delete:workspace-level	Delete Process Level
735823b6-9a25-4a81-9b8c-3118358d0c8b	create:fip	Create FIP diagrams
78dec08f-df6d-4a09-8675-68cf039d4567	view:fip	View FIP diagrams
be7cc142-efce-4c40-a2e7-ac42924ea8c0	edit:fip	Edit FIP diagrams
bc8df5a3-425a-497e-b036-8143940891ef	delete:fip	Delete FIP diagrams
\.


--
-- Data for Name: SipocComment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocComment" (comment_id, "documentId", sipoc_id, user_id, comment_text, created_at, parent_comment_id, "user") FROM stdin;
\.


--
-- Data for Name: SipocConnection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocConnection" (connection_id, "documentId", source_element_id, target_element_id, description, status, source_sipoc_id, target_sipoc_id) FROM stdin;
\.


--
-- Data for Name: SipocDiagram; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocDiagram" (sipoc_id, "documentId", title, description, process_owner, department, "createdAt", "updatedAt", version, status, is_template, "createdBy", workspace_level_id) FROM stdin;
57e2ee4b-4a68-496b-99e6-b40c8b0e1541	532ed8ec-1913-4ff5-98d9-67e424e13cda	test	test	\N	\N	2025-11-19 16:10:23.746	2025-11-19 16:10:23.746	1	draft	f	428782ed-de75-4262-bfd6-4719f382f4c1	055dda1f-7af4-43d0-b1f1-d7771461a902
\.


--
-- Data for Name: SipocElement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocElement" (id, "documentId", type, title, description, "position", "globalOrder", flow_id, "createdAt", "updatedAt", "contactInfo", "qualityCriteria", "responsibleRole", duration, sipoc_id) FROM stdin;
\.


--
-- Data for Name: SipocHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocHistory" (history_id, "documentId", sipoc_id, changed_by, changed_at, previous_version, change_description, change_type, "changedBy") FROM stdin;
\.


--
-- Data for Name: SipocPermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocPermission" (permission_id, "documentId", sipoc_id, user_id, permission_level, granted_at, granted_by, "user") FROM stdin;
\.


--
-- Data for Name: SipocTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocTag" (sipoc_id, tag_id, "documentId") FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (tag_id, "documentId", name, color) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, "firstName", "lastName", role, "authType", "externalId", "orangeId", "oidcProfile", "createdAt", "updatedAt", status, "groupId") FROM stdin;
428782ed-de75-4262-bfd6-4719f382f4c1	admin@example.com	$2b$10$HJlRfPa25yDWLBxDa5yYX.rPS57PYzoMkmrIKhTVRd.GK.hzCt2g2	Admin	User	ADMIN	LOCAL	\N	\N	\N	2025-11-19 16:09:47.035	2025-11-19 16:09:47.035	active	4537225a-3747-4939-9f41-089c50960fe5
cd46892d-33f3-45fc-bdec-13af16662e6e	manager1@example.com	$2b$10$q/.nugUMhkNVGmi0fZLAyeKJX0u/FrjMBAsJdKLhSltF2gNTr/MGu	Manager	One	EDITOR	LOCAL	\N	\N	\N	2025-11-19 16:09:47.123	2025-11-19 16:09:47.123	active	85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6
04b22eba-c73e-4852-bab0-1884765c500b	manager2@example.com	$2b$10$8JYZCOz3n.4nkINoJe5mjOzHVqFW6qNlc1Orm//mz96carC9BFsiy	Manager	Two	EDITOR	LOCAL	\N	\N	\N	2025-11-19 16:09:47.205	2025-11-19 16:09:47.205	active	85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6
65d70fb3-bf76-4b82-8f31-91cc1fc2046a	user1@example.com	$2b$10$/qpmZGe/8eevqOvx87cABODImSmIBPBVf7nqFRFXAco6YTYT9LXsu	User	1	USER	LOCAL	\N	\N	\N	2025-11-19 16:09:47.285	2025-11-19 16:09:47.285	active	cbf2a106-b266-427a-ad1c-c7585948a540
c0ddaeac-869b-45a5-83e5-e891102cdd9e	user2@example.com	$2b$10$yFZp5oGXYhKbjmsErczoeu/dZb4ULJ8K3JRb5YnKdHSYWs2qIYxUi	User	2	USER	LOCAL	\N	\N	\N	2025-11-19 16:09:47.357	2025-11-19 16:09:47.357	active	cbf2a106-b266-427a-ad1c-c7585948a540
fceef8f3-56ef-4ec0-aaa0-dffaabbb2083	user3@example.com	$2b$10$HO63228IHCUa62VQ0PyM5uPAur.JP6A0HyTmc3hMzsQRWrB.J5LKa	User	3	USER	LOCAL	\N	\N	\N	2025-11-19 16:09:47.435	2025-11-19 16:09:47.435	active	cbf2a106-b266-427a-ad1c-c7585948a540
c41b02dd-8347-4376-9272-2f821889350f	user4@example.com	$2b$10$JHdsOUgPep.Gm9TeuQpoNOllOuZJ/79nELFXUweoMItqmxxoo8W/.	User	4	USER	LOCAL	\N	\N	\N	2025-11-19 16:09:47.513	2025-11-19 16:09:47.513	active	cbf2a106-b266-427a-ad1c-c7585948a540
c7ef2137-49e2-4228-bbe7-dd38e3bb3865	user5@example.com	$2b$10$ov8527jFaeYC4h0jc3KUA.GwoUTG3Ud15fFfYgJ75rvaCto9S5BXC	User	5	USER	LOCAL	\N	\N	\N	2025-11-19 16:09:47.595	2025-11-19 16:09:47.595	active	cbf2a106-b266-427a-ad1c-c7585948a540
93d02ef6-151b-41f0-9a90-0b6d50c29615	external.user@company.com	\N	External	User	USER	EXTERNAL	ext-12345	\N	\N	2025-11-19 16:09:47.601	2025-11-19 16:09:47.601	active	cbf2a106-b266-427a-ad1c-c7585948a540
\.


--
-- Data for Name: UserSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserSetting" (user_setting_id, "documentId", user_id, setting_key, value, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ValidationResponse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ValidationResponse" (response_id, "documentId", validation_id, validator_user_id, status, feedback, responded_at, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Workspace; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Workspace" (workspace_id, "documentId", title, description, created_by_user_id, "createdAt", "updatedAt") FROM stdin;
0d7b81ae-d1f4-408f-8b9b-cd5e71e681fc	446fe32e-b6a4-47cf-98a4-1621511e52b3	sofrecom	sofreom	428782ed-de75-4262-bfd6-4719f382f4c1	2025-11-19 16:10:04.959	2025-11-19 16:10:04.959
\.


--
-- Data for Name: WorkspaceLevel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkspaceLevel" (level_id, "documentId", title, description, level, status, "processType", "imagePath", version, workspace_id, parent_id, created_by_user_id) FROM stdin;
055dda1f-7af4-43d0-b1f1-d7771461a902	5cbf04c9-487b-4141-a453-7d17af607cd0	test	test	level_two	DRAFT	SIPOC	\N	\N	0d7b81ae-d1f4-408f-8b9b-cd5e71e681fc	\N	428782ed-de75-4262-bfd6-4719f382f4c1
\.


--
-- Data for Name: WorkspaceLevelEdge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkspaceLevelEdge" (workspace_level_edge_id, "documentId", edge_id, source, target, type, label, workspace_level_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WorkspaceLevelFavorite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkspaceLevelFavorite" (favorite_id, user_id, workspace_level_id, "createdAt") FROM stdin;
\.


--
-- Data for Name: WorkspaceLevelNode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkspaceLevelNode" (workspace_level_node_id, "documentId", title, type, "subType", "position", width, height, workspace_level_id, node_id, has_sub_process, cropped_image_url, shape_name, related_to_level_id, related_to_level_type, related_to_process_type, bpmn_type, "boxStyle", "textStyle", parent_node_id, extent, "createdAt", "updatedAt", "isContainer", "handleConfig", lane) FROM stdin;
\.


--
-- Data for Name: WorkspaceLevelValidation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkspaceLevelValidation" (validation_id, "documentId", workspace_level_id, requested_by_user_id, requested_at, completed_at, status, message) FROM stdin;
\.


--
-- Data for Name: _GroupPermissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_GroupPermissions" ("A", "B") FROM stdin;
4537225a-3747-4939-9f41-089c50960fe5	4256edcc-3e3d-4251-ab29-98f29b8a6120
4537225a-3747-4939-9f41-089c50960fe5	e1bf996a-c6fa-411c-865c-a8b776b5b81b
4537225a-3747-4939-9f41-089c50960fe5	208b78a9-1087-4319-9a35-b0a346854acc
4537225a-3747-4939-9f41-089c50960fe5	e84b2065-bb63-4fce-b265-b7cfea8052b2
4537225a-3747-4939-9f41-089c50960fe5	96f5fc4e-a915-4f11-b0bd-4763ab229966
4537225a-3747-4939-9f41-089c50960fe5	0b1e81d7-353e-4261-bc02-1a6364a28c8e
4537225a-3747-4939-9f41-089c50960fe5	944784ea-ab03-4058-a135-297453749124
4537225a-3747-4939-9f41-089c50960fe5	9d0705d2-6e1a-4eb1-96a9-140c4dae37ac
4537225a-3747-4939-9f41-089c50960fe5	a3ef69e2-f4a4-44a1-b628-4f9585dfc2d4
4537225a-3747-4939-9f41-089c50960fe5	612172b0-403c-4506-badc-cf9584f9e345
4537225a-3747-4939-9f41-089c50960fe5	aceaaadf-13f9-4bfd-9741-6cd34238a14f
4537225a-3747-4939-9f41-089c50960fe5	1f3bfeed-8312-4ff5-a475-3905f1f17767
4537225a-3747-4939-9f41-089c50960fe5	809637a1-db69-4d74-b059-7527b2c9efc4
4537225a-3747-4939-9f41-089c50960fe5	9093f0e4-f52e-4ed2-913f-e8b8d4dbbd6b
4537225a-3747-4939-9f41-089c50960fe5	75167b72-142c-45fe-a1ff-2fd8e44a8e53
4537225a-3747-4939-9f41-089c50960fe5	80b9b713-065e-4f89-9cdb-c0c4812109ad
4537225a-3747-4939-9f41-089c50960fe5	a7381cfa-a0cb-4716-aece-fb3cdd01f2d0
4537225a-3747-4939-9f41-089c50960fe5	09b3e634-8313-4d2f-a4d9-56f5d598a0b1
4537225a-3747-4939-9f41-089c50960fe5	66bea0cc-17b8-4bd2-8144-55a6d3dffbe3
4537225a-3747-4939-9f41-089c50960fe5	6d543295-90e3-4819-aad6-1c67be3bc29c
4537225a-3747-4939-9f41-089c50960fe5	735823b6-9a25-4a81-9b8c-3118358d0c8b
4537225a-3747-4939-9f41-089c50960fe5	78dec08f-df6d-4a09-8675-68cf039d4567
4537225a-3747-4939-9f41-089c50960fe5	be7cc142-efce-4c40-a2e7-ac42924ea8c0
4537225a-3747-4939-9f41-089c50960fe5	bc8df5a3-425a-497e-b036-8143940891ef
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	4256edcc-3e3d-4251-ab29-98f29b8a6120
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	e1bf996a-c6fa-411c-865c-a8b776b5b81b
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	208b78a9-1087-4319-9a35-b0a346854acc
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	e84b2065-bb63-4fce-b265-b7cfea8052b2
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	96f5fc4e-a915-4f11-b0bd-4763ab229966
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	0b1e81d7-353e-4261-bc02-1a6364a28c8e
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	944784ea-ab03-4058-a135-297453749124
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	9d0705d2-6e1a-4eb1-96a9-140c4dae37ac
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	a3ef69e2-f4a4-44a1-b628-4f9585dfc2d4
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	612172b0-403c-4506-badc-cf9584f9e345
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	aceaaadf-13f9-4bfd-9741-6cd34238a14f
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	1f3bfeed-8312-4ff5-a475-3905f1f17767
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	809637a1-db69-4d74-b059-7527b2c9efc4
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	9093f0e4-f52e-4ed2-913f-e8b8d4dbbd6b
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	75167b72-142c-45fe-a1ff-2fd8e44a8e53
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	80b9b713-065e-4f89-9cdb-c0c4812109ad
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	a7381cfa-a0cb-4716-aece-fb3cdd01f2d0
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	09b3e634-8313-4d2f-a4d9-56f5d598a0b1
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	66bea0cc-17b8-4bd2-8144-55a6d3dffbe3
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	6d543295-90e3-4819-aad6-1c67be3bc29c
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	735823b6-9a25-4a81-9b8c-3118358d0c8b
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	78dec08f-df6d-4a09-8675-68cf039d4567
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	be7cc142-efce-4c40-a2e7-ac42924ea8c0
85f593b3-afa9-4dd0-9c61-5c84d2e3c1f6	bc8df5a3-425a-497e-b036-8143940891ef
cbf2a106-b266-427a-ad1c-c7585948a540	4256edcc-3e3d-4251-ab29-98f29b8a6120
cbf2a106-b266-427a-ad1c-c7585948a540	e1bf996a-c6fa-411c-865c-a8b776b5b81b
cbf2a106-b266-427a-ad1c-c7585948a540	208b78a9-1087-4319-9a35-b0a346854acc
cbf2a106-b266-427a-ad1c-c7585948a540	e84b2065-bb63-4fce-b265-b7cfea8052b2
cbf2a106-b266-427a-ad1c-c7585948a540	96f5fc4e-a915-4f11-b0bd-4763ab229966
cbf2a106-b266-427a-ad1c-c7585948a540	0b1e81d7-353e-4261-bc02-1a6364a28c8e
cbf2a106-b266-427a-ad1c-c7585948a540	944784ea-ab03-4058-a135-297453749124
cbf2a106-b266-427a-ad1c-c7585948a540	9d0705d2-6e1a-4eb1-96a9-140c4dae37ac
cbf2a106-b266-427a-ad1c-c7585948a540	a3ef69e2-f4a4-44a1-b628-4f9585dfc2d4
cbf2a106-b266-427a-ad1c-c7585948a540	612172b0-403c-4506-badc-cf9584f9e345
cbf2a106-b266-427a-ad1c-c7585948a540	aceaaadf-13f9-4bfd-9741-6cd34238a14f
cbf2a106-b266-427a-ad1c-c7585948a540	1f3bfeed-8312-4ff5-a475-3905f1f17767
cbf2a106-b266-427a-ad1c-c7585948a540	809637a1-db69-4d74-b059-7527b2c9efc4
cbf2a106-b266-427a-ad1c-c7585948a540	9093f0e4-f52e-4ed2-913f-e8b8d4dbbd6b
cbf2a106-b266-427a-ad1c-c7585948a540	75167b72-142c-45fe-a1ff-2fd8e44a8e53
cbf2a106-b266-427a-ad1c-c7585948a540	80b9b713-065e-4f89-9cdb-c0c4812109ad
cbf2a106-b266-427a-ad1c-c7585948a540	a7381cfa-a0cb-4716-aece-fb3cdd01f2d0
cbf2a106-b266-427a-ad1c-c7585948a540	09b3e634-8313-4d2f-a4d9-56f5d598a0b1
cbf2a106-b266-427a-ad1c-c7585948a540	66bea0cc-17b8-4bd2-8144-55a6d3dffbe3
cbf2a106-b266-427a-ad1c-c7585948a540	6d543295-90e3-4819-aad6-1c67be3bc29c
cbf2a106-b266-427a-ad1c-c7585948a540	735823b6-9a25-4a81-9b8c-3118358d0c8b
cbf2a106-b266-427a-ad1c-c7585948a540	78dec08f-df6d-4a09-8675-68cf039d4567
cbf2a106-b266-427a-ad1c-c7585948a540	be7cc142-efce-4c40-a2e7-ac42924ea8c0
cbf2a106-b266-427a-ad1c-c7585948a540	bc8df5a3-425a-497e-b036-8143940891ef
\.


--
-- Name: SipocComment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SipocComment_comment_id_seq"', 1, false);


--
-- Name: SipocHistory_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SipocHistory_history_id_seq"', 1, false);


--
-- Name: SipocPermission_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SipocPermission_permission_id_seq"', 1, false);


--
-- Name: Tag_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tag_tag_id_seq"', 1, false);


--
-- Name: AppSetting AppSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppSetting"
    ADD CONSTRAINT "AppSetting_pkey" PRIMARY KEY (setting_id);


--
-- Name: Bpmn Bpmn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bpmn"
    ADD CONSTRAINT "Bpmn_pkey" PRIMARY KEY (bpmn_id);


--
-- Name: FipIndicatorElement FipIndicatorElement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FipIndicatorElement"
    ADD CONSTRAINT "FipIndicatorElement_pkey" PRIMARY KEY (element_id);


--
-- Name: FipIndicator FipIndicator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FipIndicator"
    ADD CONSTRAINT "FipIndicator_pkey" PRIMARY KEY (indicator_id);


--
-- Name: Fip Fip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Fip"
    ADD CONSTRAINT "Fip_pkey" PRIMARY KEY (fip_id);


--
-- Name: Group Group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (notification_id);


--
-- Name: OidcToken OidcToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OidcToken"
    ADD CONSTRAINT "OidcToken_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: SipocComment SipocComment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocComment"
    ADD CONSTRAINT "SipocComment_pkey" PRIMARY KEY (comment_id);


--
-- Name: SipocConnection SipocConnection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocConnection"
    ADD CONSTRAINT "SipocConnection_pkey" PRIMARY KEY (connection_id);


--
-- Name: SipocDiagram SipocDiagram_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocDiagram"
    ADD CONSTRAINT "SipocDiagram_pkey" PRIMARY KEY (sipoc_id);


--
-- Name: SipocElement SipocElement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocElement"
    ADD CONSTRAINT "SipocElement_pkey" PRIMARY KEY (id);


--
-- Name: SipocHistory SipocHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocHistory"
    ADD CONSTRAINT "SipocHistory_pkey" PRIMARY KEY (history_id);


--
-- Name: SipocPermission SipocPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocPermission"
    ADD CONSTRAINT "SipocPermission_pkey" PRIMARY KEY (permission_id);


--
-- Name: SipocTag SipocTag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocTag"
    ADD CONSTRAINT "SipocTag_pkey" PRIMARY KEY (sipoc_id, tag_id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (tag_id);


--
-- Name: UserSetting UserSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSetting"
    ADD CONSTRAINT "UserSetting_pkey" PRIMARY KEY (user_setting_id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: ValidationResponse ValidationResponse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ValidationResponse"
    ADD CONSTRAINT "ValidationResponse_pkey" PRIMARY KEY (response_id);


--
-- Name: WorkspaceLevelEdge WorkspaceLevelEdge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelEdge"
    ADD CONSTRAINT "WorkspaceLevelEdge_pkey" PRIMARY KEY (workspace_level_edge_id);


--
-- Name: WorkspaceLevelFavorite WorkspaceLevelFavorite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelFavorite"
    ADD CONSTRAINT "WorkspaceLevelFavorite_pkey" PRIMARY KEY (favorite_id);


--
-- Name: WorkspaceLevelNode WorkspaceLevelNode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelNode"
    ADD CONSTRAINT "WorkspaceLevelNode_pkey" PRIMARY KEY (workspace_level_node_id);


--
-- Name: WorkspaceLevelValidation WorkspaceLevelValidation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelValidation"
    ADD CONSTRAINT "WorkspaceLevelValidation_pkey" PRIMARY KEY (validation_id);


--
-- Name: WorkspaceLevel WorkspaceLevel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevel"
    ADD CONSTRAINT "WorkspaceLevel_pkey" PRIMARY KEY (level_id);


--
-- Name: Workspace Workspace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Workspace"
    ADD CONSTRAINT "Workspace_pkey" PRIMARY KEY (workspace_id);


--
-- Name: _GroupPermissions _GroupPermissions_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_GroupPermissions"
    ADD CONSTRAINT "_GroupPermissions_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: AppSetting_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AppSetting_category_idx" ON public."AppSetting" USING btree (category);


--
-- Name: AppSetting_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AppSetting_documentId_key" ON public."AppSetting" USING btree ("documentId");


--
-- Name: AppSetting_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AppSetting_key_idx" ON public."AppSetting" USING btree (key);


--
-- Name: AppSetting_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AppSetting_key_key" ON public."AppSetting" USING btree (key);


--
-- Name: Bpmn_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Bpmn_documentId_key" ON public."Bpmn" USING btree ("documentId");


--
-- Name: FipIndicatorElement_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FipIndicatorElement_documentId_key" ON public."FipIndicatorElement" USING btree ("documentId");


--
-- Name: FipIndicator_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FipIndicator_documentId_key" ON public."FipIndicator" USING btree ("documentId");


--
-- Name: Fip_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Fip_documentId_key" ON public."Fip" USING btree ("documentId");


--
-- Name: Fip_workspace_level_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Fip_workspace_level_id_key" ON public."Fip" USING btree (workspace_level_id);


--
-- Name: Group_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Group_name_key" ON public."Group" USING btree (name);


--
-- Name: Notification_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Notification_documentId_key" ON public."Notification" USING btree ("documentId");


--
-- Name: OidcToken_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OidcToken_userId_key" ON public."OidcToken" USING btree ("userId");


--
-- Name: Permission_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_name_key" ON public."Permission" USING btree (name);


--
-- Name: SipocComment_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocComment_documentId_key" ON public."SipocComment" USING btree ("documentId");


--
-- Name: SipocConnection_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocConnection_documentId_key" ON public."SipocConnection" USING btree ("documentId");


--
-- Name: SipocDiagram_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocDiagram_documentId_key" ON public."SipocDiagram" USING btree ("documentId");


--
-- Name: SipocElement_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocElement_documentId_key" ON public."SipocElement" USING btree ("documentId");


--
-- Name: SipocHistory_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocHistory_documentId_key" ON public."SipocHistory" USING btree ("documentId");


--
-- Name: SipocPermission_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocPermission_documentId_key" ON public."SipocPermission" USING btree ("documentId");


--
-- Name: SipocPermission_sipoc_id_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocPermission_sipoc_id_user_id_key" ON public."SipocPermission" USING btree (sipoc_id, user_id);


--
-- Name: SipocTag_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocTag_documentId_key" ON public."SipocTag" USING btree ("documentId");


--
-- Name: Tag_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_documentId_key" ON public."Tag" USING btree ("documentId");


--
-- Name: Tag_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);


--
-- Name: UserSetting_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserSetting_documentId_key" ON public."UserSetting" USING btree ("documentId");


--
-- Name: UserSetting_setting_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserSetting_setting_key_idx" ON public."UserSetting" USING btree (setting_key);


--
-- Name: UserSetting_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserSetting_user_id_idx" ON public."UserSetting" USING btree (user_id);


--
-- Name: UserSetting_user_id_setting_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserSetting_user_id_setting_key_key" ON public."UserSetting" USING btree (user_id, setting_key);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: ValidationResponse_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ValidationResponse_documentId_key" ON public."ValidationResponse" USING btree ("documentId");


--
-- Name: ValidationResponse_validation_id_validator_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ValidationResponse_validation_id_validator_user_id_key" ON public."ValidationResponse" USING btree (validation_id, validator_user_id);


--
-- Name: WorkspaceLevelEdge_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkspaceLevelEdge_documentId_key" ON public."WorkspaceLevelEdge" USING btree ("documentId");


--
-- Name: WorkspaceLevelFavorite_user_id_workspace_level_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkspaceLevelFavorite_user_id_workspace_level_id_key" ON public."WorkspaceLevelFavorite" USING btree (user_id, workspace_level_id);


--
-- Name: WorkspaceLevelNode_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkspaceLevelNode_documentId_key" ON public."WorkspaceLevelNode" USING btree ("documentId");


--
-- Name: WorkspaceLevelValidation_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkspaceLevelValidation_documentId_key" ON public."WorkspaceLevelValidation" USING btree ("documentId");


--
-- Name: WorkspaceLevel_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkspaceLevel_documentId_key" ON public."WorkspaceLevel" USING btree ("documentId");


--
-- Name: WorkspaceLevel_parent_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkspaceLevel_parent_id_key" ON public."WorkspaceLevel" USING btree (parent_id);


--
-- Name: Workspace_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Workspace_documentId_key" ON public."Workspace" USING btree ("documentId");


--
-- Name: _GroupPermissions_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_GroupPermissions_B_index" ON public."_GroupPermissions" USING btree ("B");


--
-- Name: AppSetting AppSetting_updatedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppSetting"
    ADD CONSTRAINT "AppSetting_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Bpmn Bpmn_workspace_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bpmn"
    ADD CONSTRAINT "Bpmn_workspace_level_id_fkey" FOREIGN KEY (workspace_level_id) REFERENCES public."WorkspaceLevel"(level_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FipIndicatorElement FipIndicatorElement_indicator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FipIndicatorElement"
    ADD CONSTRAINT "FipIndicatorElement_indicator_id_fkey" FOREIGN KEY (indicator_id) REFERENCES public."FipIndicator"(indicator_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FipIndicator FipIndicator_fip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FipIndicator"
    ADD CONSTRAINT "FipIndicator_fip_id_fkey" FOREIGN KEY (fip_id) REFERENCES public."Fip"(fip_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Fip Fip_workspace_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Fip"
    ADD CONSTRAINT "Fip_workspace_level_id_fkey" FOREIGN KEY (workspace_level_id) REFERENCES public."WorkspaceLevel"(level_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_validation_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_validation_request_id_fkey" FOREIGN KEY (validation_request_id) REFERENCES public."WorkspaceLevelValidation"(validation_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_workspace_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_workspace_level_id_fkey" FOREIGN KEY (workspace_level_id) REFERENCES public."WorkspaceLevel"(level_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OidcToken OidcToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OidcToken"
    ADD CONSTRAINT "OidcToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SipocComment SipocComment_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocComment"
    ADD CONSTRAINT "SipocComment_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES public."SipocComment"(comment_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SipocComment SipocComment_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocComment"
    ADD CONSTRAINT "SipocComment_sipoc_id_fkey" FOREIGN KEY (sipoc_id) REFERENCES public."SipocDiagram"(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocConnection SipocConnection_source_element_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocConnection"
    ADD CONSTRAINT "SipocConnection_source_element_id_fkey" FOREIGN KEY (source_element_id) REFERENCES public."SipocElement"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocConnection SipocConnection_source_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocConnection"
    ADD CONSTRAINT "SipocConnection_source_sipoc_id_fkey" FOREIGN KEY (source_sipoc_id) REFERENCES public."SipocDiagram"(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocConnection SipocConnection_target_element_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocConnection"
    ADD CONSTRAINT "SipocConnection_target_element_id_fkey" FOREIGN KEY (target_element_id) REFERENCES public."SipocElement"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocConnection SipocConnection_target_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocConnection"
    ADD CONSTRAINT "SipocConnection_target_sipoc_id_fkey" FOREIGN KEY (target_sipoc_id) REFERENCES public."SipocDiagram"(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocDiagram SipocDiagram_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocDiagram"
    ADD CONSTRAINT "SipocDiagram_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocDiagram SipocDiagram_workspace_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocDiagram"
    ADD CONSTRAINT "SipocDiagram_workspace_level_id_fkey" FOREIGN KEY (workspace_level_id) REFERENCES public."WorkspaceLevel"(level_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SipocElement SipocElement_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocElement"
    ADD CONSTRAINT "SipocElement_sipoc_id_fkey" FOREIGN KEY (sipoc_id) REFERENCES public."SipocDiagram"(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocHistory SipocHistory_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocHistory"
    ADD CONSTRAINT "SipocHistory_sipoc_id_fkey" FOREIGN KEY (sipoc_id) REFERENCES public."SipocDiagram"(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocPermission SipocPermission_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocPermission"
    ADD CONSTRAINT "SipocPermission_sipoc_id_fkey" FOREIGN KEY (sipoc_id) REFERENCES public."SipocDiagram"(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocTag SipocTag_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocTag"
    ADD CONSTRAINT "SipocTag_sipoc_id_fkey" FOREIGN KEY (sipoc_id) REFERENCES public."SipocDiagram"(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocTag SipocTag_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocTag"
    ADD CONSTRAINT "SipocTag_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public."Tag"(tag_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSetting UserSetting_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSetting"
    ADD CONSTRAINT "UserSetting_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ValidationResponse ValidationResponse_validation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ValidationResponse"
    ADD CONSTRAINT "ValidationResponse_validation_id_fkey" FOREIGN KEY (validation_id) REFERENCES public."WorkspaceLevelValidation"(validation_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ValidationResponse ValidationResponse_validator_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ValidationResponse"
    ADD CONSTRAINT "ValidationResponse_validator_user_id_fkey" FOREIGN KEY (validator_user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WorkspaceLevelEdge WorkspaceLevelEdge_workspace_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelEdge"
    ADD CONSTRAINT "WorkspaceLevelEdge_workspace_level_id_fkey" FOREIGN KEY (workspace_level_id) REFERENCES public."WorkspaceLevel"(level_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WorkspaceLevelFavorite WorkspaceLevelFavorite_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelFavorite"
    ADD CONSTRAINT "WorkspaceLevelFavorite_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkspaceLevelFavorite WorkspaceLevelFavorite_workspace_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelFavorite"
    ADD CONSTRAINT "WorkspaceLevelFavorite_workspace_level_id_fkey" FOREIGN KEY (workspace_level_id) REFERENCES public."WorkspaceLevel"(level_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkspaceLevelNode WorkspaceLevelNode_workspace_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelNode"
    ADD CONSTRAINT "WorkspaceLevelNode_workspace_level_id_fkey" FOREIGN KEY (workspace_level_id) REFERENCES public."WorkspaceLevel"(level_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WorkspaceLevelValidation WorkspaceLevelValidation_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelValidation"
    ADD CONSTRAINT "WorkspaceLevelValidation_requested_by_user_id_fkey" FOREIGN KEY (requested_by_user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WorkspaceLevelValidation WorkspaceLevelValidation_workspace_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevelValidation"
    ADD CONSTRAINT "WorkspaceLevelValidation_workspace_level_id_fkey" FOREIGN KEY (workspace_level_id) REFERENCES public."WorkspaceLevel"(level_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WorkspaceLevel WorkspaceLevel_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevel"
    ADD CONSTRAINT "WorkspaceLevel_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public."WorkspaceLevel"(level_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkspaceLevel WorkspaceLevel_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceLevel"
    ADD CONSTRAINT "WorkspaceLevel_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES public."Workspace"(workspace_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Workspace Workspace_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Workspace"
    ADD CONSTRAINT "Workspace_created_by_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _GroupPermissions _GroupPermissions_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_GroupPermissions"
    ADD CONSTRAINT "_GroupPermissions_A_fkey" FOREIGN KEY ("A") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _GroupPermissions _GroupPermissions_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_GroupPermissions"
    ADD CONSTRAINT "_GroupPermissions_B_fkey" FOREIGN KEY ("B") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- Database "magna_turbo" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: magna_turbo; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE magna_turbo WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE magna_turbo OWNER TO postgres;

\connect magna_turbo

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: ApprovalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApprovalStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."ApprovalStatus" OWNER TO postgres;

--
-- Name: ConstraintType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ConstraintType" AS ENUM (
    'DELAI',
    'QUANTITY',
    'COST'
);


ALTER TYPE public."ConstraintType" OWNER TO postgres;

--
-- Name: ControlType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ControlType" AS ENUM (
    'HYGIENE',
    'ENVIRONNEMENT',
    'QUALITE',
    'SECURITE',
    'REGLEMENTAIRE'
);


ALTER TYPE public."ControlType" OWNER TO postgres;

--
-- Name: ElementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ElementType" AS ENUM (
    'supplier',
    'input',
    'process',
    'output',
    'customer'
);


ALTER TYPE public."ElementType" OWNER TO postgres;

--
-- Name: ProcedureStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProcedureStatus" AS ENUM (
    'DRAFT',
    'IN_REVIEW',
    'VALIDATED',
    'ACTIVE',
    'RETIRED'
);


ALTER TYPE public."ProcedureStatus" OWNER TO postgres;

--
-- Name: ProcessType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProcessType" AS ENUM (
    'FLOW',
    'SIPOC'
);


ALTER TYPE public."ProcessType" OWNER TO postgres;

--
-- Name: RoleType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RoleType" AS ENUM (
    'INTERNE',
    'EXTERNE'
);


ALTER TYPE public."RoleType" OWNER TO postgres;

--
-- Name: SettingType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SettingType" AS ENUM (
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'JSON',
    'FILE',
    'SECRET'
);


ALTER TYPE public."SettingType" OWNER TO postgres;

--
-- Name: ValidationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ValidationStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."ValidationStatus" OWNER TO postgres;

--
-- Name: actor_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.actor_types AS ENUM (
    'ROLE',
    'DEPARTMENT',
    'EXTERNAL',
    'SYSTEM'
);


ALTER TYPE public.actor_types OWNER TO postgres;

--
-- Name: audit_actions; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.audit_actions AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'PUBLISH',
    'ARCHIVE',
    'APPROVE',
    'REJECT',
    'LOGIN',
    'LOGOUT',
    'EXPORT',
    'IMPORT'
);


ALTER TYPE public.audit_actions OWNER TO postgres;

--
-- Name: background_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.background_types AS ENUM (
    'DOTS',
    'LINES',
    'CROSS',
    'NONE'
);


ALTER TYPE public.background_types OWNER TO postgres;

--
-- Name: confidentiality_levels; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.confidentiality_levels AS ENUM (
    'PUBLIC',
    'INTERNAL',
    'RESTRICTED',
    'CONFIDENTIAL'
);


ALTER TYPE public.confidentiality_levels OWNER TO postgres;

--
-- Name: controls_positions; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.controls_positions AS ENUM (
    'TOP_LEFT',
    'TOP_RIGHT',
    'BOTTOM_LEFT',
    'BOTTOM_RIGHT'
);


ALTER TYPE public.controls_positions OWNER TO postgres;

--
-- Name: document_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.document_types AS ENUM (
    'INPUT',
    'OUTPUT',
    'REFERENCE',
    'TEMPLATE',
    'RECORD'
);


ALTER TYPE public.document_types OWNER TO postgres;

--
-- Name: edge_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.edge_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'CONDITIONAL',
    'COMPLETED'
);


ALTER TYPE public.edge_status OWNER TO postgres;

--
-- Name: edge_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.edge_types AS ENUM (
    'SEQUENCE_FLOW',
    'CONDITIONAL_FLOW',
    'DEFAULT_FLOW',
    'MESSAGE_FLOW',
    'ASSOCIATION',
    'DATA_ASSOCIATION',
    'PARALLEL_FLOW',
    'EXCLUSIVE_FLOW',
    'INCLUSIVE_FLOW',
    'SEQUENCE',
    'CONDITION',
    'MESSAGE',
    'CONTROL_FLOW',
    'DATA_FLOW',
    'RESOURCE_FLOW'
);


ALTER TYPE public.edge_types OWNER TO postgres;

--
-- Name: flow_directions; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.flow_directions AS ENUM (
    'HORIZONTAL',
    'VERTICAL'
);


ALTER TYPE public.flow_directions OWNER TO postgres;

--
-- Name: flow_node_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.flow_node_types AS ENUM (
    'PROCESS',
    'PROCEDURE',
    'STEP',
    'START',
    'END',
    'DECISION',
    'ACTION',
    'SUBFLOW'
);


ALTER TYPE public.flow_node_types OWNER TO postgres;

--
-- Name: handle_positions; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.handle_positions AS ENUM (
    'TOP',
    'RIGHT',
    'BOTTOM',
    'LEFT'
);


ALTER TYPE public.handle_positions OWNER TO postgres;

--
-- Name: icon_positions; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.icon_positions AS ENUM (
    'LEFT',
    'RIGHT',
    'TOP',
    'BOTTOM',
    'CENTER'
);


ALTER TYPE public.icon_positions OWNER TO postgres;

--
-- Name: layout_directions; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.layout_directions AS ENUM (
    'LEFT_TO_RIGHT',
    'RIGHT_TO_LEFT',
    'TOP_TO_BOTTOM',
    'BOTTOM_TO_TOP'
);


ALTER TYPE public.layout_directions OWNER TO postgres;

--
-- Name: minimap_positions; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.minimap_positions AS ENUM (
    'TOP_LEFT',
    'TOP_RIGHT',
    'BOTTOM_LEFT',
    'BOTTOM_RIGHT'
);


ALTER TYPE public.minimap_positions OWNER TO postgres;

--
-- Name: node_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.node_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'COMPLETED',
    'ERROR',
    'WARNING'
);


ALTER TYPE public.node_status OWNER TO postgres;

--
-- Name: node_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.node_types AS ENUM (
    'START_EVENT',
    'END_EVENT',
    'INTERMEDIATE_EVENT',
    'TASK',
    'USER_TASK',
    'SERVICE_TASK',
    'SCRIPT_TASK',
    'SEND_TASK',
    'RECEIVE_TASK',
    'MANUAL_TASK',
    'BUSINESS_RULE_TASK',
    'SUBPROCESS',
    'CALL_ACTIVITY',
    'EXCLUSIVE_GATEWAY',
    'INCLUSIVE_GATEWAY',
    'PARALLEL_GATEWAY',
    'EVENT_GATEWAY',
    'COMPLEX_GATEWAY',
    'DATA_OBJECT',
    'DATA_STORE',
    'POOL',
    'LANE',
    'TEXT_ANNOTATION',
    'GROUP',
    'DEBUT',
    'FIN',
    'INSTRUCTION',
    'SOUS_PROCEDURE',
    'MACRO_INSTRUCTION',
    'INSTRUCTION_COLLAB',
    'ACTION_AMONT',
    'ACTION_AVAL',
    'DOCUMENT_REF',
    'MOYEN_REF',
    'INPUT_NODE',
    'OUTPUT_NODE',
    'CUSTOM_NODE'
);


ALTER TYPE public.node_types OWNER TO postgres;

--
-- Name: notification_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_types AS ENUM (
    'PROCESS_CREATED',
    'PROCESS_UPDATED',
    'PROCESS_PUBLISHED',
    'PROCESS_ARCHIVED',
    'APPROVAL_REQUESTED',
    'APPROVAL_APPROVED',
    'APPROVAL_REJECTED',
    'COMMENT_ADDED',
    'ASSIGNMENT_CREATED',
    'REVIEW_DUE',
    'WORKSPACE_INVITATION'
);


ALTER TYPE public.notification_types OWNER TO postgres;

--
-- Name: path_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.path_types AS ENUM (
    'STRAIGHT',
    'SMOOTHSTEP',
    'STEP',
    'BEZIER',
    'SIMPLE_BEZIER'
);


ALTER TYPE public.path_types OWNER TO postgres;

--
-- Name: process_priorities; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.process_priorities AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public.process_priorities OWNER TO postgres;

--
-- Name: process_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.process_status AS ENUM (
    'DRAFT',
    'IN_REVIEW',
    'VALIDATED',
    'PUBLISHED',
    'ARCHIVED',
    'OBSOLETE'
);


ALTER TYPE public.process_status OWNER TO postgres;

--
-- Name: qualigram_edge_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.qualigram_edge_types AS ENUM (
    'SEQUENCE',
    'CONDITIONAL',
    'DEFAULT',
    'MESSAGE'
);


ALTER TYPE public.qualigram_edge_types OWNER TO postgres;

--
-- Name: qualigram_node_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.qualigram_node_types AS ENUM (
    'START',
    'END',
    'ACTIVITY',
    'DECISION',
    'SUBPROCESS',
    'DOCUMENT',
    'COMMENT',
    'CONNECTOR',
    'GATEWAY_AND',
    'GATEWAY_OR',
    'GATEWAY_XOR',
    'EVENT_TIMER',
    'EVENT_MESSAGE',
    'PROCESS_NODE',
    'PROCEDURE_NODE'
);


ALTER TYPE public.qualigram_node_types OWNER TO postgres;

--
-- Name: risk_levels; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risk_levels AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public.risk_levels OWNER TO postgres;

--
-- Name: user_roles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_roles AS ENUM (
    'ADMIN',
    'PROCESS_OWNER',
    'EDITOR',
    'VIEWER',
    'VALIDATOR'
);


ALTER TYPE public.user_roles OWNER TO postgres;

--
-- Name: workspace_roles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.workspace_roles AS ENUM (
    'OWNER',
    'ADMIN',
    'EDITOR',
    'REVIEWER',
    'VIEWER'
);


ALTER TYPE public.workspace_roles OWNER TO postgres;

--
-- Name: workspace_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.workspace_types AS ENUM (
    'GROUPE',
    'ENTITY',
    'DIRECTION',
    'DEPARTMENT',
    'TEAM'
);


ALTER TYPE public.workspace_types OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SipocComment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocComment" (
    comment_id integer NOT NULL,
    "documentId" uuid NOT NULL,
    sipoc_id text NOT NULL,
    user_id text NOT NULL,
    comment_text text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    parent_comment_id integer
);


ALTER TABLE public."SipocComment" OWNER TO postgres;

--
-- Name: SipocComment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SipocComment_comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SipocComment_comment_id_seq" OWNER TO postgres;

--
-- Name: SipocComment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SipocComment_comment_id_seq" OWNED BY public."SipocComment".comment_id;


--
-- Name: SipocPermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocPermission" (
    permission_id integer NOT NULL,
    "documentId" uuid NOT NULL,
    sipoc_id text NOT NULL,
    user_id text NOT NULL,
    permission_level text NOT NULL,
    granted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    granted_by text NOT NULL
);


ALTER TABLE public."SipocPermission" OWNER TO postgres;

--
-- Name: SipocPermission_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SipocPermission_permission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SipocPermission_permission_id_seq" OWNER TO postgres;

--
-- Name: SipocPermission_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SipocPermission_permission_id_seq" OWNED BY public."SipocPermission".permission_id;


--
-- Name: SipocTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SipocTag" (
    sipoc_id text NOT NULL,
    tag_id integer NOT NULL,
    "documentId" uuid NOT NULL
);


ALTER TABLE public."SipocTag" OWNER TO postgres;

--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    tag_id integer NOT NULL,
    "documentId" uuid NOT NULL,
    name text NOT NULL,
    color text
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: Tag_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tag_tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tag_tag_id_seq" OWNER TO postgres;

--
-- Name: Tag_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tag_tag_id_seq" OWNED BY public."Tag".tag_id;


--
-- Name: _ProcedureToProcessTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProcedureToProcessTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProcedureToProcessTag" OWNER TO postgres;

--
-- Name: _ProcessMapToProcessTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProcessMapToProcessTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProcessMapToProcessTag" OWNER TO postgres;

--
-- Name: _ProcessOwners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProcessOwners" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProcessOwners" OWNER TO postgres;

--
-- Name: _ProcessToProcessTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProcessToProcessTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProcessToProcessTag" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: approval_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_requests (
    id text NOT NULL,
    "userId" text NOT NULL,
    status public."ApprovalStatus" DEFAULT 'PENDING'::public."ApprovalStatus" NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "processId" text NOT NULL
);


ALTER TABLE public.approval_requests OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    action public.audit_actions NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text NOT NULL,
    "oldValues" jsonb,
    "newValues" jsonb,
    metadata jsonb,
    "ipAddress" text,
    "userAgent" text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id text NOT NULL,
    content text NOT NULL,
    "isResolved" boolean DEFAULT false NOT NULL,
    "resolvedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "processId" text,
    "nodeId" text,
    "parentId" text,
    "resolvedById" text,
    "flowNodeId" text,
    "procedureId" text,
    "processMapId" text
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: constraints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.constraints (
    id text NOT NULL,
    "nodeId" text NOT NULL,
    type public."ConstraintType" NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.constraints OWNER TO postgres;

--
-- Name: control_indicators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.control_indicators (
    id text NOT NULL,
    "nodeId" text NOT NULL,
    type public."ControlType" NOT NULL
);


ALTER TABLE public.control_indicators OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    code text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "workspaceId" text NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id text NOT NULL,
    name text NOT NULL,
    "fileUrl" text NOT NULL,
    "mimeType" text,
    "processId" text,
    "procedureId" text,
    "processMapId" text
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: edges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.edges (
    id text NOT NULL,
    "fromId" text NOT NULL,
    "toId" text NOT NULL,
    label text,
    animated boolean DEFAULT false NOT NULL,
    hidden boolean DEFAULT false NOT NULL,
    selected boolean DEFAULT false NOT NULL,
    style jsonb,
    "className" text,
    "strokeColor" text DEFAULT '#b1b1b7'::text,
    "strokeWidth" double precision DEFAULT 1.5,
    "strokeDasharray" text,
    "markerStart" text,
    "markerEnd" text DEFAULT 'arrowclosed'::text,
    "markerSize" integer DEFAULT 20,
    "labelStyle" jsonb,
    "labelShowBg" boolean DEFAULT true NOT NULL,
    "labelBgStyle" jsonb,
    "labelBgPadding" jsonb,
    "labelBgBorderRadius" integer DEFAULT 2,
    "pathType" public.path_types DEFAULT 'SMOOTHSTEP'::public.path_types NOT NULL,
    "sourceHandle" text,
    "targetHandle" text,
    condition text,
    "isAnd" boolean DEFAULT true NOT NULL,
    priority integer DEFAULT 0,
    probability double precision,
    "isDefault" boolean DEFAULT false NOT NULL,
    "estimatedTime" integer,
    "actualTime" integer,
    status public.edge_status DEFAULT 'ACTIVE'::public.edge_status NOT NULL,
    metadata jsonb,
    tags text[],
    type text NOT NULL
);


ALTER TABLE public.edges OWNER TO postgres;

--
-- Name: flow_diagrams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flow_diagrams (
    id text NOT NULL,
    level integer NOT NULL,
    "processId" text NOT NULL,
    "flowDirection" public.flow_directions DEFAULT 'HORIZONTAL'::public.flow_directions NOT NULL,
    "processMapId" text,
    "processId_ref" text,
    "procedureId" text,
    snapshot json,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.flow_diagrams OWNER TO postgres;

--
-- Name: flow_edges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flow_edges (
    id text NOT NULL,
    "diagramId" text NOT NULL,
    "rfId" text NOT NULL,
    "sourceRfId" text NOT NULL,
    "targetRfId" text NOT NULL,
    label text,
    condition text,
    data json,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.flow_edges OWNER TO postgres;

--
-- Name: flow_nodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flow_nodes (
    id text NOT NULL,
    "diagramId" text NOT NULL,
    "rfId" text NOT NULL,
    type public.flow_node_types NOT NULL,
    label text,
    data json,
    "position" json NOT NULL,
    "entityType" text,
    "referencedEntityId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.flow_nodes OWNER TO postgres;

--
-- Name: group_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_permissions (
    id text NOT NULL,
    "groupId" text NOT NULL,
    resource text NOT NULL,
    action text NOT NULL,
    conditions jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.group_permissions OWNER TO postgres;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    color text DEFAULT '#EA580C'::text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: indicators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.indicators (
    id text NOT NULL,
    "processId" text NOT NULL,
    name text NOT NULL,
    description text,
    formula text,
    target text,
    frequency text,
    unit text,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.indicators OWNER TO postgres;

--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_entries (
    id text NOT NULL,
    "processId" text,
    action text NOT NULL,
    actor text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    comment text,
    "procedureId" text,
    "processMapId" text
);


ALTER TABLE public.journal_entries OWNER TO postgres;

--
-- Name: linked_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.linked_documents (
    id text NOT NULL,
    "processId" text,
    "procedureId" text,
    name text NOT NULL,
    reference text,
    type public.document_types NOT NULL,
    url text,
    "filePath" text,
    version text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.linked_documents OWNER TO postgres;

--
-- Name: means; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.means (
    id text NOT NULL,
    name text NOT NULL,
    "processId" text,
    "procedureId" text,
    "processMapId" text
);


ALTER TABLE public.means OWNER TO postgres;

--
-- Name: node_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.node_templates (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    "defaultStyle" jsonb NOT NULL,
    "defaultSize" jsonb NOT NULL,
    icon text,
    thumbnail text,
    "isCustom" boolean DEFAULT false NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "workspaceId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "nodeType" text NOT NULL
);


ALTER TABLE public.node_templates OWNER TO postgres;

--
-- Name: nodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nodes (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    "positionX" double precision DEFAULT 0 NOT NULL,
    "positionY" double precision DEFAULT 0 NOT NULL,
    width double precision DEFAULT 120,
    height double precision DEFAULT 80,
    "zIndex" integer DEFAULT 1,
    "sourcePosition" public.handle_positions DEFAULT 'RIGHT'::public.handle_positions,
    "targetPosition" public.handle_positions DEFAULT 'LEFT'::public.handle_positions,
    "isConnectable" boolean DEFAULT true NOT NULL,
    "isDraggable" boolean DEFAULT true NOT NULL,
    "isSelectable" boolean DEFAULT true NOT NULL,
    style jsonb,
    "className" text,
    "backgroundColor" text,
    "borderColor" text,
    "borderWidth" integer DEFAULT 1,
    "borderRadius" integer DEFAULT 4,
    "fontSize" integer DEFAULT 12,
    "fontColor" text DEFAULT '#000000'::text,
    "fontWeight" text DEFAULT 'normal'::text,
    opacity double precision DEFAULT 1.0,
    icon text,
    "iconPosition" public.icon_positions DEFAULT 'LEFT'::public.icon_positions,
    "iconSize" integer DEFAULT 16,
    "iconColor" text,
    "hoverStyle" jsonb,
    "selectedStyle" jsonb,
    "errorStyle" jsonb,
    animation text,
    "animationDuration" integer DEFAULT 1000,
    transition text,
    "roleId" text,
    "subProcessId" text,
    "isMacro" boolean DEFAULT false NOT NULL,
    "isCollaborative" boolean DEFAULT false NOT NULL,
    "linkedDocumentId" text,
    "linkedInstructionId" text,
    "isRequired" boolean DEFAULT false NOT NULL,
    "validationRules" jsonb,
    "businessRules" jsonb,
    "estimatedDuration" integer,
    "actualDuration" integer,
    "slaTime" integer,
    status public.node_status DEFAULT 'ACTIVE'::public.node_status NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "isLocked" boolean DEFAULT false NOT NULL,
    "lastModified" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data jsonb,
    metadata jsonb,
    tags text[],
    "parentNodeId" text,
    "groupId" text,
    "layerId" text,
    type text NOT NULL
);


ALTER TABLE public.nodes OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    type public.notification_types NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readAt" timestamp(3) without time zone,
    "userId" text NOT NULL,
    "processId" text,
    "procedureId" text,
    "processMapId" text
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: procedure_validation_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedure_validation_requests (
    id text NOT NULL,
    "procedureId" text NOT NULL,
    "requestedById" text NOT NULL,
    "validatorId" text NOT NULL,
    status public."ValidationStatus" DEFAULT 'PENDING'::public."ValidationStatus" NOT NULL,
    comment text,
    "validatedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.procedure_validation_requests OWNER TO postgres;

--
-- Name: procedures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedures (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    code text NOT NULL,
    status public."ProcedureStatus" DEFAULT 'DRAFT'::public."ProcedureStatus" NOT NULL,
    "processId" text,
    "workspaceId" text NOT NULL,
    "departmentId" text,
    objective text,
    scope text,
    "validatedBy" text,
    "validatedAt" timestamp(3) without time zone,
    "effectiveDate" timestamp(3) without time zone,
    "expirationDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "archivedAt" timestamp(3) without time zone,
    "createdById" text NOT NULL
);


ALTER TABLE public.procedures OWNER TO postgres;

--
-- Name: process_actors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_actors (
    id text NOT NULL,
    "processId" text NOT NULL,
    name text NOT NULL,
    type public.actor_types NOT NULL,
    role text,
    responsibilities text,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.process_actors OWNER TO postgres;

--
-- Name: process_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_assignments (
    id text NOT NULL,
    "processId" text NOT NULL,
    "userId" text NOT NULL,
    "roleId" text NOT NULL
);


ALTER TABLE public.process_assignments OWNER TO postgres;

--
-- Name: process_identity_cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_identity_cards (
    fip_id text NOT NULL,
    "documentId" uuid NOT NULL,
    "processId" text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text NOT NULL,
    objectives text,
    scope text,
    indicators jsonb,
    stakeholders jsonb,
    risks jsonb,
    opportunities jsonb,
    resources jsonb,
    "performanceTargets" jsonb
);


ALTER TABLE public.process_identity_cards OWNER TO postgres;

--
-- Name: process_inputs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_inputs (
    id text NOT NULL,
    "processId" text NOT NULL,
    trigger text NOT NULL,
    source text NOT NULL,
    "sourceRole" text NOT NULL
);


ALTER TABLE public.process_inputs OWNER TO postgres;

--
-- Name: process_ios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_ios (
    id text NOT NULL,
    "processId" text NOT NULL,
    name text NOT NULL,
    description text,
    type text,
    "isInput" boolean NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.process_ios OWNER TO postgres;

--
-- Name: process_map_validation_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_map_validation_requests (
    id text NOT NULL,
    "processMapId" text NOT NULL,
    "requestedById" text NOT NULL,
    "validatorId" text NOT NULL,
    status public."ValidationStatus" DEFAULT 'PENDING'::public."ValidationStatus" NOT NULL,
    comment text,
    "validatedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.process_map_validation_requests OWNER TO postgres;

--
-- Name: process_maps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_maps (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    code text NOT NULL,
    status public.process_status DEFAULT 'DRAFT'::public.process_status NOT NULL,
    "workspaceId" text NOT NULL,
    "departmentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "archivedAt" timestamp(3) without time zone,
    "createdById" text NOT NULL
);


ALTER TABLE public.process_maps OWNER TO postgres;

--
-- Name: process_outputs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_outputs (
    id text NOT NULL,
    "processId" text NOT NULL,
    output text NOT NULL,
    target text NOT NULL,
    "targetRole" text NOT NULL
);


ALTER TABLE public.process_outputs OWNER TO postgres;

--
-- Name: process_qualigram_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_qualigram_tags (
    "processId" text NOT NULL,
    "tagId" text NOT NULL
);


ALTER TABLE public.process_qualigram_tags OWNER TO postgres;

--
-- Name: process_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_tags (
    id text NOT NULL,
    name text NOT NULL,
    color text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "workspaceId" text NOT NULL
);


ALTER TABLE public.process_tags OWNER TO postgres;

--
-- Name: process_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_templates (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    type public."ProcessType" NOT NULL,
    level integer NOT NULL,
    template jsonb NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "workspaceId" text NOT NULL,
    "createdById" text NOT NULL
);


ALTER TABLE public.process_templates OWNER TO postgres;

--
-- Name: process_themes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_themes (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "nodeStyles" jsonb NOT NULL,
    "edgeStyles" jsonb NOT NULL,
    "primaryColor" text DEFAULT '#1976d2'::text NOT NULL,
    "secondaryColor" text DEFAULT '#dc004e'::text NOT NULL,
    "successColor" text DEFAULT '#388e3c'::text NOT NULL,
    "errorColor" text DEFAULT '#d32f2f'::text NOT NULL,
    "warningColor" text DEFAULT '#f57c00'::text NOT NULL,
    "fontFamily" text DEFAULT '''Roboto'', sans-serif'::text NOT NULL,
    "fontSize" jsonb NOT NULL,
    spacing jsonb NOT NULL,
    "borderRadius" jsonb NOT NULL,
    "workspaceId" text,
    "isDefault" boolean DEFAULT false NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.process_themes OWNER TO postgres;

--
-- Name: process_validation_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process_validation_requests (
    id text NOT NULL,
    "processId" text NOT NULL,
    "requestedById" text NOT NULL,
    "validatorId" text NOT NULL,
    status public."ValidationStatus" DEFAULT 'PENDING'::public."ValidationStatus" NOT NULL,
    comment text,
    "validatedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.process_validation_requests OWNER TO postgres;

--
-- Name: processes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.processes (
    id text NOT NULL,
    description text,
    type public."ProcessType" DEFAULT 'FLOW'::public."ProcessType" NOT NULL,
    priority public.process_priorities DEFAULT 'MEDIUM'::public.process_priorities,
    confidentiality public.confidentiality_levels DEFAULT 'INTERNAL'::public.confidentiality_levels,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "archivedAt" timestamp(3) without time zone,
    "nextReviewDate" timestamp(3) without time zone,
    "workspaceId" text NOT NULL,
    "departmentId" text,
    "createdById" text NOT NULL,
    "approvalDate" timestamp(3) without time zone,
    code text NOT NULL,
    finalite text,
    objectif text,
    perimetre text,
    "processMapId" text,
    "reviewFrequency" integer,
    title text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public.process_status DEFAULT 'DRAFT'::public.process_status NOT NULL
);


ALTER TABLE public.processes OWNER TO postgres;

--
-- Name: qualigram_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qualigram_tags (
    id text NOT NULL,
    name text NOT NULL,
    color text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.qualigram_tags OWNER TO postgres;

--
-- Name: reading_confirmations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reading_confirmations (
    id text NOT NULL,
    "userId" text NOT NULL,
    "confirmedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "processId" text NOT NULL
);


ALTER TABLE public.reading_confirmations OWNER TO postgres;

--
-- Name: risks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risks (
    id text NOT NULL,
    "processId" text NOT NULL,
    description text NOT NULL,
    level public.risk_levels NOT NULL,
    probability integer,
    impact integer,
    mitigation text,
    owner text,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.risks OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL,
    type public."RoleType" NOT NULL,
    "unitId" text,
    color text,
    description text
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id text NOT NULL,
    key text NOT NULL,
    value text,
    type public."SettingType" NOT NULL,
    category text NOT NULL,
    description text,
    "isEncrypted" boolean DEFAULT false NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: sipoc_connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sipoc_connections (
    connection_id text NOT NULL,
    "documentId" uuid NOT NULL,
    source_element_id text NOT NULL,
    target_element_id text NOT NULL,
    description text,
    status text DEFAULT 'active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    sipoc_id text NOT NULL,
    source_sipoc_id text NOT NULL,
    target_sipoc_id text NOT NULL
);


ALTER TABLE public.sipoc_connections OWNER TO postgres;

--
-- Name: sipoc_diagrams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sipoc_diagrams (
    sipoc_id text NOT NULL,
    "documentId" uuid NOT NULL,
    title text NOT NULL,
    description text,
    process_owner text,
    department text,
    status text DEFAULT 'draft'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    is_template boolean DEFAULT false NOT NULL,
    "createdBy" text NOT NULL,
    "processId" text
);


ALTER TABLE public.sipoc_diagrams OWNER TO postgres;

--
-- Name: sipoc_elements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sipoc_elements (
    id text NOT NULL,
    "documentId" uuid NOT NULL,
    type public."ElementType" NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "position" integer NOT NULL,
    "globalOrder" integer,
    flow_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "contactInfo" text,
    "qualityCriteria" text,
    "responsibleRole" text,
    duration text,
    sipoc_id text NOT NULL
);


ALTER TABLE public.sipoc_elements OWNER TO postgres;

--
-- Name: sipoc_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sipoc_history (
    history_id integer NOT NULL,
    "documentId" uuid NOT NULL,
    sipoc_id text NOT NULL,
    changed_by text NOT NULL,
    changed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    change_description text,
    change_type text,
    previous_state jsonb,
    new_state jsonb
);


ALTER TABLE public.sipoc_history OWNER TO postgres;

--
-- Name: sipoc_history_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sipoc_history_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sipoc_history_history_id_seq OWNER TO postgres;

--
-- Name: sipoc_history_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sipoc_history_history_id_seq OWNED BY public.sipoc_history.history_id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.units OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "displayName" text,
    "avatarUrl" text,
    phone text,
    "position" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "hashedPassword" text,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "resetToken" text,
    "resetTokenExp" timestamp(3) without time zone,
    "departmentId" text,
    "groupId" text,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "orangeId" text,
    provider text DEFAULT 'local'::text,
    "providerData" jsonb,
    role public.user_roles DEFAULT 'EDITOR'::public.user_roles NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: workspace_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspace_members (
    id text NOT NULL,
    role public.workspace_roles NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "userId" text NOT NULL,
    "workspaceId" text NOT NULL
);


ALTER TABLE public.workspace_members OWNER TO postgres;

--
-- Name: workspace_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspace_settings (
    id text NOT NULL,
    "allowExternalUsers" boolean DEFAULT false NOT NULL,
    "requireApproval" boolean DEFAULT true NOT NULL,
    "maxProcessLevels" integer DEFAULT 4 NOT NULL,
    "customFields" jsonb,
    "notificationSettings" jsonb,
    "workspaceId" text NOT NULL
);


ALTER TABLE public.workspace_settings OWNER TO postgres;

--
-- Name: workspaces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspaces (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    code text NOT NULL,
    type public.workspace_types NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "parentId" text
);


ALTER TABLE public.workspaces OWNER TO postgres;

--
-- Name: SipocComment comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocComment" ALTER COLUMN comment_id SET DEFAULT nextval('public."SipocComment_comment_id_seq"'::regclass);


--
-- Name: SipocPermission permission_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocPermission" ALTER COLUMN permission_id SET DEFAULT nextval('public."SipocPermission_permission_id_seq"'::regclass);


--
-- Name: Tag tag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag" ALTER COLUMN tag_id SET DEFAULT nextval('public."Tag_tag_id_seq"'::regclass);


--
-- Name: sipoc_history history_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_history ALTER COLUMN history_id SET DEFAULT nextval('public.sipoc_history_history_id_seq'::regclass);


--
-- Data for Name: SipocComment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocComment" (comment_id, "documentId", sipoc_id, user_id, comment_text, created_at, parent_comment_id) FROM stdin;
\.


--
-- Data for Name: SipocPermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocPermission" (permission_id, "documentId", sipoc_id, user_id, permission_level, granted_at, granted_by) FROM stdin;
\.


--
-- Data for Name: SipocTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SipocTag" (sipoc_id, tag_id, "documentId") FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (tag_id, "documentId", name, color) FROM stdin;
\.


--
-- Data for Name: _ProcedureToProcessTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProcedureToProcessTag" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _ProcessMapToProcessTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProcessMapToProcessTag" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _ProcessOwners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProcessOwners" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _ProcessToProcessTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProcessToProcessTag" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e10b9685-d5d7-458c-a796-9b3d296f46d9	da82fb0b7ad036fdd1a5d28a6386ab779767b248befb1456b55ba9d13eb451cc	2025-12-24 09:47:41.18327+00	20251101142223_update_process_type_enum	\N	\N	2025-12-24 09:47:41.094095+00	1
0aa85a04-7615-42b3-958d-755c44c69a58	d9a5d3eee947b81db6ee03ce19fbd1eb41e53214e79525024465ec8d00c71ee2	2025-12-24 09:47:41.199833+00	20251130234205_add_process_identity_card	\N	\N	2025-12-24 09:47:41.185894+00	1
481c4b5a-22e6-49e0-a3c7-3c4e0751d938	0a7177417546ca9ac303f96b304685d6ff7215ccdb23e963346c03f435200f88	2025-12-24 09:47:41.214213+00	20251218093131_add_process_validation_request	\N	\N	2025-12-24 09:47:41.201918+00	1
e3ed7701-ba3f-418d-ab48-999aaccdf5d6	ace3d596cef8fbfe88eb64bf01b44f12fdaac2700b044dda94f5d56155f8268a	\N	20251218100506_add_validation_all_levels	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251218100506_add_validation_all_levels\n\nDatabase error code: 42P01\n\nDatabase error:\nERROR: relation "process_maps" does not exist\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42P01), message: "relation \\"process_maps\\" does not exist", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("namespace.c"), line: Some(636), routine: Some("RangeVarGetRelidExtended") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20251218100506_add_validation_all_levels"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20251218100506_add_validation_all_levels"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:226	\N	2025-12-24 09:47:41.216914+00	0
\.


--
-- Data for Name: approval_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_requests (id, "userId", status, comment, "createdAt", "processId") FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, action, "entityType", "entityId", "oldValues", "newValues", metadata, "ipAddress", "userAgent", "timestamp", "userId") FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content, "isResolved", "resolvedAt", "createdAt", "updatedAt", "userId", "processId", "nodeId", "parentId", "resolvedById", "flowNodeId", "procedureId", "processMapId") FROM stdin;
\.


--
-- Data for Name: constraints; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.constraints (id, "nodeId", type, value) FROM stdin;
\.


--
-- Data for Name: control_indicators; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.control_indicators (id, "nodeId", type) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, description, code, "isActive", "createdAt", "updatedAt", "workspaceId") FROM stdin;
cmjjuyh9o000cvckycl48ehdp	Information Technology	IT Department responsible for technology infrastructure	IT	t	2025-12-24 10:15:29.005	2025-12-24 10:15:29.005	cmjjuyh9g0008vckyt3wuzn2b
cmjjuyh9r000evcky8f3z51if	Human Resources	HR Department for people management	HR	t	2025-12-24 10:15:29.008	2025-12-24 10:15:29.008	cmjjuyh9g0008vckyt3wuzn2b
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, name, "fileUrl", "mimeType", "processId", "procedureId", "processMapId") FROM stdin;
\.


--
-- Data for Name: edges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.edges (id, "fromId", "toId", label, animated, hidden, selected, style, "className", "strokeColor", "strokeWidth", "strokeDasharray", "markerStart", "markerEnd", "markerSize", "labelStyle", "labelShowBg", "labelBgStyle", "labelBgPadding", "labelBgBorderRadius", "pathType", "sourceHandle", "targetHandle", condition, "isAnd", priority, probability, "isDefault", "estimatedTime", "actualTime", status, metadata, tags, type) FROM stdin;
\.


--
-- Data for Name: flow_diagrams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flow_diagrams (id, level, "processId", "flowDirection", "processMapId", "processId_ref", "procedureId", snapshot, "createdAt", "updatedAt") FROM stdin;
cmk3s7o09004dq6odd8q02i36	2	cmk3s7nzv0044q6od013hxko5	HORIZONTAL	\N	cmk3s7nzv0044q6od013hxko5	\N	\N	2026-01-07 08:54:02.313	2026-01-07 08:54:02.313
cmk3s7o0t004jq6odu81p49o8	2	cmk3s7o040048q6oddvv7yhk8	HORIZONTAL	\N	cmk3s7o040048q6oddvv7yhk8	\N	\N	2026-01-07 08:54:02.333	2026-01-07 08:54:02.333
cmk3the5j0059q6odg113kgu9	2	cmk3the560054q6odn4br4vm9	HORIZONTAL	\N	cmk3the560054q6odn4br4vm9	\N	\N	2026-01-07 09:29:35.719	2026-01-07 09:29:35.719
cmk3uiud5005vq6od2cuk57v2	3	cmk3uiucx005tq6od3nhrosys	HORIZONTAL	\N	\N	cmk3uiucx005tq6od3nhrosys	\N	2026-01-07 09:58:43.001	2026-01-07 09:58:43.001
cmk3uiudg0061q6odc8s6uufq	3	cmk3uiude005zq6oddn5lxuw7	HORIZONTAL	\N	\N	cmk3uiude005zq6oddn5lxuw7	\N	2026-01-07 09:58:43.012	2026-01-07 09:58:43.012
cmk3uiudo0067q6odfyrun6wz	3	cmk3uiudm0065q6odp6538vcn	HORIZONTAL	\N	\N	cmk3uiudm0065q6odp6538vcn	\N	2026-01-07 09:58:43.021	2026-01-07 09:58:43.021
cmk3uiudx006dq6odhzmkyn9j	3	cmk3uiudv006bq6odsvn4qn9i	HORIZONTAL	\N	\N	cmk3uiudv006bq6odsvn4qn9i	\N	2026-01-07 09:58:43.029	2026-01-07 09:58:43.029
cmk3uiue5006jq6odd60s9p4m	3	cmk3uiue3006hq6od7777wyd5	HORIZONTAL	\N	\N	cmk3uiue3006hq6od7777wyd5	\N	2026-01-07 09:58:43.037	2026-01-07 09:58:43.037
cmk3uiued006pq6oden0nj8ul	3	cmk3uiueb006nq6odgewaxx0l	HORIZONTAL	\N	\N	cmk3uiueb006nq6odgewaxx0l	\N	2026-01-07 09:58:43.045	2026-01-07 09:58:43.045
cmk3uiuej006vq6od4ip4f04m	3	cmk3uiuei006tq6od38nr91k8	HORIZONTAL	\N	\N	cmk3uiuei006tq6od38nr91k8	\N	2026-01-07 09:58:43.052	2026-01-07 09:58:43.052
cmk3uiues0071q6od61gaixj1	3	cmk3uiueq006zq6od0c6gwf9s	HORIZONTAL	\N	\N	cmk3uiueq006zq6od0c6gwf9s	\N	2026-01-07 09:58:43.06	2026-01-07 09:58:43.06
cmk3uiuex0077q6od5q7dz8jx	3	cmk3uiuew0075q6od63421h1s	HORIZONTAL	\N	\N	cmk3uiuew0075q6od63421h1s	\N	2026-01-07 09:58:43.066	2026-01-07 09:58:43.066
cmk3uiuf4007dq6od5u78zghr	3	cmk3uiuf2007bq6odwaaxugul	HORIZONTAL	\N	\N	cmk3uiuf2007bq6odwaaxugul	\N	2026-01-07 09:58:43.072	2026-01-07 09:58:43.072
cmk3uz7bx0094q6od1jh8ywzv	2	cmk3uz7b6008mq6od33zdmc7d	HORIZONTAL	\N	cmk3uz7b6008mq6od33zdmc7d	\N	\N	2026-01-07 10:11:26.301	2026-01-07 10:11:26.301
cmk3uz7c4009cq6odj9usgtke	2	cmk3uz7bo008yq6od9my094ih	HORIZONTAL	\N	cmk3uz7bo008yq6od9my094ih	\N	\N	2026-01-07 10:11:26.308	2026-01-07 10:11:26.308
cmk3uz7c4009eq6odxa4qybaz	2	cmk3uz7bc008rq6od20148f4w	HORIZONTAL	\N	cmk3uz7bc008rq6od20148f4w	\N	\N	2026-01-07 10:11:26.309	2026-01-07 10:11:26.309
cmk3uz7d7009kq6odt3b3bbhq	2	cmk3uz7bq0090q6odsfd5c93f	HORIZONTAL	\N	cmk3uz7bq0090q6odsfd5c93f	\N	\N	2026-01-07 10:11:26.347	2026-01-07 10:11:26.347
cmk3vd28o00agq6odb35u7f3w	2	cmk3vd28h00abq6odrcwyt914	HORIZONTAL	\N	cmk3vd28h00abq6odrcwyt914	\N	\N	2026-01-07 10:22:12.888	2026-01-07 10:22:12.888
cmk3vv1a20018cg7k2r928ekg	2	cmk3vv19n000tcg7kjtk9jhic	HORIZONTAL	\N	cmk3vv19n000tcg7kjtk9jhic	\N	\N	2026-01-07 10:36:11.45	2026-01-07 10:36:11.45
cmk3vv1a10012cg7k3gxj0sel	2	cmk3vv19b000ncg7ki58so0xt	HORIZONTAL	\N	cmk3vv19b000ncg7ki58so0xt	\N	\N	2026-01-07 10:36:11.45	2026-01-07 10:36:11.45
cmk3vv1a2001acg7k9o67x1go	2	cmk3vv196000jcg7klt5cc509	HORIZONTAL	\N	cmk3vv196000jcg7klt5cc509	\N	\N	2026-01-07 10:36:11.45	2026-01-07 10:36:11.45
cmk3vv1aq001ecg7ke3g633x5	2	cmk3vv19q000ycg7kb9on3puq	HORIZONTAL	\N	cmk3vv19q000ycg7kb9on3puq	\N	\N	2026-01-07 10:36:11.474	2026-01-07 10:36:11.474
cmk3vv1fl002jcg7kyruoa54g	2	cmk3vv1f40029cg7kl3lxwbzv	HORIZONTAL	\N	cmk3vv1f40029cg7kl3lxwbzv	\N	\N	2026-01-07 10:36:11.65	2026-01-07 10:36:11.65
cmk3vv1fo002pcg7kit3oxf5g	2	cmk3vv1fh002fcg7ksz59fe13	HORIZONTAL	\N	cmk3vv1fh002fcg7ksz59fe13	\N	\N	2026-01-07 10:36:11.652	2026-01-07 10:36:11.652
cmk3vv1fv002rcg7k4wqip022	2	cmk3vv1fj002hcg7kpvw8uqqn	HORIZONTAL	\N	cmk3vv1fj002hcg7kpvw8uqqn	\N	\N	2026-01-07 10:36:11.66	2026-01-07 10:36:11.66
cmk3w9y21000d774jtufm8nrw	2	cmk3w9y0m000a774jqmni6vtw	HORIZONTAL	\N	cmk3w9y0m000a774jqmni6vtw	\N	\N	2026-01-07 10:47:47.113	2026-01-07 10:47:47.113
cmk3w9y3u0014774jg0pazlau	2	cmk3w9y2o000r774jw9vfn5vj	HORIZONTAL	\N	cmk3w9y2o000r774jw9vfn5vj	\N	\N	2026-01-07 10:47:47.179	2026-01-07 10:47:47.179
cmk3w9y4p001c774jr8riau2d	2	cmk3w9y2p000t774jp3x36c4v	HORIZONTAL	\N	cmk3w9y2p000t774jp3x36c4v	\N	\N	2026-01-07 10:47:47.209	2026-01-07 10:47:47.209
cmk3w9y66001e774jcp7tity4	2	cmk3w9y34000y774jtbq3cftj	HORIZONTAL	\N	cmk3w9y34000y774jtbq3cftj	\N	\N	2026-01-07 10:47:47.262	2026-01-07 10:47:47.262
cmk3w9y69001g774jpcgqzxit	2	cmk3w9y340010774jzaw6j3ls	HORIZONTAL	\N	cmk3w9y340010774jzaw6j3ls	\N	\N	2026-01-07 10:47:47.266	2026-01-07 10:47:47.266
cmk3wl3fg000sst0bpbbbm7om	2	cmk3wl3eu000gst0bejiwwt4m	HORIZONTAL	\N	cmk3wl3eu000gst0bejiwwt4m	\N	\N	2026-01-07 10:56:27.292	2026-01-07 10:56:27.292
cmk3wl3fm0013st0bbroavv22	2	cmk3wl3f2000nst0boj6vmoil	HORIZONTAL	\N	cmk3wl3f2000nst0boj6vmoil	\N	\N	2026-01-07 10:56:27.298	2026-01-07 10:56:27.298
cmk3wl3fl000zst0blwqmql6s	2	cmk3wl3f1000kst0b8q3woerf	HORIZONTAL	\N	cmk3wl3f1000kst0b8q3woerf	\N	\N	2026-01-07 10:56:27.297	2026-01-07 10:56:27.297
cmk3yo0fy007gst0b89nti57m	2	cmk3yo0fr007ast0bstxjbuxd	HORIZONTAL	\N	cmk3yo0fr007ast0bstxjbuxd	\N	\N	2026-01-07 11:54:42.622	2026-01-07 11:54:42.622
cmk3womhy0021st0bkigg3lb7	2	cmk3womht001vst0b8uogfnnm	HORIZONTAL	\N	cmk3womht001vst0b8uogfnnm	\N	\N	2026-01-07 10:59:11.975	2026-01-07 10:59:11.975
cmk3womi00027st0b1ay6qwfw	2	cmk3womhv001zst0bxn1g59dp	HORIZONTAL	\N	cmk3womhv001zst0bxn1g59dp	\N	\N	2026-01-07 10:59:11.977	2026-01-07 10:59:11.977
cmk40d86b008jst0bnamhsvke	2	cmk40d85g008fst0bniojam6x	HORIZONTAL	\N	cmk40d85g008fst0bniojam6x	\N	\N	2026-01-07 12:42:18.66	2026-01-07 12:42:18.66
cmk3x29tb0038st0bxpu2jog6	2	cmk3x29rt002wst0bvfm66351	HORIZONTAL	\N	cmk3x29rt002wst0bvfm66351	\N	\N	2026-01-07 11:09:48.719	2026-01-07 11:09:48.719
cmk3x29u8003hst0bn8t4lv9z	2	cmk3x29si002yst0box2963rs	HORIZONTAL	\N	cmk3x29si002yst0box2963rs	\N	\N	2026-01-07 11:09:48.752	2026-01-07 11:09:48.752
cmk3x29uw003ost0baodmahev	2	cmk3x29r0002sst0b53gczwxk	HORIZONTAL	\N	cmk3x29r0002sst0b53gczwxk	\N	\N	2026-01-07 11:09:48.777	2026-01-07 11:09:48.777
cmk3x29v1003ust0blgr4h0g8	2	cmk3x29sw0033st0bhw8oy5ya	HORIZONTAL	\N	cmk3x29sw0033st0bhw8oy5ya	\N	\N	2026-01-07 11:09:48.781	2026-01-07 11:09:48.781
cmk3x29vo003wst0bxncz165g	2	cmk3x29td003bst0bwlry5lbz	HORIZONTAL	\N	cmk3x29td003bst0bwlry5lbz	\N	\N	2026-01-07 11:09:48.804	2026-01-07 11:09:48.804
cmk3ye87p0053st0bdni6vyr6	2	cmk3ye873004tst0bfpx28nzx	HORIZONTAL	\N	cmk3ye873004tst0bfpx28nzx	\N	\N	2026-01-07 11:47:06.133	2026-01-07 11:47:06.133
cmk3ye8820059st0bc1w91bxx	2	cmk3ye874004wst0bi3mizldg	HORIZONTAL	\N	cmk3ye874004wst0bi3mizldg	\N	\N	2026-01-07 11:47:06.147	2026-01-07 11:47:06.147
cmk3ye88r005bst0bpm4lzhdq	2	cmk3ye87e004zst0btmgv55el	HORIZONTAL	\N	cmk3ye87e004zst0btmgv55el	\N	\N	2026-01-07 11:47:06.169	2026-01-07 11:47:06.169
cmk3ylgul006ist0bivafxomh	2	cmk3ylgtz0062st0bj7grjhol	HORIZONTAL	\N	cmk3ylgtz0062st0bj7grjhol	\N	\N	2026-01-07 11:52:43.917	2026-01-07 11:52:43.917
cmk3ylgum006mst0bpiseepwc	2	cmk3ylgu6006cst0b2ruyc2jo	HORIZONTAL	\N	cmk3ylgu6006cst0b2ruyc2jo	\N	\N	2026-01-07 11:52:43.918	2026-01-07 11:52:43.918
cmk3ylguw006qst0bk2b9jf0b	2	cmk3ylgu5006ast0bshjxnjfv	HORIZONTAL	\N	cmk3ylgu5006ast0bshjxnjfv	\N	\N	2026-01-07 11:52:43.928	2026-01-07 11:52:43.928
cmk3yqfhb007ust0blacidbwd	2	cmk3yqfh3007sst0bji27nu5b	HORIZONTAL	\N	cmk3yqfh3007sst0bji27nu5b	\N	\N	2026-01-07 11:56:35.423	2026-01-07 11:56:35.423
cmk431cop001biy36uy7djedc	2	cmk431cnh000wiy36034htlqe	HORIZONTAL	\N	cmk431cnh000wiy36034htlqe	\N	\N	2026-01-07 13:57:03.482	2026-01-07 13:57:03.482
cmk40ovwk009tst0bvdr1xh7w	2	cmk40ovuw009hst0bd2ihj0xf	HORIZONTAL	\N	cmk40ovuw009hst0bd2ihj0xf	\N	\N	2026-01-07 12:51:22.628	2026-01-07 12:51:22.628
cmk40ovwt009yst0bv5oe76xq	2	cmk40ovw2009ost0b4xrvzkgx	HORIZONTAL	\N	cmk40ovw2009ost0b4xrvzkgx	\N	\N	2026-01-07 12:51:22.637	2026-01-07 12:51:22.637
cmk40ovxz00a6st0b2e9zx6gc	2	cmk40ovx800a2st0bhu2rt6xh	HORIZONTAL	\N	cmk40ovx800a2st0bhu2rt6xh	\N	\N	2026-01-07 12:51:22.679	2026-01-07 12:51:22.679
cmk40ow0s00ahst0bmr9ffpdi	2	cmk40ovzk00abst0bqw8oospn	HORIZONTAL	\N	cmk40ovzk00abst0bqw8oospn	\N	\N	2026-01-07 12:51:22.78	2026-01-07 12:51:22.78
cmk3womhz0023st0bhn17fxx2	2	cmk3womhs001tst0b9gu27aty	HORIZONTAL	\N	cmk3womhs001tst0b9gu27aty	\N	\N	2026-01-07 10:59:11.975	2026-01-07 10:59:11.975
cmk3womi00025st0bbguxu09n	2	cmk3womhu001xst0blzbpis41	HORIZONTAL	\N	cmk3womhu001xst0blzbpis41	\N	\N	2026-01-07 10:59:11.976	2026-01-07 10:59:11.976
cmk431coj0019iy36e2a0qp38	2	cmk431cng000siy36af9r0nd0	HORIZONTAL	\N	cmk431cng000siy36af9r0nd0	\N	\N	2026-01-07 13:57:03.476	2026-01-07 13:57:03.476
cmk431cpc001fiy36shqgsg4a	2	cmk431cnh000yiy361e4bbrh2	HORIZONTAL	\N	cmk431cnh000yiy361e4bbrh2	\N	\N	2026-01-07 13:57:03.504	2026-01-07 13:57:03.504
cmk3x29u9003jst0b673a9d94	2	cmk3x29sz0035st0b9og16ofh	HORIZONTAL	\N	cmk3x29sz0035st0b9og16ofh	\N	\N	2026-01-07 11:09:48.753	2026-01-07 11:09:48.753
cmk3x29uw003qst0bh220anzq	2	cmk3x29th003fst0b62iuasl0	HORIZONTAL	\N	cmk3x29th003fst0b62iuasl0	\N	\N	2026-01-07 11:09:48.777	2026-01-07 11:09:48.777
cmk3x29uy003sst0b7sru47uc	2	cmk3x29tf003dst0bzc3ssw5a	HORIZONTAL	\N	cmk3x29tf003dst0bzc3ssw5a	\N	\N	2026-01-07 11:09:48.778	2026-01-07 11:09:48.778
cmk3x29vv003yst0bko0w24p3	2	cmk3x29uw003mst0b39r2w1m0	HORIZONTAL	\N	cmk3x29uw003mst0b39r2w1m0	\N	\N	2026-01-07 11:09:48.811	2026-01-07 11:09:48.811
cmk3ye87g0051st0bfelmkcc1	2	cmk3ye86j004lst0bwls71nxx	HORIZONTAL	\N	cmk3ye86j004lst0bwls71nxx	\N	\N	2026-01-07 11:47:06.124	2026-01-07 11:47:06.124
cmk3ye87u0055st0b1yv46z9f	2	cmk3ye873004vst0bly4ace33	HORIZONTAL	\N	cmk3ye873004vst0bly4ace33	\N	\N	2026-01-07 11:47:06.139	2026-01-07 11:47:06.139
cmk3ye8810057st0b869hk929	2	cmk3ye86u004ost0bdpqbo1v7	HORIZONTAL	\N	cmk3ye86u004ost0bdpqbo1v7	\N	\N	2026-01-07 11:47:06.145	2026-01-07 11:47:06.145
cmk40d85x008hst0bokz967gq	2	cmk40d85c008dst0b5mc92lzk	HORIZONTAL	\N	cmk40d85c008dst0b5mc92lzk	\N	\N	2026-01-07 12:42:18.645	2026-01-07 12:42:18.645
cmk3s7o0k004hq6od8t0oajcu	2	cmk3s7o08004aq6odeupztoi1	HORIZONTAL	\N	cmk3s7o08004aq6odeupztoi1	\N	\N	2026-01-07 08:54:02.324	2026-01-07 08:54:02.324
cmk3s7o0u004lq6od2et96znq	2	cmk3s7o0d004fq6odda08o6fv	HORIZONTAL	\N	cmk3s7o0d004fq6odda08o6fv	\N	\N	2026-01-07 08:54:02.335	2026-01-07 08:54:02.335
cmk40d877008ost0bvanlp1xx	2	cmk40d86r008mst0bk02xh8vb	HORIZONTAL	\N	cmk40d86r008mst0bk02xh8vb	\N	\N	2026-01-07 12:42:18.691	2026-01-07 12:42:18.691
cmk40ovwp009wst0b4i3zghy3	2	cmk40ovvm009mst0b4blsgguw	HORIZONTAL	\N	cmk40ovvm009mst0b4blsgguw	\N	\N	2026-01-07 12:51:22.634	2026-01-07 12:51:22.634
cmk3the5q005bq6odjmtlqofs	2	cmk3the5h0057q6od40ewwnto	HORIZONTAL	\N	cmk3the5h0057q6od40ewwnto	\N	\N	2026-01-07 09:29:35.726	2026-01-07 09:29:35.726
cmk3ylgug006gst0bvx48xcl8	2	cmk3ylgu10064st0b838vzxia	HORIZONTAL	\N	cmk3ylgu10064st0b838vzxia	\N	\N	2026-01-07 11:52:43.912	2026-01-07 11:52:43.912
cmk3ylgum006kst0b2qk2wqa6	2	cmk3ylgu40068st0b5zisfb0q	HORIZONTAL	\N	cmk3ylgu40068st0b5zisfb0q	\N	\N	2026-01-07 11:52:43.918	2026-01-07 11:52:43.918
cmk3tk6w3005mq6odx6ffbdar	2	cmk3tk6vw005kq6odsxyebfg4	HORIZONTAL	\N	cmk3tk6vw005kq6odsxyebfg4	\N	\N	2026-01-07 09:31:46.275	2026-01-07 09:31:46.275
cmk3ylgur006ost0bty5o7s4t	2	cmk3ylgu7006est0btxxx87gk	HORIZONTAL	\N	cmk3ylgu7006est0btxxx87gk	\N	\N	2026-01-07 11:52:43.923	2026-01-07 11:52:43.923
cmk40ovwz00a0st0bs64l5gwz	2	cmk40ovwh009qst0bx5flnouw	HORIZONTAL	\N	cmk40ovwh009qst0bx5flnouw	\N	\N	2026-01-07 12:51:22.643	2026-01-07 12:51:22.643
cmk3uz7b0008iq6odtd9xldwd	2	cmk3uz7am008gq6od890gf6g0	HORIZONTAL	\N	cmk3uz7am008gq6od890gf6g0	\N	\N	2026-01-07 10:11:26.269	2026-01-07 10:11:26.269
cmk3uz7c6009gq6odpah0on67	2	cmk3uz7bs0092q6odzqnghq5w	HORIZONTAL	\N	cmk3uz7bs0092q6odzqnghq5w	\N	\N	2026-01-07 10:11:26.31	2026-01-07 10:11:26.31
cmk3uz7c3009aq6odedu3sk1w	2	cmk3uz7ba008pq6odvqrmild2	HORIZONTAL	\N	cmk3uz7ba008pq6odvqrmild2	\N	\N	2026-01-07 10:11:26.308	2026-01-07 10:11:26.308
cmk3uz7cy009iq6ods907q709	2	cmk3uz7c30099q6od4n96hfy0	HORIZONTAL	\N	cmk3uz7c30099q6od4n96hfy0	\N	\N	2026-01-07 10:11:26.338	2026-01-07 10:11:26.338
cmk3uz7dc009oq6odik24uy6e	2	cmk3uz7by0096q6odxqpq8vya	HORIZONTAL	\N	cmk3uz7by0096q6odxqpq8vya	\N	\N	2026-01-07 10:11:26.352	2026-01-07 10:11:26.352
cmk3yo0fy007est0blr9q1aam	2	cmk3yo0fr0078st0bvrcckrou	HORIZONTAL	\N	cmk3yo0fr0078st0bvrcckrou	\N	\N	2026-01-07 11:54:42.622	2026-01-07 11:54:42.622
cmk3yo0g0007ist0blci35h7e	2	cmk3yo0fu007cst0bo2trakkc	HORIZONTAL	\N	cmk3yo0fu007cst0bo2trakkc	\N	\N	2026-01-07 11:54:42.624	2026-01-07 11:54:42.624
cmk431cov001diy36zlunrzai	2	cmk431cnt0013iy36ttst5zk3	HORIZONTAL	\N	cmk431cnt0013iy36ttst5zk3	\N	\N	2026-01-07 13:57:03.488	2026-01-07 13:57:03.488
cmk40ovyf00a8st0bdkjy5iux	2	cmk40ovxm00a4st0bwsh3x302	HORIZONTAL	\N	cmk40ovxm00a4st0bwsh3x302	\N	\N	2026-01-07 12:51:22.695	2026-01-07 12:51:22.695
cmk3vd28v00aiq6odkkmh0a41	2	cmk3vd28n00aeq6odxorv1cxw	HORIZONTAL	\N	cmk3vd28n00aeq6odxorv1cxw	\N	\N	2026-01-07 10:22:12.895	2026-01-07 10:22:12.895
cmk431cpc001hiy36x2hr6iqa	2	cmk431cni0010iy363b0f47p8	HORIZONTAL	\N	cmk431cni0010iy363b0f47p8	\N	\N	2026-01-07 13:57:03.504	2026-01-07 13:57:03.504
cmk3vv19y0010cg7k5unhk1iu	2	cmk3vv197000lcg7kr3bxxz63	HORIZONTAL	\N	cmk3vv197000lcg7kr3bxxz63	\N	\N	2026-01-07 10:36:11.446	2026-01-07 10:36:11.446
cmk3vv1a20016cg7krz9mtxan	2	cmk3vv19h000rcg7kscrikwtq	HORIZONTAL	\N	cmk3vv19h000rcg7kscrikwtq	\N	\N	2026-01-07 10:36:11.45	2026-01-07 10:36:11.45
cmk3vv1a20015cg7ktx4ne4zp	2	cmk3vv194000gcg7k9ux04e2g	HORIZONTAL	\N	cmk3vv194000gcg7k9ux04e2g	\N	\N	2026-01-07 10:36:11.45	2026-01-07 10:36:11.45
cmk3vv1a7001ccg7kv7td8nwd	2	cmk3vv19e000pcg7k10qc51um	HORIZONTAL	\N	cmk3vv19e000pcg7k10qc51um	\N	\N	2026-01-07 10:36:11.455	2026-01-07 10:36:11.455
cmk3vv1ba001gcg7kfrtxoenl	2	cmk3vv19p000wcg7kln992ugh	HORIZONTAL	\N	cmk3vv19p000wcg7kln992ugh	\N	\N	2026-01-07 10:36:11.494	2026-01-07 10:36:11.494
cmk3vv1ek001ycg7ka62cy6qy	2	cmk3vv1ds001lcg7kb7xhf0pb	HORIZONTAL	\N	cmk3vv1ds001lcg7kb7xhf0pb	\N	\N	2026-01-07 10:36:11.612	2026-01-07 10:36:11.612
cmk3vv1f4002bcg7kxnfbv6ys	2	cmk3vv1eb001scg7k21sihunx	HORIZONTAL	\N	cmk3vv1eb001scg7k21sihunx	\N	\N	2026-01-07 10:36:11.633	2026-01-07 10:36:11.633
cmk3vv1fo002ncg7kt89uutsb	2	cmk3vv1f5002dcg7ks380w9j4	HORIZONTAL	\N	cmk3vv1f5002dcg7ks380w9j4	\N	\N	2026-01-07 10:36:11.652	2026-01-07 10:36:11.652
cmk3w9y370012774j10ujhpq8	2	cmk3w9y25000g774jzs4242aq	HORIZONTAL	\N	cmk3w9y25000g774jzs4242aq	\N	\N	2026-01-07 10:47:47.156	2026-01-07 10:47:47.156
cmk3w9y3v0018774jgjymryf8	2	cmk3w9y2m000o774j8wo4by27	HORIZONTAL	\N	cmk3w9y2m000o774j8wo4by27	\N	\N	2026-01-07 10:47:47.18	2026-01-07 10:47:47.18
cmk3w9y4o001a774j9wsxr0yl	2	cmk3w9y2q000v774jwh7ycq7h	HORIZONTAL	\N	cmk3w9y2q000v774jwh7ycq7h	\N	\N	2026-01-07 10:47:47.208	2026-01-07 10:47:47.208
cmk3w9y3v0016774j8orpkl2t	2	cmk3w9y28000k774jbvxkjsgg	HORIZONTAL	\N	cmk3w9y28000k774jbvxkjsgg	\N	\N	2026-01-07 10:47:47.179	2026-01-07 10:47:47.179
cmk3wl3f8000qst0b08yxaj5c	2	cmk3wl3es000bst0bgor7fyrk	HORIZONTAL	\N	cmk3wl3es000bst0bgor7fyrk	\N	\N	2026-01-07 10:56:27.284	2026-01-07 10:56:27.284
cmk3wl3fk000xst0bjjp4ksmz	2	cmk3wl3ez000ist0bpmwvqnpi	HORIZONTAL	\N	cmk3wl3ez000ist0bpmwvqnpi	\N	\N	2026-01-07 10:56:27.297	2026-01-07 10:56:27.297
cmk3wl3fl0011st0braq7mor9	2	cmk3wl3f3000ost0bquyn9eoa	HORIZONTAL	\N	cmk3wl3f3000ost0bquyn9eoa	\N	\N	2026-01-07 10:56:27.298	2026-01-07 10:56:27.298
cmk3wl3g10015st0b4c8gxyyi	2	cmk3wl3fj000vst0bkdyl6qpv	HORIZONTAL	\N	cmk3wl3fj000vst0bkdyl6qpv	\N	\N	2026-01-07 10:56:27.313	2026-01-07 10:56:27.313
cmk431cpc001jiy36c9wosiwp	2	cmk431cnh000viy36besokaga	HORIZONTAL	\N	cmk431cnh000viy36besokaga	\N	\N	2026-01-07 13:57:03.505	2026-01-07 13:57:03.505
cmk431cpd001liy36wu92fejd	2	cmk431cnv0015iy3688h7kn6l	HORIZONTAL	\N	cmk431cnv0015iy3688h7kn6l	\N	\N	2026-01-07 13:57:03.505	2026-01-07 13:57:03.505
cmk431cpf001piy365smmsfw2	2	cmk431cng000qiy36qgi8teod	HORIZONTAL	\N	cmk431cng000qiy36qgi8teod	\N	\N	2026-01-07 13:57:03.508	2026-01-07 13:57:03.508
cmk431cpf001oiy36vmxejke9	2	cmk431cnx0017iy36uxeju3ss	HORIZONTAL	\N	cmk431cnx0017iy36uxeju3ss	\N	\N	2026-01-07 13:57:03.508	2026-01-07 13:57:03.508
cmk2pq1wy002pq6odn9oi97we	1	cmk2pq1wq002nq6od7j4afiuy	HORIZONTAL	cmk2pq1wq002nq6od7j4afiuy	\N	\N	\N	2026-01-06 14:56:35.122	2026-01-08 08:16:11.062
cmk431dfd002biy362x7e9u5l	2	cmk431dcc001xiy36vd4kw22y	HORIZONTAL	\N	cmk431dcc001xiy36vd4kw22y	\N	\N	2026-01-07 13:57:04.441	2026-01-07 13:57:04.441
cmk431dfk002kiy36ff593h7s	2	cmk431df30028iy368uofmmck	HORIZONTAL	\N	cmk431df30028iy368uofmmck	\N	\N	2026-01-07 13:57:04.449	2026-01-07 13:57:04.449
cmk4331d7003oiy36u3sf460y	2	cmk4331d0003jiy36wcsva2kq	HORIZONTAL	\N	cmk4331d0003jiy36wcsva2kq	\N	\N	2026-01-07 13:58:22.124	2026-01-07 13:58:22.124
cmk431dfk002iiy36ndeayjnc	2	cmk431df20026iy36bfd301y3	HORIZONTAL	\N	cmk431df20026iy36bfd301y3	\N	\N	2026-01-07 13:57:04.448	2026-01-07 13:57:04.448
cmk431dg1002siy36fbd3icg8	2	cmk431dfl002miy36ldpapsem	HORIZONTAL	\N	cmk431dfl002miy36ldpapsem	\N	\N	2026-01-07 13:57:04.466	2026-01-07 13:57:04.466
cmk431dg1002qiy36y00u99fq	2	cmk431dfk002giy366tvczc6g	HORIZONTAL	\N	cmk431dfk002giy366tvczc6g	\N	\N	2026-01-07 13:57:04.465	2026-01-07 13:57:04.465
cmk431dgg0030iy36c02lkbwq	2	cmk431dfo002oiy360l2cl36h	HORIZONTAL	\N	cmk431dfo002oiy360l2cl36h	\N	\N	2026-01-07 13:57:04.48	2026-01-07 13:57:04.48
cmk3vikfa000411vqey42lphr	1	cmk3vikem000211vqjfh8vi4p	HORIZONTAL	cmk3vikem000211vqjfh8vi4p	\N	\N	\N	2026-01-07 10:26:29.735	2026-01-08 09:06:44.696
cmk4331da003qiy36qio2l9yo	2	cmk4331d2003miy366kil00l3	HORIZONTAL	\N	cmk4331d2003miy366kil00l3	\N	\N	2026-01-07 13:58:22.126	2026-01-07 13:58:22.126
cmk431cfm0004iy36ucdi25x5	1	cmk431cds0002iy3665bz2xy1	HORIZONTAL	cmk431cds0002iy3665bz2xy1	\N	\N	\N	2026-01-07 13:57:03.154	2026-01-07 13:58:57.228
cmk43jqw40040iy3682efghaz	2	cmk43jqv9003yiy36jz7z0v2d	HORIZONTAL	\N	cmk43jqv9003yiy36jz7z0v2d	\N	\N	2026-01-07 14:11:21.701	2026-01-07 14:11:21.701
cmk43jqy60047iy363w43cr4a	3	cmk43jqxv0045iy36ou13ke23	HORIZONTAL	\N	\N	cmk43jqxv0045iy36ou13ke23	\N	2026-01-07 14:11:21.774	2026-01-07 14:11:21.774
cmk43jqyp004liy36meq2rsc0	3	cmk43jqyo004jiy361g6l54w9	HORIZONTAL	\N	\N	cmk43jqyo004jiy361g6l54w9	\N	2026-01-07 14:11:21.794	2026-01-07 14:11:21.794
cmk43jqzi004tiy36s6x4uub0	3	cmk43jqzg004riy36j40yjtqv	HORIZONTAL	\N	\N	cmk43jqzg004riy36j40yjtqv	\N	2026-01-07 14:11:21.823	2026-01-07 14:11:21.823
cmk43jr000051iy366mp0us1e	3	cmk43jqzr004ziy36o67x44sx	HORIZONTAL	\N	\N	cmk43jqzr004ziy36o67x44sx	\N	2026-01-07 14:11:21.84	2026-01-07 14:11:21.84
cmk43jr070059iy36o14bafyo	3	cmk43jr060057iy367ox3srx6	HORIZONTAL	\N	\N	cmk43jr060057iy367ox3srx6	\N	2026-01-07 14:11:21.847	2026-01-07 14:11:21.847
cmk43lacf006giy36a7ot4p8o	2	cmk43lac3006eiy36kzjh2k4g	HORIZONTAL	\N	cmk43lac3006eiy36kzjh2k4g	\N	\N	2026-01-07 14:12:33.568	2026-01-07 14:12:33.568
cmk43laet006niy36a4erxgfn	3	cmk43laep006liy36pd7sp0yv	HORIZONTAL	\N	\N	cmk43laep006liy36pd7sp0yv	\N	2026-01-07 14:12:33.653	2026-01-07 14:12:33.653
cmk43laf5006viy36q7xpuv64	3	cmk43laf3006tiy36y2w6nn9z	HORIZONTAL	\N	\N	cmk43laf3006tiy36y2w6nn9z	\N	2026-01-07 14:12:33.666	2026-01-07 14:12:33.666
cmk43lafd0071iy36smi2s8uc	3	cmk43lafb006ziy36r63mdkd7	HORIZONTAL	\N	\N	cmk43lafb006ziy36r63mdkd7	\N	2026-01-07 14:12:33.674	2026-01-07 14:12:33.674
cmk43lafs007diy36cx7xghep	3	cmk43lafq007biy36fy33rpvv	HORIZONTAL	\N	\N	cmk43lafq007biy36fy33rpvv	\N	2026-01-07 14:12:33.688	2026-01-07 14:12:33.688
cmk43lag4007jiy36qsa92fmo	3	cmk43lag1007hiy36j9c9n6iw	HORIZONTAL	\N	\N	cmk43lag1007hiy36j9c9n6iw	\N	2026-01-07 14:12:33.7	2026-01-07 14:12:33.7
cmk43lagj007tiy36wao1shnh	3	cmk43lagh007riy36oesb3zgn	HORIZONTAL	\N	\N	cmk43lagh007riy36oesb3zgn	\N	2026-01-07 14:12:33.715	2026-01-07 14:12:33.715
cmk43qzfd0099iy36xqpb559l	3	cmk43qzf80097iy36wwkssu2t	HORIZONTAL	\N	\N	cmk43qzf80097iy36wwkssu2t	\N	2026-01-07 14:16:59.354	2026-01-07 14:16:59.354
cmk43qzfn009hiy36xninsn17	3	cmk43qzfl009fiy36afejhuxb	HORIZONTAL	\N	\N	cmk43qzfl009fiy36afejhuxb	\N	2026-01-07 14:16:59.363	2026-01-07 14:16:59.363
cmk43qzfz009piy36nbqdyws7	3	cmk43qzfu009niy36ungg3lqz	HORIZONTAL	\N	\N	cmk43qzfu009niy36ungg3lqz	\N	2026-01-07 14:16:59.375	2026-01-07 14:16:59.375
cmk43qzgk009xiy36f0gatsgd	3	cmk43qzgh009viy362ywrg8zs	HORIZONTAL	\N	\N	cmk43qzgh009viy362ywrg8zs	\N	2026-01-07 14:16:59.396	2026-01-07 14:16:59.396
cmk43qzh100a7iy36auundgq9	3	cmk43qzgz00a5iy369o1l9q7y	HORIZONTAL	\N	\N	cmk43qzgz00a5iy369o1l9q7y	\N	2026-01-07 14:16:59.414	2026-01-07 14:16:59.414
cmk43qzd40092iy367jk05vb3	2	cmk43qzcs0090iy36wvirf09b	HORIZONTAL	\N	cmk43qzcs0090iy36wvirf09b	\N	\N	2026-01-07 14:16:59.273	2026-01-07 14:18:39.212
cmk46w0jq0004li178s471mcd	2	cmk46w0ij0002li17bqla8dnc	HORIZONTAL	\N	cmk46w0ij0002li17bqla8dnc	\N	\N	2026-01-07 15:44:52.935	2026-01-07 15:44:52.935
cmk46w0mf000dli17kg7tuy4c	3	cmk46w0m9000bli1735jkbcgj	HORIZONTAL	\N	\N	cmk46w0m9000bli1735jkbcgj	\N	2026-01-07 15:44:53.031	2026-01-07 15:44:53.031
cmk46w0n7000pli17wvwaw088	3	cmk46w0n0000nli17gmx5g8gg	HORIZONTAL	\N	\N	cmk46w0n0000nli17gmx5g8gg	\N	2026-01-07 15:44:53.059	2026-01-07 15:44:53.059
cmk46w0nk000zli1728kyx0ns	3	cmk46w0ni000xli17lza8nmmp	HORIZONTAL	\N	\N	cmk46w0ni000xli17lza8nmmp	\N	2026-01-07 15:44:53.073	2026-01-07 15:44:53.073
cmk46w0o3001bli17srw1y41j	3	cmk46w0o10019li17v7n8nw4s	HORIZONTAL	\N	\N	cmk46w0o10019li17v7n8nw4s	\N	2026-01-07 15:44:53.091	2026-01-07 15:44:53.091
cmk46w0oj001jli17fcsc33gq	3	cmk46w0oc001hli178jpt3yai	HORIZONTAL	\N	\N	cmk46w0oc001hli178jpt3yai	\N	2026-01-07 15:44:53.107	2026-01-07 15:44:53.107
cmk47gp98003sli17wfq9dh0h	2	cmk47gp40003qli17k66uc6rj	HORIZONTAL	\N	cmk47gp40003qli17k66uc6rj	\N	\N	2026-01-07 16:00:58.076	2026-01-07 16:00:58.076
cmk47gp99003wli17g7b93qip	2	cmk47gp2i003ili17ariri9ar	HORIZONTAL	\N	cmk47gp2i003ili17ariri9ar	\N	\N	2026-01-07 16:00:58.078	2026-01-07 16:00:58.078
cmk47gp9a003yli17xxszsase	2	cmk47gp2e003bli17d5sd51n9	HORIZONTAL	\N	cmk47gp2e003bli17d5sd51n9	\N	\N	2026-01-07 16:00:58.078	2026-01-07 16:00:58.078
cmk47gp9a0040li175z2lt73u	2	cmk47gp3a003nli17pvqa21pj	HORIZONTAL	\N	cmk47gp3a003nli17pvqa21pj	\N	\N	2026-01-07 16:00:58.079	2026-01-07 16:00:58.079
cmk47gp9b0042li17gveasa4g	2	cmk47gp2y003lli17fbalp3kh	HORIZONTAL	\N	cmk47gp2y003lli17fbalp3kh	\N	\N	2026-01-07 16:00:58.079	2026-01-07 16:00:58.079
cmk47gp99003uli17gx0uscff	2	cmk47gp250038li17ff6csg0d	HORIZONTAL	\N	cmk47gp250038li17ff6csg0d	\N	\N	2026-01-07 16:00:58.077	2026-01-07 16:00:58.077
cmk47gp9c0044li17ndmglifp	2	cmk47gp2g003gli17eqkrkupe	HORIZONTAL	\N	cmk47gp2g003gli17eqkrkupe	\N	\N	2026-01-07 16:00:58.08	2026-01-07 16:00:58.08
cmk47jf0k0057li17ja6ojg0w	2	cmk47jeyy0050li17zetkf7hn	HORIZONTAL	\N	cmk47jeyy0050li17zetkf7hn	\N	\N	2026-01-07 16:03:04.772	2026-01-07 16:03:04.772
cmk47jf1c0059li17f04x8des	2	cmk47jeyt004wli17r8dbearx	HORIZONTAL	\N	cmk47jeyt004wli17r8dbearx	\N	\N	2026-01-07 16:03:04.8	2026-01-07 16:03:04.8
cmk47jf1g005bli17vh7fwnu3	2	cmk47jezb0052li175vtjkevz	HORIZONTAL	\N	cmk47jezb0052li175vtjkevz	\N	\N	2026-01-07 16:03:04.804	2026-01-07 16:03:04.804
cmk47jf1g005dli17tjnd66uu	2	cmk47jezh0055li17ug3xlvfn	HORIZONTAL	\N	cmk47jezh0055li17ug3xlvfn	\N	\N	2026-01-07 16:03:04.804	2026-01-07 16:03:04.804
cmk47low9005xli17imokqaav	3	cmk47low5005vli17cpd2x9p1	HORIZONTAL	\N	\N	cmk47low5005vli17cpd2x9p1	\N	2026-01-07 16:04:50.889	2026-01-07 16:04:50.889
cmk47lowm0063li17lhxglznu	3	cmk47lowj0061li17vscxiwn1	HORIZONTAL	\N	\N	cmk47lowj0061li17vscxiwn1	\N	2026-01-07 16:04:50.903	2026-01-07 16:04:50.903
cmk47lox00069li17i5i9ktc4	3	cmk47lowv0067li1793aztr9z	HORIZONTAL	\N	\N	cmk47lowv0067li1793aztr9z	\N	2026-01-07 16:04:50.915	2026-01-07 16:04:50.915
cmk47loxg006hli175kqlgvo7	3	cmk47loxd006fli1764a73mq7	HORIZONTAL	\N	\N	cmk47loxd006fli1764a73mq7	\N	2026-01-07 16:04:50.932	2026-01-07 16:04:50.932
cmk47loxv006rli17algmfgvi	3	cmk47loxs006pli174sah4nbz	HORIZONTAL	\N	\N	cmk47loxs006pli174sah4nbz	\N	2026-01-07 16:04:50.947	2026-01-07 16:04:50.947
cmk47louw005qli17oqnpms5d	2	cmk47loup005oli1751lt9okn	VERTICAL	\N	cmk47loup005oli1751lt9okn	\N	\N	2026-01-07 16:04:50.841	2026-01-08 09:01:35.126
\.


--
-- Data for Name: flow_edges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flow_edges (id, "diagramId", "rfId", "sourceRfId", "targetRfId", label, condition, data, "createdAt", "updatedAt") FROM stdin;
cmk3uiufi007rq6od2d94b1wb	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-edge-0	img-1767779922970-upqvxr5-procedure-0	img-1767779922970-upqvxr5-procedure-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 09:58:43.086	2026-01-07 09:58:43.086
cmk3uiufq007tq6od3hqsr93u	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-edge-1	img-1767779922970-upqvxr5-procedure-1	img-1767779922970-upqvxr5-procedure-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 09:58:43.095	2026-01-07 09:58:43.095
cmk3uiufr007vq6odf7st1uy9	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-edge-2	img-1767779922970-upqvxr5-procedure-2	img-1767779922970-upqvxr5-procedure-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 09:58:43.096	2026-01-07 09:58:43.096
cmk3uiufs007xq6odsil3plbm	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-edge-3	img-1767779922970-upqvxr5-procedure-4	img-1767779922970-upqvxr5-procedure-5	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 09:58:43.097	2026-01-07 09:58:43.097
cmk3uiuft007zq6odlyig4h38	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-edge-4	img-1767779922970-upqvxr5-procedure-5	img-1767779922970-upqvxr5-procedure-6	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 09:58:43.098	2026-01-07 09:58:43.098
cmk3uiufw0081q6od05ziq0fi	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-edge-5	img-1767779922970-upqvxr5-procedure-6	img-1767779922970-upqvxr5-procedure-7	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 09:58:43.101	2026-01-07 09:58:43.101
cmk43jr0f005hiy3620dmyqxv	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-0	ai-1767795081730-332tm38-startEvent	ai-1767795081730-332tm38-procedure-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.855	2026-01-07 14:11:21.855
cmk43jr0s005jiy36z2caqsga	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-1	ai-1767795081730-332tm38-procedure-0	ai-1767795081730-332tm38-gateway-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.868	2026-01-07 14:11:21.868
cmk43jr0u005liy36h4zy7hgx	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-2	ai-1767795081730-332tm38-gateway-0	ai-1767795081730-332tm38-scriptTask-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.87	2026-01-07 14:11:21.87
cmk43jr0v005niy362nib43mb	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-3	ai-1767795081730-332tm38-gateway-0	ai-1767795081730-332tm38-userTask-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.871	2026-01-07 14:11:21.871
cmk43jr0w005piy36hi19r66l	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-4	ai-1767795081730-332tm38-scriptTask-0	ai-1767795081730-332tm38-gateway-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.872	2026-01-07 14:11:21.872
cmk43jr0x005riy36kjg6qtf2	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-5	ai-1767795081730-332tm38-userTask-1	ai-1767795081730-332tm38-gateway-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.873	2026-01-07 14:11:21.873
cmk43jr0y005tiy36mwg0q2dj	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-6	ai-1767795081730-332tm38-gateway-1	ai-1767795081730-332tm38-procedure-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.874	2026-01-07 14:11:21.874
cmk43jr0z005viy36kx5u4ep4	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-7	ai-1767795081730-332tm38-procedure-1	ai-1767795081730-332tm38-gateway-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.875	2026-01-07 14:11:21.875
cmk43jr10005xiy36xw75jvgh	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-8	ai-1767795081730-332tm38-gateway-2	ai-1767795081730-332tm38-procedure-2	Si validée	Si validée	{"type":"smoothstep","animated":false,"pathType":"smoothstep","condition":"Si validée"}	2026-01-07 14:11:21.876	2026-01-07 14:11:21.876
cmk43jr12005ziy36vcjsg7tv	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-9	ai-1767795081730-332tm38-gateway-2	ai-1767795081730-332tm38-procedure-1	Si à revoir	Si à revoir	{"type":"smoothstep","animated":false,"pathType":"smoothstep","condition":"Si à revoir"}	2026-01-07 14:11:21.879	2026-01-07 14:11:21.879
cmk43jr130061iy369sh5o3ez	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-10	ai-1767795081730-332tm38-procedure-2	ai-1767795081730-332tm38-userTask-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.88	2026-01-07 14:11:21.88
cmk43jr140063iy363qechkux	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-11	ai-1767795081730-332tm38-userTask-2	ai-1767795081730-332tm38-procedure-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.881	2026-01-07 14:11:21.881
cmk43jr150065iy36sx8s6e6z	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-12	ai-1767795081730-332tm38-procedure-3	ai-1767795081730-332tm38-serviceTask-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.882	2026-01-07 14:11:21.882
cmk43jr160067iy36rb60doh3	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-13	ai-1767795081730-332tm38-serviceTask-3	ai-1767795081730-332tm38-procedure-4	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.883	2026-01-07 14:11:21.883
cmk43jr180069iy361xthhe5e	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-14	ai-1767795081730-332tm38-procedure-4	ai-1767795081730-332tm38-timerEvent-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.885	2026-01-07 14:11:21.885
cmk43jr19006biy36a14sph1b	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-edge-15	ai-1767795081730-332tm38-timerEvent-0	ai-1767795081730-332tm38-endEvent	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:11:21.886	2026-01-07 14:11:21.886
cmk43lagx0081iy364aopuqvx	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-0	ai-1767795153619-gmmaeq2-startEvent	ai-1767795153619-gmmaeq2-procedure-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.729	2026-01-07 14:12:33.729
cmk43lah70083iy36eylquqkq	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-1	ai-1767795153619-gmmaeq2-procedure-0	ai-1767795153619-gmmaeq2-gateway-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.739	2026-01-07 14:12:33.739
cmk43lah90085iy36a63bk92y	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-2	ai-1767795153619-gmmaeq2-gateway-0	ai-1767795153619-gmmaeq2-procedure-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.741	2026-01-07 14:12:33.741
cmk43lahd0087iy36phm8vj2y	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-3	ai-1767795153619-gmmaeq2-gateway-0	ai-1767795153619-gmmaeq2-procedure-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.745	2026-01-07 14:12:33.745
cmk43lahf0089iy36d4f9b23d	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-4	ai-1767795153619-gmmaeq2-procedure-1	ai-1767795153619-gmmaeq2-userTask-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.747	2026-01-07 14:12:33.747
cmk43lahh008biy36vop7ekyx	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-5	ai-1767795153619-gmmaeq2-userTask-0	ai-1767795153619-gmmaeq2-timerEvent-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.75	2026-01-07 14:12:33.75
cmk43lahk008diy36uaadwlsm	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-6	ai-1767795153619-gmmaeq2-timerEvent-0	ai-1767795153619-gmmaeq2-gateway-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.753	2026-01-07 14:12:33.753
cmk43lahm008fiy36149yfmkt	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-7	ai-1767795153619-gmmaeq2-procedure-1	ai-1767795153619-gmmaeq2-gateway-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.754	2026-01-07 14:12:33.754
cmk43laho008hiy3608vcmdng	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-8	ai-1767795153619-gmmaeq2-procedure-2	ai-1767795153619-gmmaeq2-gateway-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.756	2026-01-07 14:12:33.756
cmk43lahq008jiy3627285sr9	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-9	ai-1767795153619-gmmaeq2-gateway-1	ai-1767795153619-gmmaeq2-procedure-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.759	2026-01-07 14:12:33.759
cmk43laht008liy366c2tuaa2	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-10	ai-1767795153619-gmmaeq2-procedure-3	ai-1767795153619-gmmaeq2-procedure-4	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.761	2026-01-07 14:12:33.761
cmk43lahv008niy36repqzs09	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-11	ai-1767795153619-gmmaeq2-procedure-4	ai-1767795153619-gmmaeq2-userTask-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.763	2026-01-07 14:12:33.763
cmk43lai1008piy36xjvp5dt2	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-12	ai-1767795153619-gmmaeq2-userTask-1	ai-1767795153619-gmmaeq2-gateway-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.769	2026-01-07 14:12:33.769
cmk43lai2008riy36lcj4z17b	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-13	ai-1767795153619-gmmaeq2-gateway-2	ai-1767795153619-gmmaeq2-procedure-5	Validée	Validée	{"type":"smoothstep","animated":false,"pathType":"smoothstep","condition":"Validée"}	2026-01-07 14:12:33.771	2026-01-07 14:12:33.771
cmk43laib008tiy36v8loj8s9	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-14	ai-1767795153619-gmmaeq2-gateway-2	ai-1767795153619-gmmaeq2-procedure-3	Ajustements nécessaires	Ajustements nécessaires	{"type":"smoothstep","animated":false,"pathType":"smoothstep","condition":"Ajustements nécessaires"}	2026-01-07 14:12:33.779	2026-01-07 14:12:33.779
cmk43laid008viy36ss2g6g3t	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-15	ai-1767795153619-gmmaeq2-procedure-5	ai-1767795153619-gmmaeq2-serviceTask-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.781	2026-01-07 14:12:33.781
cmk43laie008xiy36vqole4jb	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-edge-16	ai-1767795153619-gmmaeq2-serviceTask-2	ai-1767795153619-gmmaeq2-endEvent	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 14:12:33.783	2026-01-07 14:12:33.783
cmk43qzhq00ahiy360an1rprr	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-0	ai-1767795419318-kvb32y8-startEvent	ai-1767795419318-kvb32y8-procedure-0		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.439	2026-01-07 14:18:39.346
cmk43qzhu00ajiy36hdbz5qj1	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-1	ai-1767795419318-kvb32y8-procedure-0	ai-1767795419318-kvb32y8-userTask-0		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.442	2026-01-07 14:18:39.349
cmk43qzhv00aliy36t2ou6zcd	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-2	ai-1767795419318-kvb32y8-userTask-0	ai-1767795419318-kvb32y8-procedure-1		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.444	2026-01-07 14:18:39.352
cmk43qzhx00aniy36pnrn21fp	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-3	ai-1767795419318-kvb32y8-procedure-1	ai-1767795419318-kvb32y8-scriptTask-1		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.445	2026-01-07 14:18:39.355
cmk43qzhz00apiy36jrz7kd47	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-4	ai-1767795419318-kvb32y8-scriptTask-1	ai-1767795419318-kvb32y8-procedure-2		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.447	2026-01-07 14:18:39.358
cmk43qzi100ariy36lr7vasrp	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-5	ai-1767795419318-kvb32y8-procedure-2	ai-1767795419318-kvb32y8-userTask-2		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.45	2026-01-07 14:18:39.36
cmk43qzi300atiy36eyjf92ax	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-6	ai-1767795419318-kvb32y8-userTask-2	ai-1767795419318-kvb32y8-procedure-3		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.451	2026-01-07 14:18:39.361
cmk43qzi500aviy36gmjlnp5s	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-7	ai-1767795419318-kvb32y8-procedure-3	ai-1767795419318-kvb32y8-manualTask-3		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.453	2026-01-07 14:18:39.363
cmk43qzif00axiy36uz57yhyj	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-8	ai-1767795419318-kvb32y8-manualTask-3	ai-1767795419318-kvb32y8-gateway-0		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.463	2026-01-07 14:18:39.391
cmk43qzig00aziy36flivhlky	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-9	ai-1767795419318-kvb32y8-gateway-0	ai-1767795419318-kvb32y8-procedure-4	Si efficaces	Si efficaces	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":"Si efficaces"}	2026-01-07 14:16:59.465	2026-01-07 14:18:39.394
cmk43qzil00b1iy36tkixwz0g	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-10	ai-1767795419318-kvb32y8-gateway-0	ai-1767795419318-kvb32y8-procedure-2	Si inefficaces	Si inefficaces	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":"Si inefficaces"}	2026-01-07 14:16:59.469	2026-01-07 14:18:39.397
cmk43qzim00b3iy36gy9i3bae	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-11	ai-1767795419318-kvb32y8-procedure-4	ai-1767795419318-kvb32y8-serviceTask-4		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.47	2026-01-07 14:18:39.398
cmk43qzin00b5iy367lja9ma2	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-12	ai-1767795419318-kvb32y8-serviceTask-4	ai-1767795419318-kvb32y8-timerEvent-0		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.471	2026-01-07 14:18:39.401
cmk43qzio00b7iy36juwgtq82	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-edge-13	ai-1767795419318-kvb32y8-timerEvent-0	ai-1767795419318-kvb32y8-endEvent		\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 14:16:59.472	2026-01-07 14:18:39.405
cmk46w0ov001rli17v7kl3jgk	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-0	ai-1767800692976-347rard-startEvent	ai-1767800692976-347rard-gateway-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.119	2026-01-07 15:44:53.119
cmk46w0p4001tli17rm4kwoi4	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-1	ai-1767800692976-347rard-gateway-0	ai-1767800692976-347rard-serviceTask-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.128	2026-01-07 15:44:53.128
cmk46w0p6001vli17rddw9v9b	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-2	ai-1767800692976-347rard-gateway-0	ai-1767800692976-347rard-procedure-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.13	2026-01-07 15:44:53.13
cmk46w0p7001xli17mifvxl52	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-3	ai-1767800692976-347rard-gateway-0	ai-1767800692976-347rard-serviceTask-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.132	2026-01-07 15:44:53.132
cmk46w0p9001zli17m0u27ysv	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-4	ai-1767800692976-347rard-serviceTask-0	ai-1767800692976-347rard-gateway-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.133	2026-01-07 15:44:53.133
cmk46w0pc0021li17w3u9mz1j	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-5	ai-1767800692976-347rard-procedure-0	ai-1767800692976-347rard-gateway-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.136	2026-01-07 15:44:53.136
cmk46w0pe0023li17kd7upxm6	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-6	ai-1767800692976-347rard-serviceTask-1	ai-1767800692976-347rard-gateway-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.138	2026-01-07 15:44:53.138
cmk46w0ph0025li17zy7o1k4q	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-7	ai-1767800692976-347rard-gateway-1	ai-1767800692976-347rard-procedure-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.141	2026-01-07 15:44:53.141
cmk46w0pk0027li177rfjlezr	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-8	ai-1767800692976-347rard-procedure-1	ai-1767800692976-347rard-timerEvent-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.145	2026-01-07 15:44:53.145
cmk46w0pn0029li17igfdksli	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-9	ai-1767800692976-347rard-timerEvent-0	ai-1767800692976-347rard-gateway-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.147	2026-01-07 15:44:53.147
cmk46w0pp002bli17uhyk59o0	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-10	ai-1767800692976-347rard-gateway-2	ai-1767800692976-347rard-scriptTask-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.149	2026-01-07 15:44:53.149
cmk46w0pv002dli17nhi6v1wk	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-11	ai-1767800692976-347rard-gateway-2	ai-1767800692976-347rard-procedure-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.155	2026-01-07 15:44:53.155
cmk46w0py002fli179wpalhpl	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-12	ai-1767800692976-347rard-gateway-2	ai-1767800692976-347rard-scriptTask-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.158	2026-01-07 15:44:53.158
cmk46w0q0002hli175b9qtrh8	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-13	ai-1767800692976-347rard-scriptTask-2	ai-1767800692976-347rard-gateway-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.16	2026-01-07 15:44:53.16
cmk46w0q2002jli1778r6my6e	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-14	ai-1767800692976-347rard-procedure-2	ai-1767800692976-347rard-gateway-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.163	2026-01-07 15:44:53.163
cmk46w0q5002lli17ynsldwer	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-15	ai-1767800692976-347rard-scriptTask-3	ai-1767800692976-347rard-gateway-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.165	2026-01-07 15:44:53.165
cmk46w0qa002nli17efrnmf1i	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-16	ai-1767800692976-347rard-gateway-3	ai-1767800692976-347rard-procedure-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.17	2026-01-07 15:44:53.17
cmk46w0qd002pli171ivfolgz	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-17	ai-1767800692976-347rard-procedure-3	ai-1767800692976-347rard-gateway-4	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.173	2026-01-07 15:44:53.173
cmk46w0qj002rli17eo3mj58z	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-18	ai-1767800692976-347rard-gateway-4	ai-1767800692976-347rard-userTask-4	Si validation nécessaire	Si validation nécessaire	{"type":"smoothstep","animated":false,"pathType":"smoothstep","condition":"Si validation nécessaire"}	2026-01-07 15:44:53.179	2026-01-07 15:44:53.179
cmk46w0qm002tli17ra4wd8z2	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-19	ai-1767800692976-347rard-gateway-4	ai-1767800692976-347rard-procedure-4	Si validation non requise	Si validation non requise	{"type":"smoothstep","animated":false,"pathType":"smoothstep","condition":"Si validation non requise"}	2026-01-07 15:44:53.183	2026-01-07 15:44:53.183
cmk46w0qp002vli17pmw9dfj6	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-20	ai-1767800692976-347rard-userTask-4	ai-1767800692976-347rard-procedure-4	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.185	2026-01-07 15:44:53.185
cmk46w0qz002xli17fum2h8ob	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-edge-21	ai-1767800692976-347rard-procedure-4	ai-1767800692976-347rard-endEvent	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep"}	2026-01-07 15:44:53.196	2026-01-07 15:44:53.196
cmk47loyc0071li178arywsqn	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-0	ai-1767801890861-40pt4km-startEvent	ai-1767801890861-40pt4km-procedure-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 16:04:50.964	2026-01-08 09:01:35.204
cmk47loyh0073li176lcmzhhl	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-1	ai-1767801890861-40pt4km-procedure-0	ai-1767801890861-40pt4km-procedure-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 16:04:50.969	2026-01-08 09:01:35.207
cmk47loyk0075li17c5sv13qp	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-2	ai-1767801890861-40pt4km-procedure-1	ai-1767801890861-40pt4km-procedure-2	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 16:04:50.972	2026-01-08 09:01:35.21
cmk47loym0077li17ed1630mb	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-3	ai-1767801890861-40pt4km-procedure-2	ai-1767801890861-40pt4km-timerEvent-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 16:04:50.975	2026-01-08 09:01:35.215
cmk47loyq0079li179f2mlvu8	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-4	ai-1767801890861-40pt4km-timerEvent-0	ai-1767801890861-40pt4km-procedure-3	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 16:04:50.978	2026-01-08 09:01:35.217
cmk47loyt007bli170db1lqlq	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-5	ai-1767801890861-40pt4km-procedure-3	ai-1767801890861-40pt4km-gateway-0	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 16:04:50.981	2026-01-08 09:01:35.22
cmk47loyx007dli17byarvzom	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-6	ai-1767801890861-40pt4km-gateway-0	ai-1767801890861-40pt4km-userTask-0	Validation requise	Validation requise	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":"Validation requise"}	2026-01-07 16:04:50.985	2026-01-08 09:01:35.222
cmk47loz0007fli179ld28dem	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-7	ai-1767801890861-40pt4km-gateway-0	ai-1767801890861-40pt4km-procedure-4	Validation automatique	Validation automatique	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":"Validation automatique"}	2026-01-07 16:04:50.989	2026-01-08 09:01:35.224
cmk47loz3007hli17szm92mng	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-8	ai-1767801890861-40pt4km-userTask-0	ai-1767801890861-40pt4km-procedure-4	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 16:04:50.991	2026-01-08 09:01:35.227
cmk47loz5007jli17jljkn2os	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-9	ai-1767801890861-40pt4km-procedure-4	ai-1767801890861-40pt4km-scriptTask-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 16:04:50.994	2026-01-08 09:01:35.233
cmk47loz8007lli17oljikobk	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-10	ai-1767801890861-40pt4km-scriptTask-1	ai-1767801890861-40pt4km-gateway-1	\N	\N	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":null}	2026-01-07 16:04:50.996	2026-01-08 09:01:35.236
cmk47lozb007nli17c20dc4zm	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-edge-11	ai-1767801890861-40pt4km-gateway-1	ai-1767801890861-40pt4km-endEvent	Objectifs atteints	Objectifs atteints	{"type":"smoothstep","animated":false,"pathType":"smoothstep","style":{},"condition":"Objectifs atteints"}	2026-01-07 16:04:51	2026-01-08 09:01:35.238
\.


--
-- Data for Name: flow_nodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flow_nodes (id, "diagramId", "rfId", type, label, data, "position", "entityType", "referencedEntityId", "createdAt", "updatedAt") FROM stdin;
cmk3yo0gp007kst0bbr9jy958	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786804376	PROCESS	Obtenir les données de performance des canaux	{"originalType":"mainProcess","width":298,"height":88,"parentNodeId":"domainGroup-1767786601413","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"18px"},"label":"Obtenir les données de performance des canaux","processId":"cmk3yo0fr0078st0bvrcckrou","linkedProcessId":"cmk3yo0fr0078st0bvrcckrou","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":36.27015573959034,"y":170}	PROCESS	cmk3yo0fr0078st0bvrcckrou	2026-01-07 11:54:42.65	2026-01-08 08:16:11.15
cmk3yo0gs007mst0bhmk4045p	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786802771	PROCESS	Obtenir les donnes de satisfaction client	{"originalType":"mainProcess","width":290,"height":80,"parentNodeId":"domainGroup-1767786601413","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"18px"},"label":"Obtenir les donnes de satisfaction client","processId":"cmk3yo0fu007cst0bo2trakkc","linkedProcessId":"cmk3yo0fu007cst0bo2trakkc","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":374.2701557395903,"y":172}	PROCESS	cmk3yo0fu007cst0bo2trakkc	2026-01-07 11:54:42.653	2026-01-08 08:16:11.15
cmk3yo0gu007ost0bgmauywar	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786806054	PROCESS	Mettre en visibilité les données de l’expérience client	{"originalType":"mainProcess","width":282,"height":90,"parentNodeId":"domainGroup-1767786601413","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"18px"},"label":"Mettre en visibilité les données de l’expérience client","processId":"cmk3yo0fr007ast0bstxjbuxd","linkedProcessId":"cmk3yo0fr007ast0bstxjbuxd","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":702.2701557395903,"y":168}	PROCESS	cmk3yo0fr007ast0bstxjbuxd	2026-01-07 11:54:42.654	2026-01-08 08:16:11.15
cmk3ylgsf005sst0bah549iqr	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767786570503	SUBFLOW	PROCESSUS SUPPORT	{"originalType":"domainGroup","width":2292,"height":690,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontWeight":"bold","fontSize":"22px","backgroundColor":"#ffffff"},"label":"PROCESSUS SUPPORT","processId":null,"isHighlighted":false}	{"x":284.4299096949767,"y":2243.672159826696}	\N	\N	2026-01-07 11:52:43.839	2026-01-08 08:16:11.15
cmk3ylgsf005ust0bb7jsr06o	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767786594703	SUBFLOW	Animer les communautés	{"originalType":"domainGroup","width":920,"height":434,"parentNodeId":"domainGroup-1767786570503","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontWeight":"bold","fontSize":"18px","backgroundColor":"#3b82f6"},"label":"Animer les communautés","processId":null,"isHighlighted":false}	{"x":114,"y":148}	\N	\N	2026-01-07 11:52:43.839	2026-01-08 08:16:11.15
cmk3ylgsf005wst0by6xloz8o	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767786601413	SUBFLOW	Gérer les données de l’expérience client	{"originalType":"domainGroup","width":1064,"height":432,"parentNodeId":"domainGroup-1767786570503","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"18px","fontWeight":"bold","backgroundColor":"#3b82f6"},"label":"Gérer les données de l’expérience client","processId":null,"isHighlighted":false}	{"x":1088,"y":154}	\N	\N	2026-01-07 11:52:43.839	2026-01-08 08:16:11.15
cmk3uiuco005rq6odf16ev8bs	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-startEvent	START	Début	{"originalType":"startEvent","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":100,"y":200}	\N	\N	2026-01-07 09:58:42.984	2026-01-07 09:58:42.984
cmk3uiud9005xq6odffkmbyxr	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-0	PROCEDURE	Définir la stratégie de l'expérience client	{"originalType":"procedure","description":"Processus stratégique de définition de la stratégie globale d'expérience client","width":170,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":15,"y":100}	PROCEDURE	cmk3uiucx005tq6od3nhrosys	2026-01-07 09:58:43.005	2026-01-07 09:58:43.005
cmk3ylgvw006yst0bvivviwmj	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786753600	PROCESS	Animer la communauté BPM	{"originalType":"mainProcess","width":264,"height":80,"parentNodeId":"domainGroup-1767786594703","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Animer la communauté BPM","processId":"cmk3ylgu6006cst0b2ruyc2jo","linkedProcessId":"cmk3ylgu6006cst0b2ruyc2jo","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":634,"y":250}	PROCESS	cmk3ylgu6006cst0b2ruyc2jo	2026-01-07 11:52:43.963	2026-01-08 08:16:11.15
cmk3ylgvx0070st0bys2e6b0a	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786653843	PROCESS	Animer la communauté Vente & Distribution	{"originalType":"mainProcess","width":250,"height":80,"parentNodeId":"domainGroup-1767786594703","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Animer la communauté Vente & Distribution","processId":"cmk3ylgu7006est0btxxx87gk","linkedProcessId":"cmk3ylgu7006est0btxxx87gk","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":358.4299096949767,"y":110}	PROCESS	cmk3ylgu7006est0btxxx87gk	2026-01-07 11:52:43.965	2026-01-08 08:16:11.15
cmk3x29x40042st0be49y4zkw	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767784066948	PROCESS	Accompagner le business développement de la vente & distribution	{"originalType":"mainProcess","width":204,"height":86,"parentNodeId":"domainGroup-1767783839916","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"12px"},"label":"Accompagner le business développement de la vente & distribution","processId":"cmk3x29r0002sst0b53gczwxk","linkedProcessId":"cmk3x29r0002sst0b53gczwxk","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":290,"y":250.0000000000002}	PROCESS	cmk3x29r0002sst0b53gczwxk	2026-01-07 11:09:48.855	2026-01-08 08:16:11.15
cmk3ylgvu006ust0b8i6ye9qn	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786636391	PROCESS	Animer la communauté Expérience Client	{"originalType":"mainProcess","width":268,"height":80,"parentNodeId":"domainGroup-1767786594703","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Animer la communauté Expérience Client","processId":"cmk3ylgtz0062st0bj7grjhol","linkedProcessId":"cmk3ylgtz0062st0bj7grjhol","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":42.42990969497669,"y":112}	PROCESS	cmk3ylgtz0062st0bj7grjhol	2026-01-07 11:52:43.962	2026-01-08 08:16:11.15
cmk3ylgvv006wst0btc8bmjb8	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786674978	PROCESS	Animer la communauté Relation Client	{"originalType":"mainProcess","width":240,"height":80,"parentNodeId":"domainGroup-1767786594703","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Animer la communauté Relation Client","processId":"cmk3ylgu40068st0b5zisfb0q","linkedProcessId":"cmk3ylgu40068st0b5zisfb0q","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":50.42990969497669,"y":244}	PROCESS	cmk3ylgu40068st0b5zisfb0q	2026-01-07 11:52:43.962	2026-01-08 08:16:11.15
cmk3ye8ar005lst0bexo25h7e	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786414015	PROCESS	Déployer l’outil « Jeux en ligne »	{"originalType":"mainProcess","width":268,"height":83,"parentNodeId":"domainGroup-1767783970841","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Déployer l’outil « Jeux en ligne »","processId":"cmk3ye86j004lst0bwls71nxx","linkedProcessId":"cmk3ye86j004lst0bwls71nxx","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":332.0765153645541,"y":332.4867520588555}	PROCESS	cmk3ye86j004lst0bwls71nxx	2026-01-07 11:47:06.241	2026-01-08 08:16:11.15
cmk3ye8b1005nst0bc4slf0f1	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786402212	PROCESS	Déployer l’outil « Recueil du consentement »	{"originalType":"mainProcess","width":223,"height":80,"parentNodeId":"domainGroup-1767783970841","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Déployer l’outil « Recueil du consentement »","processId":"cmk3ye87e004zst0btmgv55el","linkedProcessId":"cmk3ye87e004zst0btmgv55el","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":32.0765153645541,"y":347.4867520588555}	PROCESS	cmk3ye87e004zst0btmgv55el	2026-01-07 11:47:06.253	2026-01-08 08:16:11.15
cmk3ye8an005hst0b30h73l49	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786391567	PROCESS	Déployer l’outil « Vérification de l’identité »	{"originalType":"mainProcess","width":263,"height":86,"parentNodeId":"domainGroup-1767783970841","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Déployer l’outil « Vérification de l’identité »","processId":"cmk3ye873004vst0bly4ace33","linkedProcessId":"cmk3ye873004vst0bly4ace33","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":326.7763858165424,"y":206.9888144208437}	PROCESS	cmk3ye873004vst0bly4ace33	2026-01-07 11:47:06.232	2026-01-08 08:16:11.15
cmk3s7nyk0041q6odr90thei9	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767775976989	SUBFLOW	Piloter l’expérience client 	{"originalType":"domainGroup","width":565,"height":207,"parentNodeId":"domainGroup-1767775839904","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#3b82f6","color":"#ffffff"},"label":"Piloter l’expérience client ","processId":null,"isHighlighted":false}	{"x":1639.206383572982,"y":117.8688382631729}	\N	\N	2026-01-07 08:54:02.251	2026-01-08 08:16:11.15
cmk3ye8a6005dst0baq9upr7a	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786351943	PROCESS	Déployer le portail web	{"originalType":"mainProcess","width":239,"height":87,"parentNodeId":"domainGroup-1767783970841","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Déployer le portail web","processId":"cmk3ye86u004ost0bdpqbo1v7","linkedProcessId":"cmk3ye86u004ost0bdpqbo1v7","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":31.71124960732482,"y":75.3219910813275}	PROCESS	cmk3ye86u004ost0bdpqbo1v7	2026-01-07 11:47:06.222	2026-01-08 08:16:11.15
cmk3ye8ap005jst0buprhua44	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786368521	PROCESS	Déployer le moteur de recherche	{"originalType":"mainProcess","width":266,"height":97,"parentNodeId":"domainGroup-1767783970841","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Déployer le moteur de recherche","processId":"cmk3ye874004wst0bi3mizldg","linkedProcessId":"cmk3ye874004wst0bi3mizldg","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":325.7882312414429,"y":78.26039747244499}	PROCESS	cmk3ye874004wst0bi3mizldg	2026-01-07 11:47:06.236	2026-01-08 08:16:11.15
cmk3x29xx004est0b9skkzbrn	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767784116693	PROCESS	Accompagner le déploiement de la Gestion par Processus 	{"originalType":"mainProcess","width":481,"height":80,"parentNodeId":"domainGroup-1767783928929","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Accompagner le déploiement de la Gestion par Processus ","processId":"cmk3x29td003bst0bwlry5lbz","linkedProcessId":"cmk3x29td003bst0bwlry5lbz","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":15.46722313225666,"y":192.539191479857}	PROCESS	cmk3x29td003bst0bwlry5lbz	2026-01-07 11:09:48.884	2026-01-08 08:16:11.15
cmk3x29wz0040st0bfgdg9tsh	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767784156503	PROCESS	Améliorer les Parcours Client avec Process Mining	{"originalType":"mainProcess","width":467,"height":80,"parentNodeId":"domainGroup-1767783928929","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Améliorer les Parcours Client avec Process Mining","processId":"cmk3x29sz0035st0b9og16ofh","linkedProcessId":"cmk3x29sz0035st0b9og16ofh","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":21.24296998752391,"y":402.6804920892268}	PROCESS	cmk3x29sz0035st0b9og16ofh	2026-01-07 11:09:48.852	2026-01-08 08:16:11.15
cmk431dkw0038iy36lxkkax2p	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-3-process-0	PROCESS	Administration du personnel	{"originalType":"supportProcess","description":"Gestion administrative des dossiers individuels et des formalités légales","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-3","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Administration du personnel","processId":"cmk431df20026iy36bfd301y3","linkedProcessId":"cmk431df20026iy36bfd301y3","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":200,"y":100}	PROCESS	cmk431df20026iy36bfd301y3	2026-01-07 13:57:04.633	2026-01-07 13:58:57.251
cmk431dl9003aiy36r7mbt9pt	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-2-process-2	PROCESS	Gestion des carrières et mobilité	{"originalType":"mainProcess","description":"Accompagnement de l'évolution professionnelle et de la mobilité interne","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-2","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Gestion des carrières et mobilité","processId":"cmk431dfo002oiy360l2cl36h","linkedProcessId":"cmk431dfo002oiy360l2cl36h","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":200}	PROCESS	cmk431dfo002oiy360l2cl36h	2026-01-07 13:57:04.653	2026-01-07 13:58:57.251
cmk431dlb003ciy360lx3u815	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-3-process-1	PROCESS	Gestion de la paie	{"originalType":"supportProcess","description":"Calcul et versement des rémunérations et charges sociales","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-3","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Gestion de la paie","processId":"cmk431df30028iy368uofmmck","linkedProcessId":"cmk431df30028iy368uofmmck","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":200}	PROCESS	cmk431df30028iy368uofmmck	2026-01-07 13:57:04.654	2026-01-07 13:58:57.251
cmk43jqxi0043iy366d8p3k8l	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-startEvent	START	Début période évaluation	{"originalType":"startEvent","description":"Démarrage de la campagne d'évaluation annuelle","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":100}	\N	\N	2026-01-07 14:11:21.75	2026-01-07 14:11:21.75
cmk43jqy90049iy36qvjnkjzy	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-procedure-0	PROCEDURE	Préparation de l'évaluation	{"originalType":"procedure","description":"Collecte des données de performance et préparation des documents d'évaluation","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":250}	PROCEDURE	cmk43jqxv0045iy36ou13ke23	2026-01-07 14:11:21.778	2026-01-07 14:11:21.778
cmk43jqyb004biy36xwnyue9j	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-gateway-0	DECISION	Préparation parallèle	{"originalType":"parallelGateway","description":"Lancement simultané des préparatifs","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":580}	\N	\N	2026-01-07 14:11:21.78	2026-01-07 14:11:21.78
cmk43jqye004diy364rmiqg3x	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-scriptTask-0	ACTION	Calculer indicateurs de performance	{"originalType":"scriptTask","description":"Calcul automatique des KPIs et métriques de performance","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":167.5,"y":735}	\N	\N	2026-01-07 14:11:21.782	2026-01-07 14:11:21.782
cmk43jqyg004fiy36gz9jj28y	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-userTask-1	ACTION	Auto-évaluation collaborateur	{"originalType":"userTask","description":"Le collaborateur complète son auto-évaluation","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":347.5,"y":735}	\N	\N	2026-01-07 14:11:21.785	2026-01-07 14:11:21.785
cmk3uiudh0063q6oduhbicx0t	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-1	PROCEDURE	Définir le marketing de l'expérience client	{"originalType":"procedure","description":"Définition du marketing et identification des moments signature","width":170,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":225,"y":100}	PROCEDURE	cmk3uiude005zq6oddn5lxuw7	2026-01-07 09:58:43.014	2026-01-07 09:58:43.014
cmk3uiudr0069q6odzq4fppzg	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-2	PROCEDURE	Définir la stratégie vente et distribution	{"originalType":"procedure","description":"Définition du plan stratégique de distribution","width":170,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":435,"y":100}	PROCEDURE	cmk3uiudm0065q6odp6538vcn	2026-01-07 09:58:43.023	2026-01-07 09:58:43.023
cmk3uiue0006fq6odvgtl13hg	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-3	PROCEDURE	Piloter l'expérience client	{"originalType":"procedure","description":"Pilotage global incluant mesure de recommandation et analyse d'expérience","width":170,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":645,"y":100}	PROCEDURE	cmk3uiudv006bq6odsvn4qn9i	2026-01-07 09:58:43.032	2026-01-07 09:58:43.032
cmk3uiue8006lq6odpo7ymwqv	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-4	PROCEDURE	Analyser l'expérience des points de contact	{"originalType":"procedure","description":"Analyse des canaux digitaux, physiques et centres d'appel","width":350,"height":200,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":15,"y":290}	PROCEDURE	cmk3uiue3006hq6od7777wyd5	2026-01-07 09:58:43.04	2026-01-07 09:58:43.04
cmk3uiuef006rq6odh6zatlop	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-5	PROCEDURE	Proposer des recommandations	{"originalType":"procedure","description":"Propositions de recommandations digitales, commerciales et bonnes pratiques","width":170,"height":120,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":405,"y":290}	PROCEDURE	cmk3uiueb006nq6odgewaxx0l	2026-01-07 09:58:43.047	2026-01-07 09:58:43.047
cmk3uiuel006xq6od1wghb853	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-6	PROCEDURE	Proposer des méthodes d'amélioration	{"originalType":"procedure","description":"Amélioration des processus avec Lean Six Sigma et Process Mining","width":170,"height":120,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":615,"y":290}	PROCEDURE	cmk3uiuei006tq6od38nr91k8	2026-01-07 09:58:43.054	2026-01-07 09:58:43.054
cmk3uiuet0073q6odtviwhstd	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-7	PROCEDURE	Proposer des outils de gestion des canaux	{"originalType":"procedure","description":"Déploiement d'outils digitaux et de gestion","width":170,"height":200,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":825,"y":290}	PROCEDURE	cmk3uiueq006zq6od0c6gwf9s	2026-01-07 09:58:43.062	2026-01-07 09:58:43.062
cmk3uiuez0079q6odvu8dlf95	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-8	PROCEDURE	Animer les communautés	{"originalType":"procedure","description":"Animation des communautés expérience client, vente, distribution et digitale","width":350,"height":120,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":15,"y":620}	PROCEDURE	cmk3uiuew0075q6od63421h1s	2026-01-07 09:58:43.068	2026-01-07 09:58:43.068
cmk3uiuf6007fq6od2wnxuc39	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-procedure-9	PROCEDURE	Gérer les données de l'expérience client	{"originalType":"procedure","description":"Gestion complète des données de performance et satisfaction client","width":350,"height":120,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":645,"y":620}	PROCEDURE	cmk3uiuf2007bq6odwaaxugul	2026-01-07 09:58:43.075	2026-01-07 09:58:43.075
cmk3uiufa007hq6odzq2xkxhl	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-task-0	ACTION	Identifier les moments signature	{"originalType":"task","description":"Identification des moments clés de l'expérience client","width":120,"height":50,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":435,"y":130}	\N	\N	2026-01-07 09:58:43.078	2026-01-07 09:58:43.078
cmk3uiufc007jq6od77rjst91	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-task-1	ACTION	Définir le plan stratégique de la distribution	{"originalType":"task","description":"Planification stratégique de la distribution","width":120,"height":50,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":645,"y":130}	\N	\N	2026-01-07 09:58:43.08	2026-01-07 09:58:43.08
cmk3uiufd007lq6odnc7bigve	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-task-2	ACTION	Mesurer la recommandation des clients	{"originalType":"task","description":"Mesure et analyse des recommandations clients","width":120,"height":50,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":855,"y":130}	\N	\N	2026-01-07 09:58:43.082	2026-01-07 09:58:43.082
cmk3uiuff007nq6odubo0753v	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-task-3	ACTION	Analyser l'expérience globale des clients des filiales	{"originalType":"task","description":"Analyse globale de l'expérience client des filiales","width":120,"height":50,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":1065,"y":130}	\N	\N	2026-01-07 09:58:43.083	2026-01-07 09:58:43.083
cmk3uiufg007pq6odl7rlup6v	cmk3tk6w3005mq6odx6ffbdar	img-1767779922970-upqvxr5-endEvent	END	Fin	{"originalType":"endEvent","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":1235,"y":200}	\N	\N	2026-01-07 09:58:43.084	2026-01-07 09:58:43.084
cmk3the3w004xq6odlb4tabkh	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767778029047	SUBFLOW	PROCESSUS OPERATIONNELS / DE REALISATION	{"originalType":"domainGroup","width":2296,"height":1180,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontWeight":"bold","fontSize":"24px","backgroundColor":"#ffffff"},"label":"PROCESSUS OPERATIONNELS / DE REALISATION","processId":null,"isHighlighted":false}	{"x":280.8072749904995,"y":1016.549460377984}	\N	\N	2026-01-07 09:29:35.659	2026-01-08 08:16:11.15
cmk3ylgvr006sst0bsraq3j33	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786656575	PROCESS	Animer la communauté Digitale	{"originalType":"mainProcess","width":248,"height":88,"parentNodeId":"domainGroup-1767786594703","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Animer la communauté Digitale","processId":"cmk3ylgu10064st0b838vzxia","linkedProcessId":"cmk3ylgu10064st0b838vzxia","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":648.4299096949767,"y":110}	PROCESS	cmk3ylgu10064st0b838vzxia	2026-01-07 11:52:43.96	2026-01-08 08:16:11.15
cmk3x29xd0044st0b9jwifuo2	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767784103981	PROCESS	Améliorer les processus avec Lean Six Sigma	{"originalType":"mainProcess","width":232,"height":80,"parentNodeId":"domainGroup-1767783928929","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Améliorer les processus avec Lean Six Sigma","processId":"cmk3x29rt002wst0bvfm66351","linkedProcessId":"cmk3x29rt002wst0bvfm66351","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":272.4549209015788,"y":76.1659050707251}	PROCESS	cmk3x29rt002wst0bvfm66351	2026-01-07 11:09:48.865	2026-01-08 08:16:11.15
cmk3x29xw004cst0bnyutzrad	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767784107505	PROCESS	Analyser la performance avec COPC	{"originalType":"mainProcess","width":246,"height":92,"parentNodeId":"domainGroup-1767783928929","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Analyser la performance avec COPC","processId":"cmk3x29th003fst0b62iuasl0","linkedProcessId":"cmk3x29th003fst0b62iuasl0","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":12.0647626861213,"y":73.44393671381704}	PROCESS	cmk3x29th003fst0b62iuasl0	2026-01-07 11:09:48.883	2026-01-08 08:16:11.15
cmk3ye8af005fst0bazfdftza	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786381356	PROCESS	Déployer le portail e-shop	{"originalType":"mainProcess","width":238,"height":80,"parentNodeId":"domainGroup-1767783970841","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Déployer le portail e-shop","processId":"cmk3ye873004tst0bfpx28nzx","linkedProcessId":"cmk3ye873004tst0bfpx28nzx","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":32.43747573094311,"y":206.633968030199}	PROCESS	cmk3ye873004tst0bfpx28nzx	2026-01-07 11:47:06.228	2026-01-08 08:16:11.15
cmk3uz7eq009uq6odviri3hbj	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767780593920	PROCESS	Analyser les centres d’appel partenaires	{"originalType":"mainProcess","width":149,"height":80,"parentNodeId":"domainGroup-1767780563531","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"10px"},"label":"Analyser les centres d’appel partenaires","processId":"cmk3uz7bs0092q6odzqnghq5w","linkedProcessId":"cmk3uz7bs0092q6odzqnghq5w","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":28.81229211385426,"y":71.27183141122805}	PROCESS	cmk3uz7bs0092q6odzqnghq5w	2026-01-07 10:11:26.402	2026-01-08 08:16:11.15
cmk3uz7eu009wq6odu5mcebzm	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767780604301	PROCESS	Analyser les données de la relation client	{"originalType":"mainProcess","width":193,"height":80,"parentNodeId":"domainGroup-1767780563531","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px","textAlign":"center"},"label":"Analyser les données de la relation client","processId":"cmk3uz7b6008mq6od33zdmc7d","linkedProcessId":"cmk3uz7b6008mq6od33zdmc7d","linkedProcessType":"process","linkedProcessFlowType":"FLOW","linkedProcessTitle":"Analyse de données relation clients","linkedProcessCode":"PROC-ANALYSEDE-2818"}	{"x":213.3883483101116,"y":69.82522465167449}	PROCESS	cmk3uz7b6008mq6od33zdmc7d	2026-01-07 10:11:26.406	2026-01-08 08:16:11.15
cmk431cis000diy36gxitqnoa	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-domainGroup-0-3	SUBFLOW	Administration RH et Paie	{"originalType":"domainGroup","description":"Processus administratifs et de gestion de la paie","width":400,"height":320,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Administration RH et Paie","processId":null}	{"x":1600,"y":100}	\N	\N	2026-01-07 13:57:03.267	2026-01-07 13:58:57.251
cmk43jqyj004hiy361dua93fa	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-gateway-1	DECISION	Convergence préparation	{"originalType":"parallelGateway","description":"Synchronisation avant entretien","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":1320}	\N	\N	2026-01-07 14:11:21.787	2026-01-07 14:11:21.787
cmk43jqz9004niy369rps6tlj	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-procedure-1	PROCEDURE	Conduite de l'entretien d'évaluation	{"originalType":"procedure","description":"Réalisation de l'entretien entre le manager et le collaborateur","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":337.5,"y":1985}	PROCEDURE	cmk43jqyo004jiy361g6l54w9	2026-01-07 14:11:21.813	2026-01-07 14:11:21.813
cmk43jqzb004piy36e2fgpdpz	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-gateway-2	DECISION	Évaluation validée?	{"originalType":"exclusiveGateway","description":"Vérification de la validation de l'évaluation","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":1830}	\N	\N	2026-01-07 14:11:21.815	2026-01-07 14:11:21.815
cmk43jqzk004viy3625ndx7gm	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-procedure-2	PROCEDURE	Finalisation de l'évaluation	{"originalType":"procedure","description":"Validation et formalisation des résultats d'évaluation","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":157.5,"y":1985}	PROCEDURE	cmk43jqzg004riy36j40yjtqv	2026-01-07 14:11:21.825	2026-01-07 14:11:21.825
cmk43jqzm004xiy367tejyg2u	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-userTask-2	ACTION	Valider évaluation RH	{"originalType":"userTask","description":"Validation de l'évaluation par les Ressources Humaines","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":2340}	\N	\N	2026-01-07 14:11:21.827	2026-01-07 14:11:21.827
cmk43jr020053iy36d1upk4js	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-procedure-3	PROCEDURE	Définition des objectifs	{"originalType":"procedure","description":"Établissement des objectifs pour la période suivante","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":2620}	PROCEDURE	cmk43jqzr004ziy36o67x44sx	2026-01-07 14:11:21.842	2026-01-07 14:11:21.842
cmk43jr030055iy36sqc9m2ck	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-serviceTask-3	ACTION	Notifier résultats SIRH	{"originalType":"serviceTask","description":"Intégration automatique des résultats dans le SIRH","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":2950}	\N	\N	2026-01-07 14:11:21.844	2026-01-07 14:11:21.844
cmk43jr09005biy36ojg7iwj6	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-procedure-4	PROCEDURE	Suivi et accompagnement	{"originalType":"procedure","description":"Mise en place du suivi régulier et des actions d'accompagnement","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":3230}	PROCEDURE	cmk43jr060057iy367ox3srx6	2026-01-07 14:11:21.849	2026-01-07 14:11:21.849
cmk3x29xu004ast0bwycizh61	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767784043343	PROCESS	Proposer des bonnes pratiques d’expérience client responsable	{"originalType":"mainProcess","width":212,"height":86,"parentNodeId":"domainGroup-1767783839916","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Proposer des bonnes pratiques d’expérience client responsable","processId":"cmk3x29uw003mst0b39r2w1m0","linkedProcessId":"cmk3x29uw003mst0b39r2w1m0","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":31.05246045544345,"y":250.0000000000002}	PROCESS	cmk3x29uw003mst0b39r2w1m0	2026-01-07 11:09:48.883	2026-01-08 08:16:11.15
cmk3uz7ey009yq6odpxtocnm8	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767780649379	PROCESS	Analyser les données CX responsable	{"originalType":"mainProcess","width":165,"height":80,"parentNodeId":"domainGroup-1767780633186","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px"},"label":"Analyser les données CX responsable","processId":"cmk3uz7bc008rq6od20148f4w","linkedProcessId":"cmk3uz7bc008rq6od20148f4w","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":37.62125804937682,"y":63.87375268312576}	PROCESS	cmk3uz7bc008rq6od20148f4w	2026-01-07 10:11:26.411	2026-01-08 08:16:11.15
cmk3uz7f200a0q6od606ku6dc	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767780668948	PROCESS	Réaliser des benchmarks	{"originalType":"mainProcess","width":154,"height":80,"parentNodeId":"domainGroup-1767780633186","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"10px"},"label":"Réaliser des benchmarks","processId":"cmk3uz7by0096q6odxqpq8vya","linkedProcessId":"cmk3uz7by0096q6odxqpq8vya","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":238,"y":61.09705606290231}	PROCESS	cmk3uz7by0096q6odxqpq8vya	2026-01-07 10:11:26.414	2026-01-08 08:16:11.15
cmk3uz7g400a4q6odobtgylws	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767780385629	PROCESS	Analyser le Traffic digital	{"originalType":"mainProcess","width":202,"height":80,"parentNodeId":"domainGroup-1767780318877","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px"},"label":"Analyser le Traffic digital","processId":"cmk3uz7c30099q6od4n96hfy0","linkedProcessId":"cmk3uz7c30099q6od4n96hfy0","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":238.5564480218554,"y":73.69741093928633}	PROCESS	cmk3uz7c30099q6od4n96hfy0	2026-01-07 10:11:26.453	2026-01-08 08:16:11.15
cmk3uz78x008dq6odz1aksm4j	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767780633186	SUBFLOW	Analyser l’expérience responsable	{"originalType":"domainGroup","width":413,"height":173.0970560629023,"parentNodeId":"domainGroup-1767778035039","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#ffedd5"},"label":"Analyser l’expérience responsable","processId":null,"isHighlighted":false}	{"x":515.7809213062901,"y":390.3008986066982}	\N	\N	2026-01-07 10:11:26.193	2026-01-08 08:16:11.15
cmk43jr0a005diy36zi0rvk2l	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-timerEvent-0	ACTION	Rappel 6 mois	{"originalType":"timerEvent","description":"Déclenchement du suivi semestriel","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":3560}	\N	\N	2026-01-07 14:11:21.851	2026-01-07 14:11:21.851
cmk43jr0c005fiy363xzf1cqf	cmk43jqw40040iy3682efghaz	ai-1767795081730-332tm38-endEvent	END	Évaluation terminée	{"originalType":"endEvent","description":"Fin du processus d'évaluation","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":300,"y":3710}	\N	\N	2026-01-07 14:11:21.852	2026-01-07 14:11:21.852
cmk3wv3fe002kst0bszm8boex	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767783839916	SUBFLOW	Proposer des recommandations	{"originalType":"domainGroup","width":596,"height":414,"parentNodeId":"domainGroup-1767778029047","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#3b82f6"},"label":"Proposer des recommandations","processId":null,"isHighlighted":false}	{"x":59.46604728365085,"y":714.6885719338607}	\N	\N	2026-01-07 11:04:13.85	2026-01-08 08:16:11.15
cmk3uz7f800a2q6od1p78xaia	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767780533581	PROCESS	Réaliser des benchmarks	{"originalType":"mainProcess","parentNodeId":"domainGroup-1767780503705","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Réaliser des benchmarks","processId":"cmk3uz7bq0090q6odsfd5c93f","linkedProcessId":"cmk3uz7bq0090q6odsfd5c93f","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":104.9999999999999,"y":63}	PROCESS	cmk3uz7bq0090q6odsfd5c93f	2026-01-07 10:11:26.42	2026-01-08 08:16:11.15
cmk43qzhk00abiy366b192zdj	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-serviceTask-4	ACTION	Déployer le monitoring	{"originalType":"serviceTask","description":"Mise en place automatique des outils de surveillance","width":261,"height":143,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Déployer le monitoring","procedureId":null}	{"x":3904.674373517178,"y":155.6718963152279}	\N	\N	2026-01-07 14:16:59.432	2026-01-07 14:18:39.227
cmk43qzhn00adiy36ymfniy0w	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-timerEvent-0	ACTION	Attendre 30 jours	{"originalType":"timerEvent","description":"Délai d'observation pour mesurer l'impact des améliorations","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Attendre 30 jours","procedureId":null}	{"x":4330,"y":200}	\N	\N	2026-01-07 14:16:59.435	2026-01-07 14:18:39.231
cmk43qzhp00afiy36bryhw6a0	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-endEvent	END	Amélioration pérennisée	{"originalType":"endEvent","description":"Fin du processus avec amélioration validée et déployée","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Amélioration pérennisée","procedureId":null}	{"x":4480,"y":200}	\N	\N	2026-01-07 14:16:59.437	2026-01-07 14:18:39.234
cmk43qzeq0095iy362sxay6th	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-startEvent	START	Besoin d'amélioration identifié	{"originalType":"startEvent","description":"Déclenchement du processus suite à un besoin d'amélioration","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Besoin d'amélioration identifié","procedureId":null}	{"x":1001.829593726278,"y":213.7159036696818}	\N	\N	2026-01-07 14:16:59.33	2026-01-07 14:18:39.24
cmk43qzfg009biy36ynrlwfu6	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-procedure-0	PROCEDURE	Définir le projet d'amélioration	{"originalType":"procedure","description":"Identifier le processus à améliorer, définir les objectifs et constituer l'équipe projet","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Définir le projet d'amélioration","procedureId":"cmk43qzf80097iy36wwkssu2t"}	{"x":1282.121751143555,"y":196.5710240825796}	PROCEDURE	cmk43qzf80097iy36wwkssu2t	2026-01-07 14:16:59.356	2026-01-07 14:18:39.244
cmk3ylgvy0072st0bmobbp2q7	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786691147	PROCESS	Animer la communauté Lean Six Sigma	{"originalType":"mainProcess","width":248,"height":80,"parentNodeId":"domainGroup-1767786594703","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Animer la communauté Lean Six Sigma","processId":"cmk3ylgu5006ast0bshjxnjfv","linkedProcessId":"cmk3ylgu5006ast0bshjxnjfv","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":330,"y":246}	PROCESS	cmk3ylgu5006ast0bshjxnjfv	2026-01-07 11:52:43.965	2026-01-08 08:16:11.15
cmk43lae9006jiy3619gcdtq8	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-startEvent	START	Début campagne évaluation	{"originalType":"startEvent","description":"Démarrage de la campagne d'évaluation annuelle","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":100,"y":200}	\N	\N	2026-01-07 14:12:33.632	2026-01-07 14:12:33.632
cmk3s7nyj003vq6odjx0ffadw	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767775839904	SUBFLOW	PROCESSUS STRATEGIQUES / PILOTAGE / MANAGEMENT	{"originalType":"domainGroup","width":2292,"height":510,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"22px","fontWeight":"bold","backgroundColor":"#ffffff"},"label":"PROCESSUS STRATEGIQUES / PILOTAGE / MANAGEMENT","processId":null,"isHighlighted":false}	{"x":286.110401784204,"y":428.9152699180127}	\N	\N	2026-01-07 08:54:02.251	2026-01-08 08:16:11.15
cmk3s7nyj003xq6odd6uyxu5h	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767775852507	SUBFLOW	Définir le marketing de l’expérience client	{"originalType":"domainGroup","width":421,"height":213,"parentNodeId":"domainGroup-1767775839904","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#3b82f6","color":"#ffffff"},"label":"Définir le marketing de l’expérience client","processId":null,"isHighlighted":false}	{"x":434.8334315320009,"y":126.6947094979562}	\N	\N	2026-01-07 08:54:02.251	2026-01-08 08:16:11.15
cmk3x29xn0048st0blb1llwp9	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767784026538	PROCESS	Proposer des guidelines  commerciales	{"originalType":"mainProcess","width":214,"height":80,"parentNodeId":"domainGroup-1767783839916","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#ffffff"},"label":"Proposer des guidelines  commerciales","processId":"cmk3x29si002yst0box2963rs","linkedProcessId":"cmk3x29si002yst0box2963rs","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":280,"y":100.0000000000002}	PROCESS	cmk3x29si002yst0box2963rs	2026-01-07 11:09:48.875	2026-01-08 08:16:11.15
cmk3x29xy004gst0b386hciuf	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767784124380	PROCESS	Définir et améliorer les  Parcours Client	{"originalType":"mainProcess","width":466,"height":80,"parentNodeId":"domainGroup-1767783928929","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Définir et améliorer les  Parcours Client","processId":"cmk3x29sw0033st0bhw8oy5ya","linkedProcessId":"cmk3x29sw0033st0bhw8oy5ya","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":19.46397159952392,"y":298.1413006093699}	PROCESS	cmk3x29sw0033st0bhw8oy5ya	2026-01-07 11:09:48.885	2026-01-08 08:16:11.15
cmk3the3w004zq6od4egotpps	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767778035039	SUBFLOW	Analyser l’expérience des points de contact	{"originalType":"domainGroup","width":961,"height":591,"parentNodeId":"domainGroup-1767778029047","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#3b82f6","color":"#ffffff"},"label":"Analyser l’expérience des points de contact","processId":null,"childIds":["domainGroup-1767778039527"],"isHighlighted":false}	{"x":38.00000000000003,"y":76}	\N	\N	2026-01-07 09:29:35.659	2026-01-08 08:16:11.15
cmk43laev006piy363iz539qe	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-procedure-0	PROCEDURE	Planification de l'évaluation	{"originalType":"procedure","description":"Planifier la campagne d'évaluation et définir le calendrier","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":250,"y":200}	PROCEDURE	cmk43laep006liy36pd7sp0yv	2026-01-07 14:12:33.656	2026-01-07 14:12:33.656
cmk43laey006riy36fkvqp2dd	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-gateway-0	DECISION	Évaluations parallèles	{"originalType":"parallelGateway","description":"Démarrage simultané des évaluations employé et manager","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":670,"y":200}	\N	\N	2026-01-07 14:12:33.659	2026-01-07 14:12:33.659
cmk431did0032iy36kayhy19r	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-4-process-1	PROCESS	Santé et sécurité au travail	{"originalType":"supportProcess","description":"Prévention des risques professionnels et promotion de la santé au travail","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-4","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Santé et sécurité au travail","processId":"cmk431dcc001xiy36vd4kw22y","linkedProcessId":"cmk431dcc001xiy36vd4kw22y","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":200}	PROCESS	cmk431dcc001xiy36vd4kw22y	2026-01-07 13:57:04.549	2026-01-07 13:58:57.251
cmk431dir0034iy36jwwvbg1e	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-2-process-0	PROCESS	Formation et développement	{"originalType":"mainProcess","description":"Conception et déploiement des plans de formation et de développement des compétences","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-2","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Formation et développement","processId":"cmk431dfk002giy366tvczc6g","linkedProcessId":"cmk431dfk002giy366tvczc6g","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":200,"y":100}	PROCESS	cmk431dfk002giy366tvczc6g	2026-01-07 13:57:04.563	2026-01-07 13:58:57.251
cmk431dit0036iy369n1xgzxb	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-3-process-2	PROCESS	Gestion des temps et activités	{"originalType":"supportProcess","description":"Suivi des présences, congés et temps de travail","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-3","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Gestion des temps et activités","processId":"cmk431dfl002miy36ldpapsem","linkedProcessId":"cmk431dfl002miy36ldpapsem","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":100}	PROCESS	cmk431dfl002miy36ldpapsem	2026-01-07 13:57:04.566	2026-01-07 13:58:57.251
cmk43laf8006xiy36hvbbkiqe	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-procedure-1	PROCEDURE	Auto-évaluation employé	{"originalType":"procedure","description":"L'employé réalise son auto-évaluation sur ses objectifs et compétences","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":825,"y":102.5}	PROCEDURE	cmk43laf3006tiy36y2w6nn9z	2026-01-07 14:12:33.668	2026-01-07 14:12:33.668
cmk43laff0073iy360ody0wf6	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-procedure-2	PROCEDURE	Évaluation managériale	{"originalType":"procedure","description":"Le manager évalue les performances et compétences de l'employé","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":825,"y":282.5}	PROCEDURE	cmk43lafb006ziy36r63mdkd7	2026-01-07 14:12:33.676	2026-01-07 14:12:33.676
cmk47loy3006vli17a5aobuzt	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-scriptTask-1	ACTION	Calculer les indicateurs d'adoption	{"originalType":"scriptTask","description":"Calcul automatique des métriques d'adoption et de performance","width":288,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"10px"},"label":"Calculer les indicateurs d'adoption","procedureId":null}	{"x":231.3528984327085,"y":1352.843668992882}	\N	\N	2026-01-07 16:04:50.956	2026-01-08 09:01:35.181
cmk4331cr003giy36zivyixg8	cmk431cfm0004iy36ucdi25x5	domainGroup-1767794256683	SUBFLOW	domainGroup	{"originalType":"domainGroup","width":1095,"height":308,"isConnectable":true,"isDraggable":true,"isSelectable":true,"label":"domainGroup","isHighlighted":false}	{"x":65.73487840554606,"y":566.924652797867}	\N	\N	2026-01-07 13:58:22.107	2026-01-07 13:58:57.251
cmk43lafi0075iy36lrli24r1	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-userTask-0	ACTION	Saisir auto-évaluation	{"originalType":"userTask","description":"L'employé saisit son auto-évaluation dans le système","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":1690,"y":200}	\N	\N	2026-01-07 14:12:33.678	2026-01-07 14:12:33.678
cmk43lafk0077iy36x5xpfd7y	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-timerEvent-0	ACTION	Délai auto-évaluation	{"originalType":"timerEvent","description":"Délai de 2 semaines pour compléter l'auto-évaluation","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":2050,"y":200}	\N	\N	2026-01-07 14:12:33.681	2026-01-07 14:12:33.681
cmk43lafn0079iy360wcyqgw8	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-gateway-1	DECISION	Convergence évaluations	{"originalType":"parallelGateway","description":"Convergence des évaluations pour l'entretien","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":2200,"y":200}	\N	\N	2026-01-07 14:12:33.683	2026-01-07 14:12:33.683
cmk43lafv007fiy362uczbfxx	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-procedure-3	PROCEDURE	Entretien d'évaluation	{"originalType":"procedure","description":"Entretien entre le manager et l'employé pour discuter des évaluations","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":3735,"y":282.5}	PROCEDURE	cmk43lafq007biy36fy33rpvv	2026-01-07 14:12:33.692	2026-01-07 14:12:33.692
cmk43lag7007liy3649luoatf	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-procedure-4	PROCEDURE	Validation RH	{"originalType":"procedure","description":"Validation finale par les Ressources Humaines","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":2800,"y":200}	PROCEDURE	cmk43lag1007hiy36j9c9n6iw	2026-01-07 14:12:33.703	2026-01-07 14:12:33.703
cmk43laga007niy36ne5p4fyb	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-userTask-1	ACTION	Valider évaluation finale	{"originalType":"userTask","description":"Validation finale de l'évaluation par le RH","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":3220,"y":200}	\N	\N	2026-01-07 14:12:33.706	2026-01-07 14:12:33.706
cmk43lagd007piy36f11jbywz	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-gateway-2	DECISION	Évaluation validée?	{"originalType":"exclusiveGateway","description":"Vérification si l'évaluation nécessite des ajustements","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":3580,"y":200}	\N	\N	2026-01-07 14:12:33.709	2026-01-07 14:12:33.709
cmk43lagk007viy36g7axm7jb	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-procedure-5	PROCEDURE	Définition objectifs N+1	{"originalType":"procedure","description":"Établissement des objectifs pour l'année suivante","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":3735,"y":102.5}	PROCEDURE	cmk43lagh007riy36oesb3zgn	2026-01-07 14:12:33.717	2026-01-07 14:12:33.717
cmk43lagq007xiy366tkar296	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-serviceTask-2	ACTION	Générer rapport d'évaluation	{"originalType":"serviceTask","description":"Génération automatique du rapport d'évaluation","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":4180,"y":200}	\N	\N	2026-01-07 14:12:33.722	2026-01-07 14:12:33.722
cmk43lagr007ziy36ytkbjcgb	cmk43lacf006giy36a7ot4p8o	ai-1767795153619-gmmaeq2-endEvent	END	Évaluation terminée	{"originalType":"endEvent","description":"Processus d'évaluation complété","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":4540,"y":200}	\N	\N	2026-01-07 14:12:33.724	2026-01-07 14:12:33.724
cmk3uz7e3009qq6oduq4cs5qw	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767780461533	PROCESS	Analyser la performance web	{"originalType":"mainProcess","width":183,"height":80,"parentNodeId":"domainGroup-1767780318877","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px"},"label":"Analyser la performance web","processId":"cmk3uz7ba008pq6odvqrmild2","linkedProcessId":"cmk3uz7ba008pq6odvqrmild2","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":247.4972186615102,"y":165.1184115549929}	PROCESS	cmk3uz7ba008pq6odvqrmild2	2026-01-07 10:11:26.379	2026-01-08 08:16:11.15
cmk3uz7ec009sq6od6gnemeui	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767780437050	PROCESS	Analyser les  web Analytics	{"originalType":"mainProcess","width":194,"height":80,"parentNodeId":"domainGroup-1767780318877","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px"},"label":"Analyser les  web Analytics","processId":"cmk3uz7bo008yq6od9my094ih","linkedProcessId":"cmk3uz7bo008yq6od9my094ih","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":20.70538157445904,"y":169.7190684779243}	PROCESS	cmk3uz7bo008yq6od9my094ih	2026-01-07 10:11:26.389	2026-01-08 08:16:11.15
cmk3x29xi0046st0bf7eqonv9	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767783993123	PROCESS	Réaliser des recommandations   sur le digital	{"originalType":"mainProcess","width":214,"height":80,"parentNodeId":"domainGroup-1767783839916","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px"},"label":"Réaliser des recommandations   sur le digital","processId":"cmk3x29tf003dst0bzc3ssw5a","linkedProcessId":"cmk3x29tf003dst0bzc3ssw5a","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":41.05246045544342,"y":94.00000000000023}	PROCESS	cmk3x29tf003dst0bzc3ssw5a	2026-01-07 11:09:48.869	2026-01-08 08:16:11.15
cmk3x29po002nst0bomgxe08k	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767783928929	SUBFLOW	Proposer des méthodes d’amélioration	{"originalType":"domainGroup","width":524,"height":528,"parentNodeId":"domainGroup-1767778029047","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#3b82f6"},"label":"Proposer des méthodes d’amélioration","processId":null,"isHighlighted":true}	{"x":1718,"y":93.88558997443351}	\N	\N	2026-01-07 11:09:48.588	2026-01-08 08:16:11.15
cmk3s7o2p004tq6odkft20v5f	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767775868269	PROCESS	Identifier les moments signature	{"originalType":"mainProcess","width":280,"height":84,"parentNodeId":"domainGroup-1767775852507","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#ffedd5","textAlign":"center"},"label":"Identifier les moments signature","processId":"cmk3s7o08004aq6odeupztoi1","linkedProcessId":"cmk3s7o08004aq6odeupztoi1","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":63.19194966144732,"y":64.54174946656991}	PROCESS	cmk3s7o08004aq6odeupztoi1	2026-01-07 08:54:02.401	2026-01-08 08:16:11.15
cmk3uz78x0089q6od4f9rm3ei	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767780503705	SUBFLOW	Analyser les canaux physiques	{"originalType":"domainGroup","width":457,"height":172,"parentNodeId":"domainGroup-1767778035039","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#ffedd5"},"label":"Analyser les canaux physiques","processId":null,"isHighlighted":false}	{"x":40.56427028317705,"y":390.0000000000002}	\N	\N	2026-01-07 10:11:26.193	2026-01-08 08:16:11.15
cmk47gplo004ili17urmgczbk	cmk3vikfa000411vqey42lphr	mainProcess-ai-1767801636790-4	PROCESS	Améliorer les Parcours Client avec Process Mining	{"originalType":"mainProcess","width":358,"height":86,"parentNodeId":"domainGroup-1767801603905","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Améliorer les Parcours Client avec Process Mining","processId":"cmk47gp2g003gli17eqkrkupe","linkedProcessId":"cmk47gp2g003gli17eqkrkupe","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":382.3973212976658,"y":203.7034989095973}	PROCESS	cmk47gp2g003gli17eqkrkupe	2026-01-07 16:00:58.519	2026-01-08 09:06:44.73
cmk47gplm004eli170kbuz785	cmk3vikfa000411vqey42lphr	mainProcess-ai-1767801636790-2	PROCESS	Accompagner le déploiement de la Gestion par Processus	{"originalType":"mainProcess","width":321,"height":105,"parentNodeId":"domainGroup-1767801603905","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Accompagner le déploiement de la Gestion par Processus","processId":"cmk47gp3a003nli17pvqa21pj","linkedProcessId":"cmk47loup005oli1751lt9okn","linkedProcessType":"process","linkedProcessFlowType":"FLOW","linkedProcessTitle":"Accompagner le déploiement de la Gestion par Processus","linkedProcessCode":"PROC-ACCOMPAGNE-0808"}	{"x":552.5188769082049,"y":74.07550763281915}	PROCESS	cmk47gp3a003nli17pvqa21pj	2026-01-07 16:00:58.518	2026-01-08 09:06:44.73
cmk47jf3l005lli1781ep2ru6	cmk3vikfa000411vqey42lphr	mainProcess-1767801751433	PROCESS	Processus 4	{"originalType":"mainProcess","width":140,"height":80,"parentNodeId":"domainGroup-1767801696038","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Processus 4","processId":"cmk47jeyy0050li17zetkf7hn","linkedProcessId":"cmk47jeyy0050li17zetkf7hn","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":200,"y":200}	PROCESS	cmk47jeyy0050li17zetkf7hn	2026-01-07 16:03:04.878	2026-01-08 09:06:44.73
cmk3yqfic007wst0bm8hznrxd	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767786943395	PROCESS	Définir la stratégie de l’expérience client	{"originalType":"mainProcess","width":285,"height":140,"parentNodeId":"domainGroup-1767775839904","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#3b82f6","textAlign":"center","color":"#ffffff"},"label":"Définir la stratégie de l’expérience client","processId":"cmk3yqfh3007sst0bji27nu5b","linkedProcessId":"cmk3yqfh3007sst0bji27nu5b","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":54.90325362432446,"y":154.7575112396543}	PROCESS	cmk3yqfh3007sst0bji27nu5b	2026-01-07 11:56:35.46	2026-01-08 08:16:11.15
cmk431cir0007iy3671yvhb5n	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-domainGroup-0-0	SUBFLOW	Pilotage et Stratégie RH	{"originalType":"domainGroup","description":"Processus de direction et d'orientation stratégique des ressources humaines","width":400,"height":320,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Pilotage et Stratégie RH","processId":null}	{"x":100,"y":100}	\N	\N	2026-01-07 13:57:03.267	2026-01-07 13:58:57.251
cmk431cir0009iy369hwc55s4	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-domainGroup-0-1	SUBFLOW	Acquisition et Intégration des Talents	{"originalType":"domainGroup","description":"Processus liés au recrutement et à l'accueil des nouveaux collaborateurs","width":400,"height":320,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Acquisition et Intégration des Talents","processId":null}	{"x":600,"y":100}	\N	\N	2026-01-07 13:57:03.267	2026-01-07 13:58:57.251
cmk431cir000biy3670a3fd9j	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-domainGroup-0-2	SUBFLOW	Développement et Performance	{"originalType":"domainGroup","description":"Processus de développement des compétences et d'évaluation de la performance","width":400,"height":320,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Développement et Performance","processId":null}	{"x":1100,"y":100}	\N	\N	2026-01-07 13:57:03.267	2026-01-07 13:58:57.251
cmk431cis000fiy369dj1wa97	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-domainGroup-0-4	SUBFLOW	Relations Sociales et Qualité de Vie	{"originalType":"domainGroup","description":"Processus de dialogue social et d'amélioration des conditions de travail","width":400,"height":320,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Relations Sociales et Qualité de Vie","processId":null}	{"x":2100,"y":100}	\N	\N	2026-01-07 13:57:03.267	2026-01-07 13:58:57.251
cmk431dc1001riy36bcjull0u	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-0-process-0	PROCESS	Définition de la stratégie RH	{"originalType":"managementProcess","description":"Élaboration et mise à jour de la stratégie RH en alignement avec la stratégie d'entreprise","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-0","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Définition de la stratégie RH","processId":"cmk431cng000qiy36qgi8teod","linkedProcessId":"cmk431cng000qiy36qgi8teod","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":100}	PROCESS	cmk431cng000qiy36qgi8teod	2026-01-07 13:57:04.321	2026-01-07 13:58:57.251
cmk431dc6001viy36ik6q7mce	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-1-process-0	PROCESS	Recrutement et sélection	{"originalType":"mainProcess","description":"Identification, attraction et sélection des candidats adaptés aux postes","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-1","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Recrutement et sélection","processId":"cmk431cng000siy36af9r0nd0","linkedProcessId":"cmk431cng000siy36af9r0nd0","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":100}	PROCESS	cmk431cng000siy36af9r0nd0	2026-01-07 13:57:04.322	2026-01-07 13:58:57.251
cmk431ddh001ziy36hait2on7	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-0-process-1	PROCESS	Pilotage de la performance RH	{"originalType":"managementProcess","description":"Suivi des indicateurs RH et analyse de la performance des processus","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-0","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Pilotage de la performance RH","processId":"cmk431cnx0017iy36uxeju3ss","linkedProcessId":"cmk431cnx0017iy36uxeju3ss","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":200,"y":100}	PROCESS	cmk431cnx0017iy36uxeju3ss	2026-01-07 13:57:04.374	2026-01-07 13:58:57.251
cmk431ddk0021iy36q7bdhfmg	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-0-process-2	PROCESS	Gestion prévisionnelle des emplois et compétences	{"originalType":"managementProcess","description":"Anticipation des besoins en compétences et planification des effectifs","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-0","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Gestion prévisionnelle des emplois et compétences","processId":"cmk431cnh000yiy361e4bbrh2","linkedProcessId":"cmk431cnh000yiy361e4bbrh2","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":200}	PROCESS	cmk431cnh000yiy361e4bbrh2	2026-01-07 13:57:04.375	2026-01-07 13:58:57.251
cmk47goyg0033li17osxrivgl	cmk3vikfa000411vqey42lphr	domainGroup-1767801489255	SUBFLOW	Piloter l’expérience client 	{"originalType":"domainGroup","width":648,"height":322,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Piloter l’expérience client ","processId":null,"isHighlighted":false}	{"x":19.37302288879027,"y":164.1956808831397}	\N	\N	2026-01-07 16:00:57.688	2026-01-08 09:06:44.73
cmk431df10024iy36lh5cjmm7	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-1-process-1	PROCESS	Intégration et onboarding	{"originalType":"mainProcess","description":"Accueil et intégration des nouveaux collaborateurs dans l'organisation","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-1","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Intégration et onboarding","processId":"cmk431cnh000wiy36034htlqe","linkedProcessId":"cmk431cnh000wiy36034htlqe","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":200,"y":100}	PROCESS	cmk431cnh000wiy36034htlqe	2026-01-07 13:57:04.376	2026-01-07 13:58:57.251
cmk431dfg002diy360cergorg	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-1-process-2	PROCESS	Gestion de la marque employeur	{"originalType":"supportProcess","description":"Développement et promotion de l'image de l'entreprise comme employeur","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-1","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Gestion de la marque employeur","processId":"cmk431cni0010iy363b0f47p8","linkedProcessId":"cmk431cni0010iy363b0f47p8","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":200}	PROCESS	cmk431cni0010iy363b0f47p8	2026-01-07 13:57:04.428	2026-01-07 13:58:57.251
cmk431dg5002uiy36nwbmo8of	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-2-process-1	PROCESS	Évaluation de la performance	{"originalType":"mainProcess","description":"Processus d'évaluation annuelle et de suivi de la performance individuelle","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-2","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Évaluation de la performance","processId":"cmk431cnh000viy36besokaga","linkedProcessId":"cmk431cnh000viy36besokaga","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":100}	PROCESS	cmk431cnh000viy36besokaga	2026-01-07 13:57:04.429	2026-01-07 13:58:57.251
cmk431dg7002wiy365afg4m9s	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-4-process-0	PROCESS	Dialogue social et relations syndicales	{"originalType":"mainProcess","description":"Animation du dialogue avec les représentants du personnel et négociations","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-4","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Dialogue social et relations syndicales","processId":"cmk431cnt0013iy36ttst5zk3","linkedProcessId":"cmk431cnt0013iy36ttst5zk3","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":100}	PROCESS	cmk431cnt0013iy36ttst5zk3	2026-01-07 13:57:04.434	2026-01-07 13:58:57.251
cmk431dg8002yiy364wodoq2c	cmk431cfm0004iy36ucdi25x5	ai-1767794223207-vgu1t6t-ai-1767794223207-vgu1t6t-domainGroup-0-4-process-2	PROCESS	Qualité de vie au travail	{"originalType":"supportProcess","description":"Amélioration des conditions de travail et du bien-être des collaborateurs","width":140,"height":80,"parentNodeId":"ai-1767794223207-vgu1t6t-domainGroup-0-4","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Qualité de vie au travail","processId":"cmk431cnv0015iy3688h7kn6l","linkedProcessId":"cmk431cnv0015iy3688h7kn6l","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":200,"y":100}	PROCESS	cmk431cnv0015iy3688h7kn6l	2026-01-07 13:57:04.444	2026-01-07 13:58:57.251
cmk4331dv003uiy36032rbzh2	cmk431cfm0004iy36ucdi25x5	mainProcess-ai-1767794290552-0	PROCESS	Analyser la performance avec COPC	{"originalType":"mainProcess","width":280,"height":117,"parentNodeId":"domainGroup-1767794256683","isConnectable":true,"isDraggable":true,"isSelectable":true,"label":"Analyser la performance avec COPC","linkedProcessId":"cmk431dfo002oiy360l2cl36h","linkedProcessType":"process","linkedProcessTitle":"Gestion des carrières et mobilité","linkedProcessCode":"PROC-1767794223223-8-U3UT","linkedProcessFlowType":"FLOW"}	{"x":501.7143087548448,"y":116.2465159604249}	PROCESS	cmk4331d2003miy366kil00l3	2026-01-07 13:58:22.143	2026-01-07 13:58:57.251
cmk4331dn003siy36ihipnxdu	cmk431cfm0004iy36ucdi25x5	mainProcess-ai-1767794290552-1	PROCESS	Améliorer les processus avec Lean Six Sigma	{"originalType":"mainProcess","width":239,"height":126,"parentNodeId":"domainGroup-1767794256683","isConnectable":true,"isDraggable":true,"isSelectable":true,"label":"Améliorer les processus avec Lean Six Sigma"}	{"x":127.1720345342634,"y":117.3697739406375}	PROCESS	cmk4331d0003jiy36wcsva2kq	2026-01-07 13:58:22.139	2026-01-07 13:58:57.251
cmk43qzfi009diy36gxpjwkir	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-userTask-0	ACTION	Valider la charte projet	{"originalType":"userTask","description":"Validation formelle de la charte projet par le sponsor","width":196,"height":129,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Valider la charte projet","procedureId":null}	{"x":1645.647901446649,"y":171.5242787399341}	\N	\N	2026-01-07 14:16:59.358	2026-01-07 14:18:39.246
cmk43qzfp009jiy36ibbdmwko	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-procedure-1	PROCEDURE	Mesurer la performance actuelle	{"originalType":"procedure","description":"Collecter les données de performance et établir l'état initial du processus","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Mesurer la performance actuelle","procedureId":"cmk43qzfl009fiy36afejhuxb"}	{"x":1993.839591370813,"y":196.220236896585}	PROCEDURE	cmk43qzfl009fiy36afejhuxb	2026-01-07 14:16:59.366	2026-01-07 14:18:39.261
cmk43qzfr009liy36wx7b2zvg	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-scriptTask-1	ACTION	Calculer les indicateurs	{"originalType":"scriptTask","description":"Calcul automatique des KPIs et métriques de performance","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Calculer les indicateurs","procedureId":null}	{"x":2325.645118957797,"y":210.0793682757732}	\N	\N	2026-01-07 14:16:59.368	2026-01-07 14:18:39.265
cmk43qzgb009riy361zub7jv0	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-procedure-2	PROCEDURE	Analyser les causes racines	{"originalType":"procedure","description":"Identifier et analyser les causes des problèmes et inefficacités","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Analyser les causes racines","procedureId":"cmk43qzfu009niy36ungg3lqz"}	{"x":3525,"y":282.5}	PROCEDURE	cmk43qzfu009niy36ungg3lqz	2026-01-07 14:16:59.378	2026-01-07 14:18:39.27
cmk43qzge009tiy36e8k4rsy5	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-userTask-2	ACTION	Analyser les données	{"originalType":"userTask","description":"Analyse statistique des données collectées par l'équipe","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Analyser les données","procedureId":null}	{"x":2676.904277710952,"y":-22.97442229733903}	\N	\N	2026-01-07 14:16:59.39	2026-01-07 14:18:39.283
cmk43qzgm009ziy36uemvshxr	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-procedure-3	PROCEDURE	Innover et optimiser	{"originalType":"procedure","description":"Concevoir et développer les solutions d'amélioration","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Innover et optimiser","procedureId":"cmk43qzgh009viy362ywrg8zs"}	{"x":2929.508664944952,"y":-36.62725132526904}	PROCEDURE	cmk43qzgh009viy362ywrg8zs	2026-01-07 14:16:59.399	2026-01-07 14:18:39.302
cmk43qzgq00a1iy36tdsv0785	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-manualTask-3	ACTION	Tester les solutions	{"originalType":"manualTask","description":"Tests pilotes manuels des solutions proposées","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Tester les solutions","procedureId":null}	{"x":3130.518227383056,"y":177.9539827957824}	\N	\N	2026-01-07 14:16:59.403	2026-01-07 14:18:39.308
cmk43qzgs00a3iy363u82n7hq	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-gateway-0	DECISION	Solutions efficaces ?	{"originalType":"exclusiveGateway","description":"Évaluation de l'efficacité des solutions testées","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Solutions efficaces ?","procedureId":null}	{"x":3370,"y":200}	\N	\N	2026-01-07 14:16:59.405	2026-01-07 14:18:39.312
cmk43qzh300a9iy364i6gfpuk	cmk43qzd40092iy367jk05vb3	ai-1767795419318-kvb32y8-procedure-4	PROCEDURE	Contrôler et pérenniser	{"originalType":"procedure","description":"Mettre en place les contrôles et assurer la pérennité des améliorations","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Contrôler et pérenniser","procedureId":"cmk43qzgz00a5iy369o1l9q7y"}	{"x":3505.893451756345,"y":-20.95769634361863}	PROCEDURE	cmk43qzgz00a5iy369o1l9q7y	2026-01-07 14:16:59.415	2026-01-07 14:18:39.316
cmk47gplj004ali17ticu38ap	cmk3vikfa000411vqey42lphr	mainProcess-ai-1767801636790-0	PROCESS	Analyser la performance avec COPC	{"originalType":"mainProcess","width":225,"height":86,"parentNodeId":"domainGroup-1767801603905","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Analyser la performance avec COPC","processId":"cmk47gp2i003ili17ariri9ar","linkedProcessId":"cmk47gp2i003ili17ariri9ar","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":39.0741252726007,"y":87.96362854380891}	PROCESS	cmk47gp2i003ili17ariri9ar	2026-01-07 16:00:58.518	2026-01-08 09:06:44.73
cmk47gpll004cli17pa0375l4	cmk3vikfa000411vqey42lphr	mainProcess-ai-1767801636790-1	PROCESS	Améliorer les processus avec Lean Six Sigma	{"originalType":"mainProcess","width":230,"height":81,"parentNodeId":"domainGroup-1767801603905","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Améliorer les processus avec Lean Six Sigma","processId":"cmk47gp2e003bli17d5sd51n9","linkedProcessId":"cmk47gp2e003bli17d5sd51n9","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":304.623844196123,"y":84.26012963421158}	PROCESS	cmk47gp2e003bli17d5sd51n9	2026-01-07 16:00:58.518	2026-01-08 09:06:44.73
cmk46w0lo0007li171cw3aqpe	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-startEvent	START	Demande d'analyse	{"originalType":"startEvent","description":"Déclenchement d'une nouvelle analyse de données clients","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":100,"y":200}	\N	\N	2026-01-07 15:44:53.004	2026-01-07 15:44:53.004
cmk46w0m00009li17h419soxj	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-gateway-0	DECISION	Collecte parallèle	{"originalType":"parallelGateway","description":"Démarrage simultané de la collecte depuis plusieurs sources","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":250,"y":200}	\N	\N	2026-01-07 15:44:53.017	2026-01-07 15:44:53.017
cmk46w0ml000fli17hqvcgw0y	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-procedure-0	PROCEDURE	Collecter les données clients	{"originalType":"procedure","description":"Rassembler toutes les données clients depuis les différentes sources","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":405,"y":192.5}	PROCEDURE	cmk46w0m9000bli1735jkbcgj	2026-01-07 15:44:53.037	2026-01-07 15:44:53.037
cmk46w0mq000hli17bxrhpv10	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-serviceTask-0	ACTION	Extraire données CRM	{"originalType":"serviceTask","description":"Appel API pour récupérer les données du système CRM","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":405,"y":17.5}	\N	\N	2026-01-07 15:44:53.042	2026-01-07 15:44:53.042
cmk46w0mt000jli17ki71f51a	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-serviceTask-1	ACTION	Extraire données web analytics	{"originalType":"serviceTask","description":"Récupération automatique des données de navigation","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":405,"y":377.5}	\N	\N	2026-01-07 15:44:53.045	2026-01-07 15:44:53.045
cmk46w0mw000lli17ys6li31f	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-gateway-1	DECISION	Convergence données	{"originalType":"parallelGateway","description":"Synchronisation des données collectées","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":1570,"y":200}	\N	\N	2026-01-07 15:44:53.048	2026-01-07 15:44:53.048
cmk46w0n9000rli17bef3nx6o	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-procedure-1	PROCEDURE	Nettoyer et préparer les données	{"originalType":"procedure","description":"Standardiser et valider la qualité des données collectées","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":1750,"y":200}	PROCEDURE	cmk46w0n0000nli17gmx5g8gg	2026-01-07 15:44:53.061	2026-01-07 15:44:53.061
cmk46w0nb000tli17eh5jx8dj	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-timerEvent-0	ACTION	Attente traitement	{"originalType":"timerEvent","description":"Délai nécessaire pour le traitement des données","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":2170,"y":200}	\N	\N	2026-01-07 15:44:53.063	2026-01-07 15:44:53.063
cmk46w0ne000vli17ih8rcyqe	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-gateway-2	DECISION	Analyse parallèle	{"originalType":"parallelGateway","description":"Démarrage simultané des différentes analyses","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":2320,"y":200}	\N	\N	2026-01-07 15:44:53.066	2026-01-07 15:44:53.066
cmk46w0no0011li17eymowfn8	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-procedure-2	PROCEDURE	Analyser les comportements clients	{"originalType":"procedure","description":"Identifier les patterns et tendances dans les données clients","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":2475,"y":192.5}	PROCEDURE	cmk46w0ni000xli17lza8nmmp	2026-01-07 15:44:53.077	2026-01-07 15:44:53.077
cmk46w0nr0013li17wxf90jfy	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-scriptTask-2	ACTION	Calculer scores de segmentation	{"originalType":"scriptTask","description":"Exécution d'algorithmes de scoring client","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":2475,"y":17.5}	\N	\N	2026-01-07 15:44:53.079	2026-01-07 15:44:53.079
cmk46w0nt0015li17z00zysn6	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-scriptTask-3	ACTION	Identifier tendances d'achat	{"originalType":"scriptTask","description":"Analyse prédictive des comportements d'achat","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":2475,"y":377.5}	\N	\N	2026-01-07 15:44:53.082	2026-01-07 15:44:53.082
cmk46w0nw0017li17xl3ac8oe	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-gateway-3	DECISION	Convergence analyses	{"originalType":"parallelGateway","description":"Synchronisation des résultats d'analyse","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":3640,"y":200}	\N	\N	2026-01-07 15:44:53.084	2026-01-07 15:44:53.084
cmk46w0o4001dli17wmn6452z	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-procedure-3	PROCEDURE	Générer les recommandations	{"originalType":"procedure","description":"Produire des insights et recommandations actionables","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":3820,"y":200}	PROCEDURE	cmk46w0o10019li17v7n8nw4s	2026-01-07 15:44:53.093	2026-01-07 15:44:53.093
cmk46w0o8001fli17r3jw6ly6	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-gateway-4	DECISION	Validation requise ?	{"originalType":"exclusiveGateway","description":"Vérification si une validation métier est nécessaire","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":4240,"y":200}	\N	\N	2026-01-07 15:44:53.096	2026-01-07 15:44:53.096
cmk46w0on001lli17lpkednvr	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-procedure-4	PROCEDURE	Valider et diffuser les résultats	{"originalType":"procedure","description":"Contrôler la qualité des analyses et partager les résultats","width":160,"height":70,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":4395,"y":282.5}	PROCEDURE	cmk46w0oc001hli178jpt3yai	2026-01-07 15:44:53.111	2026-01-07 15:44:53.111
cmk46w0op001nli17rouzkurm	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-userTask-4	ACTION	Valider les insights	{"originalType":"userTask","description":"Validation métier des recommandations générées","width":140,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":4395,"y":107.5}	\N	\N	2026-01-07 15:44:53.113	2026-01-07 15:44:53.113
cmk46w0os001pli171f592ycm	cmk46w0jq0004li178s471mcd	ai-1767800692976-347rard-endEvent	END	Analyse terminée	{"originalType":"endEvent","description":"Fin du processus d'analyse avec résultats validés","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true}	{"x":5200,"y":200}	\N	\N	2026-01-07 15:44:53.116	2026-01-07 15:44:53.116
cmk47lowp0065li170efnno1z	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-procedure-1	PROCEDURE	Définir la stratégie de déploiement	{"originalType":"procedure","description":"Élaborer une stratégie adaptée au contexte et aux objectifs de l'organisation","width":205,"height":80,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px","backgroundColor":"#9ca3af"},"label":"Définir la stratégie de déploiement","procedureId":"cmk47lowj0061li17vscxiwn1"}	{"x":289.7795073301037,"y":270.6174201591289}	PROCEDURE	cmk47lowj0061li17vscxiwn1	2026-01-07 16:04:50.905	2026-01-08 09:01:35.142
cmk47lox4006bli17792evgri	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-procedure-2	PROCEDURE	Former les équipes	{"originalType":"procedure","description":"Organiser et dispenser les formations nécessaires aux équipes impliquées","width":191,"height":80,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"10px","backgroundColor":"#ffedd5"},"label":"Former les équipes","procedureId":"cmk47lowv0067li1793aztr9z"}	{"x":290.8319624120606,"y":432.9708797743057}	PROCEDURE	cmk47lowv0067li1793aztr9z	2026-01-07 16:04:50.92	2026-01-08 09:01:35.147
cmk47lox7006dli17cji6tyvg	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-timerEvent-0	ACTION	Délai de formation	{"originalType":"timerEvent","description":"Attente de 2 semaines pour permettre la planification des formations","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px"},"label":"Délai de formation","procedureId":null}	{"x":352.0934046822416,"y":562.1207190868976}	\N	\N	2026-01-07 16:04:50.923	2026-01-08 09:01:35.154
cmk47loxi006jli17kry7gfku	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-procedure-3	PROCEDURE	Accompagner l'implémentation	{"originalType":"procedure","description":"Soutenir les équipes dans la mise en œuvre concrète des processus","width":218,"height":82,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"10px","backgroundColor":"#ffedd5"},"label":"Accompagner l'implémentation","procedureId":"cmk47loxd006fli1764a73mq7"}	{"x":276.5020166497215,"y":657.9959011539077}	PROCEDURE	cmk47loxd006fli1764a73mq7	2026-01-07 16:04:50.935	2026-01-08 09:01:35.161
cmk47loxl006lli17u2cenq4n	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-gateway-0	DECISION	Validation OK ?	{"originalType":"exclusiveGateway","description":"Décision basée sur la validation de l'évaluation de maturité","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Validation OK ?","procedureId":null}	{"x":347.3711870898117,"y":842.4830706167303}	\N	\N	2026-01-07 16:04:50.938	2026-01-08 09:01:35.166
cmk47loxo006nli17m46l5359	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-userTask-0	ACTION	Valider l'évaluation de maturité	{"originalType":"userTask","description":"Validation par la direction de l'évaluation réalisée","width":182,"height":60,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"10px","backgroundColor":"#9ca3af","color":"#ffffff","borderColor":"#ff6600"},"label":"Valider l'évaluation de maturité","procedureId":null}	{"x":66.76388367172478,"y":897.3126406332883}	\N	\N	2026-01-07 16:04:50.94	2026-01-08 09:01:35.171
cmk47loxz006tli17jc9f51h1	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-procedure-4	PROCEDURE	Suivre et ajuster	{"originalType":"procedure","description":"Monitorer l'adoption et apporter les ajustements nécessaires","width":161,"height":80,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"10px"},"label":"Suivre et ajuster","procedureId":"cmk47loxs006pli174sah4nbz"}	{"x":296.2936657825632,"y":1076.726746886332}	PROCEDURE	cmk47loxs006pli174sah4nbz	2026-01-07 16:04:50.951	2026-01-08 09:01:35.176
cmk3uz78x008bq6odt9moxkmc	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767780563531	SUBFLOW	Analyser les centres d’appel	{"originalType":"domainGroup","width":412,"height":260,"parentNodeId":"domainGroup-1767778035039","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontWeight":"bold","backgroundColor":"#ffedd5"},"label":"Analyser les centres d’appel","processId":null,"isHighlighted":false}	{"x":508.8134387385941,"y":97}	\N	\N	2026-01-07 10:11:26.193	2026-01-08 08:16:11.15
cmk47gplh0048li17131gtk3k	cmk3vikfa000411vqey42lphr	mainProcess-ai-1767801592159-0	PROCESS	Mesurer la recommandation des clients	{"originalType":"mainProcess","width":247,"height":82,"parentNodeId":"domainGroup-1767801489255","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Mesurer la recommandation des clients","processId":"cmk47gp40003qli17k66uc6rj","linkedProcessId":"cmk47gp40003qli17k66uc6rj","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":100}	PROCESS	cmk47gp40003qli17k66uc6rj	2026-01-07 16:00:58.517	2026-01-08 09:06:44.73
cmk47gpgn0046li172xt5yuym	cmk3vikfa000411vqey42lphr	mainProcess-ai-1767801592159-1	PROCESS	Analyser l’expérience  globale des clients des filiales	{"originalType":"mainProcess","width":227,"height":86,"parentNodeId":"domainGroup-1767801489255","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Analyser l’expérience  globale des clients des filiales","processId":"cmk47gp250038li17ff6csg0d","linkedProcessId":"cmk47gp250038li17ff6csg0d","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":363.8798267496794,"y":98.14825054520134}	PROCESS	cmk47gp250038li17ff6csg0d	2026-01-07 16:00:58.343	2026-01-08 09:06:44.73
cmk47goyh0035li17oaoi8hw2	cmk3vikfa000411vqey42lphr	domainGroup-1767801603905	SUBFLOW	Proposer des méthodes d’amélioration	{"originalType":"domainGroup","width":880,"height":320,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Proposer des méthodes d’amélioration","processId":null,"isHighlighted":false}	{"x":57.21206116715388,"y":620.4287686559479}	\N	\N	2026-01-07 16:00:57.688	2026-01-08 09:06:44.73
cmk47gpln004gli17gi1kenqz	cmk3vikfa000411vqey42lphr	mainProcess-ai-1767801636790-3	PROCESS	Définir et améliorer les Parcours Client	{"originalType":"mainProcess","width":266,"height":80,"parentNodeId":"domainGroup-1767801603905","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Définir et améliorer les Parcours Client","processId":"cmk47gp2y003lli17fbalp3kh","linkedProcessId":"cmk47gp2y003lli17fbalp3kh","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":210.1846220013924}	PROCESS	cmk47gp2y003lli17fbalp3kh	2026-01-07 16:00:58.519	2026-01-08 09:06:44.73
cmk47jexz004lli17ghz3ztzv	cmk3vikfa000411vqey42lphr	domainGroup-1767801660947	SUBFLOW	Analyser l’expérience des points de contact	{"originalType":"domainGroup","width":1020,"height":630,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Analyser l’expérience des points de contact","processId":null}	{"x":60.95823376113879,"y":1018.049509701996}	\N	\N	2026-01-07 16:03:04.679	2026-01-08 09:06:44.73
cmk47jexz004nli17r42sus7f	cmk3vikfa000411vqey42lphr	domainGroup-1767801696038	SUBFLOW	Analyser les canaux digitaux	{"originalType":"domainGroup","width":720,"height":320,"parentNodeId":"domainGroup-1767801660947","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Analyser les canaux digitaux","processId":null}	{"x":40,"y":100}	\N	\N	2026-01-07 16:03:04.679	2026-01-08 09:06:44.73
cmk3uz7da009mq6odvukjan0k	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767780366667	PROCESS	Analymaturitéser la digitale	{"originalType":"mainProcess","width":195,"height":80,"parentNodeId":"domainGroup-1767780318877","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px"},"label":"Analymaturitéser la digitale","processId":"cmk3uz7am008gq6od890gf6g0","linkedProcessId":"cmk3uz7am008gq6od890gf6g0","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":20.94629611620306,"y":74.69034549893149}	PROCESS	cmk3uz7am008gq6od890gf6g0	2026-01-07 10:11:26.351	2026-01-08 08:16:11.15
cmk3uz78x0087q6od2i2du6sm	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767780318877	SUBFLOW	Analyser les canaux digitaux	{"originalType":"domainGroup","width":452,"height":264,"parentNodeId":"domainGroup-1767778035039","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#ffedd5"},"label":"Analyser les canaux digitaux","processId":null,"isHighlighted":false}	{"x":41.1994275154448,"y":97.92934969531507}	\N	\N	2026-01-07 10:11:26.193	2026-01-08 08:16:11.15
cmk3s7nyj003zq6odwqvkbiu6	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767775925193	SUBFLOW	Définir la stratégie vente et distribution	{"originalType":"domainGroup","width":494,"height":209,"parentNodeId":"domainGroup-1767775839904","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#3b82f6","color":"#ffffff"},"label":"Définir la stratégie vente et distribution","processId":null,"isHighlighted":false}	{"x":990.3971695204543,"y":121.5256918061808}	\N	\N	2026-01-07 08:54:02.251	2026-01-08 08:16:11.15
cmk3vd29k00akq6odtlwqaf52	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767781231423	PROCESS	Mesurer la recommandation des clients	{"originalType":"mainProcess","width":228,"height":104,"parentNodeId":"domainGroup-1767775976989","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"backgroundColor":"#ffedd5"},"label":"Mesurer la recommandation des clients","processId":"cmk3vd28h00abq6odrcwyt914","linkedProcessId":"cmk3vd28h00abq6odrcwyt914","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":62.40465943363097,"y":69.18770788614586}	PROCESS	cmk3vd28h00abq6odrcwyt914	2026-01-07 10:22:12.92	2026-01-08 08:16:11.15
cmk47jey0004pli17ss5becos	cmk3vikfa000411vqey42lphr	domainGroup-1767801696039	SUBFLOW	Groupe 2	{"originalType":"domainGroup","width":200,"height":150,"parentNodeId":"domainGroup-1767801660947","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Groupe 2","processId":null}	{"x":780,"y":185}	\N	\N	2026-01-07 16:03:04.679	2026-01-08 09:06:44.73
cmk47jey0004rli1752n15ot8	cmk3vikfa000411vqey42lphr	domainGroup-1767801696040	SUBFLOW	Groupe 3	{"originalType":"domainGroup","width":200,"height":150,"parentNodeId":"domainGroup-1767801660947","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Groupe 3","processId":null}	{"x":300,"y":440}	\N	\N	2026-01-07 16:03:04.679	2026-01-08 09:06:44.73
cmk47jey0004tli17bugbhzw9	cmk3vikfa000411vqey42lphr	domainGroup-1767801696041	SUBFLOW	Groupe 4	{"originalType":"domainGroup","width":200,"height":150,"parentNodeId":"domainGroup-1767801660947","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Groupe 4","processId":null}	{"x":780,"y":440}	\N	\N	2026-01-07 16:03:04.679	2026-01-08 09:06:44.73
cmk47jf3h005hli1780eeu49y	cmk3vikfa000411vqey42lphr	mainProcess-1767801751430	PROCESS	Analymaturitéser la digitale	{"originalType":"mainProcess","width":140,"height":80,"parentNodeId":"domainGroup-1767801696038","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Analymaturitéser la digitale","processId":"cmk47jezb0052li175vtjkevz","linkedProcessId":"cmk47jezb0052li175vtjkevz","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":100}	PROCESS	cmk47jezb0052li175vtjkevz	2026-01-07 16:03:04.877	2026-01-08 09:06:44.73
cmk47jf3j005jli17dji6z2hr	cmk3vikfa000411vqey42lphr	mainProcess-1767801751431	PROCESS	Processus 2	{"originalType":"mainProcess","width":140,"height":80,"parentNodeId":"domainGroup-1767801696038","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Processus 2","processId":"cmk47jeyt004wli17r8dbearx","linkedProcessId":"cmk47jeyt004wli17r8dbearx","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":200,"y":100}	PROCESS	cmk47jeyt004wli17r8dbearx	2026-01-07 16:03:04.877	2026-01-08 09:06:44.73
cmk47jf3e005fli17tx4o7l31	cmk3vikfa000411vqey42lphr	mainProcess-1767801751432	PROCESS	Processus 3	{"originalType":"mainProcess","width":140,"height":80,"parentNodeId":"domainGroup-1767801696038","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Processus 3","processId":"cmk47jezh0055li17ug3xlvfn","linkedProcessId":"cmk47jezh0055li17ug3xlvfn","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":40,"y":200}	PROCESS	cmk47jezh0055li17ug3xlvfn	2026-01-07 16:03:04.874	2026-01-08 09:06:44.73
cmk3vd29o00amq6odp508bk3s	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767781308525	PROCESS	Analyser l’expérience  globale des clients des filiales	{"originalType":"mainProcess","width":214,"height":100,"parentNodeId":"domainGroup-1767775976989","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center"},"label":"Analyser l’expérience  globale des clients des filiales","processId":"cmk3vd28n00aeq6odxorv1cxw","linkedProcessId":"cmk3vd28n00aeq6odxorv1cxw","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":331.6148538097179,"y":62.57925831608691}	PROCESS	cmk3vd28n00aeq6odxorv1cxw	2026-01-07 10:22:12.923	2026-01-08 08:16:11.15
cmk47lowc005zli179o7bafpx	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-procedure-0	PROCEDURE	Évaluer la maturité organisationnelle	{"originalType":"procedure","description":"Analyser le niveau de maturité actuel de l'organisation en matière de gestion par processus","width":180,"height":80,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontSize":"10px"},"label":"Évaluer la maturité organisationnelle","procedureId":"cmk47low5005vli17cpd2x9p1"}	{"x":299.6891046975028,"y":138.7480134126218}	PROCEDURE	cmk47low5005vli17cpd2x9p1	2026-01-07 16:04:50.893	2026-01-08 09:01:35.191
cmk47loy6006xli17jqlvqqfv	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-gateway-1	DECISION	Indicateurs satisfaisants ?	{"originalType":"exclusiveGateway","description":"Évaluation des indicateurs d'adoption calculés","width":55,"height":55,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Indicateurs satisfaisants ?","procedureId":null}	{"x":345.1994027873631,"y":1512.006436649808}	\N	\N	2026-01-07 16:04:50.959	2026-01-08 09:01:35.196
cmk47loy9006zli17s5jv2hkf	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-endEvent	END	Déploiement finalisé	{"originalType":"endEvent","description":"Fin du processus avec déploiement réussi de la gestion par processus","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{},"label":"Déploiement finalisé","procedureId":null}	{"x":355.9572591403454,"y":1699.629874796827}	\N	\N	2026-01-07 16:04:50.961	2026-01-08 09:01:35.201
cmk47lovx005tli172t4exa4l	cmk47louw005qli17oqnpms5d	ai-1767801890861-40pt4km-startEvent	START	Demande de déploiement	{"originalType":"startEvent","description":"Début du processus suite à une demande de déploiement de la gestion par processus","width":45,"height":45,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontSize":"10px"},"label":"Demande de déploiement","procedureId":null}	{"x":364.7186467927499,"y":31.00000000000003}	\N	\N	2026-01-07 16:04:50.877	2026-01-08 09:01:35.186
cmk3rc6r8003cq6od9sskcxne	cmk2pq1wy002pq6odn9oi97we	text-1767774423803	ACTION	CARTOGRAPHIE DES PCustomer Experience & Operations ROCESSUS DE « Gérer l’Expérience Client Groupe»  	{"originalType":"text","width":1500,"height":113,"isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","fontWeight":"bold","fontSize":"32px"},"label":"CARTOGRAPHIE DES PCustomer Experience & Operations ROCESSUS DE « Gérer l’Expérience Client Groupe»  ","processId":null}	{"x":458.7507373335002,"y":265.8027996107671}	\N	\N	2026-01-07 08:29:33.621	2026-01-08 08:16:11.15
cmk3s7o1i004nq6od8ij40m1e	cmk2pq1wy002pq6odn9oi97we	mainProcess-1767775935321	PROCESS	Définir le plan stratégique de la distribution	{"originalType":"mainProcess","width":264,"height":82,"parentNodeId":"domainGroup-1767775925193","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"textAlign":"center","backgroundColor":"#ffedd5"},"label":"Définir le plan stratégique de la distribution","processId":"cmk3s7nzv0044q6od013hxko5","linkedProcessId":"cmk3s7nzv0044q6od013hxko5","linkedProcessType":"process","linkedProcessFlowType":"FLOW"}	{"x":94.5177977468154,"y":75.66991013933023}	PROCESS	cmk3s7nzv0044q6od013hxko5	2026-01-07 08:54:02.358	2026-01-08 08:16:11.15
cmk3x29po002pst0bkj2tus0x	cmk2pq1wy002pq6odn9oi97we	domainGroup-1767783970841	SUBFLOW	Proposer des outils de gestion des canaux	{"originalType":"domainGroup","width":612.2096423017642,"height":549,"parentNodeId":"domainGroup-1767778029047","isConnectable":true,"isDraggable":true,"isSelectable":true,"style":{"fontWeight":"bold","fontSize":"18px","backgroundColor":"#3b82f6"},"label":"Proposer des outils de gestion des canaux","processId":null,"isHighlighted":false}	{"x":1054.344134930823,"y":87.31113349277848}	\N	\N	2026-01-07 11:09:48.588	2026-01-08 08:16:11.15
\.


--
-- Data for Name: group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_permissions (id, "groupId", resource, action, conditions, "createdAt") FROM stdin;
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name, code, description, color, "isActive", "createdAt", "updatedAt") FROM stdin;
cmjjuyh8j0000vckys3xek0ff	Groupe RH	RH	Ressources Humaines - Gestion du personnel et recrutement	#EA580C	t	2025-12-24 10:15:28.964	2025-12-24 10:15:28.964
cmjjuyh8t0001vckyjal5reu5	Groupe Commercial	COM	Équipe Commerciale - Ventes et relations clients	#10B981	t	2025-12-24 10:15:28.974	2025-12-24 10:15:28.974
cmjjuyh8y0002vckyrsrqg23r	Groupe Qualité	QUAL	Gestion Qualité - Normes et certifications	#3B82F6	t	2025-12-24 10:15:28.978	2025-12-24 10:15:28.978
cmjjuyh910003vcky9e54y5mh	Groupe IT	IT	Informatique - Infrastructure et développement	#8B5CF6	t	2025-12-24 10:15:28.981	2025-12-24 10:15:28.981
cmjjuyh940004vckyej7jzdyj	Groupe Finance	FIN	Finance et Comptabilité	#F59E0B	t	2025-12-24 10:15:28.984	2025-12-24 10:15:28.984
cmjjuyh960005vckyp5gltyjh	Groupe Marketing	MKT	Marketing et Communication	#EC4899	t	2025-12-24 10:15:28.987	2025-12-24 10:15:28.987
\.


--
-- Data for Name: indicators; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.indicators (id, "processId", name, description, formula, target, frequency, unit, "order") FROM stdin;
\.


--
-- Data for Name: journal_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_entries (id, "processId", action, actor, date, comment, "procedureId", "processMapId") FROM stdin;
\.


--
-- Data for Name: linked_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.linked_documents (id, "processId", "procedureId", name, reference, type, url, "filePath", version, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: means; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.means (id, name, "processId", "procedureId", "processMapId") FROM stdin;
\.


--
-- Data for Name: node_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.node_templates (id, name, description, category, "defaultStyle", "defaultSize", icon, thumbnail, "isCustom", "isPublic", "usageCount", "workspaceId", "createdAt", "updatedAt", "createdBy", "nodeType") FROM stdin;
cmjjuyhbh0014vcky9abek47c	Basic Task	Standard process task template	basic	{"border": "2px solid #1976d2", "padding": "10px", "fontSize": 14, "fontWeight": "bold", "borderRadius": 6, "backgroundColor": "#ffffff"}	{"width": 150, "height": 80}	task	\N	f	t	0	cmjjuyh9g0008vckyt3wuzn2b	2025-12-24 10:15:29.07	2025-12-24 10:15:29.07	cmjjuyhac000mvcky4i4382cw	TASK
cmjjuyhbm0016vckyaqqbjlai	Decision Gateway	Decision point in process flow	gateways	{"border": "3px solid #f57c00", "transform": "rotate(45deg)", "borderRadius": 0, "backgroundColor": "#fff3e0"}	{"width": 60, "height": 60}	decision	\N	f	t	0	cmjjuyh9g0008vckyt3wuzn2b	2025-12-24 10:15:29.074	2025-12-24 10:15:29.074	cmjjuyhac000mvcky4i4382cw	EXCLUSIVE_GATEWAY
\.


--
-- Data for Name: nodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nodes (id, label, description, "positionX", "positionY", width, height, "zIndex", "sourcePosition", "targetPosition", "isConnectable", "isDraggable", "isSelectable", style, "className", "backgroundColor", "borderColor", "borderWidth", "borderRadius", "fontSize", "fontColor", "fontWeight", opacity, icon, "iconPosition", "iconSize", "iconColor", "hoverStyle", "selectedStyle", "errorStyle", animation, "animationDuration", transition, "roleId", "subProcessId", "isMacro", "isCollaborative", "linkedDocumentId", "linkedInstructionId", "isRequired", "validationRules", "businessRules", "estimatedDuration", "actualDuration", "slaTime", status, "isHidden", "isLocked", "lastModified", data, metadata, tags, "parentNodeId", "groupId", "layerId", type) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, title, message, "isRead", "createdAt", "readAt", "userId", "processId", "procedureId", "processMapId") FROM stdin;
\.


--
-- Data for Name: procedure_validation_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procedure_validation_requests (id, "procedureId", "requestedById", "validatorId", status, comment, "validatedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: procedures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procedures (id, title, description, code, status, "processId", "workspaceId", "departmentId", objective, scope, "validatedBy", "validatedAt", "effectiveDate", "expirationDate", "createdAt", "updatedAt", "publishedAt", "archivedAt", "createdById") FROM stdin;
cmk3uiucx005tq6od3nhrosys	Définir la stratégie de l'expérience client	Processus stratégique de définition de la stratégie globale d'expérience client	PROC-1767778306244-0-PXO7-PROC-001	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:42.993	2026-01-07 09:58:42.993	\N	\N	cmjjuyha4000kvckyggis8670
cmk3uiude005zq6oddn5lxuw7	Définir le marketing de l'expérience client	Définition du marketing et identification des moments signature	PROC-1767778306244-0-PXO7-PROC-002	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:43.01	2026-01-07 09:58:43.01	\N	\N	cmjjuyha4000kvckyggis8670
cmk3uiudm0065q6odp6538vcn	Définir la stratégie vente et distribution	Définition du plan stratégique de distribution	PROC-1767778306244-0-PXO7-PROC-003	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:43.019	2026-01-07 09:58:43.019	\N	\N	cmjjuyha4000kvckyggis8670
cmk3uiudv006bq6odsvn4qn9i	Piloter l'expérience client	Pilotage global incluant mesure de recommandation et analyse d'expérience	PROC-1767778306244-0-PXO7-PROC-004	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:43.028	2026-01-07 09:58:43.028	\N	\N	cmjjuyha4000kvckyggis8670
cmk3uiue3006hq6od7777wyd5	Analyser l'expérience des points de contact	Analyse des canaux digitaux, physiques et centres d'appel	PROC-1767778306244-0-PXO7-PROC-005	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:43.035	2026-01-07 09:58:43.035	\N	\N	cmjjuyha4000kvckyggis8670
cmk3uiueb006nq6odgewaxx0l	Proposer des recommandations	Propositions de recommandations digitales, commerciales et bonnes pratiques	PROC-1767778306244-0-PXO7-PROC-006	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:43.043	2026-01-07 09:58:43.043	\N	\N	cmjjuyha4000kvckyggis8670
cmk3uiuei006tq6od38nr91k8	Proposer des méthodes d'amélioration	Amélioration des processus avec Lean Six Sigma et Process Mining	PROC-1767778306244-0-PXO7-PROC-007	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:43.05	2026-01-07 09:58:43.05	\N	\N	cmjjuyha4000kvckyggis8670
cmk3uiueq006zq6od0c6gwf9s	Proposer des outils de gestion des canaux	Déploiement d'outils digitaux et de gestion	PROC-1767778306244-0-PXO7-PROC-008	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:43.059	2026-01-07 09:58:43.059	\N	\N	cmjjuyha4000kvckyggis8670
cmk3uiuew0075q6od63421h1s	Animer les communautés	Animation des communautés expérience client, vente, distribution et digitale	PROC-1767778306244-0-PXO7-PROC-009	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:43.064	2026-01-07 09:58:43.064	\N	\N	cmjjuyha4000kvckyggis8670
cmk3uiuf2007bq6odwaaxugul	Gérer les données de l'expérience client	Gestion complète des données de performance et satisfaction client	PROC-1767778306244-0-PXO7-PROC-010	DRAFT	cmk3tk6vw005kq6odsxyebfg4	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 09:58:43.07	2026-01-07 09:58:43.07	\N	\N	cmjjuyha4000kvckyggis8670
cmk43jqxv0045iy36ou13ke23	Préparation de l'évaluation	Collecte des données de performance et préparation des documents d'évaluation	PROC-VALUATION-1599-PROC-001	DRAFT	cmk43jqv9003yiy36jz7z0v2d	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:11:21.763	2026-01-07 14:11:21.763	\N	\N	cmjjuyha4000kvckyggis8670
cmk43jqyo004jiy361g6l54w9	Conduite de l'entretien d'évaluation	Réalisation de l'entretien entre le manager et le collaborateur	PROC-VALUATION-1599-PROC-002	DRAFT	cmk43jqv9003yiy36jz7z0v2d	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:11:21.792	2026-01-07 14:11:21.792	\N	\N	cmjjuyha4000kvckyggis8670
cmk43jqzg004riy36j40yjtqv	Finalisation de l'évaluation	Validation et formalisation des résultats d'évaluation	PROC-VALUATION-1599-PROC-003	DRAFT	cmk43jqv9003yiy36jz7z0v2d	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:11:21.82	2026-01-07 14:11:21.82	\N	\N	cmjjuyha4000kvckyggis8670
cmk43jqzr004ziy36o67x44sx	Définition des objectifs	Établissement des objectifs pour la période suivante	PROC-VALUATION-1599-PROC-004	DRAFT	cmk43jqv9003yiy36jz7z0v2d	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:11:21.831	2026-01-07 14:11:21.831	\N	\N	cmjjuyha4000kvckyggis8670
cmk43jr060057iy367ox3srx6	Suivi et accompagnement	Mise en place du suivi régulier et des actions d'accompagnement	PROC-VALUATION-1599-PROC-005	DRAFT	cmk43jqv9003yiy36jz7z0v2d	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:11:21.846	2026-01-07 14:11:21.846	\N	\N	cmjjuyha4000kvckyggis8670
cmk43laep006liy36pd7sp0yv	Planification de l'évaluation	Planifier la campagne d'évaluation et définir le calendrier	PROC-PROCESSUS-3522-PROC-001	DRAFT	cmk43lac3006eiy36kzjh2k4g	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:12:33.649	2026-01-07 14:12:33.649	\N	\N	cmjjuyha4000kvckyggis8670
cmk43laf3006tiy36y2w6nn9z	Auto-évaluation employé	L'employé réalise son auto-évaluation sur ses objectifs et compétences	PROC-PROCESSUS-3522-PROC-002	DRAFT	cmk43lac3006eiy36kzjh2k4g	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:12:33.663	2026-01-07 14:12:33.663	\N	\N	cmjjuyha4000kvckyggis8670
cmk43lafb006ziy36r63mdkd7	Évaluation managériale	Le manager évalue les performances et compétences de l'employé	PROC-PROCESSUS-3522-PROC-003	DRAFT	cmk43lac3006eiy36kzjh2k4g	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:12:33.671	2026-01-07 14:12:33.671	\N	\N	cmjjuyha4000kvckyggis8670
cmk43lafq007biy36fy33rpvv	Entretien d'évaluation	Entretien entre le manager et l'employé pour discuter des évaluations	PROC-PROCESSUS-3522-PROC-004	DRAFT	cmk43lac3006eiy36kzjh2k4g	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:12:33.686	2026-01-07 14:12:33.686	\N	\N	cmjjuyha4000kvckyggis8670
cmk43lag1007hiy36j9c9n6iw	Validation RH	Validation finale par les Ressources Humaines	PROC-PROCESSUS-3522-PROC-005	DRAFT	cmk43lac3006eiy36kzjh2k4g	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:12:33.698	2026-01-07 14:12:33.698	\N	\N	cmjjuyha4000kvckyggis8670
cmk43lagh007riy36oesb3zgn	Définition objectifs N+1	Établissement des objectifs pour l'année suivante	PROC-PROCESSUS-3522-PROC-006	DRAFT	cmk43lac3006eiy36kzjh2k4g	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:12:33.713	2026-01-07 14:12:33.713	\N	\N	cmjjuyha4000kvckyggis8670
cmk43qzf80097iy36wwkssu2t	Définir le projet d'amélioration	Identifier le processus à améliorer, définir les objectifs et constituer l'équipe projet	PROC-AMLIORER-9219-PROC-001	DRAFT	cmk43qzcs0090iy36wvirf09b	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:16:59.349	2026-01-07 14:16:59.349	\N	\N	cmjjuyha4000kvckyggis8670
cmk43qzfl009fiy36afejhuxb	Mesurer la performance actuelle	Collecter les données de performance et établir l'état initial du processus	PROC-AMLIORER-9219-PROC-002	DRAFT	cmk43qzcs0090iy36wvirf09b	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:16:59.361	2026-01-07 14:16:59.361	\N	\N	cmjjuyha4000kvckyggis8670
cmk43qzfu009niy36ungg3lqz	Analyser les causes racines	Identifier et analyser les causes des problèmes et inefficacités	PROC-AMLIORER-9219-PROC-003	DRAFT	cmk43qzcs0090iy36wvirf09b	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:16:59.37	2026-01-07 14:16:59.37	\N	\N	cmjjuyha4000kvckyggis8670
cmk43qzgh009viy362ywrg8zs	Innover et optimiser	Concevoir et développer les solutions d'amélioration	PROC-AMLIORER-9219-PROC-004	DRAFT	cmk43qzcs0090iy36wvirf09b	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:16:59.394	2026-01-07 14:16:59.394	\N	\N	cmjjuyha4000kvckyggis8670
cmk43qzgz00a5iy369o1l9q7y	Contrôler et pérenniser	Mettre en place les contrôles et assurer la pérennité des améliorations	PROC-AMLIORER-9219-PROC-005	DRAFT	cmk43qzcs0090iy36wvirf09b	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 14:16:59.412	2026-01-07 14:16:59.412	\N	\N	cmjjuyha4000kvckyggis8670
cmk46w0m9000bli1735jkbcgj	Collecter les données clients	Rassembler toutes les données clients depuis les différentes sources	PROC-ANALYSEDE-2818-PROC-001	DRAFT	cmk46w0ij0002li17bqla8dnc	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 15:44:53.025	2026-01-07 15:44:53.025	\N	\N	cmjjuyha4000kvckyggis8670
cmk46w0n0000nli17gmx5g8gg	Nettoyer et préparer les données	Standardiser et valider la qualité des données collectées	PROC-ANALYSEDE-2818-PROC-002	DRAFT	cmk46w0ij0002li17bqla8dnc	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 15:44:53.052	2026-01-07 15:44:53.052	\N	\N	cmjjuyha4000kvckyggis8670
cmk46w0ni000xli17lza8nmmp	Analyser les comportements clients	Identifier les patterns et tendances dans les données clients	PROC-ANALYSEDE-2818-PROC-003	DRAFT	cmk46w0ij0002li17bqla8dnc	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 15:44:53.07	2026-01-07 15:44:53.07	\N	\N	cmjjuyha4000kvckyggis8670
cmk46w0o10019li17v7n8nw4s	Générer les recommandations	Produire des insights et recommandations actionables	PROC-ANALYSEDE-2818-PROC-004	DRAFT	cmk46w0ij0002li17bqla8dnc	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 15:44:53.089	2026-01-07 15:44:53.089	\N	\N	cmjjuyha4000kvckyggis8670
cmk46w0oc001hli178jpt3yai	Valider et diffuser les résultats	Contrôler la qualité des analyses et partager les résultats	PROC-ANALYSEDE-2818-PROC-005	DRAFT	cmk46w0ij0002li17bqla8dnc	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 15:44:53.1	2026-01-07 15:44:53.1	\N	\N	cmjjuyha4000kvckyggis8670
cmk47low5005vli17cpd2x9p1	Évaluer la maturité organisationnelle	Analyser le niveau de maturité actuel de l'organisation en matière de gestion par processus	PROC-ACCOMPAGNE-0808-PROC-001	DRAFT	cmk47loup005oli1751lt9okn	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 16:04:50.885	2026-01-07 16:04:50.885	\N	\N	cmjjuyha4000kvckyggis8670
cmk47lowj0061li17vscxiwn1	Définir la stratégie de déploiement	Élaborer une stratégie adaptée au contexte et aux objectifs de l'organisation	PROC-ACCOMPAGNE-0808-PROC-002	DRAFT	cmk47loup005oli1751lt9okn	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 16:04:50.899	2026-01-07 16:04:50.899	\N	\N	cmjjuyha4000kvckyggis8670
cmk47lowv0067li1793aztr9z	Former les équipes	Organiser et dispenser les formations nécessaires aux équipes impliquées	PROC-ACCOMPAGNE-0808-PROC-003	DRAFT	cmk47loup005oli1751lt9okn	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 16:04:50.912	2026-01-07 16:04:50.912	\N	\N	cmjjuyha4000kvckyggis8670
cmk47loxd006fli1764a73mq7	Accompagner l'implémentation	Soutenir les équipes dans la mise en œuvre concrète des processus	PROC-ACCOMPAGNE-0808-PROC-004	DRAFT	cmk47loup005oli1751lt9okn	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 16:04:50.929	2026-01-07 16:04:50.929	\N	\N	cmjjuyha4000kvckyggis8670
cmk47loxs006pli174sah4nbz	Suivre et ajuster	Monitorer l'adoption et apporter les ajustements nécessaires	PROC-ACCOMPAGNE-0808-PROC-005	DRAFT	cmk47loup005oli1751lt9okn	cmk2phbcj0003q6od9akuiql5	\N	\N	\N	\N	\N	\N	\N	2026-01-07 16:04:50.945	2026-01-07 16:04:50.945	\N	\N	cmjjuyha4000kvckyggis8670
\.


--
-- Data for Name: process_actors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_actors (id, "processId", name, type, role, responsibilities, "order") FROM stdin;
\.


--
-- Data for Name: process_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_assignments (id, "processId", "userId", "roleId") FROM stdin;
\.


--
-- Data for Name: process_identity_cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_identity_cards (fip_id, "documentId", "processId", status, "createdAt", "updatedAt", "createdBy", objectives, scope, indicators, stakeholders, risks, opportunities, resources, "performanceTargets") FROM stdin;
16f63782-aa8a-4774-a5cd-3b587beca22e	bcb84625-19f9-4cc1-94e0-f41ada39662d	cmk3s7nzv0044q6od013hxko5	draft	2026-01-07 08:54:02.319	2026-01-07 08:54:02.319	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
23766df6-09aa-4630-b332-a133b0cb870f	c141d4a6-f571-4d71-b51a-195758677c0b	cmk3s7o08004aq6odeupztoi1	draft	2026-01-07 08:54:02.333	2026-01-07 08:54:02.333	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
6ce82a24-a808-4be5-8b33-a89d546343b7	7d805442-6e1c-4649-b4d5-df3f63950034	cmk3s7o040048q6oddvv7yhk8	draft	2026-01-07 08:54:02.348	2026-01-07 08:54:02.348	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
f68ea7f0-00ce-4490-87be-eb2547b32fee	1ba686d4-bb31-4942-8572-54575668bff2	cmk3s7o0d004fq6odda08o6fv	draft	2026-01-07 08:54:02.351	2026-01-07 08:54:02.351	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
9736b8e2-0475-4967-b50a-dbc978c1c256	aabc1942-ee96-47fd-9b08-2f5e9dd29efc	cmk3the560054q6odn4br4vm9	draft	2026-01-07 09:29:35.724	2026-01-07 09:29:35.724	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
1b1e774f-843c-44ec-9ac8-92a2dff7714f	2b3886c5-1459-4ad4-b719-c3a41bd9a0f6	cmk3the5h0057q6od40ewwnto	draft	2026-01-07 09:29:35.731	2026-01-07 09:29:35.731	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
5e1a11c1-24c2-4d1f-8fd9-84c98bbbdb08	5dd0579b-b34e-485a-ae08-7608aaf4c75a	cmk3tk6vw005kq6odsxyebfg4	draft	2026-01-07 09:31:46.278	2026-01-07 09:31:46.278	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
6860832b-68a5-4cf2-82ba-622bf8925cd6	31fd0eec-bb07-40e2-92cc-4f1a8cdecf52	cmk3uz7am008gq6od890gf6g0	draft	2026-01-07 10:11:26.277	2026-01-07 10:11:26.277	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
54a1fc4d-c38a-4e08-b76d-cb97394d2696	42125745-2e20-4ca9-85ba-51e427f5a02d	cmk3uz7b6008mq6od33zdmc7d	draft	2026-01-07 10:11:26.309	2026-01-07 10:11:26.309	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
0f3ee0ca-708c-4b35-8811-09326e2d4781	6542fa03-f8e5-47aa-9492-bb02c4870305	cmk3uz7bo008yq6od9my094ih	draft	2026-01-07 10:11:26.321	2026-01-07 10:11:26.321	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
08372386-9eb7-450d-9e18-2e82de30006d	f43f41e0-6e05-43ee-bf35-c639fdc85971	cmk3uz7bs0092q6odzqnghq5w	draft	2026-01-07 10:11:26.321	2026-01-07 10:11:26.321	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
d9ccac77-cc5e-466e-8eb5-aed5d1daabf4	810ecd5e-a25e-41c5-a383-7dfe2beddcb6	cmk3uz7ba008pq6odvqrmild2	draft	2026-01-07 10:11:26.324	2026-01-07 10:11:26.324	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
ff118d5b-7d31-42bf-80ab-c60e471ee135	2bf69c66-4fae-4859-b0b3-86fecda590c2	cmk3uz7bc008rq6od20148f4w	draft	2026-01-07 10:11:26.328	2026-01-07 10:11:26.328	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
4c90166b-917d-43f2-9168-e310d7c9cc59	c77a757f-53fb-4f3a-9545-dbaa37e4dd07	cmk3uz7bq0090q6odsfd5c93f	draft	2026-01-07 10:11:26.351	2026-01-07 10:11:26.351	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
ea0d4c24-b3f6-4638-9d7e-ca3b07ed4ceb	6fd9e675-4a2a-477f-b1c0-b3d9b66c4a4a	cmk3uz7by0096q6odxqpq8vya	draft	2026-01-07 10:11:26.358	2026-01-07 10:11:26.358	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
13b63584-094a-49d2-b82e-17f05f97e5f6	72834a59-eb06-4aa7-ab04-4d968ae83f8f	cmk3uz7c30099q6od4n96hfy0	draft	2026-01-07 10:11:26.351	2026-01-07 10:11:26.351	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
6e1b6fb1-719c-4525-8fed-f53e95d09797	ab8cc997-7455-43d6-b6c3-50f49da74a59	cmk3vd28h00abq6odrcwyt914	draft	2026-01-07 10:22:12.892	2026-01-07 10:22:12.892	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
056d9cd8-dcae-47be-ab33-a1407be4f7b8	a5f1b6cd-8d5b-4f9c-94e5-8fa489b19fa1	cmk3vd28n00aeq6odxorv1cxw	draft	2026-01-07 10:22:12.898	2026-01-07 10:22:12.898	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
64e24ae2-29bf-45dc-8c1c-3defb2953189	6c8dcb1a-3dee-4f93-a5b4-7043d8977911	cmk3vv19h000rcg7kscrikwtq	draft	2026-01-07 10:36:11.457	2026-01-07 10:36:11.457	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
a3be4df4-45a9-4dc3-965f-ce9b2c37485d	ce974369-4ad3-4737-a4fe-20fc53ebaee0	cmk3vv19e000pcg7k10qc51um	draft	2026-01-07 10:36:11.473	2026-01-07 10:36:11.473	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
40918023-e163-472d-90a8-9213b153f2cb	a962269f-e95a-4242-a6e9-3ff51bde2014	cmk3vv194000gcg7k9ux04e2g	draft	2026-01-07 10:36:11.472	2026-01-07 10:36:11.472	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
0ad8df45-6b1f-41a7-b8b6-9d8cacb07630	d30d902a-1fd6-42d1-a1de-812a50dfa8ad	cmk3vv19n000tcg7kjtk9jhic	draft	2026-01-07 10:36:11.473	2026-01-07 10:36:11.473	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
40086957-b7a0-4e60-b806-2b6101632aea	95913200-5108-437a-88b4-f6e610deecfe	cmk3vv197000lcg7kr3bxxz63	draft	2026-01-07 10:36:11.475	2026-01-07 10:36:11.475	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
5e2fa0cd-be3f-4f1d-8340-ab99931fcb7a	1ebc05b5-05fd-42d1-991c-e549ce8df16a	cmk3vv19b000ncg7ki58so0xt	draft	2026-01-07 10:36:11.471	2026-01-07 10:36:11.471	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
2cd6c47c-4c10-450e-98be-d4ae9ada8b45	e00a7056-50ba-409a-a222-f0bd29b6a020	cmk3vv19q000ycg7kb9on3puq	draft	2026-01-07 10:36:11.48	2026-01-07 10:36:11.48	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
26f2c41b-83ef-4f03-8e4f-76278abb567c	f605a9da-bec9-4fe4-b5fd-42624d361c67	cmk3vv196000jcg7klt5cc509	draft	2026-01-07 10:36:11.473	2026-01-07 10:36:11.473	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
42da20c2-a833-4896-9a6f-3b60957ea7e0	0f848572-7b01-407f-b052-68b06fe9bccf	cmk3vv19p000wcg7kln992ugh	draft	2026-01-07 10:36:11.504	2026-01-07 10:36:11.504	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
5b45fc10-65b4-4924-91ff-b09a67f47e2b	7e84d620-baa3-4c81-ad51-89b23b3ef05b	cmk3vv1ds001lcg7kb7xhf0pb	draft	2026-01-07 10:36:11.645	2026-01-07 10:36:11.645	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
e2fa8b6d-1d6f-476a-a10b-d4ec5a80eec6	f17913b2-bb69-4f72-b057-7b8722e54191	cmk3vv1eb001scg7k21sihunx	draft	2026-01-07 10:36:11.65	2026-01-07 10:36:11.65	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
6845db6b-a2ba-4374-a25a-588ac9d16fb8	5cbb5a1c-bb7f-4f8f-8d09-e62ce18ef863	cmk3vv1fh002fcg7ksz59fe13	draft	2026-01-07 10:36:11.654	2026-01-07 10:36:11.654	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
50b3adbe-9d21-47aa-bfec-d1f5f6f3be1f	e2c08a85-db18-4d80-a4dc-0d3314a93f6d	cmk3vv1f40029cg7kl3lxwbzv	draft	2026-01-07 10:36:11.669	2026-01-07 10:36:11.669	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
dc5591fb-31d0-49d2-8fb9-a9cb3ab38993	09f800df-14ef-4c9d-b069-0a85679b8229	cmk3vv1f5002dcg7ks380w9j4	draft	2026-01-07 10:36:11.67	2026-01-07 10:36:11.67	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
43d7d4a0-b83b-4e2c-954e-f5b749ea1fec	bf9e3324-c98f-4895-b8fa-c55f97a9c9b1	cmk3vv1fj002hcg7kpvw8uqqn	draft	2026-01-07 10:36:11.672	2026-01-07 10:36:11.672	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
b3032585-2820-45e9-8fa6-bb636a634bbd	192e699e-cc9c-43cf-9fe2-e99912c5e154	cmk3w9y0m000a774jqmni6vtw	draft	2026-01-07 10:47:47.135	2026-01-07 10:47:47.135	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
b09d3735-4f1c-47af-a7fc-c8ac0f54da82	891c905f-4b65-4cb4-b52e-021036f5d54f	cmk3w9y2p000t774jp3x36c4v	draft	2026-01-07 10:47:47.297	2026-01-07 10:47:47.297	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
f76330fa-af16-4fe2-937f-9ba8cde771b7	4ce47c92-0b7b-4719-b76b-415ad3ce7eb8	cmk3wl3es000bst0bgor7fyrk	draft	2026-01-07 10:56:27.292	2026-01-07 10:56:27.292	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
68445ba0-ee8b-4c4b-8989-e487f404effd	e15b14ad-d439-4e8a-b589-b86b3e377b26	cmk40ovuw009hst0bd2ihj0xf	draft	2026-01-07 12:51:22.654	2026-01-07 12:51:22.654	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
08137333-aa6b-4d7b-a22b-c61b4d0c2200	b7fe6130-9ff9-417d-a6ef-08e217de057d	cmk3wl3eu000gst0bejiwwt4m	draft	2026-01-07 10:56:27.297	2026-01-07 10:56:27.297	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
502a4d04-effc-4bc9-a8d2-d570df5f5e39	938005af-5d0e-402d-bcab-5141a892b8b4	cmk40ovvm009mst0b4blsgguw	draft	2026-01-07 12:51:22.669	2026-01-07 12:51:22.669	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
159a73c1-c11d-4efc-85a0-6ed49e1892b2	df8d4e83-2397-495f-a257-aa791e60d4d7	cmk3w9y28000k774jbvxkjsgg	draft	2026-01-07 10:47:47.339	2026-01-07 10:47:47.339	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
65834f9e-13a0-48f7-a88b-9851f0f2a52f	6ef294f5-58c8-42fd-b890-fcdd8ea18b84	cmk3wl3ez000ist0bpmwvqnpi	draft	2026-01-07 10:56:27.302	2026-01-07 10:56:27.302	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
7d6e436f-60c0-416e-b511-ef4bd09022f4	4966ab35-3ebd-472e-9b8d-fbbe7ce5a1b5	cmk40ovw2009ost0b4xrvzkgx	draft	2026-01-07 12:51:22.672	2026-01-07 12:51:22.672	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
647bc93c-692f-490e-9b29-540737eba07a	31fa741f-3d0e-4e7c-aabb-3787c20b4e3c	cmk3wl3f2000nst0boj6vmoil	draft	2026-01-07 10:56:27.304	2026-01-07 10:56:27.304	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
4ef1f396-23ef-48b9-bd4f-20101ca1f20b	0cbc08e6-e2fc-4284-8e78-794cb28b6303	cmk3womhv001zst0bxn1g59dp	draft	2026-01-07 10:59:11.979	2026-01-07 10:59:11.979	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
ff395109-31d8-4494-96a3-343766026bbe	2dfbebcd-c415-4df1-807e-1ea4679e7255	cmk40ovwh009qst0bx5flnouw	draft	2026-01-07 12:51:22.674	2026-01-07 12:51:22.674	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
49f449d0-3aa5-4298-93ce-e70772933e50	76d33192-b653-4e7f-8e6d-97cc46097386	cmk3w9y2o000r774jw9vfn5vj	draft	2026-01-07 10:47:47.209	2026-01-07 10:47:47.209	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
dc0adb8e-4760-4a8f-b7f5-94da07edc1a7	af50b212-189c-41e7-bb4b-e28793fd8bdf	cmk3wl3f3000ost0bquyn9eoa	draft	2026-01-07 10:56:27.307	2026-01-07 10:56:27.307	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
736f8b47-23e5-4834-a2f6-2ba485dfd2fa	9b444d23-8a9a-4394-adc8-e5a0a62222b7	cmk3womhs001tst0b9gu27aty	draft	2026-01-07 10:59:11.978	2026-01-07 10:59:11.978	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
c65005dd-514e-4234-8763-42d5354592f6	e77fe304-2086-4292-80b2-82780d391ef8	cmk40ovx800a2st0bhu2rt6xh	draft	2026-01-07 12:51:22.717	2026-01-07 12:51:22.717	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
1e238ff6-a589-4e67-a138-da390cbbbc8c	402a148c-0174-4959-bf3e-2f9e8ab8db12	cmk3wl3f1000kst0b8q3woerf	draft	2026-01-07 10:56:27.316	2026-01-07 10:56:27.316	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
f7bdbdbb-bfba-42e3-a8f1-c3defab452fb	eb88c53f-be81-4814-a0b7-f0d88f478699	cmk3womht001vst0b8uogfnnm	draft	2026-01-07 10:59:11.977	2026-01-07 10:59:11.977	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
2e58ef60-ab83-442a-8192-a67f06dd6f8f	f7088617-d179-4d8e-a2b0-24463bdcb3c5	cmk40ovxm00a4st0bwsh3x302	draft	2026-01-07 12:51:22.732	2026-01-07 12:51:22.732	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
4ef3824d-9eca-4d71-bf73-ab303228f3fb	1d95d44e-054f-4894-ae52-09ddee0a93a7	cmk3wl3fj000vst0bkdyl6qpv	draft	2026-01-07 10:56:27.321	2026-01-07 10:56:27.321	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
e555586f-fd46-40f5-9fe3-92ea30aa1572	741b2893-fdb0-4ff3-8d72-05dba3870729	cmk3womhu001xst0blzbpis41	draft	2026-01-07 10:59:11.978	2026-01-07 10:59:11.978	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
ce848ce4-c3bb-4b0a-aaf5-8656b35e638a	26a5b9c1-c4ce-4533-901d-81fc4de42b3c	cmk40ovzk00abst0bqw8oospn	draft	2026-01-07 12:51:22.791	2026-01-07 12:51:22.791	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
e9df6fa2-744f-4915-9af0-5481d14b475c	e760017d-d8e4-4927-9b82-c8065b337044	cmk3x29rt002wst0bvfm66351	draft	2026-01-07 11:09:48.753	2026-01-07 11:09:48.753	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
fec3a4f7-8e84-423a-a7a2-fb87fc5d3a62	3fc49ea1-8071-41b4-be93-96fb1b901ee7	cmk431cni0010iy363b0f47p8	draft	2026-01-07 13:57:03.812	2026-01-07 13:57:03.812	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
4f0f6aed-564d-46e8-aa93-c64a8037c68c	5023d566-e36f-464f-af98-2a1be98e0b0d	cmk431cnt0013iy36ttst5zk3	draft	2026-01-07 13:57:03.812	2026-01-07 13:57:03.812	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
68168b8e-990a-4e5f-b197-4bea7e766907	c3053eb2-e688-4938-a638-a253727bcfb1	cmk431cng000siy36af9r0nd0	draft	2026-01-07 13:57:03.807	2026-01-07 13:57:03.807	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
8dfbe692-708c-4f50-be0c-40c90b2ad4a9	094a386c-1e8c-4ac3-8f16-754a1a361ad5	cmk431cnh000viy36besokaga	draft	2026-01-07 13:57:03.811	2026-01-07 13:57:03.811	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
1e3b881c-5b25-4cca-a092-dc076ad43336	db93523c-2ec7-483f-a3cc-989db421e148	cmk431cnh000yiy361e4bbrh2	draft	2026-01-07 13:57:03.747	2026-01-07 13:57:03.747	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
c21b41a3-2d3d-4da7-b4e4-b78d4e37eba9	eb5c049a-0701-438d-a129-0b28f3a836b1	cmk431dcc001xiy36vd4kw22y	draft	2026-01-07 13:57:04.451	2026-01-07 13:57:04.451	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
b30377d1-d5cf-4dca-abf2-1f44eb8197a3	4bfe2272-3ce7-47fc-83f5-70001e7f4648	cmk431df30028iy368uofmmck	draft	2026-01-07 13:57:04.453	2026-01-07 13:57:04.453	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
5f637e99-25a0-43c9-8b62-b4b3b21a715e	8cfb8ca9-3990-4a22-b7de-dcc6fbd07ff6	cmk431dfk002giy366tvczc6g	draft	2026-01-07 13:57:04.479	2026-01-07 13:57:04.479	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
07c0ec61-d68c-490c-ad0a-0a3ee67debfb	ab136970-6fc5-4d98-a3f8-70dd023a499f	cmk4331d0003jiy36wcsva2kq	draft	2026-01-07 13:58:22.127	2026-01-07 13:58:22.127	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
a6527753-6f62-4033-9a93-c4391119ec81	b2cef89e-ec40-4393-ac96-a764174154f7	cmk3x29sz0035st0b9og16ofh	draft	2026-01-07 11:09:48.773	2026-01-07 11:09:48.773	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
d83eaef5-3bc5-4fa7-9ce3-e49d05ede66b	66685fa0-4773-42ab-b23d-4fed7428b795	cmk431cnh000wiy36034htlqe	draft	2026-01-07 13:57:03.921	2026-01-07 13:57:03.921	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
8d298233-2e15-4d25-8e49-8b28c243eb14	e45c204a-fa38-4c2f-b3d7-1c79b0129fdb	cmk431cng000qiy36qgi8teod	draft	2026-01-07 13:57:03.911	2026-01-07 13:57:03.911	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
8079ed5a-1b01-450b-b973-f9046d5652d5	f8444971-8ff6-4949-9f79-0dd58214de1b	cmk431df20026iy36bfd301y3	draft	2026-01-07 13:57:04.481	2026-01-07 13:57:04.481	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
d3f2fd9d-165c-4c3a-9c93-d804e4e82510	917e07a3-6728-48b6-bc3f-ba0580d786ae	cmk431dfo002oiy360l2cl36h	draft	2026-01-07 13:57:04.502	2026-01-07 13:57:04.502	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
a0f51382-8e32-48a2-8917-932e7c2790db	85b5fe75-5d84-4087-aeb6-77b737bf3467	cmk4331d2003miy366kil00l3	draft	2026-01-07 13:58:22.128	2026-01-07 13:58:22.128	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
425ec208-42f4-499f-8bae-9efbf591ccbf	31941aff-2336-4f85-8db8-14d851a24c71	cmk3x29si002yst0box2963rs	draft	2026-01-07 11:09:48.778	2026-01-07 11:09:48.778	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
54048f74-41b0-4bcd-8d3d-064ff5c08443	f01a1c17-7627-49c4-8fb9-2841433d56f7	cmk431cnx0017iy36uxeju3ss	draft	2026-01-07 13:57:03.996	2026-01-07 13:57:03.996	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
d33635a2-a6c4-4a98-b4ff-12f8aeb04fdb	447c3b9d-2b0a-4d14-b38d-3222c2d2c320	cmk431dfl002miy36ldpapsem	draft	2026-01-07 13:57:04.484	2026-01-07 13:57:04.484	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
bbb8ff21-4726-4ba2-bdc3-80bc3555f938	cd2aff88-d8b8-4a29-8453-7597c3e3b42e	cmk3x29tf003dst0bzc3ssw5a	draft	2026-01-07 11:09:48.801	2026-01-07 11:09:48.801	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
ce41e034-fe22-464e-84ba-3caacb74787b	6f3c836b-dd51-4273-91d1-d39e6fa8d593	cmk431cnv0015iy3688h7kn6l	draft	2026-01-07 13:57:03.998	2026-01-07 13:57:03.998	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
55df183b-8e09-4add-9917-f71ee3a15edc	7e58f663-3b7c-4070-802e-c932aaf42d6c	cmk3w9y25000g774jzs4242aq	draft	2026-01-07 10:47:47.251	2026-01-07 10:47:47.251	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
17be61bd-74f6-43d7-9103-5344043a84b3	19677fe6-eb84-47c8-949c-a17ff16a3f1d	cmk3x29r0002sst0b53gczwxk	draft	2026-01-07 11:09:48.803	2026-01-07 11:09:48.803	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
0c59102f-2717-42e2-b3c9-b95b14d9f951	d7fc397e-d271-4370-af55-949ede6459ef	cmk43jqv9003yiy36jz7z0v2d	draft	2026-01-07 14:11:21.706	2026-01-07 14:11:21.706	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
46e4dcfe-a83d-4802-9b3e-555ac25aa492	162b0733-94d4-40f7-ba05-5796110e3d87	cmk3x29th003fst0b62iuasl0	draft	2026-01-07 11:09:48.804	2026-01-07 11:09:48.804	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
eba5aa4b-76a8-48d9-b714-31ef127e1c99	488e4112-e18c-445c-bcff-554407a6f7a4	cmk43lac3006eiy36kzjh2k4g	draft	2026-01-07 14:12:33.583	2026-01-07 14:12:33.583	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
6cf16e1d-f714-458f-8ce8-566817e5c3fb	a978394b-086f-4eaa-9e9a-d590dd3cd4ec	cmk3x29uw003mst0b39r2w1m0	draft	2026-01-07 11:09:48.824	2026-01-07 11:09:48.824	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
73ac78dc-9cf3-4207-b5f8-f9943937b96e	2a5e430c-f395-4dbf-aea2-52af59359c00	cmk43qzcs0090iy36wvirf09b	draft	2026-01-07 14:16:59.279	2026-01-07 14:16:59.279	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
3517aee3-c769-4cc6-8248-7477f7d2d92f	e8711950-9ae1-4288-96d0-555a01701f77	cmk3w9y2m000o774j8wo4by27	draft	2026-01-07 10:47:47.251	2026-01-07 10:47:47.251	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
ab01897f-9b1b-481b-9ea2-20798b4570bf	fe63ab68-4b77-443e-adcf-3d8d537b1d9f	cmk3x29sw0033st0bhw8oy5ya	draft	2026-01-07 11:09:48.804	2026-01-07 11:09:48.804	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
aacca33b-3868-4173-b002-7b98261b8904	4459ee20-a8fc-49f3-835e-4b9b16e8f0b7	cmk46w0ij0002li17bqla8dnc	draft	2026-01-07 15:44:52.945	2026-01-07 15:44:52.945	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
66c878b6-75a4-441b-97b4-01415df6842d	a7d40593-d543-4602-bf39-6d3701f20086	cmk3x29td003bst0bwlry5lbz	draft	2026-01-07 11:09:48.834	2026-01-07 11:09:48.834	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
8a315409-a116-4584-a3d1-7a4b31bd6b50	365a04f9-2094-4d17-85eb-a9401030fce4	cmk47gp2i003ili17ariri9ar	draft	2026-01-07 16:00:58.115	2026-01-07 16:00:58.115	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
226b68d3-9750-41fb-8ac3-fc8f7ee3c736	6b2ed35e-e147-49bd-aac8-795c0c0f1794	cmk47gp40003qli17k66uc6rj	draft	2026-01-07 16:00:58.114	2026-01-07 16:00:58.114	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
2e46225b-fe1a-4447-8132-13952e3672f6	48467ecb-8a3c-4305-a24c-cfe3673807d1	cmk3w9y34000y774jtbq3cftj	draft	2026-01-07 10:47:47.34	2026-01-07 10:47:47.34	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
4c805018-98ca-457a-8006-b14e9d15eee6	7c19e5d8-b0df-4e21-ad3c-9490c700543a	cmk3ye873004tst0bfpx28nzx	draft	2026-01-07 11:47:06.146	2026-01-07 11:47:06.146	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
6cb7d215-7f57-4977-9baf-b9d964788975	73169b65-2dbd-431a-9e91-049faa769c06	cmk47gp2e003bli17d5sd51n9	draft	2026-01-07 16:00:58.115	2026-01-07 16:00:58.115	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
c11a3acd-4480-4790-9d26-4ca78953d694	9e7b5510-0f89-408b-b095-a93bcab44167	cmk3ye86j004lst0bwls71nxx	draft	2026-01-07 11:47:06.144	2026-01-07 11:47:06.144	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
50cc9d79-2cec-44b8-830e-1521bfc2255a	63edaa0b-ec43-4745-af10-01f91318dd76	cmk47gp250038li17ff6csg0d	draft	2026-01-07 16:00:58.115	2026-01-07 16:00:58.115	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
e337febf-d9ca-4e30-9422-c10fd4d85b63	acaf5e5b-07e8-489f-ad20-31d00703e6e4	cmk3ye873004vst0bly4ace33	draft	2026-01-07 11:47:06.152	2026-01-07 11:47:06.152	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
b21bda56-4952-4155-82e3-a66e41bc1f99	d1b113c5-a700-4eef-9e76-8633e2769aab	cmk47gp2y003lli17fbalp3kh	draft	2026-01-07 16:00:58.116	2026-01-07 16:00:58.116	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
6ab9b55f-9b10-4f5b-b715-5f369d7b1833	d189e002-9fde-4884-9212-b0df27423949	cmk3ye86u004ost0bdpqbo1v7	draft	2026-01-07 11:47:06.161	2026-01-07 11:47:06.161	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
7f609c41-518a-43a7-a7cf-57322cfa6579	0da361ba-9a7f-4723-86b8-dba15bdd8705	cmk47gp2g003gli17eqkrkupe	draft	2026-01-07 16:00:58.117	2026-01-07 16:00:58.117	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
4889b8d2-ffdb-4773-b340-2bf3cdbf8d43	312a66e2-8a0b-4b33-b7ff-f8021d67ab35	cmk47gp3a003nli17pvqa21pj	draft	2026-01-07 16:00:58.116	2026-01-07 16:00:58.116	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
a7be100a-f9d5-4420-af24-1fba6404f853	32040030-51ff-4620-9f43-b0ca23029693	cmk3ye874004wst0bi3mizldg	draft	2026-01-07 11:47:06.158	2026-01-07 11:47:06.158	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
eed9d6c7-da56-4af8-91c8-4cb29be086ea	8b654722-f8f4-4750-90e0-2251faa1f8dd	cmk47jezb0052li175vtjkevz	draft	2026-01-07 16:03:04.806	2026-01-07 16:03:04.806	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
b83523ae-a794-4e80-8245-26c050c0f2fc	95bbb624-8c36-4e94-96d5-7eb03e5fef59	cmk47loup005oli1751lt9okn	draft	2026-01-07 16:04:50.844	2026-01-07 16:04:50.844	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
ed4887d4-0038-4ee9-9cd2-86d2e2f17f62	af0a219f-46cb-4dde-a556-43dca36af22e	cmk3w9y2q000v774jwh7ycq7h	draft	2026-01-07 10:47:47.267	2026-01-07 10:47:47.267	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
88982b5f-45d0-4538-b77b-ad6e15978d53	fe6d2418-dbd6-4739-ba15-ccda85cf30a2	cmk3ye87e004zst0btmgv55el	draft	2026-01-07 11:47:06.191	2026-01-07 11:47:06.191	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
e8310e65-2950-4032-9ec2-320f8287ad43	920badfa-59cd-41c0-9346-0a08c6d940c6	cmk47jezh0055li17ug3xlvfn	draft	2026-01-07 16:03:04.807	2026-01-07 16:03:04.807	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
f15418f3-e6d3-43d8-a46c-f33f10dc6c0d	becc7725-729d-4b4a-a0b5-1fcd555aae47	cmk3ylgu10064st0b838vzxia	draft	2026-01-07 11:52:43.918	2026-01-07 11:52:43.918	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
93c2c049-2699-4880-90ae-8b60791982eb	248f6aae-b21a-461c-bc12-25250537c849	cmk47jeyy0050li17zetkf7hn	draft	2026-01-07 16:03:04.809	2026-01-07 16:03:04.809	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
8edd6f62-d12b-4f7a-a856-afe7eb700f86	b2d5d0ee-2454-468b-9e76-2d241d76bd76	cmk3ylgtz0062st0bj7grjhol	draft	2026-01-07 11:52:43.924	2026-01-07 11:52:43.924	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
6dc9bb93-d249-442e-964d-98a7a3e4be6e	481bdaf4-eef8-43f7-8729-4e42cd923fea	cmk47jeyt004wli17r8dbearx	draft	2026-01-07 16:03:04.818	2026-01-07 16:03:04.818	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
5e099f51-568d-4896-adfe-bdcd3d03a7b9	60a8aca4-fcaf-4e75-a393-7647d55e1177	cmk3ylgu40068st0b5zisfb0q	draft	2026-01-07 11:52:43.928	2026-01-07 11:52:43.928	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
87cfa841-cfe2-4c08-8e74-ade367e9fc15	f07bd444-a145-4f69-977f-163d2d098f5a	cmk3yo0fu007cst0bo2trakkc	draft	2026-01-07 11:54:42.632	2026-01-07 11:54:42.632	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
93cfb49c-cc7a-475f-a298-8533b6b7535b	86edddf7-d822-49af-86fa-05199d1bc651	cmk3ylgu6006cst0b2ruyc2jo	draft	2026-01-07 11:52:43.928	2026-01-07 11:52:43.928	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
0178608d-b39e-4d33-941a-f1c0c4cb3185	2df027d2-5c4c-4f52-9cbc-788532ac2d73	cmk3w9y340010774jzaw6j3ls	draft	2026-01-07 10:47:47.34	2026-01-07 10:47:47.34	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
4bb65bfc-f1ab-49a4-b0a6-3cdaa4f12851	11e97427-08f5-463c-bdd7-e71ad6b0c479	cmk3ylgu7006est0btxxx87gk	draft	2026-01-07 11:52:43.93	2026-01-07 11:52:43.93	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
071d54d0-fbf1-45dc-b5ac-407faa297f23	b6a1d2ab-0150-4558-b99d-4a84b8b7af3b	cmk3yo0fr0078st0bvrcckrou	draft	2026-01-07 11:54:42.628	2026-01-07 11:54:42.628	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
d994e7a4-4000-48e9-9bf5-f57e7face5c0	4bd889a3-a8a2-4cc5-90c2-31db318780da	cmk3ylgu5006ast0bshjxnjfv	draft	2026-01-07 11:52:43.934	2026-01-07 11:52:43.934	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
8e7780be-d9bc-428c-9602-932c504696e1	0fd3d277-92e6-4bac-abd7-17baa26020ca	cmk3yo0fr007ast0bstxjbuxd	draft	2026-01-07 11:54:42.629	2026-01-07 11:54:42.629	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
72b05d7b-f733-4d77-ac73-d48b45ef8197	077b75dc-ef3c-4871-9b67-12feb7bb659f	cmk3yqfh3007sst0bji27nu5b	draft	2026-01-07 11:56:35.429	2026-01-07 11:56:35.429	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
9bfa7f42-d3ed-455d-8c84-0e71e7533724	c300f37b-05f9-441e-b37e-0f668bc87bb9	cmk3z5eh10082st0bbfjx80ug	draft	2026-01-07 12:08:13.979	2026-01-07 12:08:13.979	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
db38833e-a6b3-476f-9faf-9b1cd583516a	491e5975-d9f6-4ab0-88a2-c137d1eff970	cmk3z97sv0085st0bitpnbflt	draft	2026-01-07 12:11:11.95	2026-01-07 15:55:49.61	cmjjuyha4000kvckyggis8670	Au niveau groupe piloter et comparer avec la concurrence la satisfaction et recommandation des clients	B2C zone EUR + Orange France + Mas Orange	[{"name": "11", "unit": "3", "frequency": "monthly", "description": "", "responsible": "", "targetValue": 0, "currentValue": 0}]	[{"name": "acteur 1", "role": "", "contact": "", "responsibility": ""}]	[{"impact": "medium", "mitigation": "", "description": "risque 1", "probability": "medium"}, {"impact": "low", "mitigation": "", "description": "risque 2", "probability": "high"}]	[{"potential": "", "actionPlan": "", "description": "op 1"}]	[{"cost": 0, "type": "human", "quantity": "1", "description": ""}]	[{"target": 0, "deadline": "", "indicator": "cilbe 1", "responsible": ""}]
4e433149-47a2-470c-82ad-22f2744b52e4	2bcaa727-9a38-470b-8e79-3e9c25c8fdaa	cmk40d85c008dst0b5mc92lzk	draft	2026-01-07 12:42:18.687	2026-01-07 12:42:18.687	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
0e001894-660f-46be-bf38-77b3ebb861a5	3a6c7971-f36c-48b2-b092-719577ac08ec	cmk40d85g008fst0bniojam6x	draft	2026-01-07 12:42:18.689	2026-01-07 12:42:18.689	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
8b2a0ca8-728a-4e14-9436-acc6f0628605	ee9f3323-2753-450f-8d8d-c096f67de59d	cmk40d86r008mst0bk02xh8vb	draft	2026-01-07 12:42:18.713	2026-01-07 12:42:18.713	cmjjuyha4000kvckyggis8670	\N	\N	null	null	null	null	null	null
\.


--
-- Data for Name: process_inputs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_inputs (id, "processId", trigger, source, "sourceRole") FROM stdin;
\.


--
-- Data for Name: process_ios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_ios (id, "processId", name, description, type, "isInput", "order") FROM stdin;
\.


--
-- Data for Name: process_map_validation_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_map_validation_requests (id, "processMapId", "requestedById", "validatorId", status, comment, "validatedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: process_maps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_maps (id, title, description, code, status, "workspaceId", "departmentId", "createdAt", "updatedAt", "publishedAt", "archivedAt", "createdById") FROM stdin;
cmk2pq1wq002nq6od7j4afiuy	Gérer l’Expérience Client Groupe		GERE_EXPERICE_CLIENT_GROUPE	DRAFT	cmk2phbcj0003q6od9akuiql5	\N	2026-01-06 14:56:35.114	2026-01-06 14:56:35.114	\N	\N	cmjjuyha4000kvckyggis8670
cmk3vikem000211vqjfh8vi4p	test ai	\N	TEST-AI	DRAFT	cmk2phbcj0003q6od9akuiql5	\N	2026-01-07 10:26:29.711	2026-01-07 10:26:29.711	\N	\N	cmjjuyha4000kvckyggis8670
cmk431cds0002iy3665bz2xy1	Cartographie des Processus Ressources Humaines	Cette carte présente l'ensemble des processus RH organisés par domaines fonctionnels. Elle couvre la gestion du capital humain depuis le recrutement jusqu'au développement des compétences, en intégrant les aspects stratégiques, opérationnels et de support.	MAP-CARTOGRAPH-3030	DRAFT	cmk2phbcj0003q6od9akuiql5	\N	2026-01-07 13:57:03.084	2026-01-07 13:57:03.084	\N	\N	cmjjuyha4000kvckyggis8670
\.


--
-- Data for Name: process_outputs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_outputs (id, "processId", output, target, "targetRole") FROM stdin;
\.


--
-- Data for Name: process_qualigram_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_qualigram_tags ("processId", "tagId") FROM stdin;
\.


--
-- Data for Name: process_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_tags (id, name, color, description, "createdAt", "workspaceId") FROM stdin;
\.


--
-- Data for Name: process_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_templates (id, name, description, type, level, template, "isPublic", "createdAt", "updatedAt", "workspaceId", "createdById") FROM stdin;
\.


--
-- Data for Name: process_themes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_themes (id, name, description, "nodeStyles", "edgeStyles", "primaryColor", "secondaryColor", "successColor", "errorColor", "warningColor", "fontFamily", "fontSize", spacing, "borderRadius", "workspaceId", "isDefault", "isPublic", "createdAt", "updatedAt") FROM stdin;
cmjjuyhbq0018vckydhk0uot2	Orange Corporate Theme	Official Orange Group branding theme	{"TASK": {"fontSize": 14, "fontColor": "#333333", "borderColor": "#ff6900", "borderWidth": 2, "borderRadius": 6, "backgroundColor": "#ffffff"}, "END_EVENT": {"borderColor": "#c62828", "borderWidth": 3, "borderRadius": "50%", "backgroundColor": "#f44336"}, "START_EVENT": {"borderColor": "#2e7d32", "borderWidth": 3, "borderRadius": "50%", "backgroundColor": "#4caf50"}}	{"SEQUENCE_FLOW": {"markerEnd": "arrowclosed", "strokeColor": "#666666", "strokeWidth": 2}, "CONDITIONAL_FLOW": {"markerEnd": "arrowclosed", "strokeColor": "#ff6900", "strokeWidth": 2, "strokeDasharray": "5,5"}}	#ff6900	#000000	#4caf50	#f44336	#ff9800	'Orange Helvetica', Arial, sans-serif	{"large": 16, "small": 12, "title": 20, "medium": 14}	{"large": 24, "small": 8, "medium": 16}	{"large": 8, "small": 4, "medium": 6}	cmjjuyh9g0008vckyt3wuzn2b	t	t	2025-12-24 10:15:29.078	2025-12-24 10:15:29.078
\.


--
-- Data for Name: process_validation_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process_validation_requests (id, "processId", "requestedById", "validatorId", status, comment, "validatedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: processes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.processes (id, description, type, priority, confidentiality, "createdAt", "publishedAt", "archivedAt", "nextReviewDate", "workspaceId", "departmentId", "createdById", "approvalDate", code, finalite, objectif, perimetre, "processMapId", "reviewFrequency", title, "updatedAt", status) FROM stdin;
cmk3s7nzv0044q6od013hxko5	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 08:54:02.299	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767776042248-1-2VCZ	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Définir le plan stratégique de la distribution	2026-01-07 08:54:02.299	DRAFT
cmk3s7o040048q6oddvv7yhk8	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 08:54:02.308	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767776042248-2-CTXS	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Mesurer la recommandation des clients	2026-01-07 08:54:02.308	DRAFT
cmk3s7o08004aq6odeupztoi1	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 08:54:02.313	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767776042248-0-9R9X	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Identifier les moments signature	2026-01-07 08:54:02.313	DRAFT
cmk3s7o0d004fq6odda08o6fv	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 08:54:02.317	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767776042248-3-7VD8	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser l’expérience  globale des clients des filiales	2026-01-07 08:54:02.317	DRAFT
cmk3the560054q6odn4br4vm9	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 09:29:35.706	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767778175653-1-KL81	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser le Traffic digital	2026-01-07 09:29:35.706	DRAFT
cmk3the5h0057q6od40ewwnto	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 09:29:35.717	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767778175653-0-N89E	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser la maturité digitale	2026-01-07 09:29:35.717	DRAFT
cmk3tk6vw005kq6odsxyebfg4	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 09:31:46.269	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767778306244-0-PXO7	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser la maturité digitale	2026-01-07 09:31:46.269	DRAFT
cmk3uz7am008gq6od890gf6g0	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:11:26.255	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767780686191-0-MQVV	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analymaturitéser la digitale	2026-01-07 10:11:26.255	DRAFT
cmk3uz7b6008mq6od33zdmc7d	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:11:26.274	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767780686191-6-EXCH	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser les données de la relation client	2026-01-07 10:11:26.274	DRAFT
cmk3uz7ba008pq6odvqrmild2	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:11:26.278	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767780686191-3-M5SW	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser la performance web	2026-01-07 10:11:26.278	DRAFT
cmk3uz7bc008rq6od20148f4w	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:11:26.28	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767780686191-7-UYI2	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser les données CX responsable	2026-01-07 10:11:26.28	DRAFT
cmk3uz7bo008yq6od9my094ih	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:11:26.292	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767780686191-2-6EAY	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser les  web Analytics	2026-01-07 10:11:26.292	DRAFT
cmk3uz7bq0090q6odsfd5c93f	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:11:26.294	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767780686191-4-5IBP	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Réaliser des benchmarks	2026-01-07 10:11:26.294	DRAFT
cmk3uz7bs0092q6odzqnghq5w	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:11:26.296	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767780686191-5-K9GV	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser les centres d’appel partenaires	2026-01-07 10:11:26.296	DRAFT
cmk3uz7by0096q6odxqpq8vya	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:11:26.302	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767780686191-8-HYGI	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Réaliser des benchmarks	2026-01-07 10:11:26.302	DRAFT
cmk3uz7c30099q6od4n96hfy0	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:11:26.308	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767780686191-1-GNYL	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser le Traffic digital	2026-01-07 10:11:26.308	DRAFT
cmk3vd28h00abq6odrcwyt914	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:22:12.881	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767781332852-0-37ZR	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Mesurer la recommandation des clients	2026-01-07 10:22:12.881	DRAFT
cmk3vd28n00aeq6odxorv1cxw	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 10:22:12.888	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767781332852-1-TALG	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser l’expérience  globale des clients des filiales	2026-01-07 10:22:12.888	DRAFT
cmk3vv194000gcg7k9ux04e2g	Pilotage et suivi du déploiement stratégique RH	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.416	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-2-H8PH	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Piloter le déploiement de la stratégie RH	2026-01-07 10:36:11.416	DRAFT
cmk3vv197000lcg7kr3bxxz63	Amélioration continue des conditions de travail	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.419	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-14-WRD8	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Améliorer les conditions de travail	2026-01-07 10:36:11.419	DRAFT
cmk3vv196000jcg7klt5cc509	Gestion des programmes de formation et développement	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.418	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-12-U753	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Gérer la formation	2026-01-07 10:36:11.418	DRAFT
cmk3vv19b000ncg7ki58so0xt	Définition de la stratégie globale des ressources humaines	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.423	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-0-3OL2	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir la stratégie RH-G	2026-01-07 10:36:11.423	DRAFT
cmk3vv19e000pcg7k10qc51um	Planification stratégique des effectifs et compétences	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.426	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-4-TWFO	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Elaborer le Strategic Workforce Planning	2026-01-07 10:36:11.426	DRAFT
cmk3vv19h000rcg7kscrikwtq	Définition des politiques RH au niveau groupe	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.425	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-1-5212	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir la politique RH-G	2026-01-07 10:36:11.425	DRAFT
cmk3vv19n000tcg7kjtk9jhic	Processus de recrutement et sélection des candidats	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.435	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-6-RK6V	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Recruter des candidats	2026-01-07 10:36:11.435	DRAFT
cmk3vv1ds001lcg7kb7xhf0pb	Gestion de la politique de rémunération	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.585	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-9-CZ3D	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Gérer la rémunération salariés	2026-01-07 10:36:11.585	DRAFT
cmk3vv1eb001scg7k21sihunx	Planification opérationnelle des effectifs	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.603	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-5-LF15	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Elaborer le Workforce Planning Opérationnel	2026-01-07 10:36:11.603	DRAFT
cmk3vv1f5002dcg7ks380w9j4	Gestion et développement des compétences	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.633	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-7-GDIG	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Gérer les compétences des salariés	2026-01-07 10:36:11.633	DRAFT
cmk3vv1fh002fcg7ksz59fe13	Gestion des postes et des emplois	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.645	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-8-0E2S	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Gérer les emplois	2026-01-07 10:36:11.645	DRAFT
cmk3vv1fj002hcg7kpvw8uqqn	Gestion du SIRH et des outils informatiques RH	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.647	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-11-UUVG	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Gérer le Système d'Information RH Groupe	2026-01-07 10:36:11.647	DRAFT
cmk3vv19q000ycg7kb9on3puq	Gestion de la santé, sécurité et conditions de travail	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.438	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-13-HQ2O	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Gérer la santé et la sécurité au travail	2026-01-07 10:36:11.438	DRAFT
cmk3vv19p000wcg7kln992ugh	Reconnaissance et évaluation de la performance	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.437	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-10-RPM4	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Reconnaître la performance des salariés	2026-01-07 10:36:11.437	DRAFT
cmk3vv1f40029cg7kl3lxwbzv	Communication stratégique vers les parties prenantes	FLOW	MEDIUM	INTERNAL	2026-01-07 10:36:11.632	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782171311-3-552Z	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Communiquer aux parties prenantes	2026-01-07 10:36:11.632	DRAFT
cmk3w9y0m000a774jqmni6vtw	Processus de définition stratégique de l'expérience client	FLOW	MEDIUM	INTERNAL	2026-01-07 10:47:47.062	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782866998-0-7KVA	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir la stratégie de l'expérience client	2026-01-07 10:47:47.062	DRAFT
cmk3w9y25000g774jzs4242aq	Processus d'animation des communautés incluant Expérience Client, Vente & Distribution, Digitale, Relation Client, Lean Six Sigma et BPM	FLOW	MEDIUM	INTERNAL	2026-01-07 10:47:47.118	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782866998-7-FTLV	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Animer les communautés	2026-01-07 10:47:47.118	DRAFT
cmk3w9y28000k774jbvxkjsgg	Processus de pilotage incluant mesure de recommandation et analyse globale	FLOW	MEDIUM	INTERNAL	2026-01-07 10:47:47.12	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782866998-3-CKWE	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Piloter l'expérience client	2026-01-07 10:47:47.12	DRAFT
cmk3w9y2m000o774j8wo4by27	Processus de proposition de recommandations digitales et commerciales	FLOW	MEDIUM	INTERNAL	2026-01-07 10:47:47.134	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782866998-4-EBT8	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Proposer des recommandations	2026-01-07 10:47:47.134	DRAFT
cmk3w9y2q000v774jwh7ycq7h	Processus incluant l'identification des moments signature	FLOW	MEDIUM	INTERNAL	2026-01-07 10:47:47.138	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782866998-1-83OL	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir le marketing de l'expérience client	2026-01-07 10:47:47.138	DRAFT
cmk3w9y2o000r774jw9vfn5vj	Processus incluant la définition du plan stratégique de la distribution	FLOW	MEDIUM	INTERNAL	2026-01-07 10:47:47.136	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782866998-2-39H1	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir la stratégie vente et distribution	2026-01-07 10:47:47.136	DRAFT
cmk3w9y2p000t774jp3x36c4v	Processus de gestion des données incluant obtention des données de performance et satisfaction client	FLOW	MEDIUM	INTERNAL	2026-01-07 10:47:47.137	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782866998-8-Y64W	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Gérer les données de l'expérience client	2026-01-07 10:47:47.137	DRAFT
cmk3w9y34000y774jtbq3cftj	Processus d'amélioration avec COPC, Lean Six Sigma et Process Mining	FLOW	MEDIUM	INTERNAL	2026-01-07 10:47:47.152	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782866998-5-5JWL	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Proposer des méthodes d'amélioration	2026-01-07 10:47:47.152	DRAFT
cmk3w9y340010774jzaw6j3ls	Processus de déploiement d'outils de gestion des canaux	FLOW	MEDIUM	INTERNAL	2026-01-07 10:47:47.152	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767782866998-6-HV74	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Proposer des outils de gestion des canaux	2026-01-07 10:47:47.152	DRAFT
cmk3wl3es000bst0bgor7fyrk	Définition de la stratégie globale d'expérience client	FLOW	MEDIUM	INTERNAL	2026-01-07 10:56:27.268	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783387225-0-KOK1	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir la stratégie de l'expérience client	2026-01-07 10:56:27.268	DRAFT
cmk3wl3eu000gst0bejiwwt4m	Mesure et analyse de l'expérience globale des clients	FLOW	MEDIUM	INTERNAL	2026-01-07 10:56:27.27	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783387225-3-WDKL	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Piloter l'expérience client	2026-01-07 10:56:27.27	DRAFT
cmk3wl3ez000ist0bpmwvqnpi	Définition du plan stratégique de distribution	FLOW	MEDIUM	INTERNAL	2026-01-07 10:56:27.275	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783387225-2-XB4R	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir la stratégie vente et distribution	2026-01-07 10:56:27.275	DRAFT
cmk3wl3f2000nst0boj6vmoil	Proposer des outils de gestion des canaux digitaux	FLOW	MEDIUM	INTERNAL	2026-01-07 10:56:27.278	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783387225-6-YFTU	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Proposer des outils de gestion des canaux	2026-01-07 10:56:27.278	DRAFT
cmk3wl3f3000ost0bquyn9eoa	Proposer des méthodes d'amélioration avec COPC, Lean Six Sigma et Process Mining	FLOW	MEDIUM	INTERNAL	2026-01-07 10:56:27.278	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783387225-5-2FD0	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Proposer des méthodes d'amélioration	2026-01-07 10:56:27.278	DRAFT
cmk3wl3f1000kst0b8q3woerf	Proposer des recommandations digitales et commerciales	FLOW	MEDIUM	INTERNAL	2026-01-07 10:56:27.277	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783387225-4-RQM8	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Proposer des recommandations	2026-01-07 10:56:27.277	DRAFT
cmk3wl3fj000vst0bkdyl6qpv	Définition du marketing et identification des moments signature	FLOW	MEDIUM	INTERNAL	2026-01-07 10:56:27.295	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783387225-1-3HY4	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir le marketing de l'expérience client	2026-01-07 10:56:27.295	DRAFT
cmk3womhs001tst0b9gu27aty	Processus de définition du marketing et identification des moments signature	FLOW	MEDIUM	INTERNAL	2026-01-07 10:59:11.968	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783551948-1-93Z6	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir le marketing de l'expérience client	2026-01-07 10:59:11.968	DRAFT
cmk3womht001vst0b8uogfnnm	Processus de définition de la stratégie globale pour l'expérience client	FLOW	MEDIUM	INTERNAL	2026-01-07 10:59:11.969	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783551948-0-24TO	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir la stratégie de l'expérience client	2026-01-07 10:59:11.969	DRAFT
cmk3womhu001xst0blzbpis41	Processus de définition du plan stratégique de distribution	FLOW	MEDIUM	INTERNAL	2026-01-07 10:59:11.97	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783551948-2-8FCQ	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir la stratégie vente et distribution	2026-01-07 10:59:11.97	DRAFT
cmk3womhv001zst0bxn1g59dp	Processus de pilotage incluant mesure de recommandation et analyse globale	FLOW	MEDIUM	INTERNAL	2026-01-07 10:59:11.971	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767783551948-3-C5DY	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Piloter l'expérience client	2026-01-07 10:59:11.971	DRAFT
cmk3x29r0002sst0b53gczwxk	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:09:48.636	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767784188586-3-ROFG	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Accompagner le business développement de la vente & distribution	2026-01-07 11:09:48.636	DRAFT
cmk3x29rt002wst0bvfm66351	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:09:48.665	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767784188586-4-J9LV	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Améliorer les processus avec Lean Six Sigma	2026-01-07 11:09:48.665	DRAFT
cmk3x29si002yst0box2963rs	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:09:48.69	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767784188586-1-Y0VT	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Proposer des guidelines  commerciales	2026-01-07 11:09:48.69	DRAFT
cmk3x29sw0033st0bhw8oy5ya	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:09:48.705	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767784188586-7-41C6	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Définir et améliorer les  Parcours Client	2026-01-07 11:09:48.705	DRAFT
cmk3x29sz0035st0b9og16ofh	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:09:48.708	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767784188586-8-OKKU	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Améliorer les Parcours Client avec Process Mining	2026-01-07 11:09:48.708	DRAFT
cmk3x29td003bst0bwlry5lbz	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:09:48.721	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767784188586-6-380F	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Accompagner le déploiement de la Gestion par Processus 	2026-01-07 11:09:48.721	DRAFT
cmk3x29tf003dst0bzc3ssw5a	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:09:48.723	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767784188586-0-5IV4	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Réaliser des recommandations   sur le digital	2026-01-07 11:09:48.723	DRAFT
cmk3x29th003fst0b62iuasl0	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:09:48.725	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767784188586-5-HJ87	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser la performance avec COPC	2026-01-07 11:09:48.725	DRAFT
cmk3x29uw003mst0b39r2w1m0	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:09:48.776	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767784188586-2-HVF6	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Proposer des bonnes pratiques d’expérience client responsable	2026-01-07 11:09:48.776	DRAFT
cmk3ye86j004lst0bwls71nxx	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:47:06.091	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786425997-5-0U20	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Déployer l’outil « Jeux en ligne »	2026-01-07 11:47:06.091	DRAFT
cmk3ye86u004ost0bdpqbo1v7	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:47:06.101	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786425997-0-EKON	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Déployer le portail web	2026-01-07 11:47:06.101	DRAFT
cmk3ye874004wst0bi3mizldg	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:47:06.111	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786425997-1-E1OE	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Déployer le moteur de recherche	2026-01-07 11:47:06.111	DRAFT
cmk3ye873004tst0bfpx28nzx	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:47:06.108	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786425997-2-1NNY	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Déployer le portail e-shop	2026-01-07 11:47:06.108	DRAFT
cmk3ye873004vst0bly4ace33	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:47:06.112	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786425997-3-81WN	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Déployer l’outil « Vérification de l’identité »	2026-01-07 11:47:06.112	DRAFT
cmk3ye87e004zst0btmgv55el	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:47:06.12	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786425997-4-B0B2	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Déployer l’outil « Recueil du consentement »	2026-01-07 11:47:06.12	DRAFT
cmk3ylgtz0062st0bj7grjhol	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:52:43.895	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786763836-0-T4KR	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Animer la communauté Expérience Client	2026-01-07 11:52:43.895	DRAFT
cmk3ylgu10064st0b838vzxia	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:52:43.897	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786763836-2-K8A2	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Animer la communauté Digitale	2026-01-07 11:52:43.897	DRAFT
cmk3ylgu40068st0b5zisfb0q	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:52:43.901	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786763836-3-PF82	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Animer la communauté Relation Client	2026-01-07 11:52:43.901	DRAFT
cmk3ylgu6006cst0b2ruyc2jo	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:52:43.903	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786763836-5-08XZ	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Animer la communauté BPM	2026-01-07 11:52:43.903	DRAFT
cmk3ylgu7006est0btxxx87gk	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:52:43.903	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786763836-1-FKED	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Animer la communauté Vente & Distribution	2026-01-07 11:52:43.903	DRAFT
cmk3ylgu5006ast0bshjxnjfv	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:52:43.902	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786763836-4-922P	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Animer la communauté Lean Six Sigma	2026-01-07 11:52:43.902	DRAFT
cmk3yo0fr0078st0bvrcckrou	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:54:42.615	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786882600-1-OAUB	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Obtenir les données de performance des canaux	2026-01-07 11:54:42.615	DRAFT
cmk3yo0fr007ast0bstxjbuxd	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:54:42.616	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786882600-2-QFRF	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Mettre en visibilité les données de l’expérience client	2026-01-07 11:54:42.616	DRAFT
cmk3yo0fu007cst0bo2trakkc	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:54:42.618	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786882600-0-Y8VN	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Obtenir les donnes de satisfaction client	2026-01-07 11:54:42.618	DRAFT
cmk3yqfh3007sst0bji27nu5b	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 11:56:35.416	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767786995366-0-V7TI	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Définir la stratégie de l’expérience client	2026-01-07 11:56:35.416	DRAFT
cmk3z5eh10082st0bbfjx80ug	\N	SIPOC	MEDIUM	INTERNAL	2026-01-07 12:08:13.958	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	ANALYSER_EXPERIENCE	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyser experience	2026-01-07 12:08:13.958	DRAFT
cmk3z97sv0085st0bitpnbflt	\N	SIPOC	MEDIUM	INTERNAL	2026-01-07 12:11:11.936	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	MESURER_LA_RECOMMENDATION	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Mesurer la recommendation des clients	2026-01-07 12:11:11.936	DRAFT
cmk40d85c008dst0b5mc92lzk	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:42:18.624	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767789738510-0-0URG	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 1	2026-01-07 12:42:18.624	DRAFT
cmk40d85g008fst0bniojam6x	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:42:18.628	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767789738510-1-2W5I	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 2	2026-01-07 12:42:18.628	DRAFT
cmk40d86r008mst0bk02xh8vb	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:42:18.675	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767789738510-2-WJW8	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 3	2026-01-07 12:42:18.675	DRAFT
cmk40ovuw009hst0bd2ihj0xf	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:51:22.568	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767790282405-6-JI44	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 1	2026-01-07 12:51:22.568	DRAFT
cmk40ovvm009mst0b4blsgguw	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:51:22.594	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767790282405-1-V8YC	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 1	2026-01-07 12:51:22.594	DRAFT
cmk40ovw2009ost0b4xrvzkgx	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:51:22.61	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767790282405-2-3QUW	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 2	2026-01-07 12:51:22.61	DRAFT
cmk40ovwh009qst0bx5flnouw	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:51:22.625	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767790282405-3-4L3C	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 1	2026-01-07 12:51:22.625	DRAFT
cmk40ovx800a2st0bhu2rt6xh	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:51:22.652	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767790282405-5-7LWP	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 1	2026-01-07 12:51:22.652	DRAFT
cmk40ovxm00a4st0bwsh3x302	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:51:22.666	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767790282405-0-9RC2	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 1	2026-01-07 12:51:22.666	DRAFT
cmk40ovzk00abst0bqw8oospn	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 12:51:22.733	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767790282405-4-CJS6	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 1	2026-01-07 12:51:22.733	DRAFT
cmk431cng000qiy36qgi8teod	Élaboration et mise à jour de la stratégie RH en alignement avec la stratégie d'entreprise	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:03.436	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-0-9VT8	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Définition de la stratégie RH	2026-01-07 13:57:03.436	DRAFT
cmk431cng000siy36af9r0nd0	Identification, attraction et sélection des candidats adaptés aux postes	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:03.434	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-3-2AC3	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Recrutement et sélection	2026-01-07 13:57:03.434	DRAFT
cmk431cnh000wiy36034htlqe	Accueil et intégration des nouveaux collaborateurs dans l'organisation	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:03.435	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-4-V46U	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Intégration et onboarding	2026-01-07 13:57:03.435	DRAFT
cmk431cnh000yiy361e4bbrh2	Anticipation des besoins en compétences et planification des effectifs	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:03.435	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-2-8S5C	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Gestion prévisionnelle des emplois et compétences	2026-01-07 13:57:03.435	DRAFT
cmk431cni0010iy363b0f47p8	Développement et promotion de l'image de l'entreprise comme employeur	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:03.434	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-5-GICB	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Gestion de la marque employeur	2026-01-07 13:57:03.434	DRAFT
cmk431cnh000viy36besokaga	Processus d'évaluation annuelle et de suivi de la performance individuelle	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:03.437	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-7-X6MT	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Évaluation de la performance	2026-01-07 13:57:03.437	DRAFT
cmk431cnt0013iy36ttst5zk3	Animation du dialogue avec les représentants du personnel et négociations	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:03.449	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-12-DL0M	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Dialogue social et relations syndicales	2026-01-07 13:57:03.449	DRAFT
cmk431cnx0017iy36uxeju3ss	Suivi des indicateurs RH et analyse de la performance des processus	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:03.453	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-1-RA31	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Pilotage de la performance RH	2026-01-07 13:57:03.453	DRAFT
cmk431cnv0015iy3688h7kn6l	Amélioration des conditions de travail et du bien-être des collaborateurs	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:03.451	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-14-KR91	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Qualité de vie au travail	2026-01-07 13:57:03.451	DRAFT
cmk431dcc001xiy36vd4kw22y	Prévention des risques professionnels et promotion de la santé au travail	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:04.333	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-13-1XBN	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Santé et sécurité au travail	2026-01-07 13:57:04.333	DRAFT
cmk431df20026iy36bfd301y3	Gestion administrative des dossiers individuels et des formalités légales	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:04.431	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-9-OWLG	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Administration du personnel	2026-01-07 13:57:04.431	DRAFT
cmk431df30028iy368uofmmck	Calcul et versement des rémunérations et charges sociales	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:04.431	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-10-KSGA	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Gestion de la paie	2026-01-07 13:57:04.431	DRAFT
cmk431dfk002giy366tvczc6g	Conception et déploiement des plans de formation et de développement des compétences	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:04.448	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-6-3Y9D	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Formation et développement	2026-01-07 13:57:04.448	DRAFT
cmk431dfl002miy36ldpapsem	Suivi des présences, congés et temps de travail	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:04.45	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-11-RWN6	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Gestion des temps et activités	2026-01-07 13:57:04.45	DRAFT
cmk431dfo002oiy360l2cl36h	Accompagnement de l'évolution professionnelle et de la mobilité interne	FLOW	MEDIUM	INTERNAL	2026-01-07 13:57:04.452	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794223223-8-U3UT	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Gestion des carrières et mobilité	2026-01-07 13:57:04.452	DRAFT
cmk4331d0003jiy36wcsva2kq	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 13:58:22.116	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794302092-1-2GRX	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Améliorer les processus avec Lean Six Sigma	2026-01-07 13:58:22.116	DRAFT
cmk4331d2003miy366kil00l3	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 13:58:22.118	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767794302092-0-HYGK	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Analyser la performance avec COPC	2026-01-07 13:58:22.118	DRAFT
cmk43jqv9003yiy36jz7z0v2d	Processus structuré d'évaluation de la performance des collaborateurs comprenant la préparation, l'entretien d'évaluation, la définition d'objectifs et le suivi régulier. Ce processus garantit une évaluation équitable et un développement professionnel continu.	FLOW	MEDIUM	INTERNAL	2026-01-07 14:11:21.669	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-VALUATION-1599	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Évaluation annuelle et suivi de la performance	2026-01-07 14:11:21.669	DRAFT
cmk43lac3006eiy36kzjh2k4g	Processus d'évaluation annuelle des performances des employés incluant l'auto-évaluation, l'évaluation managériale et la validation RH. Ce processus permet d'établir les objectifs pour l'année suivante et de déterminer les actions de développement professionnel.	FLOW	MEDIUM	INTERNAL	2026-01-07 14:12:33.555	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-PROCESSUS-3522	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Processus d'Évaluation des Performances	2026-01-07 14:12:33.555	DRAFT
cmk43qzcs0090iy36wvirf09b	Processus d'amélioration continue utilisant la méthodologie Lean Six Sigma pour identifier, analyser et optimiser les processus organisationnels. Ce processus vise à éliminer les gaspillages et réduire la variabilité pour améliorer la performance globale.	FLOW	MEDIUM	INTERNAL	2026-01-07 14:16:59.243	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-AMLIORER-9219	\N	\N	\N	cmk431cds0002iy3665bz2xy1	\N	Améliorer les processus avec Lean Six Sigma	2026-01-07 14:16:59.243	DRAFT
cmk46w0ij0002li17bqla8dnc	Processus d'analyse des données clients pour améliorer la relation client et optimiser l'expérience utilisateur. Ce processus permet de collecter, analyser et exploiter les données comportementales et transactionnelles des clients.	FLOW	MEDIUM	INTERNAL	2026-01-07 15:44:52.886	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-ANALYSEDE-2818	\N	\N	\N	cmk2pq1wq002nq6od7j4afiuy	\N	Analyse de données relation clients	2026-01-07 15:44:52.886	DRAFT
cmk47gp250038li17ff6csg0d	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:00:57.821	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801657675-1-9KS6	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Analyser l’expérience  globale des clients des filiales	2026-01-07 16:00:57.821	DRAFT
cmk47gp2e003bli17d5sd51n9	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:00:57.831	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801657675-3-FEQF	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Améliorer les processus avec Lean Six Sigma	2026-01-07 16:00:57.831	DRAFT
cmk47gp2y003lli17fbalp3kh	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:00:57.851	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801657675-5-599C	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Définir et améliorer les Parcours Client	2026-01-07 16:00:57.851	DRAFT
cmk47gp40003qli17k66uc6rj	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:00:57.888	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801657675-0-F089	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Mesurer la recommandation des clients	2026-01-07 16:00:57.888	DRAFT
cmk47jeyy0050li17zetkf7hn	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:03:04.714	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801784667-3-TWLT	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 4	2026-01-07 16:03:04.714	DRAFT
cmk47gp2g003gli17eqkrkupe	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:00:57.833	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801657675-6-S59I	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Améliorer les Parcours Client avec Process Mining	2026-01-07 16:00:57.833	DRAFT
cmk47jezb0052li175vtjkevz	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:03:04.727	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801784667-0-JQGZ	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Analymaturitéser la digitale	2026-01-07 16:03:04.727	DRAFT
cmk47gp2i003ili17ariri9ar	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:00:57.834	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801657675-2-ZG0G	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Analyser la performance avec COPC	2026-01-07 16:00:57.834	DRAFT
cmk47jezh0055li17ug3xlvfn	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:03:04.733	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801784667-2-L2I1	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 3	2026-01-07 16:03:04.733	DRAFT
cmk47gp3a003nli17pvqa21pj	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:00:57.863	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801657675-4-ECOX	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Accompagner le déploiement de la Gestion par Processus	2026-01-07 16:00:57.863	DRAFT
cmk47jeyt004wli17r8dbearx	\N	FLOW	MEDIUM	INTERNAL	2026-01-07 16:03:04.71	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-1767801784667-1-UPZ8	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Processus 2	2026-01-07 16:03:04.71	DRAFT
cmk47loup005oli1751lt9okn	Ce processus guide l'accompagnement organisationnel pour le déploiement d'une démarche de gestion par processus. Il couvre l'évaluation de la maturité, la formation des équipes, l'implémentation et le suivi de l'adoption.	FLOW	MEDIUM	INTERNAL	2026-01-07 16:04:50.833	\N	\N	\N	cmk2phbcj0003q6od9akuiql5	\N	cmjjuyha4000kvckyggis8670	\N	PROC-ACCOMPAGNE-0808	\N	\N	\N	cmk3vikem000211vqjfh8vi4p	\N	Accompagner le déploiement de la Gestion par Processus	2026-01-07 16:04:50.833	DRAFT
\.


--
-- Data for Name: qualigram_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.qualigram_tags (id, name, color, "createdAt") FROM stdin;
\.


--
-- Data for Name: reading_confirmations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reading_confirmations (id, "userId", "confirmedAt", "processId") FROM stdin;
\.


--
-- Data for Name: risks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risks (id, "processId", description, level, probability, impact, mitigation, owner, "order") FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, type, "unitId", color, description) FROM stdin;
cmjjuyh9u000fvckyc66y73ii	Internal Staff	INTERNE	\N	#007bff	Internal Orange employees
cmjjuyh9x000gvckyq6dkvbo1	External Consultant	EXTERNE	\N	#6c757d	External consultants and contractors
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, key, value, type, category, description, "isEncrypted", "isPublic", metadata, "createdAt", "updatedAt") FROM stdin;
6d84a6bf-ef8e-464e-aab5-344191210cf8	ai.provider	openai	STRING	ai	Fournisseur IA par défaut (openai, anthropic, azure)	f	f	{"options": ["openai", "anthropic", "azure"]}	2025-12-24 10:15:29.179	2025-12-24 10:15:29.179
61868708-b7c5-43ad-942a-18ddfea94af6	ai.openai.apiKey	\N	SECRET	ai	Clé API OpenAI	t	f	{"placeholder": "sk-..."}	2025-12-24 10:15:29.186	2025-12-24 10:15:29.186
84ca47ee-ba50-449c-a006-b57a8f9c58d2	ai.openai.model	gpt-4	STRING	ai	Modèle OpenAI par défaut	f	f	{"options": ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"]}	2025-12-24 10:15:29.188	2025-12-24 10:15:29.188
df25b7cf-eb5a-47bb-9797-d284493ae161	ai.anthropic.apiKey	\N	SECRET	ai	Clé API Claude (Anthropic)	t	f	{"placeholder": "sk-ant-..."}	2025-12-24 10:15:29.191	2025-12-24 10:15:29.191
da1b3c2d-0120-4ded-a999-1a01f2162762	ai.anthropic.model	claude-3-sonnet-20240229	STRING	ai	Modèle Claude par défaut	f	f	{"options": ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"]}	2025-12-24 10:15:29.194	2025-12-24 10:15:29.194
f95d5f46-528f-4954-a203-d90203cbe91c	ai.temperature	0.7	NUMBER	ai	Température pour la génération (0.0 = déterministe, 1.0 = créatif)	f	f	{"max": 1, "min": 0, "step": 0.1}	2025-12-24 10:15:29.197	2025-12-24 10:15:29.197
70de8490-96f2-4782-99b2-230b1a31c9d4	ai.maxTokens	4000	NUMBER	ai	Limite maximale de tokens par requête	f	f	{"max": 100000, "min": 100}	2025-12-24 10:15:29.199	2025-12-24 10:15:29.199
6c2f4421-e680-4703-a3f0-d59616500d91	app.name	MAGNA - Process Manager	STRING	app	Nom de l'application	f	t	\N	2025-12-24 10:15:29.202	2025-12-24 10:15:29.202
7683d5ee-cfb3-4a74-bd4b-4c4c15f6ca61	app.logo	/logo.svg	FILE	app	URL ou chemin du logo de l'application	f	t	\N	2025-12-24 10:15:29.204	2025-12-24 10:15:29.204
970300ac-4bc8-4603-9508-1a0bb1d4c8dc	app.favicon	/favicon.ico	FILE	app	URL ou chemin du favicon	f	t	\N	2025-12-24 10:15:29.206	2025-12-24 10:15:29.206
5d6b84d5-f68b-4dc3-b280-27e8c788c8ea	app.primaryColor	#FF7900	STRING	app	Couleur principale de l'application (hex)	f	t	{"format": "color"}	2025-12-24 10:15:29.208	2025-12-24 10:15:29.208
76e9d28e-32a9-4874-bcd7-c9768365ba44	app.language	fr	STRING	app	Langue par défaut	f	t	{"options": ["fr", "en", "ar"]}	2025-12-24 10:15:29.213	2025-12-24 10:15:29.213
e0cc1b70-8d26-4e80-b914-388040b24180	app.timezone	Europe/Paris	STRING	app	Fuseau horaire par défaut	f	t	\N	2025-12-24 10:15:29.216	2025-12-24 10:15:29.216
614be9a3-50ca-48a8-aabc-dbb62382fc48	system.maintenanceMode	false	BOOLEAN	system	Activer le mode maintenance	f	f	\N	2025-12-24 10:15:29.22	2025-12-24 10:15:29.22
787a02d8-5910-422a-bfd1-77299ffded4b	system.allowRegistration	false	BOOLEAN	system	Autoriser les inscriptions publiques	f	f	\N	2025-12-24 10:15:29.223	2025-12-24 10:15:29.223
a0d085ba-6c1c-4562-b6af-e25e75b311db	system.sessionTimeout	480	NUMBER	system	Durée de session en minutes	f	f	{"max": 1440, "min": 15}	2025-12-24 10:15:29.225	2025-12-24 10:15:29.225
9be54af9-f11c-4c75-a072-237d96986b8f	email.smtp.host	\N	STRING	email	Serveur SMTP	f	f	{"placeholder": "smtp.example.com"}	2025-12-24 10:15:29.228	2025-12-24 10:15:29.228
84ebea46-d355-45f8-aef6-7b6938c013b1	email.smtp.port	587	NUMBER	email	Port SMTP	f	f	\N	2025-12-24 10:15:29.23	2025-12-24 10:15:29.23
79497258-96cb-4946-ae0f-5d6aed5410bf	email.smtp.user	\N	STRING	email	Nom d'utilisateur SMTP	f	f	\N	2025-12-24 10:15:29.232	2025-12-24 10:15:29.232
0d54f236-6619-4511-9dec-d31d1638889d	email.smtp.password	\N	SECRET	email	Mot de passe SMTP	t	f	\N	2025-12-24 10:15:29.234	2025-12-24 10:15:29.234
57577ae9-2dc3-4277-9886-b6cd500ad9bb	email.from.name	MAGNA Process Manager	STRING	email	Nom de l'expéditeur par défaut	f	f	\N	2025-12-24 10:15:29.236	2025-12-24 10:15:29.236
6c2fc7a8-6fb9-4174-8526-70202d25a7ba	email.from.address	noreply@magna.orange.tn	STRING	email	Adresse email de l'expéditeur par défaut	f	f	{"format": "email"}	2025-12-24 10:15:29.238	2025-12-24 10:15:29.238
\.


--
-- Data for Name: sipoc_connections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sipoc_connections (connection_id, "documentId", source_element_id, target_element_id, description, status, "createdAt", "updatedAt", sipoc_id, source_sipoc_id, target_sipoc_id) FROM stdin;
\.


--
-- Data for Name: sipoc_diagrams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sipoc_diagrams (sipoc_id, "documentId", title, description, process_owner, department, status, "createdAt", "updatedAt", is_template, "createdBy", "processId") FROM stdin;
12bd14dc-dfc2-4815-9b61-799ad3afc948	5c5d3b5e-12eb-4e4d-836b-7770d8dffff3	Analyser experience	\N	\N	\N	draft	2026-01-07 12:08:13.969	2026-01-07 12:08:13.969	f	cmjjuyha4000kvckyggis8670	cmk3z5eh10082st0bbfjx80ug
02f641b8-152a-4c71-8272-02b4b5a145ae	23fc8daa-4a58-48fe-9151-13b22ff76206	Mesurer la recommendation des clients	\N	\N	\N	draft	2026-01-07 12:11:11.945	2026-01-07 12:11:11.945	f	cmjjuyha4000kvckyggis8670	cmk3z97sv0085st0bitpnbflt
\.


--
-- Data for Name: sipoc_elements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sipoc_elements (id, "documentId", type, title, description, "position", "globalOrder", flow_id, "createdAt", "updatedAt", "contactInfo", "qualityCriteria", "responsibleRole", duration, sipoc_id) FROM stdin;
f23e5572-ea10-4324-8348-e72f3e0b1fbe	c00749c7-005a-4ddb-8cb1-2026c8fb7ddb	process	Description macro		0	\N	f4908887-70c6-4e5d-bc37-4e68c4c22243	2026-01-07 12:08:53.561	2026-01-07 12:08:53.561	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
571b9c88-8baa-4539-a7d3-0915d083b3cd	b5e70c5a-2405-4471-92a3-e96935030a81	supplier	Fournisseurs des ressources		0	\N	f4908887-70c6-4e5d-bc37-4e68c4c22243	2026-01-07 12:08:53.587	2026-01-07 12:08:53.587	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
0a6d0023-375f-452f-827b-b501d796045c	f00d3f52-1a4f-48c5-abca-e47a06e74994	input	Ressources nécessaires au processus		0	\N	f4908887-70c6-4e5d-bc37-4e68c4c22243	2026-01-07 12:08:53.598	2026-01-07 12:08:53.598	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
18d75568-66db-4371-99f4-71e86316e232	20f3a0d7-bf97-4ca6-9df1-992ae0261257	output	Sorties du processus		0	\N	f4908887-70c6-4e5d-bc37-4e68c4c22243	2026-01-07 12:08:53.611	2026-01-07 12:08:53.611	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
0aad9c2e-12ef-4ca4-b106-aa3d8bb5ed7e	8d3ab6d7-8799-4d2b-a492-8b911284de20	customer	Clients du processus		0	\N	f4908887-70c6-4e5d-bc37-4e68c4c22243	2026-01-07 12:08:53.624	2026-01-07 12:08:53.624	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
0242a8cd-b852-40dc-88d1-905e863b3fa0	a2baaaa2-7b78-4c43-b78b-68de0afa3662	process	Accord de la filiale pour réaliser l'étude		1	\N	1fabe50a-0a41-44bc-8248-bb5d52dcbd7f	2026-01-07 12:08:53.633	2026-01-07 12:08:53.633	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
54e8c7b8-d535-4a23-abd0-f1fde42e0cd2	d59662f8-ea17-40b7-8dbc-18dead76a2d8	supplier	<		0	\N	1fabe50a-0a41-44bc-8248-bb5d52dcbd7f	2026-01-07 12:08:53.645	2026-01-07 12:08:53.645	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
92bd6933-08ab-4a7e-95ba-43b96ca0c0ed	786c13d9-3ca4-4d9b-9bd5-e069d1a84265	customer	- Filial : Dir CX, CR, Digital, Ventes, RSE		0	\N	1fabe50a-0a41-44bc-8248-bb5d52dcbd7f	2026-01-07 12:08:53.656	2026-01-07 12:08:53.656	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
e209f3d1-2d40-437f-80a6-1a6bb370015b	d81b4aca-fee1-423f-8bae-ba5508bd2f89	customer	- CXO experts		1	\N	1fabe50a-0a41-44bc-8248-bb5d52dcbd7f	2026-01-07 12:08:53.666	2026-01-07 12:08:53.666	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
47b3d085-299f-46ef-b275-d1c43c819b41	34825a4f-d779-4e3f-9a17-2da2cda4e11a	customer	- Zone CX Directors		2	\N	1fabe50a-0a41-44bc-8248-bb5d52dcbd7f	2026-01-07 12:08:53.676	2026-01-07 12:08:53.676	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
57e4d95f-9b10-4e06-8258-ad11952b05c6	f1501a6a-8194-4b04-b3a1-a2d137254ba0	process	Kick off with affiliate stakeholders chapter owners & experts		2	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.684	2026-01-07 12:08:53.684	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
91a0a92d-9aea-448f-91a9-b131cbc12c7d	6f6ed6b3-28b9-4b4b-aaea-e53d792b5d44	supplier	- Group Brand Director		0	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.693	2026-01-07 12:08:53.693	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
c086dfb4-fc07-43b4-8d6e-fcce8ea01651	65d65862-3db4-443b-a7bb-946cbbdd1ed7	supplier	- Dir CX filial		1	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.702	2026-01-07 12:08:53.702	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
48d28410-aaf3-4d7d-8eb2-41ca240cbbdb	4fef1154-4413-4cd2-a570-2841dd0905f3	input	- Go official CEO affiliate		0	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.711	2026-01-07 12:08:53.711	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
ea4b49f9-6b75-427d-ae09-2774bfdaf690	2a4f7bd0-ac46-4b94-86a7-9f47982992c6	input	- CX Review framework		1	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.719	2026-01-07 12:08:53.719	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
934cc72c-6065-47fc-ba44-941c68eb6405	0553bd4f-3e44-487a-bdc2-86d2892a3f66	input	- Timeline & experts CXO		2	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.728	2026-01-07 12:08:53.728	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
53dc89f6-80af-42fa-9bb1-dcd4953a8133	8ddebc7a-8128-4b02-84e9-803ff59a70c6	input	- Interlocuteurs pays		3	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.737	2026-01-07 12:08:53.737	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
b80031ce-88d2-47bc-ae61-7fc7893b470c	53621e3d-9d3d-41c1-b55a-9728c417ec38	output	- oficialisation des contacts experts CXO et filial		0	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.746	2026-01-07 12:08:53.746	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
ae30dccf-a4f6-440e-a73e-6d6e2978c2da	6aac2fc7-e3fb-44f1-bc05-0617ede7bbf1	output	- CX Review framework et experts presentés		1	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.756	2026-01-07 12:08:53.756	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
71458af8-c523-403d-86aa-adbf149f6120	f8e12935-1530-4c0c-8ca7-3e53d7ac6aa3	output	- Besoins de colaboration exprimés		2	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.764	2026-01-07 12:08:53.764	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
5ffd2f0c-c0a7-4494-b212-7326c00dcdb8	a36665db-eb44-4beb-ad18-f559d7d8fe70	customer	- Filial : Dir CX, CR, Digital, Ventes, RSE		0	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.772	2026-01-07 12:08:53.772	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
40c16b3a-ef9a-484e-9519-93305382238d	6cff0f9a-64b0-44ee-b75a-6feb2a831eea	customer	- CXO experts		1	\N	0bc61881-166b-4cc6-8d33-7d675289f66e	2026-01-07 12:08:53.781	2026-01-07 12:08:53.781	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
c97acd7b-a4af-45f4-9a41-bdbbad8e28f5	dcbc03bd-04af-40fd-8780-394cd7dfe365	process	Gather facts : affiliate strategy, priorities and ambition (Interview affiliate operationals, zone directors)		3	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.791	2026-01-07 12:08:53.791	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
1e407b6e-2d0a-4037-88d1-8ed765794f2d	b6eaec7f-9796-4476-861f-08a8a5f6c032	supplier	Country operational experts		0	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.799	2026-01-07 12:08:53.799	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
701ddc72-5654-4e14-90c9-4603322f0241	00f59a92-faa1-4091-b07d-76db35aca630	supplier	Zones (Europe & MEA)		1	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.812	2026-01-07 12:08:53.812	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
35c0cb58-6f85-4293-8784-fc1b3b727870	77aea0e0-0063-40cd-84d5-78444531de74	supplier	Brand Team		2	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.819	2026-01-07 12:08:53.819	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
ddd123b9-1f29-4533-85e0-1193b05547c7	645a4004-cf4e-421f-a30f-bc755a64a37f	supplier	Affiliate CX director, Cr, Sales, Maketing, CSR		3	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.827	2026-01-07 12:08:53.827	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
9e1da1f8-5f66-4727-936d-dbbab423881a	a44e423f-e934-423a-a6c6-c553aa6349f1	supplier	INNOV		4	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.836	2026-01-07 12:08:53.836	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
8101f8ef-002c-4db9-a5d9-be70ae04a7ad	0f322f04-c88e-43ee-97f7-efc4f133bb36	supplier	FINANCE GROUPE		5	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.843	2026-01-07 12:08:53.843	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
c971e8df-8779-44e7-af57-f4c6f5667047	f50059a3-0b26-49c0-9c85-2c21518ad0b1	input	- Strategic Plan, Plan de Marketing, CSR report		0	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.851	2026-01-07 12:08:53.851	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
05877797-7d1e-4b9c-9412-178ffaade36c	cf3438ab-ba64-4268-a529-46dd6fff59de	input	- Stratégie digitale (ventes, care & trafic)		1	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.861	2026-01-07 12:08:53.861	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
2b6b3bfc-ef73-45ea-b457-e8e826f7fc89	22b77533-db2b-44d4-b032-598ef35f66c8	input	- Principaux concurrents		2	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.915	2026-01-07 12:08:53.915	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
f2e5a414-166c-4f1d-abda-673165c9315e	3e28dcdb-08d5-4a03-817c-adbf01a6ef91	input	- Fiche Pays		3	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.943	2026-01-07 12:08:53.943	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
a45301c9-b3a9-4812-ac0f-b180dec96daf	60fffdf1-8458-49f7-91d9-2d6a0607889b	input	-  Rapoprt Extra Financiere		4	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.963	2026-01-07 12:08:53.963	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
9d7cd478-ce53-44d3-8630-3b833691a2b1	e99455d2-f754-40e1-85bc-b46f71bc5aac	input	- QBR		5	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.98	2026-01-07 12:08:53.98	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
63c824fc-3401-46fc-8849-5f6cfaae129c	2629d60d-0540-4398-a972-e9d6a303b8f3	input	-  legal contraints		6	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.99	2026-01-07 12:08:53.99	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
5c2e60a6-0ffe-4cfd-bd95-f13a0673d677	9e6fe816-4ba4-4c5f-b56f-8f4134c7812a	input	- channel mix		7	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:53.999	2026-01-07 12:08:53.999	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
b70394d2-2ce2-47da-8e69-e8f12f78ae58	719f4d3b-cf08-4125-a730-918c74f8e8ed	input	-  - Brand review		8	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:54.022	2026-01-07 12:08:54.022	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
88cb8079-c01b-4255-8d89-9af857a009cf	a8ca8ea9-81ff-42a5-8dfc-01b8e837cd1d	output	Picture of affiliate startegy and  local market		0	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:54.031	2026-01-07 12:08:54.031	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
dbde9247-d33e-4faf-8daa-1dbe06974bf2	565712da-7820-4f5c-9802-2fbb4f1de021	customer	- CXO experts		0	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:54.041	2026-01-07 12:08:54.041	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
6a801d9e-4181-4ed2-b57f-b115169bfd8c	a25a3827-5552-44ab-a8b3-a23aeaa06efb	customer	- CXO CX Review core team		1	\N	e5438e5b-4a4f-4953-980a-da4538ce927c	2026-01-07 12:08:54.05	2026-01-07 12:08:54.05	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
526f34cd-de77-4f5b-a011-ed14162e1ec7	3284b526-cf7e-41ff-bb4a-8d5a75a5a708	process	Gather data		4	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.059	2026-01-07 12:08:54.059	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
0010ca98-426f-409f-a431-4f3ccbb16699	6d05553a-ac5b-4a9b-b98c-8ee27ca9d7cb	supplier	CXO Listening Factory		0	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.066	2026-01-07 12:08:54.066	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
86c47192-e238-404a-9312-a1333c80a1fb	d9160197-54e8-4f70-83c0-407026b5a7bb	supplier	MEA CX		1	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.074	2026-01-07 12:08:54.074	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
a74dfc7d-386d-4c44-9209-64b22147d821	cced9cd7-123a-461d-9b6c-0c4e6b84bd78	supplier	- Directions metier filiale		2	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.083	2026-01-07 12:08:54.083	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
6265ec36-6500-4b8e-a695-cf9e2513beb0	f52597d8-beb0-4ef0-8511-e5d910fcbee7	supplier	CXO Listening Factory		3	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.09	2026-01-07 12:08:54.09	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
6ca54714-a7e3-49ca-82e4-029473e25575	522be452-302a-420b-a8e9-ca5d53db88d8	supplier	Affiliate, MEA Zone CX (kibana)		4	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.097	2026-01-07 12:08:54.097	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
11f3de64-150a-451d-8a7a-d2bdd28a3180	c19cf999-a13d-400b-9b69-e6c5e0053e76	supplier	Europe Sales		5	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.106	2026-01-07 12:08:54.106	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
4aaad634-2f95-421a-8623-3beba1172100	e68e986c-956e-4586-827b-d80d261e7762	supplier	- Listening Factory (ou Dir Digital)		6	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.114	2026-01-07 12:08:54.114	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
91076876-7984-4791-97c2-8b458f18c12a	fc5d5d77-7f55-49c0-982a-ce73cf239010	supplier	- Zone ou Filiale		7	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.121	2026-01-07 12:08:54.121	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
d96a3c8f-b41e-4c11-9b2b-d24234243e92	6a673e5f-2a58-4042-b3c2-4413ca58924b	supplier	CXO Listening Factory		8	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.129	2026-01-07 12:08:54.129	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
7100ceb2-00e0-4489-ad65-c2e301ddf6c8	0271f7ae-4e6c-427e-9a3c-e32a5c6cf029	supplier	INNOV accesibilité		9	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.139	2026-01-07 12:08:54.139	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
9f52479a-3bec-45d9-97cf-7dea15aac1af	fc4f0af2-3e03-4857-ba0c-261ede5ddaad	supplier	Affiliate		10	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.147	2026-01-07 12:08:54.147	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
37f9ca97-4726-49ae-91e7-66d262d30f2f	82f0a766-97d9-4a40-a871-240af2ff27ac	input	- Customer Voice data :		0	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.157	2026-01-07 12:08:54.157	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
4ff16f03-2de9-4e7e-b99a-1ad5a2651c44	ec45c5bb-c557-4ce2-ab0c-95ce426eb14c	input	- CX Tracker,		1	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.167	2026-01-07 12:08:54.167	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
5ddd01c1-5ef3-47af-a659-76a3f16c66c8	0ef8ca5b-71a0-4bb9-a4b7-182213ebcea2	input	- verbatims on apps and websites		2	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.182	2026-01-07 12:08:54.182	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
5ed46c9f-b3bb-4463-86a8-1578b275df40	bacd8c39-8c37-4689-8358-5f8a93a491c0	input	-  Enquetes de satisfaction de tous les cannaux (client, revendeur)		3	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.192	2026-01-07 12:08:54.192	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
69d2949a-f51f-4ab9-85ca-68f9c6f9b33b	08e67fe4-5573-4694-a06c-eb2740bd5a01	input	- Process Data :		4	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.204	2026-01-07 12:08:54.204	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
4b481dc9-b7c1-44f8-88de-bae754250185	ab845160-9398-492c-b827-331994e5fede	input	- Customer service Score Card (call centre, bots)		5	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.222	2026-01-07 12:08:54.222	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
a1d8d86f-d97d-47d3-b5e0-396723e998fd	9b400221-62a0-4675-a344-e8287af6c945	input	- Tableaux de bord digital (ventes, care, trafic & CSAT)		6	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.229	2026-01-07 12:08:54.229	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
dd2eff42-1317-47ee-9b0a-ca2552d475d7	609053eb-8c84-4198-9465-93635c31d463	input	- Dashboard sales.		7	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.236	2026-01-07 12:08:54.236	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
e4b1de58-913f-4459-b22b-9ff0a27dd560	a41e0506-9a91-4cf6-9dd2-f3a056189ec5	input	-Circular Economy dashboard		8	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.244	2026-01-07 12:08:54.244	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
d4bf8e66-7bc7-4504-8f45-addd804607af	57059543-65a9-4c9e-a028-fbda131f979f	input	- COPC Audits		9	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.252	2026-01-07 12:08:54.252	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
49e318b6-1616-4aaf-ac5a-19eb107cc46b	0d4ff5de-4521-4183-acec-7fb5a46d2fd1	input	Operational data		10	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.26	2026-01-07 12:08:54.26	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
b68104e8-3e3a-4011-93a1-f2b6d6cec644	93c35992-8e72-4f0a-8868-813447f49446	input	System data : QoS, SEO		11	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.267	2026-01-07 12:08:54.267	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
d690adc3-59dc-4e44-804c-4d865438df65	59e419cb-b342-434d-8571-1ac94392987b	input	- ventes et CA par canal et par produit		12	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.275	2026-01-07 12:08:54.275	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
0864bffa-3e19-46db-acb8-af522719f2ad	31468433-dd9b-4e83-a7e2-1950dcca2222	input	CSR Data : websites & apps energy comsomption, accesibility,		13	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.283	2026-01-07 12:08:54.283	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
a7e08067-c862-4ffc-980b-15ec492bd631	3f767175-60fe-41fc-a62e-b454dba09aac	input	Accès à des outils pour mener des analyses à distance : Google search console au niveau nom de domaine. Compte GA4 (incl. Pramétrages locaux)		14	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.293	2026-01-07 12:08:54.293	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
58f07dfb-c1bd-4a10-9b31-4dc88f179c8f	34807115-5b6c-492a-9c72-d7c192f82d24	output	Picture of local KPIs per chapter (OX, TX, EX, RX)		0	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.301	2026-01-07 12:08:54.301	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
a3ecffba-b22e-4567-bcef-a4536c5682e6	d50d702a-f9d8-418e-83e4-732648c397df	customer	- CXO experts		0	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.308	2026-01-07 12:08:54.308	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
620f0cd7-39aa-485f-9ca2-9e2503a3b2c6	7097511d-1b5f-4314-ac6e-380584c08502	customer	- CXO CX Review core team		1	\N	0c3c48bf-d415-4a04-b6fe-92abc9cede18	2026-01-07 12:08:54.316	2026-01-07 12:08:54.316	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
1e3c6a39-e9fd-42ba-8556-71b1e9a339ce	0767185b-c6ca-4552-b990-94e49a0d9a4f	process	Analyse customer journeys :  completenes, effort, preformance and efficiency (digital, physical, call centre)		5	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.324	2026-01-07 12:08:54.324	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
78474cdf-923a-46d7-9166-9612737ad7d8	c5f353fd-26fb-4ab0-91a5-bfb1497ad87a	supplier	Dir Digital		0	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.332	2026-01-07 12:08:54.332	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
1b52636c-844d-4f05-b61a-66c7bb7f0eaf	370870e4-504d-43f9-b6ff-742e1923ec74	supplier	Dir Digital		1	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.342	2026-01-07 12:08:54.342	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
5e2c34b6-2e04-41e7-b6fd-a88e3c15da2c	2ef31f85-f78b-4262-8b85-89b23ec4ee05	input	Compte test : ID et mot de passe test (ou autre moyen de se logger à l’app. ou au web)		0	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.349	2026-01-07 12:08:54.349	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
57428d2b-624e-4485-9020-b4be9070c70c	c18876a2-776e-4a11-af28-4885699da1e7	input	APK app. si non utilisable avec un compte de test en France. Carte SIM si besoin		1	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.361	2026-01-07 12:08:54.361	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
36acba59-e0f5-46e9-b24b-3178601a8c22	0b939017-b422-4733-947d-f0c34b5cd8b3	input	Auto evaluation filiale:		2	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.402	2026-01-07 12:08:54.402	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
38312e2a-26f1-41f6-9267-f0415a0a4222	253bc024-0ccf-4a3a-b828-1dce3d03f160	input	Grille maturité digitale		3	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.416	2026-01-07 12:08:54.416	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
079adcb4-ad5f-44a7-aa4d-016fe4a8171e	16dc2e68-5975-4289-9164-8b9d6b674eb3	input	Grille couverture fonctionnelle		4	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.43	2026-01-07 12:08:54.43	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
354cc2ed-7c84-4e93-9254-7de6ba2bce8c	ec595342-fdb8-4442-b4ac-fafa32678314	output	Picture of local digital Customer Journeys		0	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.439	2026-01-07 12:08:54.439	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
e4d4f984-0ccf-4a0d-bed5-a847b140dea2	387cdf7c-3028-4622-9466-134c352decad	customer	- CXO experts		0	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.446	2026-01-07 12:08:54.446	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
4af64efc-57a3-4c4f-bda8-a4d0f6f87136	d339fd49-d889-40b8-a760-1cd181139289	customer	- CXO CX Review core team		1	\N	03871b6d-5c89-45e3-a850-998eeaf7a667	2026-01-07 12:08:54.453	2026-01-07 12:08:54.453	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
a71679d1-1e9c-4b05-94a2-43a0aabbbf6c	7a7a9bb2-b1e6-4f2b-9c6c-494bef511810	process	Compare facts & data & Customer journeys with strategy, ther affilates and competition, standards		6	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.461	2026-01-07 12:08:54.461	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
1bc63117-8c21-4c3e-9af4-3f040f427c3a	702a6f9b-0e5e-41bb-a727-26a42e7bfd16	supplier	CXO Listening Factory		0	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.468	2026-01-07 12:08:54.468	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
6c71c5e4-03e3-4181-a189-46d5a3ced91c	a423001f-699a-4c66-8323-eb6e809f8e2b	supplier	CX Review Core Team		1	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.477	2026-01-07 12:08:54.477	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
2f4c0619-87b2-40aa-a666-77188ab4d95e	86d67e8f-d5c9-4135-afd4-d2d8229764a2	supplier	CXO Listening Factory		2	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.485	2026-01-07 12:08:54.485	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
1272a543-fca7-441b-b5fb-da971fc1a956	00e93595-6963-4a47-b2dc-6fcfc632bdb6	supplier	CX Review Core Team		3	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.492	2026-01-07 12:08:54.492	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
0eb6ab71-113c-4604-a631-63c43de7f695	70ae9808-0536-4b82-affc-87d5c7889f14	supplier	CXO Customer Ralations team		4	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.5	2026-01-07 12:08:54.5	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
a597b6c0-6322-4711-b278-b14585a0c78d	d36f30f1-93e3-480b-9778-92bbefaa4269	input	- CR Strategy, CX Strategy, Lead the Future, Digital acceleration		0	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.508	2026-01-07 12:08:54.508	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
8467f75f-8fd0-4f5b-901e-2e2d72183ee2	93517e9f-e279-4bb1-a901-c65130e20aec	input	- Facts from other affiliates and competition		1	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.517	2026-01-07 12:08:54.517	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
0e2fc113-7ee8-42fc-a272-45c4c5b8a27e	553c0f26-5369-4d71-9992-b728c4733c03	input	- Data from other affiliates and competition		2	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.527	2026-01-07 12:08:54.527	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
e812c68c-2a91-4dfe-b419-703a1c7f9713	0fbdd360-f16d-4515-b4c6-f730875c3f84	input	- Customer Journeys from other affiliates and competition		3	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.534	2026-01-07 12:08:54.534	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
41323d7a-9964-4afb-9481-1819395c44ee	934e4bbd-1fe9-4549-803d-8954acf84775	input	COPC standards		4	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.541	2026-01-07 12:08:54.541	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
c9a211ca-eb85-4f90-8fbf-e51bfda0dab1	a2f258da-a6ba-45e6-992c-611c7cf4afb6	output	Picture of affiliate towards competency		0	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.549	2026-01-07 12:08:54.549	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
71a00a7b-ed13-4f4d-8a1f-1241b48754cf	401b400b-a3cd-4238-8a65-1156000d86cb	customer	- CXO experts		0	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.557	2026-01-07 12:08:54.557	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
5024400f-4df0-406c-abf9-022a94a0b2ef	58afe361-8e88-4689-801f-e77354334e29	customer	- CXO CX Review core team		1	\N	52566adb-fcad-4e9b-a873-a00c0d7313e4	2026-01-07 12:08:54.565	2026-01-07 12:08:54.565	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
e456fc87-e445-4e62-8b0d-48d6bd507351	02c7da9c-e98d-4d27-b201-e4b27c9f5856	process	Select key priorities per chapter		7	\N	35ba0e17-59d7-4363-a0f3-6911c2c2e56d	2026-01-07 12:08:54.573	2026-01-07 12:08:54.573	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
53642990-d3ae-4843-a588-d339a54bcd3f	48a0d58d-5ebc-4844-8822-812cab634252	supplier	- CXO experts		0	\N	35ba0e17-59d7-4363-a0f3-6911c2c2e56d	2026-01-07 12:08:54.582	2026-01-07 12:08:54.582	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
a9a04890-394f-458c-985b-7a846f9a4095	67592238-8e91-4ae9-ac13-14e87f0a92c7	supplier	- CXO CX Review core team		1	\N	35ba0e17-59d7-4363-a0f3-6911c2c2e56d	2026-01-07 12:08:54.591	2026-01-07 12:08:54.591	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
a959c80e-e877-42b1-8936-f0b5283399da	dedf6fc9-654a-4b22-8d82-b40c316369de	input	- Picture of local KPIs per chapter (OX, TX, EX, RX)		0	\N	35ba0e17-59d7-4363-a0f3-6911c2c2e56d	2026-01-07 12:08:54.599	2026-01-07 12:08:54.599	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
34786873-262e-4280-98d4-2bcf56aa4104	93964778-358d-48e6-b586-0bb213a1990f	input	- Picture of local digital Customer Journeys		1	\N	35ba0e17-59d7-4363-a0f3-6911c2c2e56d	2026-01-07 12:08:54.608	2026-01-07 12:08:54.608	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
f7e2b693-6f5c-487e-86ba-0991ab90038a	df3fe4e4-5136-4401-9de9-4c364ea282ad	input	- Picture of affiliate towards competency		2	\N	35ba0e17-59d7-4363-a0f3-6911c2c2e56d	2026-01-07 12:08:54.616	2026-01-07 12:08:54.616	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
177a6c5b-19f6-40cf-826c-6fd09fb562f3	dd58b095-904d-42f8-859a-ace70bbd0ad6	output	Key priorities per chapter		0	\N	35ba0e17-59d7-4363-a0f3-6911c2c2e56d	2026-01-07 12:08:54.625	2026-01-07 12:08:54.625	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
dd6e4e9c-4122-41fc-ac5b-69e353c33c4f	bb1b91a6-e839-441c-bf71-123034e42ed3	customer	- CXO experts		0	\N	35ba0e17-59d7-4363-a0f3-6911c2c2e56d	2026-01-07 12:08:54.634	2026-01-07 12:08:54.634	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
e61b930d-fee2-4cf0-9777-aa2e077bbf8a	f1a5e401-efb9-43a5-8dca-80acf8636fb5	customer	- CXO CX Review core team		1	\N	35ba0e17-59d7-4363-a0f3-6911c2c2e56d	2026-01-07 12:08:54.646	2026-01-07 12:08:54.646	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
77386ac9-07bf-4e42-854b-8255b4c7b3bf	6c1d3e39-58cc-46ce-ae8b-18a7a8692176	process	Elaborate best practices & lessons learnt from other affiliates, competition local market or other markets and other industries. Offre d'accompagnement CXO		8	\N	96a51b57-6ac0-47b2-8052-6a3dec7a21fe	2026-01-07 12:08:54.654	2026-01-07 12:08:54.654	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
49f60498-398e-4493-b173-51c5872f495f	f89994ef-282b-48f8-813b-fb57585d6c35	supplier	- CXO experts		0	\N	96a51b57-6ac0-47b2-8052-6a3dec7a21fe	2026-01-07 12:08:54.662	2026-01-07 12:08:54.662	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
17c9ce8c-55ab-4ca8-9df9-cb4836445a67	4beef92a-dcd7-4a3b-bdb1-ac33f4abcce2	supplier	- CXO CX Review core team		1	\N	96a51b57-6ac0-47b2-8052-6a3dec7a21fe	2026-01-07 12:08:54.67	2026-01-07 12:08:54.67	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
fa6e8ed4-cf91-46f5-98c0-0dd5dec85785	e51fc747-d0ee-4a41-a64e-337f16009153	input	- Previous CX Reviews		0	\N	96a51b57-6ac0-47b2-8052-6a3dec7a21fe	2026-01-07 12:08:54.677	2026-01-07 12:08:54.677	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
fd1d672c-3c37-489f-9e4f-2adbee3dad53	8f39c9e4-33ed-4dbb-93c1-72652d4ff75a	output	Best pracitces slides		0	\N	96a51b57-6ac0-47b2-8052-6a3dec7a21fe	2026-01-07 12:08:54.684	2026-01-07 12:08:54.684	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
9af8b92e-18a0-4656-b284-9f791f90a0ae	c649957d-25c1-4202-8e5c-1a9a8616b6f2	customer	- CXO CX Review core team		0	\N	96a51b57-6ac0-47b2-8052-6a3dec7a21fe	2026-01-07 12:08:54.691	2026-01-07 12:08:54.691	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
8058eb50-54d8-4dd6-a9ac-73942e752c77	ba5c042a-3bfb-4577-995c-ba87380cca85	process	Consolidate information from all experts		9	\N	0a976a04-cf39-4f60-ad61-fb3b092545bf	2026-01-07 12:08:54.699	2026-01-07 12:08:54.699	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
2ba0f0af-74d6-41f4-9279-465c26943f5e	06489c63-019e-4957-8da8-827a40aedeaf	process	Validate CX Review messages with affiliate stakeholders		10	\N	4b039f68-249c-4234-ae92-57cfdc6d92bb	2026-01-07 12:08:54.707	2026-01-07 12:08:54.707	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
10fb0eb3-e671-44a4-863f-b2c1adba4534	ae2c5941-ddc9-4c48-b773-75fcc4302da5	supplier	- CXO experts		0	\N	4b039f68-249c-4234-ae92-57cfdc6d92bb	2026-01-07 12:08:54.715	2026-01-07 12:08:54.715	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
06e9372a-bd28-453d-973d-fc40646078fe	b6578815-6990-4bed-a837-d4cd739b0687	supplier	- CXO CX Review core team		1	\N	4b039f68-249c-4234-ae92-57cfdc6d92bb	2026-01-07 12:08:54.724	2026-01-07 12:08:54.724	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
7c4c0993-b207-424b-a952-9d74cbbd90db	19d59272-41d6-4da2-9e83-bc061ac6fc16	input	Key priorities per chapter		0	\N	4b039f68-249c-4234-ae92-57cfdc6d92bb	2026-01-07 12:08:54.731	2026-01-07 12:08:54.731	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
e3715768-6ede-4e32-a009-5295a5ff619e	998e9e0e-a77f-47b9-a45d-f4653fb73ee6	output	Pre-lecture du dossier		0	\N	4b039f68-249c-4234-ae92-57cfdc6d92bb	2026-01-07 12:08:54.741	2026-01-07 12:08:54.741	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
d7cebb78-37f5-4141-b176-f412b7558a1b	4be7f31d-45cc-4bcb-976b-eea567169d15	customer	Zones, Brand, Affiliate experts metier		0	\N	4b039f68-249c-4234-ae92-57cfdc6d92bb	2026-01-07 12:08:54.756	2026-01-07 12:08:54.756	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
9b13e543-edf6-4f57-b92a-cec973d5b569	56e84566-6f2f-4dc6-9101-c4c547d884ed	process	Present the CX Review report		11	\N	043c4b1e-5bad-411f-ab8e-3fdeeedae5bc	2026-01-07 12:08:54.763	2026-01-07 12:08:54.763	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
7c9e7b5e-7209-4ad0-a387-748043500ae3	88642f30-d428-4687-a49a-d47fa865ff89	output	CX Review Report		0	\N	043c4b1e-5bad-411f-ab8e-3fdeeedae5bc	2026-01-07 12:08:54.77	2026-01-07 12:08:54.77	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
ef04a709-f00f-4ac8-99ff-de139a693e01	9bd73595-e85d-43c2-a453-76010b356d0b	output	Offre d'accompagnement CXO		1	\N	043c4b1e-5bad-411f-ab8e-3fdeeedae5bc	2026-01-07 12:08:54.778	2026-01-07 12:08:54.778	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
bceeb19b-f2f5-4b19-83c1-4052f7ade464	659769f0-8db7-4436-bbc2-a6ad6907197a	customer	Affiliate CEO, CX Director, Customer Relationship Director, Digital Director, Sales Director		0	\N	043c4b1e-5bad-411f-ab8e-3fdeeedae5bc	2026-01-07 12:08:54.785	2026-01-07 12:08:54.785	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
64b69ff2-6062-4eea-9e51-92afec4a44e6	a467bf4e-3350-45db-817b-2385bd571bc9	customer	Zones EUR et MEA. Brand		1	\N	043c4b1e-5bad-411f-ab8e-3fdeeedae5bc	2026-01-07 12:08:54.793	2026-01-07 12:08:54.793	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
aacc4b64-c933-491c-936e-76aad7b5489f	b7268282-9d59-4cd9-8321-f50ce8a8bc58	process	Debriefer sur le positionement pays		12	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.8	2026-01-07 12:08:54.8	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
3654f4cf-f832-4912-9b26-a06af0a342ef	1a7059de-a376-42da-b5dc-61a0e34c35c4	supplier	Procesus QBR Pays : Suivi de la performance Metier		0	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.809	2026-01-07 12:08:54.809	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
ed993bb7-ba95-4030-b8a5-605cc5fdfe1c	dd6855f7-7f01-4d7a-8e09-5eebc48a3800	supplier	- comités pilotés par zone EUR : Comité relation Client, Comité Digital (digital board), comité ventes (B2C sales board)		1	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.817	2026-01-07 12:08:54.817	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
db5bd968-9fa8-4781-ad6c-9bb554043143	0af44ff0-2dcb-43a7-a18d-7fe3df6ab2bc	supplier	- comite CX, piloté par CXO (CX quaterly review)		2	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.825	2026-01-07 12:08:54.825	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
ccaf7892-4800-4438-b211-360cd37fe38c	07fa8c56-bfd7-4473-8727-80fd7f136c75	supplier	Comité suivi CX MEA		3	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.833	2026-01-07 12:08:54.833	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
2c5fe3f1-56c5-4a2a-a401-ef4e3efe9910	374dbf14-cc97-4c39-a049-9e3b8811dfc2	supplier	procesus de suivi des actions CXO dans les pays		4	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.842	2026-01-07 12:08:54.842	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
6c4548c4-6469-4b24-bf73-a51a586c61a9	35c413fa-3a3b-4045-a59a-d1f42446ab49	supplier	procesus de suivi de la performance CX des pays		5	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.852	2026-01-07 12:08:54.852	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
d2c08367-478a-4501-8eb0-a08231ca10be	3397f076-24da-4baa-b42f-f636d9010197	output	Recommendations retenues/pas retenues par le pays		0	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.859	2026-01-07 12:08:54.859	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
9269988b-6f7b-41f1-ac68-5c5edbcbcfe9	14a25b94-8697-45b0-be32-1187ea4eaaa6	customer	Zones EUR et MEA		0	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.867	2026-01-07 12:08:54.867	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
90e15eb7-15b5-4335-8e7b-a1f020d6dead	38dffe5b-086f-41d3-8078-f0cbf91552a8	customer	Centres de service CXO (experts CXO)		1	\N	1c7a5a72-1bcf-452e-94aa-c90edf3d3728	2026-01-07 12:08:54.875	2026-01-07 12:08:54.875	\N	\N	\N	\N	12bd14dc-dfc2-4815-9b61-799ad3afc948
08bc7303-2e00-4e7d-b90f-2917e3b7e33f	2e23befd-afc0-4b88-92e8-41bf0ee2dbd0	process	Nécessité d'évaluer l'expérience des clients Orange par rapport aux clients de la concurrence, par pays		0	\N	c8a275ba-d8a8-495e-8096-5ef54105f6bd	2026-01-07 12:11:25.451	2026-01-07 12:11:25.451	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
193798e0-0b8c-4bdb-95be-ecaf60b3631c	5488d3eb-fd04-4567-8260-8a2caa1e8aa3	process	Préparer la campagne d'évaluation des clients des opérateurs		1	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.462	2026-01-07 12:11:25.462	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
8554b441-4a7b-4ff8-a645-9c2d6f64672c	f7393100-0433-4895-8581-e0bd72420a48	supplier	Strategie groupe		0	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.473	2026-01-07 12:11:25.473	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
e64509fe-d5e8-49fa-8387-bca7952ce07c	3563751a-09fa-4668-8f34-3aabca569dc0	supplier	Kantar		1	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.484	2026-01-07 12:11:25.484	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
13ed6fa1-12d9-4357-a745-aceb35587ac5	aded7e81-ef09-41f3-9b8e-29ebf29ab7e3	supplier	CX fialiales		2	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.497	2026-01-07 12:11:25.497	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
ad97cd4a-8499-49a4-8c4b-90cd39e49dbb	49fafcca-3b7c-437a-b1fa-7a5cec106ce1	supplier	Market Research filiales		3	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.509	2026-01-07 12:11:25.509	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
9bff0800-b981-494a-acdf-0a9629a96e96	d5f538b1-53d5-435c-b34e-e28106a133b2	input	Proposition de nouveaux sujets  ou angles à questionner		0	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.521	2026-01-07 12:11:25.521	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
03af6e6f-5fa2-475e-b1bf-7565d6fb8462	a83391ac-34fd-4a96-a83d-c0bbdc81f349	input	Fourniture du questionnaire de base de la campagne précédente		1	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.534	2026-01-07 12:11:25.534	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
e3dc80ed-9136-4530-bfcc-4272dbe5e63a	a1303635-9bc1-494c-8436-e157087847ec	input	Proposition de questions par les pays		2	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.545	2026-01-07 12:11:25.545	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
e1f644cb-e751-4a26-ad42-974674bb7b1e	fcbc9fa9-e57b-4c11-ade8-028458f735cd	input	Screener / Chiffres de redressement par pays, de la population et de la base clients (socio-economique, techno, region…)		3	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.558	2026-01-07 12:11:25.558	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
1127ea92-a8fe-47ae-95b9-c612df03ee7a	db5e1718-cc8f-4584-a477-476f8bb17409	output	Dynata		0	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.568	2026-01-07 12:11:25.568	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
e0c50b75-21fe-4b3c-a2e8-a532be22fa23	6eb1727d-9e28-45ea-b82f-bbfae72faa03	output	Questionnaire traduit en 9 langues		1	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.577	2026-01-07 12:11:25.577	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
85277e46-9410-4340-a24b-1848d2f4daf7	6853a388-a087-45c5-ab62-d85bd14d6609	output	Questions ad-hoc des pays ajoutées		2	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.586	2026-01-07 12:11:25.586	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
97a4bc86-96bf-4c1b-a11d-ca10149a6663	8bc3aa66-0783-4780-b166-29aff2e787f1	output	Echatillon cible défini, par pays		3	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.595	2026-01-07 12:11:25.595	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
46534a17-ffa0-49e2-8546-7a009d72a979	a12c8abe-ccaf-4306-8f66-5611a8aebbe3	output	Etude commandée au fournisseur		4	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.603	2026-01-07 12:11:25.603	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
0cce1550-cc68-482b-b361-8cb11defd353	e0e393aa-6dca-4937-97a9-b84b0ffdf4e9	customer	Dynata		0	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.612	2026-01-07 12:11:25.612	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
90db23a3-196d-4c5e-a56b-b1a8ce8d0213	8420d225-e9dd-422d-85dc-66ffc034ae59	customer	Dynata		1	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.62	2026-01-07 12:11:25.62	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
1658f691-1536-42a3-92ee-c558505f34db	e10c2451-5d2b-4452-8c93-2ec70b550923	customer	Dynata		2	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.631	2026-01-07 12:11:25.631	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
d4ce276b-fddb-4a8b-89a7-d18214baa947	c9a31a4e-fc06-41e4-afab-013767217a23	customer	Dynata		3	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.641	2026-01-07 12:11:25.641	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
d6bb2531-f1df-4b0a-8a60-d336b7f45c08	96226159-2f8c-4407-a948-834129b9c5c5	customer	Dynata		4	\N	0d9962ea-8184-4897-bcd3-078c12b1da77	2026-01-07 12:11:25.649	2026-01-07 12:11:25.649	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
dec63a8d-2932-4837-a997-98d256bd97b4	a1228f51-6ac5-4b05-bb8a-6af5f1f8c6f9	process	Réaliser le sondage de l'expérience client, par pays		2	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.659	2026-01-07 12:11:25.659	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
c54a668e-0b55-4086-9869-ed329638c697	97788108-15d1-400f-801f-a57b31056e55	supplier	Kantar		0	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.667	2026-01-07 12:11:25.667	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
2140b798-3c37-4f01-bd57-fecaf89ae7b3	3251abd8-c2fa-496d-a67a-a52f24036a05	supplier	Dynata		1	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.677	2026-01-07 12:11:25.677	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
2f5d17f1-0c3d-4533-8566-abcbeab1212e	fb2fd876-9ef0-4448-a8f5-bf09ac91834e	supplier	Dynata		2	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.685	2026-01-07 12:11:25.685	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
fac2af2d-99eb-47f6-a2cc-2b289aba51c8	4d606103-63ff-4d68-8d40-3f12a119112b	input	Questionnaire programmé par pays		0	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.695	2026-01-07 12:11:25.695	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
52e0a7d6-610e-434c-a95c-81785f63aa1e	93e34450-c833-43c4-87b9-eeef45f5f06f	input	Document grille de suivi des objectifs de l'echantillonage		1	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.702	2026-01-07 12:11:25.702	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
67762175-b988-4708-b8ad-5cda34aff473	e8a5dc57-6623-487d-ba10-e712b41b5c57	input	Chiffres redressés verifiés		2	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.71	2026-01-07 12:11:25.71	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
acff9dcb-c66d-4e6a-a1c9-a6b69690ffc2	20e79c1e-c918-493e-9478-ce8b3f2480ef	output	Interviews realisées selon les canaux prévus		0	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.718	2026-01-07 12:11:25.718	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
4720c9ee-507b-4eee-a353-6468b3287303	84d8b973-65e9-4b27-acf2-ce3633e4724f	output	Suivi mensuel des interviews realisées		1	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.727	2026-01-07 12:11:25.727	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
79b6db1b-81c5-4b1f-8f57-b79354435955	0f9a815f-1215-4993-b946-2c30c78f0c22	output	Fichier des principaux resultats		2	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.735	2026-01-07 12:11:25.735	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
811d5d41-1872-42a1-a0f1-a560eb72f626	bce7ccff-e5da-4316-9377-56b7c8b47871	output	Données brutes redressées par pays		3	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.744	2026-01-07 12:11:25.744	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
cafd32cd-9df7-4476-8a9d-f5f8366ce8c5	88a51f4c-8647-4803-a70c-fb5c9a773418	output	Données de recommandation disponibles sur la plateforme en ligne		4	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.752	2026-01-07 12:11:25.752	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
8b98551d-7aab-401d-b822-ddee9e119994	b242870e-c419-4897-bef4-e52dcd8f7e1f	customer	CX Tracker Team		0	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.761	2026-01-07 12:11:25.761	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
bdbbbf67-77fe-47c7-8e0e-6e3471bd5f8d	fd9f55a4-6401-4160-a676-17641420c2e7	customer	Dynata		1	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.77	2026-01-07 12:11:25.77	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
ec0d48ae-4c5c-439d-a31b-2aa64b8d56ee	ab58a934-bb1e-4b72-9df9-92c76e675d2e	customer	CX Tracker Team		2	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.779	2026-01-07 12:11:25.779	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
38ab08ba-9239-4caa-8ef4-6aaf20cc9e97	814c04a3-6501-4a52-9c3a-95b667aba149	customer	Kantar (Medalia)		3	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.787	2026-01-07 12:11:25.787	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
699533ac-0269-496e-8202-d38b642ce9c5	75c55949-df97-4e9c-abed-19712be2261c	customer	Filiales CX		4	\N	e7269bd1-baed-462e-907c-6727f469b15d	2026-01-07 12:11:25.796	2026-01-07 12:11:25.796	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
2808df45-c003-4ee5-9d9b-54cbcb0cb20a	ec03ea35-b13d-4fda-9278-096c1b9643b0	process	Analyser les résultats du sondage, par pays		3	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.804	2026-01-07 12:11:25.804	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
38ce12b1-2701-4028-a9e9-cdb405042a5b	79a5bba5-b188-400d-a02a-3a48ed66acce	supplier	Dynata		0	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.812	2026-01-07 12:11:25.812	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
fb4eb40b-4aed-4233-b707-7b028665c828	df9a8fa4-40a4-4745-afd7-ec9da7fad7fc	supplier	Kantar (Medallia)		1	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.858	2026-01-07 12:11:25.858	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
85d63d55-7395-4fc0-a9a4-a14d01ab4245	79cae2ed-17d6-4fe8-868e-89f0ffd6227e	supplier	CX filiales / Market Research filiales		2	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.93	2026-01-07 12:11:25.93	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
ce68f5d7-5b79-4567-bbc7-8248d9e793cb	c40512da-4290-4dd4-9dd7-041afabb2644	supplier	EUR Zone		3	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.94	2026-01-07 12:11:25.94	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
a2285520-e72a-42ae-924e-7f96ecb025d7	b31b559f-45ed-4f46-a808-908dc36e225f	input	Fichier des principaux resultats		0	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.958	2026-01-07 12:11:25.958	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
716c971e-78ef-4da2-ba95-b6d225c7a74b	d30c33e1-61a5-466c-9a40-1fe127b9ee26	input	Chiffres disponibles sur la plateforme en ligne		1	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.974	2026-01-07 12:11:25.974	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
96a7de39-e531-4bc0-9752-8ce6b0f729a3	75d4e212-7fad-49a3-a660-d42d96f1723b	input	Briefing de chaque pays		2	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.981	2026-01-07 12:11:25.981	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
79d30832-277c-4f2a-b3e2-1b7bd4e6e73b	f244fce0-17ef-4cc8-ad2e-091d88ea54cb	input	- sur les faits majeurs en cours		3	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.991	2026-01-07 12:11:25.991	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
08c414ce-e98b-4bb6-a261-e1eb71e2e0f1	3b1b118e-a72d-44df-a27f-48a49712cfcd	input	- attentes d'analyse		4	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:25.999	2026-01-07 12:11:25.999	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
67b242b4-ebb3-4687-8b0e-bd11aec1e27e	d8f5380e-8aba-4414-a62d-7b0b15d47820	input	Analyse de causes		5	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.012	2026-01-07 12:11:26.012	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
6c71de39-35fb-4534-86ba-fe61c78a3c8a	6fef6146-1f50-4e46-acc6-b70a90c970ac	input	Briefing attentes		6	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.019	2026-01-07 12:11:26.019	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
dbcd15cc-1e69-43d0-b807-02d667b50839	bc4dc6ad-c5d4-4f63-8180-6ca9a8074cec	input	Analyse de causes		7	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.027	2026-01-07 12:11:26.027	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
25ba3af8-8357-43a5-af6a-25164dc514e1	9fcd28fe-cb0a-459c-b5ea-f1796267a788	output	Analyse des résultats selon les points abordés durant le briefing		0	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.035	2026-01-07 12:11:26.035	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
53bb0774-b466-44fd-8472-58c1e26dde51	1afa273d-ceaa-47cb-bbb1-40012d260380	output	Analyse de verbatim		1	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.043	2026-01-07 12:11:26.043	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
f234fc56-d801-4503-b8ec-a5035edc98c0	2e864a3b-a571-46a7-bc9f-877b97abb01e	output	Calcul des indicateurs NPS et MRS par pays		2	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.052	2026-01-07 12:11:26.052	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
75d8dc24-4105-4467-856a-65ca807f9f24	db79ef52-8502-4c9b-aaf9-d1aec3d9a411	output	Comparaison des résultats d'Orange avec la concurrence		3	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.061	2026-01-07 12:11:26.061	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
eec226e8-38f1-4ba1-8e05-e60d0dafdc1e	e4c4eda9-8a19-4fcf-9d8d-0f7f37f56e80	output	Identification des leviers de satisfaction, par pays		4	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.069	2026-01-07 12:11:26.069	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
d8007aa3-5140-403a-8c4f-5f232b4fa290	90c429e6-db25-4f45-89e4-74432a24fc7e	output	Analyse des résultats ad-hoc des pays		5	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.077	2026-01-07 12:11:26.077	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
d2312bae-2932-42bb-af5c-efe5e790d55d	985dd660-4f8f-4357-97e1-b012a93f237c	output	Recommendations de sujets d'amélioration		6	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.084	2026-01-07 12:11:26.084	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
480a4606-8630-4026-b5dc-8acbbf920a24	cd786ad0-a8fe-4d13-9746-b675815b9bdd	customer	CX Tracker Team		0	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.092	2026-01-07 12:11:26.092	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
2ede2eae-f5f6-4994-bcdc-16005e58fbd8	321639d9-fbbd-4544-8bf8-8b90749cf85a	customer	CX Tracker Team		1	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.1	2026-01-07 12:11:26.1	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
68126d22-3356-4abd-9e49-c3d7778f7ac9	a581055e-a814-42f9-a348-ec6b72b39e53	customer	CX Tracker Team		2	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.107	2026-01-07 12:11:26.107	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
74a8ae10-a9a5-468d-80bd-abbab469729e	48d1105a-1a12-4f22-b877-f77273109d92	customer	CX Tracker Team		3	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.115	2026-01-07 12:11:26.115	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
84cb62cd-3411-46e8-963c-87bf92f50a92	a9b64d58-5200-4fb1-9ed2-a3b431055626	customer	CX Tracker Team		4	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.125	2026-01-07 12:11:26.125	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
ee41c33a-b0f7-41f4-87c3-3dc250a91d45	6b56c64c-a3b3-4d20-b764-78636e32c461	customer	CX Tracker Team		5	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.134	2026-01-07 12:11:26.134	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
3ebcf3d3-4458-42b7-9eaf-a6e14381d888	c1d72bdb-6286-4aae-b99d-33119d835c27	customer	CX Tracker Team		6	\N	709e3868-14f9-4237-be5b-cb123ad00bdd	2026-01-07 12:11:26.142	2026-01-07 12:11:26.142	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
b48cea0b-6164-4504-9990-97fdf38150dc	41ac8410-78d0-4c61-b7ae-0c42c4262047	process	Partager les résultats		4	\N	51c2945a-a799-4b58-9fce-06c3ef0e31fe	2026-01-07 12:11:26.151	2026-01-07 12:11:26.151	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
fef9edb7-1036-49ef-b2cb-d4f14224a35c	6afb24d1-8fb8-4289-814f-6a8611f7304c	supplier	Kantar		0	\N	51c2945a-a799-4b58-9fce-06c3ef0e31fe	2026-01-07 12:11:26.161	2026-01-07 12:11:26.161	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
ca5b2dd7-c391-41d8-95ba-6c52f7340906	6cd64ec5-0aa6-46b8-9c5a-17f430a04015	supplier	CX Tracker Team		1	\N	51c2945a-a799-4b58-9fce-06c3ef0e31fe	2026-01-07 12:11:26.169	2026-01-07 12:11:26.169	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
bcf98af9-b551-43b7-aeeb-83ef7953c832	7bb48151-b4ba-4d0d-800c-63307f59acdc	input	Documents d'analyse de la recommendation client par pays		0	\N	51c2945a-a799-4b58-9fce-06c3ef0e31fe	2026-01-07 12:11:26.178	2026-01-07 12:11:26.178	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
75bd020a-228c-4a34-bf6f-3e19f9a4b774	0b8661e5-061c-4f3b-be02-ea318976885b	input	Recommendations de sujets d'amélioration		1	\N	51c2945a-a799-4b58-9fce-06c3ef0e31fe	2026-01-07 12:11:26.187	2026-01-07 12:11:26.187	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
aa9a7262-b6e6-4ddc-ac71-c860937ca1c8	a8ca4ebc-b1f2-4caf-b7f8-9e1165a2aa71	output	Présentation orale des documents d’analyse et orientations		0	\N	51c2945a-a799-4b58-9fce-06c3ef0e31fe	2026-01-07 12:11:26.206	2026-01-07 12:11:26.206	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
022d52d8-3c74-49a2-a36b-6959a67d58cf	86d5f2e4-6cfa-4322-8bfa-d404fb1cdd8e	output	Documents d'analyse de la recommendation client par pays		1	\N	51c2945a-a799-4b58-9fce-06c3ef0e31fe	2026-01-07 12:11:26.213	2026-01-07 12:11:26.213	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
cd2f875f-0173-45f3-9993-7c8b04444379	9202e106-20d5-45b5-8693-338ca647d321	customer	- Fonct Support Groupe :  EUR Zone, Brand, etc		0	\N	51c2945a-a799-4b58-9fce-06c3ef0e31fe	2026-01-07 12:11:26.222	2026-01-07 12:11:26.222	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
d8d1d54a-618a-4b30-a99d-4e36dc4c9146	593870de-2c91-412d-b8ce-99d6d8894ad5	customer	- Filiales : CX, CR, Sales, Digital		1	\N	51c2945a-a799-4b58-9fce-06c3ef0e31fe	2026-01-07 12:11:26.23	2026-01-07 12:11:26.23	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
8163ee44-8fb7-4743-8ff1-3b1136035627	03ce612d-68fc-4402-b27f-0bd5f599de8d	process	Les filiales sont conscientes de leur positionnement par rapport à la concurrence, vu des clients		5	\N	b5578188-82a1-4d69-b49d-4319c31add24	2026-01-07 12:11:26.237	2026-01-07 12:11:26.237	\N	\N	\N	\N	02f641b8-152a-4c71-8272-02b4b5a145ae
\.


--
-- Data for Name: sipoc_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sipoc_history (history_id, "documentId", sipoc_id, changed_by, changed_at, change_description, change_type, previous_state, new_state) FROM stdin;
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (id, name) FROM stdin;
cmjjuyh9z000hvckymhdsq4pq	Development Team
cmjjuyha1000ivcky2iihfsm1	Operations Team
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, "firstName", "lastName", "displayName", "avatarUrl", phone, "position", "isActive", "lastLoginAt", "createdAt", "updatedAt", "hashedPassword", "emailVerified", "resetToken", "resetTokenExp", "departmentId", "groupId", "isAdmin", "orangeId", provider, "providerData", role) FROM stdin;
cmjjuyha4000kvckyggis8670	charlie.brown@orange.com	Charlie	Brown	\N	\N	\N	HR Manager	t	\N	2025-12-24 10:15:29.02	2025-12-24 10:15:29.02	$2b$10$CW1kBvD1en0L.hXYknmK6uB8HL0LRGommUI3FP.r5uUAWzogOtV22	t	\N	\N	cmjjuyh9r000evcky8f3z51if	cmjjuyh8j0000vckys3xek0ff	f	\N	local	\N	EDITOR
cmjjuyhag000ovcky787oiy3s	bob.smith@orange.com	Bob	Smith	\N	\N	\N	IT Director	t	\N	2025-12-24 10:15:29.02	2025-12-24 10:15:29.02	$2b$10$CW1kBvD1en0L.hXYknmK6uB8HL0LRGommUI3FP.r5uUAWzogOtV22	t	\N	\N	cmjjuyh9o000cvckycl48ehdp	cmjjuyh910003vcky9e54y5mh	f	\N	local	\N	EDITOR
cmjjuyhac000mvcky4i4382cw	alice.johnson@orange.com	Alice	Johnson	Alice J.	\N	\N	Process Manager	t	2026-01-06 14:35:44.857	2025-12-24 10:15:29.02	2026-01-06 14:35:44.879	$2b$10$CW1kBvD1en0L.hXYknmK6uB8HL0LRGommUI3FP.r5uUAWzogOtV22	t	\N	\N	cmjjuyh9o000cvckycl48ehdp	cmjjuyh910003vcky9e54y5mh	t	\N	local	\N	EDITOR
\.


--
-- Data for Name: workspace_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspace_members (id, role, "joinedAt", "isActive", "userId", "workspaceId") FROM stdin;
cmjjuyham000uvcky3pdkaw1h	EDITOR	2025-12-24 10:15:29.038	t	cmjjuyha4000kvckyggis8670	cmjjuyh9g0008vckyt3wuzn2b
cmjjuyham000tvckyxn8u9fqh	OWNER	2025-12-24 10:15:29.038	t	cmjjuyhag000ovcky787oiy3s	cmjjuyh9g0008vckyt3wuzn2b
cmjjuyham000qvckyqaqcud1t	ADMIN	2025-12-24 10:15:29.038	t	cmjjuyhac000mvcky4i4382cw	cmjjuyh9g0008vckyt3wuzn2b
\.


--
-- Data for Name: workspace_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspace_settings (id, "allowExternalUsers", "requireApproval", "maxProcessLevels", "customFields", "notificationSettings", "workspaceId") FROM stdin;
\.


--
-- Data for Name: workspaces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspaces (id, name, description, code, type, "isActive", "createdAt", "updatedAt", "parentId") FROM stdin;
cmjjuyh990006vckyzwhtqh6v	Orange Group	Orange Group - Global telecommunications company	OG	GROUPE	t	2025-12-24 10:15:28.99	2025-12-24 10:15:28.99	\N
cmjjuyh9g0008vckyt3wuzn2b	Orange Tunisie	Orange Tunisie telecommunications services	OTN	ENTITY	t	2025-12-24 10:15:28.996	2025-12-24 10:15:28.996	cmjjuyh990006vckyzwhtqh6v
cmjjuyh9l000avckyvmqiemgx	Orange Business Services	Orange Business Services for enterprise solutions	OBS	ENTITY	t	2025-12-24 10:15:29.002	2025-12-24 10:15:29.002	cmjjuyh990006vckyzwhtqh6v
cmjjvz4vk0000t5c78f1vhoyx	test		TEST	DEPARTMENT	t	2025-12-24 10:43:59.215	2025-12-24 10:43:59.215	cmjjuyh9g0008vckyt3wuzn2b
cmjk1he260001t5c7sm9cgh7a	test 2		TEST SIPOC	DIRECTION	t	2025-12-24 13:18:09.006	2025-12-24 13:18:09.006	cmjjvz4vk0000t5c78f1vhoyx
cmjk3gefy0002t5c7bpquijs6	Sofrecom		2196	DEPARTMENT	t	2025-12-24 14:13:22.078	2025-12-24 14:13:22.078	\N
cmjk47ng70005zzsg0bu302wx	Sofrecom C2S		TEST_ERTY	DIRECTION	t	2025-12-24 14:34:33.464	2025-12-24 14:34:33.464	cmjk3gefy0002t5c7bpquijs6
cmk2phbcj0003q6od9akuiql5	CXO		CXO	GROUPE	t	2026-01-06 14:49:47.44	2026-01-06 14:49:47.44	\N
\.


--
-- Name: SipocComment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SipocComment_comment_id_seq"', 1, false);


--
-- Name: SipocPermission_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SipocPermission_permission_id_seq"', 1, false);


--
-- Name: Tag_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tag_tag_id_seq"', 1, false);


--
-- Name: sipoc_history_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sipoc_history_history_id_seq', 1, false);


--
-- Name: SipocComment SipocComment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocComment"
    ADD CONSTRAINT "SipocComment_pkey" PRIMARY KEY (comment_id);


--
-- Name: SipocPermission SipocPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocPermission"
    ADD CONSTRAINT "SipocPermission_pkey" PRIMARY KEY (permission_id);


--
-- Name: SipocTag SipocTag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocTag"
    ADD CONSTRAINT "SipocTag_pkey" PRIMARY KEY (sipoc_id, tag_id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (tag_id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: approval_requests approval_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_requests
    ADD CONSTRAINT approval_requests_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: constraints constraints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.constraints
    ADD CONSTRAINT constraints_pkey PRIMARY KEY (id);


--
-- Name: control_indicators control_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_indicators
    ADD CONSTRAINT control_indicators_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: edges edges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT edges_pkey PRIMARY KEY (id);


--
-- Name: flow_diagrams flow_diagrams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flow_diagrams
    ADD CONSTRAINT flow_diagrams_pkey PRIMARY KEY (id);


--
-- Name: flow_edges flow_edges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flow_edges
    ADD CONSTRAINT flow_edges_pkey PRIMARY KEY (id);


--
-- Name: flow_nodes flow_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flow_nodes
    ADD CONSTRAINT flow_nodes_pkey PRIMARY KEY (id);


--
-- Name: group_permissions group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_permissions
    ADD CONSTRAINT group_permissions_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: indicators indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indicators
    ADD CONSTRAINT indicators_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- Name: linked_documents linked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.linked_documents
    ADD CONSTRAINT linked_documents_pkey PRIMARY KEY (id);


--
-- Name: means means_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.means
    ADD CONSTRAINT means_pkey PRIMARY KEY (id);


--
-- Name: node_templates node_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.node_templates
    ADD CONSTRAINT node_templates_pkey PRIMARY KEY (id);


--
-- Name: nodes nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: procedure_validation_requests procedure_validation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_validation_requests
    ADD CONSTRAINT procedure_validation_requests_pkey PRIMARY KEY (id);


--
-- Name: procedures procedures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT procedures_pkey PRIMARY KEY (id);


--
-- Name: process_actors process_actors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_actors
    ADD CONSTRAINT process_actors_pkey PRIMARY KEY (id);


--
-- Name: process_assignments process_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_assignments
    ADD CONSTRAINT process_assignments_pkey PRIMARY KEY (id);


--
-- Name: process_identity_cards process_identity_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_identity_cards
    ADD CONSTRAINT process_identity_cards_pkey PRIMARY KEY (fip_id);


--
-- Name: process_inputs process_inputs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_inputs
    ADD CONSTRAINT process_inputs_pkey PRIMARY KEY (id);


--
-- Name: process_ios process_ios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_ios
    ADD CONSTRAINT process_ios_pkey PRIMARY KEY (id);


--
-- Name: process_map_validation_requests process_map_validation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_map_validation_requests
    ADD CONSTRAINT process_map_validation_requests_pkey PRIMARY KEY (id);


--
-- Name: process_maps process_maps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_maps
    ADD CONSTRAINT process_maps_pkey PRIMARY KEY (id);


--
-- Name: process_outputs process_outputs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_outputs
    ADD CONSTRAINT process_outputs_pkey PRIMARY KEY (id);


--
-- Name: process_qualigram_tags process_qualigram_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_qualigram_tags
    ADD CONSTRAINT process_qualigram_tags_pkey PRIMARY KEY ("processId", "tagId");


--
-- Name: process_tags process_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_tags
    ADD CONSTRAINT process_tags_pkey PRIMARY KEY (id);


--
-- Name: process_templates process_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_templates
    ADD CONSTRAINT process_templates_pkey PRIMARY KEY (id);


--
-- Name: process_themes process_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_themes
    ADD CONSTRAINT process_themes_pkey PRIMARY KEY (id);


--
-- Name: process_validation_requests process_validation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_validation_requests
    ADD CONSTRAINT process_validation_requests_pkey PRIMARY KEY (id);


--
-- Name: processes processes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processes
    ADD CONSTRAINT processes_pkey PRIMARY KEY (id);


--
-- Name: qualigram_tags qualigram_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qualigram_tags
    ADD CONSTRAINT qualigram_tags_pkey PRIMARY KEY (id);


--
-- Name: reading_confirmations reading_confirmations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_confirmations
    ADD CONSTRAINT reading_confirmations_pkey PRIMARY KEY (id);


--
-- Name: risks risks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT risks_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: sipoc_connections sipoc_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_connections
    ADD CONSTRAINT sipoc_connections_pkey PRIMARY KEY (connection_id);


--
-- Name: sipoc_diagrams sipoc_diagrams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_diagrams
    ADD CONSTRAINT sipoc_diagrams_pkey PRIMARY KEY (sipoc_id);


--
-- Name: sipoc_elements sipoc_elements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_elements
    ADD CONSTRAINT sipoc_elements_pkey PRIMARY KEY (id);


--
-- Name: sipoc_history sipoc_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_history
    ADD CONSTRAINT sipoc_history_pkey PRIMARY KEY (history_id);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: workspace_members workspace_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_pkey PRIMARY KEY (id);


--
-- Name: workspace_settings workspace_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_settings
    ADD CONSTRAINT workspace_settings_pkey PRIMARY KEY (id);


--
-- Name: workspaces workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);


--
-- Name: SipocComment_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocComment_documentId_key" ON public."SipocComment" USING btree ("documentId");


--
-- Name: SipocPermission_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocPermission_documentId_key" ON public."SipocPermission" USING btree ("documentId");


--
-- Name: SipocPermission_sipoc_id_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocPermission_sipoc_id_user_id_key" ON public."SipocPermission" USING btree (sipoc_id, user_id);


--
-- Name: SipocTag_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SipocTag_documentId_key" ON public."SipocTag" USING btree ("documentId");


--
-- Name: Tag_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_documentId_key" ON public."Tag" USING btree ("documentId");


--
-- Name: Tag_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);


--
-- Name: _ProcedureToProcessTag_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_ProcedureToProcessTag_AB_unique" ON public."_ProcedureToProcessTag" USING btree ("A", "B");


--
-- Name: _ProcedureToProcessTag_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProcedureToProcessTag_B_index" ON public."_ProcedureToProcessTag" USING btree ("B");


--
-- Name: _ProcessMapToProcessTag_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_ProcessMapToProcessTag_AB_unique" ON public."_ProcessMapToProcessTag" USING btree ("A", "B");


--
-- Name: _ProcessMapToProcessTag_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProcessMapToProcessTag_B_index" ON public."_ProcessMapToProcessTag" USING btree ("B");


--
-- Name: _ProcessOwners_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_ProcessOwners_AB_unique" ON public."_ProcessOwners" USING btree ("A", "B");


--
-- Name: _ProcessOwners_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProcessOwners_B_index" ON public."_ProcessOwners" USING btree ("B");


--
-- Name: _ProcessToProcessTag_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_ProcessToProcessTag_AB_unique" ON public."_ProcessToProcessTag" USING btree ("A", "B");


--
-- Name: _ProcessToProcessTag_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProcessToProcessTag_B_index" ON public."_ProcessToProcessTag" USING btree ("B");


--
-- Name: approval_requests_processId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "approval_requests_processId_userId_key" ON public.approval_requests USING btree ("processId", "userId");


--
-- Name: audit_logs_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_entityType_entityId_idx" ON public.audit_logs USING btree ("entityType", "entityId");


--
-- Name: audit_logs_timestamp_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_timestamp_idx ON public.audit_logs USING btree ("timestamp");


--
-- Name: audit_logs_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_userId_idx" ON public.audit_logs USING btree ("userId");


--
-- Name: comments_flowNodeId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "comments_flowNodeId_idx" ON public.comments USING btree ("flowNodeId");


--
-- Name: comments_nodeId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "comments_nodeId_idx" ON public.comments USING btree ("nodeId");


--
-- Name: comments_procedureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "comments_procedureId_idx" ON public.comments USING btree ("procedureId");


--
-- Name: comments_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "comments_processId_idx" ON public.comments USING btree ("processId");


--
-- Name: comments_processMapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "comments_processMapId_idx" ON public.comments USING btree ("processMapId");


--
-- Name: comments_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "comments_userId_idx" ON public.comments USING btree ("userId");


--
-- Name: departments_workspaceId_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "departments_workspaceId_code_key" ON public.departments USING btree ("workspaceId", code);


--
-- Name: documents_procedureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "documents_procedureId_idx" ON public.documents USING btree ("procedureId");


--
-- Name: documents_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "documents_processId_idx" ON public.documents USING btree ("processId");


--
-- Name: documents_processMapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "documents_processMapId_idx" ON public.documents USING btree ("processMapId");


--
-- Name: edges_fromId_toId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "edges_fromId_toId_key" ON public.edges USING btree ("fromId", "toId");


--
-- Name: edges_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX edges_status_idx ON public.edges USING btree (status);


--
-- Name: edges_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX edges_type_idx ON public.edges USING btree (type);


--
-- Name: flow_diagrams_level_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX flow_diagrams_level_idx ON public.flow_diagrams USING btree (level);


--
-- Name: flow_diagrams_level_processId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "flow_diagrams_level_processId_key" ON public.flow_diagrams USING btree (level, "processId");


--
-- Name: flow_diagrams_procedureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flow_diagrams_procedureId_idx" ON public.flow_diagrams USING btree ("procedureId");


--
-- Name: flow_diagrams_procedureId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "flow_diagrams_procedureId_key" ON public.flow_diagrams USING btree ("procedureId");


--
-- Name: flow_diagrams_processId_ref_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flow_diagrams_processId_ref_idx" ON public.flow_diagrams USING btree ("processId_ref");


--
-- Name: flow_diagrams_processId_ref_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "flow_diagrams_processId_ref_key" ON public.flow_diagrams USING btree ("processId_ref");


--
-- Name: flow_diagrams_processMapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flow_diagrams_processMapId_idx" ON public.flow_diagrams USING btree ("processMapId");


--
-- Name: flow_diagrams_processMapId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "flow_diagrams_processMapId_key" ON public.flow_diagrams USING btree ("processMapId");


--
-- Name: flow_edges_diagramId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flow_edges_diagramId_idx" ON public.flow_edges USING btree ("diagramId");


--
-- Name: flow_edges_rfId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "flow_edges_rfId_key" ON public.flow_edges USING btree ("rfId");


--
-- Name: flow_edges_sourceRfId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flow_edges_sourceRfId_idx" ON public.flow_edges USING btree ("sourceRfId");


--
-- Name: flow_edges_targetRfId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flow_edges_targetRfId_idx" ON public.flow_edges USING btree ("targetRfId");


--
-- Name: flow_nodes_diagramId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flow_nodes_diagramId_idx" ON public.flow_nodes USING btree ("diagramId");


--
-- Name: flow_nodes_entityType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flow_nodes_entityType_idx" ON public.flow_nodes USING btree ("entityType");


--
-- Name: flow_nodes_referencedEntityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flow_nodes_referencedEntityId_idx" ON public.flow_nodes USING btree ("referencedEntityId");


--
-- Name: flow_nodes_rfId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "flow_nodes_rfId_key" ON public.flow_nodes USING btree ("rfId");


--
-- Name: group_permissions_groupId_resource_action_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "group_permissions_groupId_resource_action_key" ON public.group_permissions USING btree ("groupId", resource, action);


--
-- Name: groups_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX groups_code_key ON public.groups USING btree (code);


--
-- Name: groups_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX groups_name_key ON public.groups USING btree (name);


--
-- Name: indicators_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "indicators_processId_idx" ON public.indicators USING btree ("processId");


--
-- Name: journal_entries_procedureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entries_procedureId_idx" ON public.journal_entries USING btree ("procedureId");


--
-- Name: journal_entries_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entries_processId_idx" ON public.journal_entries USING btree ("processId");


--
-- Name: journal_entries_processMapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entries_processMapId_idx" ON public.journal_entries USING btree ("processMapId");


--
-- Name: linked_documents_procedureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "linked_documents_procedureId_idx" ON public.linked_documents USING btree ("procedureId");


--
-- Name: linked_documents_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "linked_documents_processId_idx" ON public.linked_documents USING btree ("processId");


--
-- Name: linked_documents_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX linked_documents_type_idx ON public.linked_documents USING btree (type);


--
-- Name: means_procedureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "means_procedureId_idx" ON public.means USING btree ("procedureId");


--
-- Name: means_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "means_processId_idx" ON public.means USING btree ("processId");


--
-- Name: means_processMapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "means_processMapId_idx" ON public.means USING btree ("processMapId");


--
-- Name: node_templates_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX node_templates_category_idx ON public.node_templates USING btree (category);


--
-- Name: node_templates_workspaceId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "node_templates_workspaceId_name_key" ON public.node_templates USING btree ("workspaceId", name);


--
-- Name: nodes_groupId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "nodes_groupId_idx" ON public.nodes USING btree ("groupId");


--
-- Name: nodes_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nodes_status_idx ON public.nodes USING btree (status);


--
-- Name: nodes_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nodes_type_idx ON public.nodes USING btree (type);


--
-- Name: notifications_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_createdAt_idx" ON public.notifications USING btree ("createdAt");


--
-- Name: notifications_procedureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_procedureId_idx" ON public.notifications USING btree ("procedureId");


--
-- Name: notifications_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_processId_idx" ON public.notifications USING btree ("processId");


--
-- Name: notifications_processMapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_processMapId_idx" ON public.notifications USING btree ("processMapId");


--
-- Name: notifications_userId_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_userId_isRead_idx" ON public.notifications USING btree ("userId", "isRead");


--
-- Name: procedure_validation_requests_procedureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "procedure_validation_requests_procedureId_idx" ON public.procedure_validation_requests USING btree ("procedureId");


--
-- Name: procedure_validation_requests_procedureId_validatorId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "procedure_validation_requests_procedureId_validatorId_key" ON public.procedure_validation_requests USING btree ("procedureId", "validatorId");


--
-- Name: procedure_validation_requests_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX procedure_validation_requests_status_idx ON public.procedure_validation_requests USING btree (status);


--
-- Name: procedure_validation_requests_validatorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "procedure_validation_requests_validatorId_idx" ON public.procedure_validation_requests USING btree ("validatorId");


--
-- Name: procedures_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "procedures_processId_idx" ON public.procedures USING btree ("processId");


--
-- Name: procedures_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX procedures_status_idx ON public.procedures USING btree (status);


--
-- Name: procedures_workspaceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "procedures_workspaceId_idx" ON public.procedures USING btree ("workspaceId");


--
-- Name: process_actors_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_actors_processId_idx" ON public.process_actors USING btree ("processId");


--
-- Name: process_assignments_processId_userId_roleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "process_assignments_processId_userId_roleId_key" ON public.process_assignments USING btree ("processId", "userId", "roleId");


--
-- Name: process_identity_cards_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "process_identity_cards_documentId_key" ON public.process_identity_cards USING btree ("documentId");


--
-- Name: process_identity_cards_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_identity_cards_processId_idx" ON public.process_identity_cards USING btree ("processId");


--
-- Name: process_identity_cards_processId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "process_identity_cards_processId_key" ON public.process_identity_cards USING btree ("processId");


--
-- Name: process_identity_cards_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX process_identity_cards_status_idx ON public.process_identity_cards USING btree (status);


--
-- Name: process_ios_isInput_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_ios_isInput_idx" ON public.process_ios USING btree ("isInput");


--
-- Name: process_ios_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_ios_processId_idx" ON public.process_ios USING btree ("processId");


--
-- Name: process_map_validation_requests_processMapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_map_validation_requests_processMapId_idx" ON public.process_map_validation_requests USING btree ("processMapId");


--
-- Name: process_map_validation_requests_processMapId_validatorId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "process_map_validation_requests_processMapId_validatorId_key" ON public.process_map_validation_requests USING btree ("processMapId", "validatorId");


--
-- Name: process_map_validation_requests_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX process_map_validation_requests_status_idx ON public.process_map_validation_requests USING btree (status);


--
-- Name: process_map_validation_requests_validatorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_map_validation_requests_validatorId_idx" ON public.process_map_validation_requests USING btree ("validatorId");


--
-- Name: process_maps_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX process_maps_code_idx ON public.process_maps USING btree (code);


--
-- Name: process_maps_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX process_maps_code_key ON public.process_maps USING btree (code);


--
-- Name: process_maps_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX process_maps_status_idx ON public.process_maps USING btree (status);


--
-- Name: process_maps_workspaceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_maps_workspaceId_idx" ON public.process_maps USING btree ("workspaceId");


--
-- Name: process_qualigram_tags_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_qualigram_tags_processId_idx" ON public.process_qualigram_tags USING btree ("processId");


--
-- Name: process_qualigram_tags_tagId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_qualigram_tags_tagId_idx" ON public.process_qualigram_tags USING btree ("tagId");


--
-- Name: process_tags_workspaceId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "process_tags_workspaceId_name_key" ON public.process_tags USING btree ("workspaceId", name);


--
-- Name: process_templates_workspaceId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "process_templates_workspaceId_name_key" ON public.process_templates USING btree ("workspaceId", name);


--
-- Name: process_themes_workspaceId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "process_themes_workspaceId_name_key" ON public.process_themes USING btree ("workspaceId", name);


--
-- Name: process_validation_requests_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_validation_requests_processId_idx" ON public.process_validation_requests USING btree ("processId");


--
-- Name: process_validation_requests_processId_validatorId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "process_validation_requests_processId_validatorId_key" ON public.process_validation_requests USING btree ("processId", "validatorId");


--
-- Name: process_validation_requests_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX process_validation_requests_status_idx ON public.process_validation_requests USING btree (status);


--
-- Name: process_validation_requests_validatorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "process_validation_requests_validatorId_idx" ON public.process_validation_requests USING btree ("validatorId");


--
-- Name: processes_processMapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "processes_processMapId_idx" ON public.processes USING btree ("processMapId");


--
-- Name: processes_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX processes_status_idx ON public.processes USING btree (status);


--
-- Name: processes_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX processes_type_idx ON public.processes USING btree (type);


--
-- Name: processes_workspaceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "processes_workspaceId_idx" ON public.processes USING btree ("workspaceId");


--
-- Name: qualigram_tags_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX qualigram_tags_name_key ON public.qualigram_tags USING btree (name);


--
-- Name: reading_confirmations_processId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "reading_confirmations_processId_userId_key" ON public.reading_confirmations USING btree ("processId", "userId");


--
-- Name: risks_level_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX risks_level_idx ON public.risks USING btree (level);


--
-- Name: risks_processId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "risks_processId_idx" ON public.risks USING btree ("processId");


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: settings_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX settings_category_idx ON public.settings USING btree (category);


--
-- Name: settings_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX settings_key_idx ON public.settings USING btree (key);


--
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- Name: sipoc_connections_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sipoc_connections_documentId_key" ON public.sipoc_connections USING btree ("documentId");


--
-- Name: sipoc_connections_sipoc_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_connections_sipoc_id_idx ON public.sipoc_connections USING btree (sipoc_id);


--
-- Name: sipoc_connections_source_element_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_connections_source_element_id_idx ON public.sipoc_connections USING btree (source_element_id);


--
-- Name: sipoc_connections_source_sipoc_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_connections_source_sipoc_id_idx ON public.sipoc_connections USING btree (source_sipoc_id);


--
-- Name: sipoc_connections_target_element_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_connections_target_element_id_idx ON public.sipoc_connections USING btree (target_element_id);


--
-- Name: sipoc_connections_target_sipoc_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_connections_target_sipoc_id_idx ON public.sipoc_connections USING btree (target_sipoc_id);


--
-- Name: sipoc_diagrams_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sipoc_diagrams_documentId_key" ON public.sipoc_diagrams USING btree ("documentId");


--
-- Name: sipoc_diagrams_processId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sipoc_diagrams_processId_key" ON public.sipoc_diagrams USING btree ("processId");


--
-- Name: sipoc_diagrams_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_diagrams_status_idx ON public.sipoc_diagrams USING btree (status);


--
-- Name: sipoc_elements_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sipoc_elements_documentId_key" ON public.sipoc_elements USING btree ("documentId");


--
-- Name: sipoc_elements_sipoc_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_elements_sipoc_id_idx ON public.sipoc_elements USING btree (sipoc_id);


--
-- Name: sipoc_elements_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_elements_type_idx ON public.sipoc_elements USING btree (type);


--
-- Name: sipoc_history_changed_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_history_changed_at_idx ON public.sipoc_history USING btree (changed_at);


--
-- Name: sipoc_history_documentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sipoc_history_documentId_key" ON public.sipoc_history USING btree ("documentId");


--
-- Name: sipoc_history_sipoc_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sipoc_history_sipoc_id_idx ON public.sipoc_history USING btree (sipoc_id);


--
-- Name: units_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX units_name_key ON public.units USING btree (name);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_orangeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_orangeId_key" ON public.users USING btree ("orangeId");


--
-- Name: workspace_members_userId_workspaceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "workspace_members_userId_workspaceId_key" ON public.workspace_members USING btree ("userId", "workspaceId");


--
-- Name: workspace_settings_workspaceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "workspace_settings_workspaceId_key" ON public.workspace_settings USING btree ("workspaceId");


--
-- Name: workspaces_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX workspaces_code_key ON public.workspaces USING btree (code);


--
-- Name: SipocComment SipocComment_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocComment"
    ADD CONSTRAINT "SipocComment_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES public."SipocComment"(comment_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SipocComment SipocComment_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocComment"
    ADD CONSTRAINT "SipocComment_sipoc_id_fkey" FOREIGN KEY (sipoc_id) REFERENCES public.sipoc_diagrams(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocComment SipocComment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocComment"
    ADD CONSTRAINT "SipocComment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocPermission SipocPermission_granted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocPermission"
    ADD CONSTRAINT "SipocPermission_granted_by_fkey" FOREIGN KEY (granted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocPermission SipocPermission_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocPermission"
    ADD CONSTRAINT "SipocPermission_sipoc_id_fkey" FOREIGN KEY (sipoc_id) REFERENCES public.sipoc_diagrams(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocPermission SipocPermission_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocPermission"
    ADD CONSTRAINT "SipocPermission_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocTag SipocTag_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocTag"
    ADD CONSTRAINT "SipocTag_sipoc_id_fkey" FOREIGN KEY (sipoc_id) REFERENCES public.sipoc_diagrams(sipoc_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SipocTag SipocTag_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SipocTag"
    ADD CONSTRAINT "SipocTag_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public."Tag"(tag_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _ProcedureToProcessTag _ProcedureToProcessTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProcedureToProcessTag"
    ADD CONSTRAINT "_ProcedureToProcessTag_A_fkey" FOREIGN KEY ("A") REFERENCES public.procedures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProcedureToProcessTag _ProcedureToProcessTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProcedureToProcessTag"
    ADD CONSTRAINT "_ProcedureToProcessTag_B_fkey" FOREIGN KEY ("B") REFERENCES public.process_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProcessMapToProcessTag _ProcessMapToProcessTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProcessMapToProcessTag"
    ADD CONSTRAINT "_ProcessMapToProcessTag_A_fkey" FOREIGN KEY ("A") REFERENCES public.process_maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProcessMapToProcessTag _ProcessMapToProcessTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProcessMapToProcessTag"
    ADD CONSTRAINT "_ProcessMapToProcessTag_B_fkey" FOREIGN KEY ("B") REFERENCES public.process_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProcessOwners _ProcessOwners_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProcessOwners"
    ADD CONSTRAINT "_ProcessOwners_A_fkey" FOREIGN KEY ("A") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProcessOwners _ProcessOwners_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProcessOwners"
    ADD CONSTRAINT "_ProcessOwners_B_fkey" FOREIGN KEY ("B") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProcessToProcessTag _ProcessToProcessTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProcessToProcessTag"
    ADD CONSTRAINT "_ProcessToProcessTag_A_fkey" FOREIGN KEY ("A") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProcessToProcessTag _ProcessToProcessTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProcessToProcessTag"
    ADD CONSTRAINT "_ProcessToProcessTag_B_fkey" FOREIGN KEY ("B") REFERENCES public.process_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: approval_requests approval_requests_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_requests
    ADD CONSTRAINT "approval_requests_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: approval_requests approval_requests_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_requests
    ADD CONSTRAINT "approval_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: audit_logs audit_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: comments comments_flowNodeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_flowNodeId_fkey" FOREIGN KEY ("flowNodeId") REFERENCES public.flow_nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_nodeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comments comments_procedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES public.procedures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_processMapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_processMapId_fkey" FOREIGN KEY ("processMapId") REFERENCES public.process_maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_resolvedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comments comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: constraints constraints_nodeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.constraints
    ADD CONSTRAINT "constraints_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: control_indicators control_indicators_nodeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_indicators
    ADD CONSTRAINT "control_indicators_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: departments departments_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT "departments_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documents documents_procedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES public.procedures(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: documents documents_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: documents documents_processMapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_processMapId_fkey" FOREIGN KEY ("processMapId") REFERENCES public.process_maps(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: edges edges_fromId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT "edges_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: edges edges_toId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT "edges_toId_fkey" FOREIGN KEY ("toId") REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_diagrams flow_diagrams_procedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flow_diagrams
    ADD CONSTRAINT "flow_diagrams_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES public.procedures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_diagrams flow_diagrams_processId_ref_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flow_diagrams
    ADD CONSTRAINT "flow_diagrams_processId_ref_fkey" FOREIGN KEY ("processId_ref") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_diagrams flow_diagrams_processMapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flow_diagrams
    ADD CONSTRAINT "flow_diagrams_processMapId_fkey" FOREIGN KEY ("processMapId") REFERENCES public.process_maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_edges flow_edges_diagramId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flow_edges
    ADD CONSTRAINT "flow_edges_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES public.flow_diagrams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_nodes flow_nodes_diagramId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flow_nodes
    ADD CONSTRAINT "flow_nodes_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES public.flow_diagrams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_permissions group_permissions_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_permissions
    ADD CONSTRAINT "group_permissions_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: indicators indicators_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indicators
    ADD CONSTRAINT "indicators_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: journal_entries journal_entries_procedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES public.procedures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: journal_entries journal_entries_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: journal_entries journal_entries_processMapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_processMapId_fkey" FOREIGN KEY ("processMapId") REFERENCES public.process_maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: linked_documents linked_documents_procedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.linked_documents
    ADD CONSTRAINT "linked_documents_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES public.procedures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: linked_documents linked_documents_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.linked_documents
    ADD CONSTRAINT "linked_documents_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: means means_procedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.means
    ADD CONSTRAINT "means_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES public.procedures(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: means means_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.means
    ADD CONSTRAINT "means_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: means means_processMapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.means
    ADD CONSTRAINT "means_processMapId_fkey" FOREIGN KEY ("processMapId") REFERENCES public.process_maps(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: node_templates node_templates_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.node_templates
    ADD CONSTRAINT "node_templates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: node_templates node_templates_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.node_templates
    ADD CONSTRAINT "node_templates_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: nodes nodes_linkedDocumentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT "nodes_linkedDocumentId_fkey" FOREIGN KEY ("linkedDocumentId") REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_linkedInstructionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT "nodes_linkedInstructionId_fkey" FOREIGN KEY ("linkedInstructionId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_parentNodeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT "nodes_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT "nodes_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_subProcessId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT "nodes_subProcessId_fkey" FOREIGN KEY ("subProcessId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notifications notifications_procedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES public.procedures(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notifications notifications_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notifications notifications_processMapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_processMapId_fkey" FOREIGN KEY ("processMapId") REFERENCES public.process_maps(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: procedure_validation_requests procedure_validation_requests_procedureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_validation_requests
    ADD CONSTRAINT "procedure_validation_requests_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES public.procedures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: procedure_validation_requests procedure_validation_requests_requestedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_validation_requests
    ADD CONSTRAINT "procedure_validation_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: procedure_validation_requests procedure_validation_requests_validatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_validation_requests
    ADD CONSTRAINT "procedure_validation_requests_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: procedures procedures_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT "procedures_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: procedures procedures_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT "procedures_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: procedures procedures_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT "procedures_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: procedures procedures_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT "procedures_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_actors process_actors_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_actors
    ADD CONSTRAINT "process_actors_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_assignments process_assignments_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_assignments
    ADD CONSTRAINT "process_assignments_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_assignments process_assignments_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_assignments
    ADD CONSTRAINT "process_assignments_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: process_assignments process_assignments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_assignments
    ADD CONSTRAINT "process_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: process_identity_cards process_identity_cards_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_identity_cards
    ADD CONSTRAINT "process_identity_cards_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: process_identity_cards process_identity_cards_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_identity_cards
    ADD CONSTRAINT "process_identity_cards_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_inputs process_inputs_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_inputs
    ADD CONSTRAINT "process_inputs_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_ios process_ios_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_ios
    ADD CONSTRAINT "process_ios_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_map_validation_requests process_map_validation_requests_processMapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_map_validation_requests
    ADD CONSTRAINT "process_map_validation_requests_processMapId_fkey" FOREIGN KEY ("processMapId") REFERENCES public.process_maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_map_validation_requests process_map_validation_requests_requestedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_map_validation_requests
    ADD CONSTRAINT "process_map_validation_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: process_map_validation_requests process_map_validation_requests_validatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_map_validation_requests
    ADD CONSTRAINT "process_map_validation_requests_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: process_maps process_maps_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_maps
    ADD CONSTRAINT "process_maps_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: process_maps process_maps_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_maps
    ADD CONSTRAINT "process_maps_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: process_maps process_maps_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_maps
    ADD CONSTRAINT "process_maps_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_outputs process_outputs_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_outputs
    ADD CONSTRAINT "process_outputs_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_qualigram_tags process_qualigram_tags_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_qualigram_tags
    ADD CONSTRAINT "process_qualigram_tags_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_qualigram_tags process_qualigram_tags_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_qualigram_tags
    ADD CONSTRAINT "process_qualigram_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public.qualigram_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_tags process_tags_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_tags
    ADD CONSTRAINT "process_tags_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_templates process_templates_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_templates
    ADD CONSTRAINT "process_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: process_templates process_templates_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_templates
    ADD CONSTRAINT "process_templates_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_themes process_themes_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_themes
    ADD CONSTRAINT "process_themes_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_validation_requests process_validation_requests_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_validation_requests
    ADD CONSTRAINT "process_validation_requests_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_validation_requests process_validation_requests_requestedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_validation_requests
    ADD CONSTRAINT "process_validation_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: process_validation_requests process_validation_requests_validatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process_validation_requests
    ADD CONSTRAINT "process_validation_requests_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: processes processes_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processes
    ADD CONSTRAINT "processes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: processes processes_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processes
    ADD CONSTRAINT "processes_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: processes processes_processMapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processes
    ADD CONSTRAINT "processes_processMapId_fkey" FOREIGN KEY ("processMapId") REFERENCES public.process_maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: processes processes_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processes
    ADD CONSTRAINT "processes_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reading_confirmations reading_confirmations_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_confirmations
    ADD CONSTRAINT "reading_confirmations_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reading_confirmations reading_confirmations_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_confirmations
    ADD CONSTRAINT "reading_confirmations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: risks risks_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT "risks_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: roles roles_unitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "roles_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sipoc_connections sipoc_connections_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_connections
    ADD CONSTRAINT sipoc_connections_sipoc_id_fkey FOREIGN KEY (sipoc_id) REFERENCES public.sipoc_diagrams(sipoc_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sipoc_connections sipoc_connections_source_element_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_connections
    ADD CONSTRAINT sipoc_connections_source_element_id_fkey FOREIGN KEY (source_element_id) REFERENCES public.sipoc_elements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sipoc_connections sipoc_connections_source_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_connections
    ADD CONSTRAINT sipoc_connections_source_sipoc_id_fkey FOREIGN KEY (source_sipoc_id) REFERENCES public.sipoc_diagrams(sipoc_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sipoc_connections sipoc_connections_target_element_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_connections
    ADD CONSTRAINT sipoc_connections_target_element_id_fkey FOREIGN KEY (target_element_id) REFERENCES public.sipoc_elements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sipoc_connections sipoc_connections_target_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_connections
    ADD CONSTRAINT sipoc_connections_target_sipoc_id_fkey FOREIGN KEY (target_sipoc_id) REFERENCES public.sipoc_diagrams(sipoc_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sipoc_diagrams sipoc_diagrams_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_diagrams
    ADD CONSTRAINT "sipoc_diagrams_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sipoc_diagrams sipoc_diagrams_processId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_diagrams
    ADD CONSTRAINT "sipoc_diagrams_processId_fkey" FOREIGN KEY ("processId") REFERENCES public.processes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sipoc_elements sipoc_elements_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_elements
    ADD CONSTRAINT sipoc_elements_sipoc_id_fkey FOREIGN KEY (sipoc_id) REFERENCES public.sipoc_diagrams(sipoc_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sipoc_history sipoc_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_history
    ADD CONSTRAINT sipoc_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sipoc_history sipoc_history_sipoc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sipoc_history
    ADD CONSTRAINT sipoc_history_sipoc_id_fkey FOREIGN KEY (sipoc_id) REFERENCES public.sipoc_diagrams(sipoc_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: workspace_members workspace_members_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workspace_members workspace_members_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workspace_settings workspace_settings_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_settings
    ADD CONSTRAINT "workspace_settings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workspaces workspaces_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT "workspaces_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

