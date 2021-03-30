import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { User } from "../Models/User"

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req?.user) {
    return next()
  }
  res.clearCookie("connect.sid")
  const token = req.cookies.token
  if (!token) {
    return res.json({ error: "UnAuthenticated" })
  }
  const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string
  }
  if (!id) {
    return res.json({ error: "Invalid Token" })
  }
  try {
    const user = await User.findById(id)
    if (user) {
      req.user = user
      next()
    }
  } catch (error) {
    return res.json({ error: "Invalid Token" })
  }
}
