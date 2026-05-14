import * as userService from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, user, "User created successfully");
  } catch (error) {
    return errorResponse(res, "Failed to create user", error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Failed to retrieve users", error.message);
  }
};

export const changeUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { active } = req.body;
    const result = await userService.changeUserStatus(userId, active);
    return successResponse(res, result, "User status updated successfully");
  } catch (error) {
    return errorResponse(res, "Failed to update user status", error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Failed to retrieve user", error.message);
  }
};

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await userService.getUserById(userId);
    const statsData = await userService.getStatsData();
    return successResponse(
      res,
      { users, statsData },
      "User data retrieved successfully",
    );
  } catch (error) {
    return errorResponse(res, "Failed to retrieve user data", error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await userService.getAllUsers(userId);
    console.log(users);
    return successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Failed to retrieve users", error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;
    await userService.changePassword(userId, newPassword);
    return successResponse(res, null, "Password changed successfully");
  } catch (error) {
    return errorResponse(res, "Failed to change password", error.message);
  }
};
