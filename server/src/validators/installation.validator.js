const { z } = require('zod');

const installationSchema = z.object({
  siteId: z.coerce.number().int().positive(),
  assignedTo: z.coerce.number().int().positive().optional().nullable(),
  status: z.enum(['planned', 'in_progress', 'completed', 'failed']).default('planned'),
  scheduledDate: z.coerce.date().optional().nullable(),
  completedDate: z.coerce.date().optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

const validateInstallation = (req, _res, next) => {
  const result = installationSchema.safeParse(req.body);
  if (!result.success) {
    return next(Object.assign(new Error(result.error.issues.map((issue) => issue.message).join(', ')), { statusCode: 400 }));
  }
  req.validatedBody = result.data;
  return next();
};

module.exports = { installationSchema, validateInstallation };
