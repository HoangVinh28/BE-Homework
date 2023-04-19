const yup = require("yup");
//const ObjectId = require('mongodb').ObjectId;

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(3).max(31).required(),
  }),
  params: yup.object({}),
});

const loginCategorySchema = yup.object({
  params: yup.object({
    _id: yup.string(),
  }),
});

const loginSupplierSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
  }),
  params: yup.object({}),
});

const loginCustomerSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
  }),
  params: yup.object({}),
});

const loginProductSchema = yup.object({
  params: yup.object({
    _id: yup.string(),
  }),
});

const loginOrderSchema = yup.object({
  params: yup.object({
    _id: yup.string(),
  }),
});

module.exports = {
  validateSchema,
  loginSchema,
  loginCategorySchema,
  loginSupplierSchema,
  loginCustomerSchema,
  loginProductSchema,
  loginOrderSchema,
};
