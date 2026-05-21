import * as userService from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* -------- DASHBOARD -------- */
export const dashboard = async (req, res) => {
  try {
    console.log("Dashboard controller called");
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

/* -------- create user -------- */
export const createUser = async (req, res) => {
  try {
    const { user_name, email, password, role, is_active } = req.body;
    const user = await userService.createUser(
      user_name,
      email,
      password,
      role,
      is_active,
    );
    return successResponse(res, user, "User created successfully");
  } catch (error) {
    return errorResponse(res, "Failed to create user", error.message);
  }
};

/* -------- get all users -------- */
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Failed to retrieve users", error.message);
  }
};

/* -------- get user by id -------- */
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Failed to retrieve user", error.message);
  }
};

/* -------- update user -------- */
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedData = req.body;

    const user = await userService.updateUser(userId, updatedData);

    return successResponse(res, user, "User updated successfully");
  } catch (error) {
    return errorResponse(res, "Failed to update user", error.message);
  }
};

/* -------- delete user -------- */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);
    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    return errorResponse(res, "Failed to delete user", error.message);
  }
};

/* -------- change user status -------- */
export const changeUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { is_active } = req.body;
    const result = await userService.changeUserStatus(userId, is_active);
    return successResponse(res, result, "User status updated successfully");
  } catch (error) {
    return errorResponse(res, "Failed to update user status", error.message);
  }
};

/* -------- change password -------- */
export const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;
    await userService.changePassword(userId, password);
    return successResponse(res, null, "Password changed successfully");
  } catch (error) {
    return errorResponse(res, "Failed to change password", error.message);
  }
};

export const getUserDetailsWithProjectsAndEnvironments = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserDetailsWithProjectsAndEnvironments(userId);
    return successResponse(res, user, "User details retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Failed to retrieve user details", error.message);
  }
};
