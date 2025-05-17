import express from 'express';
import Restaurant from '../models/restaurant.js';
import { verifyTokenAndAdmin } from '../middlewares/verifyToken.js';

const router = express.Router();

// Get count of restaurants (admin only)
router.get('/count', verifyTokenAndAdmin, async (req, res) => {
  try {
    const count = await Restaurant.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all restaurants (public access, optional sorting and pagination)
router.get('/', async (req, res) => {
  const { sort, limit = 10, page = 1 } = req.query;
  const sortOptions = {};

  if (sort) {
    const fields = sort.split(',');
    fields.forEach(field => {
      let order = 1;
      if (field.startsWith('-')) {
        order = -1;
        field = field.substring(1);
      }
      if (["name", "address"].includes(field)) {
        sortOptions[field] = order;
      }
    });
  }

  try {
    const restaurants = await Restaurant.find()
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a restaurant (admin only)
router.post('/', 
  //verifyTokenAndAdmin, 
  async (req, res) => {
  const {id, name, address, phone, opening_hours } = req.body;
  const newRestaurant = new Restaurant({id, name, address, phone, opening_hours });

  try {
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a restaurant (admin only)
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a restaurant (admin only)
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
