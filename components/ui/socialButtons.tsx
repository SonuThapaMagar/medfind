import { Button, ButtonProps, Group } from "@mantine/core";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import classes from "./SocialButtons.module.css";

export function GoogleButton(
  props: ButtonProps & React.ComponentPropsWithoutRef<"button">,
) {
  return <Button leftSection={<GoogleIcon />} variant="default" {...props} />;
}

export function SocialButtons() {
  return (
    <Group justify="center" p="md">
      <GoogleButton>Continue with Google</GoogleButton>
    </Group>
  );
}
