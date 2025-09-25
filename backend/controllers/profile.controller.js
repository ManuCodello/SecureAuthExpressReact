// Esta función solo se ejecutará si el middleware de autenticación tuvo éxito.
exports.getMyProfile = async (req, res) => {
  // Gracias al middleware, ahora tenemos acceso a 'req.user'
  // que contiene los datos del usuario extraídos del token.
  res.status(200).json({
    message: 'Perfil obtenido exitosamente.',
    user: req.user 
  });
};