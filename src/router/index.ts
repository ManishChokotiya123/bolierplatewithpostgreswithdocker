import { Request, Response, Router } from "express";
import pool from "../database";
import { comparePassword, createhash } from "../helper/passwordEncyption";
import { createToken } from "../helper/jwtService";
const router = Router();

router.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM public.user");
  console.log(result);
  res.json(result.rows);
});


router.post("/createUser", async (req: Request, res: Response) => {
  const hashPassword = await createhash(req.body.password);
  console.log(req.body);
  try {
    const result = await pool.query(
      'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [req.body.name, req.body.email, hashPassword]
    );
    res
      .status(200)
      .json({ message: "User created successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error creating user", message: err });
  }
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id: " + id);
  try {
    const result = await pool.query("SELECT * FROM public.user WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).send("User does not exist");
    } else {
      res.status(200).send(result.rows);
    }
  } catch (error) {
    res.status(500).send("error: " + error);
  }
});

router.post("/user/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query("SELECT * FROM public.user WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).send("User does not exist");
    } else {
      const updateData = await pool.query(
        'UPDATE "user" SET name = $1, email = $2 WHERE id = $3',
        [req.body.name, req.body.email, req.params.id]
      );

      if (updateData.rowCount === 0) {
        res.status(404).send("User not Updated");
      } else {
        res.status(200).send("User Updated successfully");
      }
    }
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

router.delete("/user/delete/:id", async (req, res) => {
  console.log(":id", req.params.id);
  const id = req.params.id;
  console.log(":id", id);
  try {
    const result = await pool.query('DELETE FROM "user" WHERE id = $1 ', [id]);
    console.log("data:", result.rows);
    if (result.rowCount === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM public.user Where email=$1 ",
      [email]
    );
    if (result.rows.length == 0) {
      res.status(404).send("User does not exist");
    } else {
      const data = result.rows;
      const userpassword = result.rows[0].password;
      const checkPassword = await comparePassword(password, userpassword);

      if (!checkPassword) {
        return res.status(400).send("Invalid password");
      }
      const tokendata = {
        name: data[0].name,
        password: data[0].password,
        email: data[0].email,
      };
      const token = await createToken(tokendata);
      return res.status(200).send({ token: token });
    }
  } catch (error) {
    return res.status(500).send("error:" + error);
  }
});

export default router;
