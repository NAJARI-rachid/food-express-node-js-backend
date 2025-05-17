const Restaurant = require('../models/restaurantModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const {name, address, phone, opening_hours } = req.body;
    const restaurant = new Restaurant({ name, address, phone, opening_hours });
    await restaurant.save();    
    res.status(201).json(restaurant);
};

exports.login = async (req, res) => {
    const { name, address  } = req.body;
    const restaurant = await Restaurant.findOne({ name });
    if (!restaurant || !(await bcrypt.compare(address, restaurant.address))) {
        return res.status(400).json({ message: 'Identifiants invalides' });
    }
    const token = jwt.sign({ id: restaurant._id, role: restaurant.role }, process.env.JWT_SECRET);
    res.json({ token });
};

exports.createRestaurant = (req, res) => {
    res.send('Créer un restaurant');
  };
  
  exports.getAllRestaurants = (req, res) => {
    res.send('Liste des restaurants');
  };
  
  exports.getRestaurantById = (req, res) => {
    res.send(`Détails du restaurant ${req.params.id}`);
  };
  
  exports.updateRestaurant = (req, res) => {
    res.send(`Mettre à jour le restaurant ${req.params.id}`);
  };
  
  exports.deleteRestaurant = (req, res) => {
    res.send(`Supprimer le restaurant ${req.params.id}`);
  };
  