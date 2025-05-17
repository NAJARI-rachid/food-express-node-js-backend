import express from "express";
import User from "../models/user.js"; // ✅ Correction ici
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middlewares/verifyToken.js";

const router = express.Router();

// ✅ Créer un utilisateur
router.post("/", async (req, res) => {
  const { id, email, username, password, role } = req.body;
  try {
    const newUser = new User({
      id,
      email,
      username,
      password,
      role: role || "user",
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Obtenir tous les utilisateurs (admin uniquement)
router.get(
  "/",
  //verifyTokenAndAdmin,
  async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ✅ Obtenir un utilisateur par ID
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Modifier un utilisateur
router.put("/:id", 
    //verifyTokenAndAuthorization, 
    async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Supprimer un utilisateur
router.delete("/:id", 
    //verifyTokenAndAuthorization,
     async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
