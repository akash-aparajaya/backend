export const allowRoles = (roles) => {   
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" }); 
    }
  }
};