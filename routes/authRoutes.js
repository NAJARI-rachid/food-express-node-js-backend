import express from 'express'
import User from '../models/user.js'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'

const router = express.Router()

// REGISTER
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body

    try {
        const iv = randomBytes(16)
        const cipher = createCipheriv('aes-256-cbc', Buffer.from(process.env.PASS_SEC), iv)
        let encryptedPassword = cipher.update(password, 'utf8', 'hex')
        encryptedPassword += cipher.final('hex')

        const newUser = new User({
            username,
            email,
            password: encryptedPassword,
            iv: iv.toString('hex'),
        })

        const savedUser = await newUser.save()
        const { password: _, iv: __, ...userWithoutSensitiveData } = savedUser._doc
        res.status(201).json(userWithoutSensitiveData)
    } catch (err) {
        console.error(err)
        res.status(500).json({ response: 'Internal server error: ' + err.message })
    }
})

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(401).json({ response: 'Wrong username' })
        }

        const decipher = createDecipheriv(
            'aes-256-cbc',
            Buffer.from(process.env.PASS_SEC),
            Buffer.from(user.iv, 'hex')
        )

        let decryptedPassword = decipher.update(user.password, 'hex', 'utf8')
        decryptedPassword += decipher.final('utf8')

        if (decryptedPassword !== password) {
            return res.status(401).json({ response: 'Wrong password' })
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '3d' }
        )

        const { password: _, iv: __, ...others } = user._doc
        res.status(200).json({ ...others, accessToken })
    } catch (err) {
        console.error(err)
        res.status(500).json({ response: 'Internal server error' })
    }
})

export default router
