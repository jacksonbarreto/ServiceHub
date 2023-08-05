CREATE TABLE IF NOT EXISTS automation_model
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(50) UNIQUE                      NOT NULL,
    image    VARCHAR(255)                            NOT NULL,
    host     VARCHAR(50)                             NOT NULL,
    port     INT CHECK (port >= 0 AND port <= 65535) NOT NULL,
    position INT CHECK (position >= 0) UNIQUE        NOT NULL
);

CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
