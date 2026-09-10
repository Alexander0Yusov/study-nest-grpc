SELECT 'CREATE DATABASE study_tasks'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'study_tasks'
)\gexec

SELECT 'CREATE DATABASE study_gateway'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'study_gateway'
)\gexec
