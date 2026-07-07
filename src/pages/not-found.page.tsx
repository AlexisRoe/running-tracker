import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

/** Fallback route for unknown URLs, with a link back to the dashboard. */
export function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container pt="md">
      <Stack gap="md" align="center" mt="xl">
        <Title>{t("notFound.title")}</Title>
        <Text c="dimmed">{t("notFound.message")}</Text>
        <Button onClick={() => navigate("/")}>{t("notFound.goHome")}</Button>
      </Stack>
    </Container>
  );
}
