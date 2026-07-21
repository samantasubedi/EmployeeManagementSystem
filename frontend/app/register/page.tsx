"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});


type registerFormType = z.infer<typeof registerSchema>;

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerFormType>({
    resolver: zodResolver(registerSchema),
  });

  const postApi = async (formdata: registerFormType) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const response = await axios.post(`${backendUrl}/auth/register`, formdata, {
      withCredentials: true,
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      toast.success(data.message);
      console.log(data);
      router.push("/getstarted");
    },
    onError: (error: any) => {
      if (isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response?.data);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("something went wrong");
      }
    },
  });

  const onSubmit = (data: registerFormType) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your details below to register.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-900 hover:bg-blue-800"
            >
              Register
            </Button>
          </form>
          <div className="mt-3">
            already have an account ?{" "}
            <button
              className="text-blue-900 cursor-pointer font-semibold"
              onClick={() => {
                router.push("/login");
              }}
            >
              Log in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
