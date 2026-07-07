import {
  Button,
  Card,
  Container,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/ui/confirm-modal.component";
import { BUILD_INFO } from "@/config/build-info.const";
import { SUPPORTED_LANGUAGES } from "@/config/i18n.config";
import { useLanguage } from "@/hooks/use-language.hook";
import { useResetAppData } from "@/hooks/use-reset-app-data.hook";
import { useTheme } from "@/hooks/use-theme.hook";
import { Theme } from "@/types/settings.model";

/** Settings route: theme and language selection, build info, and app-data reset. */
export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const language = useLanguage();
  const { resetAppData } = useResetAppData();
  const [resetOpened, { open: openReset, close: closeReset }] = useDisclosure(false);

  return (
    <Container pt="md">
      <Stack gap="md">
        <Title>{t("settings.title")}</Title>

        <Card padding="md">
          <Text fw={500} mb="xs">
            {t("settings.theme.title")}
          </Text>
          <SegmentedControl
            fullWidth
            value={theme.value}
            onChange={(value) => theme.change(value)}
            data={[
              { label: t("settings.theme.light"), value: Theme.Light },
              { label: t("settings.theme.dark"), value: Theme.Dark },
              { label: t("settings.theme.system"), value: Theme.System },
            ]}
          />
        </Card>

        <Card padding="md">
          <Text fw={500} mb="xs">
            {t("settings.language.title")}
          </Text>
          <SegmentedControl
            fullWidth
            value={language.value}
            onChange={(value) => value && language.change(value)}
            data={SUPPORTED_LANGUAGES.map((code) => ({
              value: code,
              label: t(`settings.language.${code}`),
            }))}
          />
        </Card>

        <Card padding="md">
          <Text fw={500} mb="xs">
            {t("settings.buildInfo.title")}
          </Text>
          <Stack gap={4}>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {t("settings.buildInfo.version")}
              </Text>
              <Text size="sm">{BUILD_INFO.version}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {t("settings.buildInfo.commitHash")}
              </Text>
              <Text size="sm">{BUILD_INFO.commitHash}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {t("settings.buildInfo.builtAt")}
              </Text>
              <Text size="sm">{new Date(BUILD_INFO.builtAt).toLocaleString(i18n.language)}</Text>
            </Group>
          </Stack>
        </Card>

        <Card padding="md">
          <Text fw={500} c="red" mb="xs">
            {t("settings.resetData.title")}
          </Text>
          <Text size="sm" c="dimmed" mb="sm">
            {t("settings.resetData.description")}
          </Text>
          <Button color="red" variant="light" onClick={openReset}>
            {t("settings.resetData.button")}
          </Button>
        </Card>
      </Stack>

      <ConfirmModal
        opened={resetOpened}
        onClose={closeReset}
        onConfirm={resetAppData}
        title={t("settings.resetData.confirmTitle")}
        message={t("settings.resetData.confirmMessage")}
        confirmLabel={t("settings.resetData.confirmButton")}
        cancelLabel={t("settings.resetData.cancelButton")}
      />
    </Container>
  );
}
