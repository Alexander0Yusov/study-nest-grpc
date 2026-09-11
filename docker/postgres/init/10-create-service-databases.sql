SELECT 'CREATE DATABASE gateway_db'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'gateway_db'
)\gexec

SELECT 'CREATE DATABASE task_db'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'task_db'
)\gexec
