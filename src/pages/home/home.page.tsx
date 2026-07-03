import { Container, Stack, Text, Title } from "@mantine/core";
import { BUILD_INFO } from "@shared/build-info/build-info.const";
import { useTranslation } from "react-i18next";

export function HomePage() {
  const { t, i18n } = useTranslation();

  return (
    <Container>
      <Stack gap="md">
        <Title>{t("home.title")}</Title>
        <Text c="dimmed">{t("home.subtitle")}</Text>
        <Text size="xs" c="dimmed">
          {t("home.buildInfo", {
            appName: BUILD_INFO.appName,
            version: BUILD_INFO.version,
            builtAt: new Date(BUILD_INFO.builtAt).toLocaleString(i18n.language),
          })}
        </Text>
      </Stack>
    </Container>
  );
}
