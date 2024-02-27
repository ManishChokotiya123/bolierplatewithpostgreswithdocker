import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.User, process.env.password, process.env.database);
const pool = new Pool({
  user: "postgres",
  database: "mydb",
  password: "new_password",
  host: "postgres", // Use the container name or IP address
  port: 5432,
});

// pool.connect((err) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log("Connected to database");
//   }
// });
export default pool;
