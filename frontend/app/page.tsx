"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-end px-4 py-2">
        <Button
          className="font-bold bg-green-700 hover:bg-green-600 cursor-pointer"
          onClick={() => {
            router.push("/login");
          }}
        >
          Sign in
        </Button>
      </div>
      <div className="text-6xl flex justify-center">Landing page</div>
    </div>
  );
};
export default page;
