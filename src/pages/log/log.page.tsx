import { Container, Stack, Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

export function LogPage() {
  const { t } = useTranslation();

  return (
    <Container>
      <Stack gap="md">
        <Title>{t("log.title")}</Title>
        <Text c="dimmed">{t("log.empty")}</Text>
      </Stack>
    </Container>
  );
}
