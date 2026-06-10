import prisma from "../config/prisma.js";

export const getAllApiDocs = async (filters = {}) => {
    const {
        search,
        service_type_id,
        provider_id,
        is_active,
        type,
        page = 1,
        limit = 10
    } = filters;

    const where = {
        is_deleted: false,

        ...(service_type_id && {
            service_type_id
        }),

        ...(provider_id && {
            provider_id
        }),

        ...(type && {
            type
        }),

        ...(is_active !== undefined && {
            is_active
        }),

        ...(search && {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    service_type: {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                },
                {
                    provider: {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                }
            ]
        })
    };

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
        prisma.apiDocumentation.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                created_at: "desc"
            },
            include: {
                service_type: true,
                provider: true
            }
        }),
        prisma.apiDocumentation.count({
            where
        })
    ]);

    return {
        records,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

export const getApiDocById = async (public_id) => {
    const doc = await prisma.apiDocumentation.findUnique({
        where: { public_id },
        include: {
            service_type: true,
            provider: true
        }
    });

    if (!doc) {
        throw new Error("API Documentation not found");
    }

    return doc;
};

export const getApiDocsByService = async (service_type_id) => {
    const docs = await prisma.apiDocumentation.findMany({
        where: {
            service_type_id,
            is_active: true,
            is_deleted: false
        },
        include: {
            provider: true,
            service_type: true
        },
        orderBy: [
            { provider_id: 'asc' },
            { order: 'asc' }
        ]
    });

    // Group by provider
    const grouped = {};
    docs.forEach(doc => {
        const providerKey = doc.provider_id || 'no-provider';
        if (!grouped[providerKey]) {
            grouped[providerKey] = {
                provider: doc.provider,
                service: doc.service_type,
                apis: []
            };
        }
        grouped[providerKey].apis.push(doc);
    });

    return Object.values(grouped);
};

export const getServicesWithDocs = async () => {
    const services = await prisma.serviceType.findMany({
        where: {
            api_documentations: {
                some: {
                    is_deleted: false,
                    is_active: true
                }
            },
            is_active: true
        },
        include: {
            api_documentations: {
                where: { is_deleted: false, is_active: true },
                distinct: ['provider_id'],
                include: { provider: true }
            }
        }
    });

    return services.map(service => ({
        id: service.public_id,
        name: service.name,
        slug: service.slug,
        providers: service.api_documentations
            .filter(doc => doc.provider)
            .map(doc => ({
                id: doc.provider.public_id,
                name: doc.provider.name,
                slug: doc.provider.slug
            }))
            .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    }));
};

export const createApiDoc = async (data) => {
    // Check if exists
    const existing = await prisma.apiDocumentation.findFirst({
        where: {
            service_type_id: data.service_type_id,
            provider_id: data.provider_id,
            name: data.name,
            is_deleted: false
        }
    });

    if (existing) {
        throw new Error("API documentation with this name already exists for this service and provider");
    }

    return prisma.apiDocumentation.create({
        data: {
            service_type_id: data.service_type_id,
            provider_id: data.provider_id || null,
            name: data.name,
            type: data.type,
            url: data.url,
            description: data.description,
            header: data.header || "",
            input: data.input || "",
            output: data.output || "",
            headers: data.headers || [],
            body: data.body || [],
            response: data.response || [],
            order: data.order || 0,
            is_active: data.is_active !== undefined ? data.is_active : true
        },
        include: {
            service_type: true,
            provider: true
        }
    });
};

export const updateApiDoc = async (public_id, data) => {
    const existing = await prisma.apiDocumentation.findUnique({
        where: { public_id }
    });

    if (!existing) {
        throw new Error("API Documentation not found");
    }

    return prisma.apiDocumentation.update({
        where: { public_id },
        data: {
            name: data.name,
            type: data.type,
            url: data.url,
            description: data.description,
            header: data.header,
            input: data.input,
            output: data.output,
            headers: data.headers,
            body: data.body,
            response: data.response,
            order: data.order,
            is_active: data.is_active
        },
        include: {
            service_type: true,
            provider: true
        }
    });
};

export const deleteApiDoc = async (public_id) => {
    const existing = await prisma.apiDocumentation.findUnique({
        where: { public_id }
    });

    if (!existing) {
        throw new Error("API Documentation not found");
    }

    return prisma.apiDocumentation.update({
        where: { public_id },
        data: { is_deleted: true }
    });
};