-- Database: perf_test

-- DROP DATABASE perf_test;

CREATE DATABASE perf_test
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.utf8'
       LC_CTYPE = 'en_US.utf8'
       CONNECTION LIMIT = -1;

create table document
(
     id text not null
          constraint "PK_DOCUMENT_ID"
          primary key,
     "docId" text,
     label text,
     context text,
     distributions jsonb,
     date timestamp with time zone
)
;

