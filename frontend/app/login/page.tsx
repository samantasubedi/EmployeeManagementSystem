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
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type loginFormType = z.infer<typeof loginSchema>;

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const postApi = async (data: loginFormType) => {
    const response = await axios.post(`${backendUrl}/auth/login`, data, {
      withCredentials: true,
    });
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      toast.success(data.message);
      console.log(data);
      const role = data.details.userData.role;
      if (!role) {
        router.push("/getstarted");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "manager") {
        router.push("/manager/dashboard");
      } else if (role === "employee") {
        router.push("/employee/dashboard");
      }
    },
    onError: (error: any) => {
      if (isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response?.data);
        } else {
          toast.error(error.message);
        }
      }
    },
  });

  const onSubmit = (data: loginFormType) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-bold text-center">Sign in</CardTitle>
          <CardDescription>
            Enter your username and password to continue.
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
              Sign in
            </Button>
          </form>

          <div className="mt-3">
            dont have an account ?{" "}
            <button
              className="text-blue-900 cursor-pointer font-semibold"
              onClick={() => {
                router.push("/register");
              }}
            >
              register
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
