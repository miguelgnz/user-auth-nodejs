import DBLocal from 'db-local'

const { Schema } = DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static create ({ username, password }) {
    // Username validations (Zod can be used)
    if (typeof username !== 'string') {
      throw new Error('Username must be a string')
    }
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters')
    }

    if (typeof password !== 'string') {
      throw new Error('Password must be a string')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Make sure username does not exist
    const user = User.findOne({ username })
    if (user) {
      throw new Error('Username already exists')
    }

    // Create user
    const id = crypto.randomUUID()

    User.create({
      _id: id,
      username,
      password
    }).save()

    return id
  }
}
