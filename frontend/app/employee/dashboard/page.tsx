"use client";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const router=useRouter()
  useEffect(() => {
   const getuser= async () => {
      const userinfo = await getCurrentUser();
      console.log("this is userinfo",userinfo)
      if(!userinfo?.organizationId){
router.push("/")
      }
    };
    getuser()
  }, []);
  return <div>employee </div>;
};
export default page;
