SELECT user, host FROM mysql.user;

GRANT ALL PRIVILEGES ON mydatabase.* TO 'user'@'172.19.0.4' IDENTIFIED BY 'password';

FLUSH PRIVILEGES;
