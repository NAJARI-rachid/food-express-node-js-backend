import express from "express";
import Menu from "../models/menu.js";
import { verifyTokenAndAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();

// GET /menus - Public - With sorting and pagination
router.get("/", async (req, res) => {
  const { sort, limit = 10, page = 1 } = req.query;

  const sortFields = sort ? sort.split(",") : [];
  const sortOptions = {};

  sortFields.forEach((field) => {
    let order = 1;
    if (field.startsWith("-")) {
      order = -1;
      field = field.substring(1);
    }

    if (["price", "category", "name"].includes(field)) {
      sortOptions[field] = order;
    }
  });

  try {
    const menus = await Menu.find()
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(menus);
  } catch (err) {
    console.error("Error getting menus:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /menus/:id - Public
router.get("/:id", async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.status(200).json(menu);
  } catch (err) {
    console.error("Error getting menu:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /menus - Admin only
router.post(
  "/",
  //verifyTokenAndAdmin,
  async (req, res) => {
    const { id, restaurantId, name, description, price, category } = req.body;

    const menu = new Menu({
      id,
      restaurantId,
      name,
      description,
      price,
      category,
    });

    try {
      const savedMenu = await menu.save();
      res.status(201).json(savedMenu);
    } catch (err) {
      console.error("Error creating menu:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// PUT /menus/:id - Admin only
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const { restaurant_id, name, description, price, category } = req.body;

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      { restaurant_id, name, description, price, category },
      { new: true }
    );
    if (!updatedMenu) return res.status(404).json({ error: "Menu not found" });
    res.status(200).json(updatedMenu);
  } catch (err) {
    console.error("Error updating menu:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Api pour supprimer les menus avec l'id
router.delete("/:id", 
    //verifyTokenAndAdmin, 
    async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Menu not found" });
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;