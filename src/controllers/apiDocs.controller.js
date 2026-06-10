import * as apiDocsService from "../services/apiDocs.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getAllApiDocs = async (req, res) => {
    try {
        const {
            search,
            service_type_id,
            provider_id,
            is_active,
            type,
            page,
            limit
        } = req.query;
        const result = await apiDocsService.getAllApiDocs({
            search,
            service_type_id,
            provider_id,
            type,
            is_active:
                is_active === undefined
                    ? undefined
                    : is_active === "true",
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10
        });
        return successResponse(res, result, "API documentation fetched successfully");
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

export const getApiDocById = async (req, res) => {
    try {
        const doc = await apiDocsService.getApiDocById(req.params.id);
        return successResponse(res, doc, "API documentation fetched successfully");
    } catch (error) {
        return errorResponse(res, error.message, null, 404);
    }
};

export const getApiDocsByService = async (req, res) => {
    try {
        const docs = await apiDocsService.getApiDocsByService(req.params.serviceId);
        return successResponse(res, docs, "API documentation fetched successfully");
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

export const getServicesWithProviders = async (req, res) => {
    try {
        const services = await apiDocsService.getServicesWithDocs();
        return successResponse(res, services, "Services fetched successfully");
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

export const createApiDoc = async (req, res) => {
    try {
        const doc = await apiDocsService.createApiDoc(req.body);
        return successResponse(res, doc, "API documentation created successfully", 201);
    } catch (error) {
        return errorResponse(res, error.message, null, 400);
    }
};

export const updateApiDoc = async (req, res) => {
    try {
        const doc = await apiDocsService.updateApiDoc(req.params.id, req.body);
        return successResponse(res, doc, "API documentation updated successfully");
    } catch (error) {
        return errorResponse(res, error.message, null, 400);
    }
};

export const deleteApiDoc = async (req, res) => {
    try {
        await apiDocsService.deleteApiDoc(req.params.id);
        return successResponse(res, null, "API documentation deleted successfully");
    } catch (error) {
        return errorResponse(res, error.message, null, 404);
    }
};