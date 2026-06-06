import * as userService from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* -------- DASHBOARD -------- */
export const dashboard = async (req, res) => {
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
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- create user -------- */
export const createUser = async (req, res) => {
  try {
    const { user_name, email, role, is_active } = req.body;

    const user = await userService.createUser(
      user_name,
      email,
      role,
      is_active,
    );
    return successResponse(res, user, "User created successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- get all users -------- */
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- get user by id -------- */
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
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
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- delete user -------- */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);
    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
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
    return errorResponse(res, error.message, null, error.statusCode || 500);
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
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- get user details with projects and environments -------- */
export const getUserDetailsWithProjectsAndEnvironments = async (req, res) => {
  try {
    const userId = req.params.id;
    const user =
      await userService.getUserDetailsWithProjectsAndEnvironments(userId);
    return successResponse(res, user, "User details retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- remove environment from user -------- */
export const removeEnvironmentFromUser = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const environment_id = req.body.environment_id;
    const project_id = req.body.project_id;
    await userService.removeEnvironmentFromUser(
      user_id,
      environment_id,
      project_id,
    );
    return successResponse(
      res,
      null,
      "Environment removed from user successfully",
    );
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- get user assigned projects and environments -------- */
export const userAssignedProjectsEnvironments = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await userService.userAssignedProjectsEnvironments(user_id);
    return successResponse(
      res,
      result,
      "User assigned projects and environments retrieved successfully",
    );
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};
