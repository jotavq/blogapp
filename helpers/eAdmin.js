export const estaAutenticado = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Você precisa estar logado para acessar essa página.");
  res.redirect("/usuario/login");
};

export const estaAutenticadoAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  }
  req.flash("error_msg", "Você não tem permissão para acessar essa página.");
  res.redirect("/");
};
