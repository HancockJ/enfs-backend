import dotenv from 'dotenv';
dotenv.config();
export const infuraKey = process.env.INFURA_KEY;
const db_conn = {
    "debug":{
        "connection_uri":{
            "user": "postgres",
            "host": "localhost",
            "database": "ens_database",
            "password": "",
            "port": 5432
          }
    },
    "production":{
        "connection_uri":{
  "user": "postgres",
  "host": "localhost",
  "database": "ens_db",
  "password": "root",
  "port": 5432
}
    }
};
export default db_conn