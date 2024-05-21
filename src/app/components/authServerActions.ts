

import { users } from "../../models/User"
import { generateToken } from '@/utils/generateToken'
import { v4 as uuidv4 } from 'uuid'

export const handleSignIn = async (email: string, password: string) => {

  try {
    if (await users.findOne({ email, password })) {
      const user = { email, password }
      const token = await generateToken(user)
      return { message: "success", token }
    }
    else {
      return { message: "error: user does not exists" }
    }
  }
  catch (err) {

    return { message: "error", error: "internal server error" }

  }
}

export const handleSignUp = async (email: string, password: string) => {

  try {
    if (await users.findOne({ email, password })) {
      throw new Error("user already exists")
    }
    else {
      const userId = `${uuidv4()}-userId`
      const newUser = new users({ userId, email, password })
      await newUser.save()
      const user = { email, password }
      const token = await generateToken(user)
      return { message: "succes", token }
    }
  }
  catch (err) {

    return { message: "error", error: "User already exists" }

  }
}