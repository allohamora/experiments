module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'fc7835c12c22cb59ebc03d8e01549ac9'),
  },
});
