module.exports = (req, res, next) => {
  const user = req.headers['x-user'] || 'netrunnerX';
  const role = req.headers['x-role'] || 'admin';
  req.user = { user, role };
  next();
};
