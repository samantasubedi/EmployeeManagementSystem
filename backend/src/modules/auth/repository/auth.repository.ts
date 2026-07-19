import { db } from "../../../database/client"
import { users } from "../../../database/schema"

export const authRepository={
    handleRegister:(payload:{email:string,username:string,hashedPassword:string})=>{
       return db.insert(users).values(payload).returning().then((rows)=>{rows[0]})
    }
}