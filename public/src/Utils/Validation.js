import Joi from "joi-browser";

const userValidation = (data) => {
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  });
  const result = Joi.validate(data, schema, { abortEarly: false });
  return result;
};

export default userValidation;
