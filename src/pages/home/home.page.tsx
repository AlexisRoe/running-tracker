import { BUILD_INFO } from "@app/build-info/build-info.const";
import { Container, Stack, Text, Title } from "@mantine/core";

export function HomePage() {
  return (
    <Container>
      <Stack gap="md">
        <Title>Welcome to Running Tracker</Title>
        <Text c="dimmed">Track your runs and reach your goals.</Text>
        <Text size="xs" c="dimmed">
          {BUILD_INFO.appName} v{BUILD_INFO.version} — built{" "}
          {new Date(BUILD_INFO.builtAt).toLocaleString()}
        </Text>
      </Stack>
    </Container>
  );
}
