import { eq } from "drizzle-orm";
import { db } from "../../../database/client";
import { users } from "../../../database/schema";

export const authRepository = {
  handleRegister: (payload: {
    email: string;
    username: string;
    hashedPassword: string;
  }) => {
    return db
      .insert(users)
      .values(payload)
      .returning()
      .then((rows) => {
        return rows[0];
      });
  },
  findUserByEmail:(email:string)=>{
return db.query.users.findFirst({where:eq(users.email,email)})
  }
  ,
  findUserByUsername:(username:string)=>{
  return db.query.users.findFirst({where:eq(users.username,username)})
}
};
