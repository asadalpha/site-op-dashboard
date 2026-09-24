const { z } = require('zod');

const siteSchema = z.object({
  name: z.string().trim().min(2).max(150),
  address: z.string().trim().min(3),
  status: z.enum(['active', 'inactive', 'completed']).default('active'),
  contactName: z.string().trim().max(100).optional().nullable(),
  contactPhone: z.string().trim().max(30).optional().nullable(),
});

const validateSite = (req, _res, next) => {
  const result = siteSchema.safeParse(req.body);
  if (!result.success) {
    return next(Object.assign(new Error(result.error.issues.map((issue) => issue.message).join(', ')), { statusCode: 400 }));
  }
  req.validatedBody = result.data;
  return next();
};

module.exports = { siteSchema, validateSite };
