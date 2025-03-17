export function checkPermission(permission) {
  return (req, res, next) => {
    if (
      req.user &&
      req.user.permissions &&
      req.user.permissions.includes(permission)
    ) {
      return next();
    }
    return res.status(403).json({ msg: "Forbidden: Access denied" });
  };
}

export function checkAdminOrAdministrator(req, res, next) {
  if (!req.user || !["Admin", "Administrator"].includes(req.user.role)) {
    return res.status(403).json({ msg: "Forbidden: Access denied" });
  }
  next();
}
