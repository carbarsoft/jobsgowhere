-- Add your release scripts here
-- table to keep common data for both job seeker and provider
-- iam stands for identity and access management.
CREATE TABLE person
(
    id           UUID PRIMARY KEY,
    iam_id       TEXT      NOT NULL UNIQUE,
    name         TEXT,
    dp_url       TEXT,
    email        TEXT      NOT NULL,
    iam_provider TEXT      NOT NULL,
    created_at   TIMESTAMP NOT NULL,
    UNIQUE (email, iam_provider)
);

-- table to keep job and description.
CREATE TABLE job
(
    id          UUID PRIMARY KEY,
    title       TEXT      NOT NULL,
    description TEXT      NOT NULL,
    location    TEXT      NOT NULL,
    status      INT       NOT NULL DEFAULT 1, -- 1 = Open, 0 = Closed, 2 = Canceled, 3 = OnHold
    person_id   UUID      NOT NULL REFERENCES person (id),
    created_at  TIMESTAMP NOT NULL
);

-- master table to keep the skill information
CREATE TABLE skill
(
    id          UUID PRIMARY KEY,
    title       TEXT UNIQUE NOT NULL,
    description TEXT
);

-- a master table map of related skills which helps in search
CREATE TABLE related_skills
(
    primary_skill_id UUID REFERENCES skill (id),
    related_skill_id UUID REFERENCES skill (id),
    PRIMARY KEY (primary_skill_id, related_skill_id)
);

-- table to keep the map of job and skill to help in search
CREATE TABLE job_skill_map
(
    id       UUID PRIMARY KEY,
    job_id   UUID NOT NULL REFERENCES job (id),
    skill_id UUID NOT NULL REFERENCES skill (id),
    required BOOL DEFAULT FALSE
);

-- table to keep the job seeker specific data
CREATE TABLE job_seeker
(
    person_id       UUID PRIMARY KEY REFERENCES person (id),
    title           TEXT      NOT NULL,
    current_company TEXT,
    headline        TEXT,
    city            TEXT,
    seeking_mode    INT, -- 0 = Inactive, 1 = Active, 2 = Open
    created_at      TIMESTAMP NOT NULL
);

-- 1 to many mapping of job_seeker_profile
CREATE TABLE job_seeker_profile
(
    person_id   UUID NOT NULL REFERENCES job_seeker (person_id),
    profile_url TEXT NOT NULL
);

-- table to keep job provider data
CREATE TABLE job_provider
(
    person_id       UUID PRIMARY KEY REFERENCES person (id),
    title           TEXT      NOT NULL,
    current_company TEXT      NOT NULL,
    website_url     TEXT,
    hunting_mode    INT, -- 0 = Inactive, 1 = Active, 2 = Open
    created_at      TIMESTAMP NOT NULL
);