import { clerkClient } from "@clerk/express"

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth()
        
        const user = await clerkClient.users.getUser(userId)
        console.log(user.privateMetadata)
        if (user.privateMetadata.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'usuário não autorizado' })
        }
        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: "Ocorreu um erro, tente novamente mais tarde" })
    }
}