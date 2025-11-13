-- Создание базы данных для ALed проекта
-- Этот файл выполняется при первом запуске PostgreSQL контейнера

-- Создание расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Настройка локали для корректной работы с русским языком
SET lc_messages TO 'en_US.UTF-8';
SET lc_monetary TO 'en_US.UTF-8';
SET lc_numeric TO 'en_US.UTF-8';
SET lc_time TO 'en_US.UTF-8';

-- Комментарий к базе данных
COMMENT ON DATABASE aled IS 'ALed интернет-магазин светодиодной продукции';
