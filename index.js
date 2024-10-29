import express from 'express'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

app.set('view engine', 'ejs')

app.use(express.json())

app.use(cookieParser())

// Middleware to check if the user is authenticated
app.use((req, res, next) => {
  const token = req.cookies.access_token

  req.session = { user: null }

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
  } catch (error) {
    // req.session.user = null
  }

  next()
})

app.get('/', (req, res) => {
  const user = req.session.user
  res.render('index', user)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })

    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      {
        expiresIn: '1h'
      }
    )

    // What's the best practice to store the token? (localStorage is not recommended, Cookies are better)
    res
      .cookie('access_token', token, {
        httpOnly: true, // Cookie can only be read on the server
        secure: true, // Cookie can only be read on HTTPS
        sameSite: 'strict', // Cookie can only be read on the same domain
        maxAge: 1000 * 60 * 60 // 1 hour
      })
      .send({ user })
  } catch (error) {
    res.status(401).send(error.message)
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    // Normally is not a good practice to send the error msg fron the repository
    res.status(400).send({ error: error.message })
  }
})

app.post('/logout', (req, res) => {
  // A redirection is recommended here
  res.clearCookie('access_token').send('Logged out')
})

app.post('/protected', (req, res) => {
  const user = req.session.user

  if (!user) {
    return res.status(403).send('Unauthorized')
  }

  res.render('protected', user)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
