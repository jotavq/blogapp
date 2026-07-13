// proteção no caso de mutiplas tentativas de login

import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res, next) => {
    req.flash(
      "error_msg",
      "Muitas tentativas de login. Tente novamente em 15 minutos.",
    );
    res.redirect("/usuario/login");
  },
});
