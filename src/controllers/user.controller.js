import * as userService from "../services/user.service.js";

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserData = async (req, res) => {
  try {
    const userId =  req.user
    const users = await userService.getUserById(userId.id);
    const statsData = await userService.getStatsData();
    res.json({ users, statsData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const userId =  req.user.id
    const users = await userService.getAllUsers(userId);
    console.log(users)
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;
    await userService.changePassword(userId, newPassword);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.json(result);
    res.status(500).json({ message: error.message });
  }
};