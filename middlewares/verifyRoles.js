const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if(!req.user?.roles || !Array.isArray(req.user.roles)){
      return res.status(403).json({ message : "Access denied: roles missing"});
    } 

    const userRoles = req.user.roles;

    const hasPermission = userRoles.some(role => allowedRoles.includes(role));
    if(!hasPermission) return res.status(403).json({ message: "You’re not allowed to access this" });

    next();
  }
}

module.exports =  verifyRoles;