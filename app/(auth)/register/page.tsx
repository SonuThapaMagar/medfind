"use client";

import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Stepper,
  Stack,
  Text,
  TextInput,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { GoogleButton } from "@/components/ui/socialButtons";
import dynamic from "next/dynamic";
import classes from "@/components/modules/AuthenticationImage.module.css";
import {
  RegisterOwnerInput,
  registerOwnerSchema,
} from "@/lib/validations/auth";
import { STEP_FIELDS } from "@/constants/auth.constants";

const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), {
  ssr: false,
});

export default function RegisterPage() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<RegisterOwnerInput>({
    initialValues: {
      // step 1 — personal
      name: "",
      email: "",
      password: "",
      // step 2 — pharmacy
      pharmacyName: "",
      pharmacyEmail: "",
      pharmacyPhone: "",
      pharmacyAddress: "",
      // step 3
      pharmacyLat: 0,
      pharmacyLng: 0,
      terms: false as unknown as true,
    },
    validate: (values) => {
      const parsed = registerOwnerSchema.safeParse(values);
      if (parsed.success) return {};

      // Convert Zod issues into Mantine's { fieldName: message } format
      return parsed.error.issues.reduce(
        (acc, issue) => {
          const field = issue.path[0] as string;
          if (!acc[field]) acc[field] = issue.message;
          return acc;
        },
        {} as Record<string, string>,
      );
    },
  });

  function nextStep() {
    const fields = STEP_FIELDS[active];
    if (!fields) return;
    const result = form.validate();
    const stepHasErrors = fields.some(
      (field) => result.errors[field as string],
    );
    if (stepHasErrors) return;
    setActive((c) => Math.min(c + 1, 3));
  }

  function prevStep() {
    setActive((c) => Math.max(c - 1, 0));
  }

  async function handleSubmit(values: RegisterOwnerInput) {
    setLoading(true);
    setError("");
    try {
      const parsed = registerOwnerSchema.safeParse(values);
      if (!parsed.success) {
        setError(parsed.error.issues[0].message);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, role: "PHARMACY_OWNER" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={classes.wrapper}>
        <Paper className={classes.form}>
          <img
            src="/logo.png"
            alt="MedFind"
            className="mx-auto mb-4 h-10 w-auto"
          />

          <Text size="lg" fw={600} ta="center" mb="lg">
            Register as Pharmacy Owner
          </Text>

          <Divider
            labelPosition="center"
            mb="lg"
            styles={{
              label: { color: "var(--mantine-color-bright)", opacity: 0.85 },
            }}
          />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stepper active={active} mb="xl">
              {/* Step 1 — Personal info */}
              <Stepper.Step label="Account" description="Personal details">
                <Stack mt="md">
                  <TextInput
                    required
                    label="Full Name"
                    placeholder="Ram Kumar"
                    radius="md"
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    required
                    label="Email"
                    placeholder="ram@pharmacy.com"
                    radius="md"
                    {...form.getInputProps("email")}
                  />
                  <PasswordInput
                    required
                    label="Password"
                    placeholder="Min. 6 characters"
                    radius="md"
                    {...form.getInputProps("password")}
                  />
                </Stack>
              </Stepper.Step>

              {/* Step 2 — Pharmacy info */}
              <Stepper.Step label="Pharmacy" description="Your pharmacy">
                <Stack mt="md">
                  <TextInput
                    required
                    label="Pharmacy Name"
                    placeholder="New Road Pharmacy"
                    radius="md"
                    {...form.getInputProps("pharmacyName")}
                  />
                  <TextInput
                    required
                    label="Pharmacy Email"
                    placeholder="newroad@gmail.com"
                    radius="md"
                    {...form.getInputProps("pharmacyEmail")}
                  />
                  <TextInput
                    required
                    label="Phone"
                    placeholder="01-4221234"
                    radius="md"
                    {...form.getInputProps("pharmacyPhone")}
                  />
                  <LocationPicker
                    lat={form.values.pharmacyLat || null}
                    lng={form.values.pharmacyLng || null}
                    address={form.values.pharmacyAddress}
                    onChange={(lat, lng, address) => {
                      form.setFieldValue("pharmacyLat", lat);
                      form.setFieldValue("pharmacyLng", lng);
                      form.setFieldValue("pharmacyAddress", address);
                    }}
                  />
                  {form.errors.pharmacyAddress && (
                    <Text size="xs" c="red">
                      {form.errors.pharmacyAddress}
                    </Text>
                  )}
                </Stack>
              </Stepper.Step>

              {/* Step 3 — Confirm */}
              <Stepper.Step label="Confirm" description="Review & submit">
                <Stack mt="md">
                  <Text size="sm" c="dimmed">
                    You're registering <strong>{form.values.name}</strong> as
                    owner of <strong>{form.values.pharmacyName}</strong>.
                  </Text>
                  <Checkbox
                    label="I accept the terms and conditions"
                    {...form.getInputProps("terms", { type: "checkbox" })}
                  />
                  {form.errors.terms && (
                    <Text size="xs" c="red">
                      {form.errors.terms}
                    </Text>
                  )}
                </Stack>
              </Stepper.Step>

              <Stepper.Completed>
                <Text ta="center" mt="md" c="dimmed">
                  Creating your account...
                </Text>
              </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl">
              {active > 0 && (
                <Button variant="default" radius="xl" onClick={prevStep}>
                  Back
                </Button>
              )}
              {active < 2 && (
                <Button radius="xl" onClick={nextStep}>
                  Next
                </Button>
              )}
              {active === 2 && (
                <Button type="submit" radius="xl" loading={loading}>
                  Register
                </Button>
              )}
            </Group>

            <Divider
              label="Or continue with Google"
              labelPosition="center"
              my="lg"
              styles={{
                label: { color: "var(--mantine-color-bright)", opacity: 0.85 },
              }}
            />

            <Group grow mb="md">
              <GoogleButton radius="xl">Google</GoogleButton>
            </Group>

            <Group justify="center" mt="sm">
              <Anchor
                component={Link}
                href="/login"
                c="bright"
                opacity={0.85}
                size="xs"
              >
                Already have an account? Login
              </Anchor>
            </Group>
          </form>
        </Paper>
      </div>
    </>
  );
}
