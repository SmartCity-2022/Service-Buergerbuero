# environment variables  

__PORT__ port of the server app, i.e. "3001"  

__REBUILD__ true or false. rebuild db, delete if exists then create all tables, insert mock data. for testing purposes: should not be used in actual deployment (will probably be removed by then)

__DB_USER__ database username  

__DB_PW__ database passwort  

__DB_NAME__ database name  

__DB_HOST__ database host, i.e. "127.0.0.1"  

__AMQPHOST__ rabbitmq host, i.e. "amqp://localhost:5672"  

__RABBITMQEXCHANGE__ rabbitmq exchange name , i.e. "exchange"  

__JWT_SECRET__ jwt secret  

__MAIN_HUB_HOST__ host address of main hub server  

__SKIP_AUTH__ set to true if to skip user authentication for testing/development purposes 