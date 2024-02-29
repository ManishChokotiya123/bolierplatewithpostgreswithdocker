import pool from "../database";
import { Request, Response } from "express";
import { comparePassword, createhash } from "../helper/passwordEncyption";
import { createToken } from "../helper/jwtService";

export const showUser = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM public.user");
    console.log(result);
    if (result.rows.length === 0) {
      return res.status(404).send({ message: "empty user list" });
    } else {
      return res
        .status(200)
        .send({ message: "User List was successfully", data: result.rows });
    }
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export const createUser = async (req: Request, res: Response) => {
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
};

export const findbyId = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("id: " + id);
  try {
    const result = await pool.query("SELECT * FROM public.user WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("User does not exist");
    } else {
      return res.status(200).send(result.rows);
    }
  } catch (error) {
    return res.status(500).send("error: " + error);
  }
};

export const userUpdate = async (req: Request, res: Response) => {
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
};
export const userDelete = async (req: Request, res: Response) => {
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
};
export const userLogin = async (req: Request, res: Response) => {
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
};

export const userChangePassword = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    console.log("Email: " + email);
    const result = await pool.query(
      "select * from public.user where email=$1",
      [email]
    );
    console.log(result);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not Found" });
    } else {
      const hashPassword = await createhash(req.body.password);
      const updatePassword = await pool.query(
        'UPDATE "user" SET password = $1 WHERE email = $2',
        [hashPassword, email]
      );
      console.log("145",updatePassword);

      if (updatePassword.rowCount === 1) {
        return res
          .status(200)
          .json({ message: "Password updated successfully" });
      } else {
        return res.status(500).json({ message: "Failed to update password" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};
