function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidAge(value) {
  return Number.isInteger(value) && value >= 0;
}

function validateCreate(body) {
  const errors = {};

  if (!body || !isNonEmptyString(body.name)) {
    errors.name = "name is required";
  }
  if (body && body.age !== undefined && !isValidAge(body.age)) {
    errors.age = "age must be a non-negative integer";
  }
  if (body && body.address !== undefined && typeof body.address !== "string") {
    errors.address = "address must be a string";
  }
  if (body && body.work !== undefined && typeof body.work !== "string") {
    errors.work = "work must be a string";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function validatePatch(body) {
  const errors = {};

  if (!body) {
    return errors;
  }
  if (body.name !== undefined && !isNonEmptyString(body.name)) {
    errors.name = "name must be a non-empty string";
  }
  if (body.age !== undefined && !isValidAge(body.age)) {
    errors.age = "age must be a non-negative integer";
  }
  if (body.address !== undefined && typeof body.address !== "string") {
    errors.address = "address must be a string";
  }
  if (body.work !== undefined && typeof body.work !== "string") {
    errors.work = "work must be a string";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

module.exports = { validateCreate, validatePatch };
