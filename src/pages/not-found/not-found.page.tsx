import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Stack gap="md" align="center" mt="xl">
        <Title>404</Title>
        <Text c="dimmed">The page you were looking for does not exist.</Text>
        <Button onClick={() => navigate("/")}>Go home</Button>
      </Stack>
    </Container>
  );
}
