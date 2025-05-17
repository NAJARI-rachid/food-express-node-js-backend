import express from 'express';
import user from '../models/user';
import { verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../middleware/verifyToken';


exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  const user = new User({ email, username, password });
  await user.save();
  res.status(201).json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Identifiants invalides' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.createUser = (req, res) => {
  res.send('Créer un utilisateur');
};

exports.getAllUsers = (req, res) => {
  res.send('Liste des utilisateurs');
};

exports.getUserById = (req, res) => {
  res.send(`Détails de l'utilisateur ${req.params.id}`);
};

exports.updateUser = (req, res) => {
  res.send(`Mettre à jour l'utilisateur ${req.params.id}`);
};

exports.deleteUser = (req, res) => {
  res.send(`Supprimer l'utilisateur ${req.params.id}`);
};

