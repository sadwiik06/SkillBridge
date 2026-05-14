CREATE TABLE IF NOT EXISTS user_skills (
    user_id BIGINT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, skill_name),
    CONSTRAINT fk_user_skills_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
