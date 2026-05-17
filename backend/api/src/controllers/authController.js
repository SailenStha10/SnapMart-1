export const register = (req, res) => {
  res.status(201).json({ message: 'Registration successful' })
}

export const login = (req, res) => {
  res.json({ message: 'Login successful' })
}
