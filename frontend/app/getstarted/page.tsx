"use client";
import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import axios, { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  description: z.string().min(1, "Description is required"),
});

type OrganizationForm = z.infer<typeof organizationSchema>;

const page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationForm>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });
  const postApi = async (formData: OrganizationForm) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const response = await axios.post(
      `${backendUrl}/organization/create`,
      formData,
      {
        withCredentials: true,
      },
    );

    return response.data;
  };

  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      toast.success(data.message);
      console.log(data);
      router.push("/admin/dashboard");
    },
    onError: (error: any) => {
      if (isAxiosError(error)) {
        toast.error("error")
        if (error.response) {
          toast.error(error.response.data);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const onSubmit = (data: OrganizationForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col min-h-screen items-center  px-4">
      <div className="text-center text-4xl mt-5 mb-3">
        <span className="font-bold">Get Started </span>by creating an
        organization
      </div>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center font-bold ">
            Create Organization
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new organization.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Acme Corporation"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="acme-corporation"
                {...register("slug")}
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs. Only lowercase letters, numbers, and hyphens are
                allowed.
              </p>
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your organization..."
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-900 hover:bg-blue-800"
            >
              Create Organization
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default page;
