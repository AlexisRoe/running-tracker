import { Container, Stack, Text, Title } from "@mantine/core";

export function LogPage() {
  return (
    <Container>
      <Stack gap="md">
        <Title>Run Log</Title>
        <Text c="dimmed">Your tracked running events will appear here.</Text>
      </Stack>
    </Container>
  );
}
