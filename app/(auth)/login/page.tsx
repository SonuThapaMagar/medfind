"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import classes from "@/components/modules/AuthenticationImage.module.css";
import { useForm } from "@mantine/form";
import { LoginInput, loginSchema } from "@/lib/validations/auth";

// This component uses useState and browser events (form submit).
// These only exist in the browser, not on the server.
// "use client" tells Next.js: run this in the browser, not the server.

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<LoginInput>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (val) => {
        const result = loginSchema.shape.email.safeParse(val);
        return result.success ? null : result.error.issues[0].message;
      },
      password: (val) => {
        const result = loginSchema.shape.password.safeParse(val);
        return result.success ? null : result.error.issues[0].message;
      },
    },
  });
  async function handleSubmit(values: LoginInput) {
    form.clearErrors();
    setError("");
    // Client-side Zod validation before hitting the server
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        form.setFieldError(issue.path[0] as keyof LoginInput, issue.message);
      });
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    if (result?.ok) {
      const session = await getSession();
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else if (session?.user?.role === "PHARMACY_OWNER") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    }
  }
  return (
    <>
      <div className={classes.wrapper}>
        <Paper className={classes.form}>
          <img
            src="/logo.png"
            alt="MedFind"
            className="mx-auto mb-4 h-12 w-auto"
          />

          <Title order={2} className={classes.title}>
            Welcome back to MedFind!
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
              radius="md"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              radius="md"
              {...form.getInputProps("password")}
            />

            <Checkbox label="Keep me logged in" mt="xl" size="md" />
            <Button
              fullWidth
              mt="xl"
              size="md"
              radius="md"
              type="submit"
              loading={form.submitting}
              loaderProps={{ type: "dots" }}
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Login
            </Button>
          </form>

          <Text ta="center" mt="md" size="sm" c="dimmed">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{ color: "var(--color-secondary)", fontWeight: 500 }}
            >
              Create one
            </Link>
          </Text>
        </Paper>
      </div>
    </>
  );
}
