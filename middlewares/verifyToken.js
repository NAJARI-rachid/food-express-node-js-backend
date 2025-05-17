import jwt from 'jsonwebtoken'

// Middleware pour vérifier que le token est présent et valide
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1] // Format attendu : "Bearer <token>"

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json('Token is not valid!')

      req.user = user // On stocke les infos décodées du token dans req.user
      next()
    })
  } else {
    return res.status(401).json('You are not authenticated!')
  }
}

// Middleware pour vérifier que l'utilisateur est connecté ET autorisé (soit admin, soit propriétaire de la ressource)
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin || req.params.id === req.user.id) {
      next()
    } else {
      res.status(403).json('You are not allowed to do that!')
    }
  })
}

// Middleware pour vérifier que l'utilisateur est admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      res.status(403).json('You are not allowed to do that!')
    }
  })
}

export {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
}
