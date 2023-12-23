export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
  },
  secret: process.env.SECRET,
});
