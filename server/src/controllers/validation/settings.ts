'use strict';

import { yup, validateYupSchema } from "@strapi/utils";

// helper for yup transform function
function emptyStringToNull(value, originalValue) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return null;
  }
  return value;
}

const settingsSchema = yup.object({
  quality: yup.number().required().min(1).max(100),
  progressive: yup.boolean().required(),
  formats: yup.array().of(yup.object().shape({
    name: yup.string().matches(/^[a-zA-Z0-9_-]+$/gi).required(),
    x2: yup.boolean(),
    convertToFormat: yup.string().transform(emptyStringToNull).nullable(),
    width: yup.number().required().min(1),
    height: yup.number().min(1).transform(emptyStringToNull).nullable(),
    fit: yup.string(),
    position: yup.string(),
    withoutEnlargement: yup.boolean(),
  })),
});

export default validateYupSchema(settingsSchema);