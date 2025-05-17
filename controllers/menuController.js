const Menu= require('../models/menuModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.createMenu = (req, res) => {
    res.send('Créer un menu');
  };
  
  exports.getAllMenus = (req, res) => {
    res.send('Liste des menus');
  };
  
  exports.getMenuById = (req, res) => {
    res.send(`Détails du menu ${req.params.id}`);
  };
  
  exports.updateMenu = (req, res) => {
    res.send(`Mettre à jour le menu ${req.params.id}`);
  };
  
  exports.deleteMenu = (req, res) => {
    res.send(`Supprimer le menu ${req.params.id}`);
  };
exports.getMenuByRestaurantId = (req, res) => {
    res.send(`Détails du menu du restaurant ${req.params.id}`);
};  