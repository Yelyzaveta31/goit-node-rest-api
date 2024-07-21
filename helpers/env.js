import "dotenv/config";

const env = (name, dafaultValue) => {
  const value = process.env[name];

  if (value) return value;
  if (dafaultValue) return dafaultValue;

  throw new Error(`Missing provess.env[${name}]`);
};
export default env;