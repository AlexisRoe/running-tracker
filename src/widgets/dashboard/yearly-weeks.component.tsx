import type { WeekCell } from "@features/dashboard/dashboard.model";
import { Flip, useFlipContext } from "@gfazioli/mantine-flip";
import { ActionIcon, Box, Group, Paper, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { formatDistance } from "@shared/lib/distance.utils";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { MouseEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface YearlyWeeksProps {
  year: number;
  weeks: WeekCell[];
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevYear: () => void;
  onNextYear: () => void;
}

// Level 0 (no runs) recedes to a neutral border tone; 1-5 climb the brand ramp.
const LEVEL_COLORS: Record<WeekCell["level"], string> = {
  0: "var(--mantine-color-default-border)",
  1: "var(--mantine-color-brand-2)",
  2: "var(--mantine-color-brand-4)",
  3: "var(--mantine-color-brand-6)",
  4: "var(--mantine-color-brand-7)",
  5: "var(--mantine-color-brand-9)",
};

// Applied to cells outside the active goal's date range so they read as "dimmed".
const OUT_OF_PERIOD_FILTER = "brightness(0.55)";

const CELL = 20;

// The heatmap wraps into a different number of rows depending on viewport
// width, so its natural height isn't constant like a stat tile's. Flip still
// needs a single fixed pixel height, so both faces measure their own natural
// height (see FlipFace) and the taller one drives it, rather than guessing a
// constant that would only fit one width.
const MIN_CARD_HEIGHT = 220;

function Cell({ color, ariaLabel }: { color: string; ariaLabel?: string }) {
  return (
    <Box
      aria-label={ariaLabel}
      w={CELL}
      h={CELL}
      style={{ backgroundColor: color, borderRadius: 3, flex: "none" }}
    />
  );
}

/** Swatch-by-swatch breakdown of the heatmap legend, shown on the card's back face. */
function LegendExplanation() {
  const { t } = useTranslation();

  return (
    <Stack gap={6}>
      <Text size="xs" fw={600}>
        {t("dashboard.weeks.legendTitle")}
      </Text>
      <Stack gap={4}>
        {([0, 1, 2, 3, 4, 5] as const).map((level) => (
          <Group key={level} gap={8} wrap="nowrap">
            <Box
              w={12}
              h={12}
              style={{ backgroundColor: LEVEL_COLORS[level], borderRadius: 3, flex: "none" }}
            />
            <Text size="xs">
              {t("dashboard.weeks.legendRow", { count: level === 5 ? "5+" : level })}
            </Text>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
}

interface FlipFaceProps {
  ariaLabel: string;
  measureRef: (node: HTMLDivElement | null) => void;
  children: ReactNode;
}

// Doesn't use Flip.Target/a <button>: the front face nests real buttons (year
// nav) that must stay independently clickable, and a <button> can't legally
// contain another <button>. A div with the standard custom-button a11y
// pattern (role, tabIndex, onKeyDown) sidesteps that while still giving
// click-to-flip on the card itself.
//
// The padding lives on the measured inner Box (not the Paper) so its natural,
// unconstrained height already includes the padding Flip's fixed height needs
// to account for — the Paper itself just supplies the h="100%" background/
// radius/shadow to fill whatever height that measurement produces.
function FlipFace({ ariaLabel, measureRef, children }: FlipFaceProps) {
  const { toggleFlip } = useFlipContext();

  return (
    <Paper
      radius="lg"
      h="100%"
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={toggleFlip}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleFlip();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <Box p="md" ref={measureRef}>
        {children}
      </Box>
    </Paper>
  );
}

/** GitHub-style heatmap of weekly running volume across a given year. */
export function YearlyWeeks({
  year,
  weeks,
  canGoPrev,
  canGoNext,
  onPrevYear,
  onNextYear,
}: YearlyWeeksProps) {
  const { t } = useTranslation();
  const front = useElementSize<HTMLDivElement>();
  const back = useElementSize<HTMLDivElement>();
  const height = Math.max(front.height, back.height, MIN_CARD_HEIGHT);

  const stopPropagation =
    (handler: () => void) =>
    (event: MouseEvent): void => {
      event.stopPropagation();
      handler();
    };

  const frontContent = (
    <>
      <Group justify="space-between" mb="sm">
        <Text fw={600}>{t("dashboard.weeks.title", { year })}</Text>
        <Group gap={4}>
          {canGoPrev && (
            <ActionIcon
              variant="subtle"
              aria-label={t("dashboard.weeks.prevYear")}
              onClick={stopPropagation(onPrevYear)}
            >
              <IconChevronLeft size={18} />
            </ActionIcon>
          )}
          {canGoNext && (
            <ActionIcon
              variant="subtle"
              aria-label={t("dashboard.weeks.nextYear")}
              onClick={stopPropagation(onNextYear)}
            >
              <IconChevronRight size={18} />
            </ActionIcon>
          )}
        </Group>
      </Group>

      <Box mt="lg" style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {weeks.map((week) => (
          <Tooltip
            key={week.weekStart}
            label={t("dashboard.weeks.tooltip", {
              week: week.weekNumber,
              count: week.runCount,
              km: formatDistance(week.distance),
            })}
            withArrow
          >
            <Box
              aria-label={t("dashboard.weeks.tooltip", {
                week: week.weekNumber,
                count: week.runCount,
                km: formatDistance(week.distance),
              })}
              w={CELL}
              h={CELL}
              style={{
                backgroundColor: LEVEL_COLORS[week.level],
                borderRadius: 3,
                flex: "none",
                filter: week.inGoalPeriod ? undefined : OUT_OF_PERIOD_FILTER,
              }}
            />
          </Tooltip>
        ))}
      </Box>

      <Group gap={4} mt="lg" justify="flex-end">
        <Text size="xs" c="dimmed">
          {t("dashboard.weeks.less")}
        </Text>
        {([0, 1, 2, 3, 4, 5] as const).map((level) => (
          <Cell key={level} color={LEVEL_COLORS[level]} />
        ))}
        <Text size="xs" c="dimmed">
          {t("dashboard.weeks.more")}
        </Text>
      </Group>
    </>
  );

  const backContent = (
    <SimpleGrid cols={2} spacing="xl">
      <Text size="xs">{t("dashboard.weeks.help")}</Text>
      <LegendExplanation />
    </SimpleGrid>
  );

  return (
    <Flip h={height}>
      <Flip.Front>
        <FlipFace ariaLabel={t("dashboard.weeks.flipToDetails")} measureRef={front.ref}>
          {frontContent}
        </FlipFace>
      </Flip.Front>
      <Flip.Back>
        <FlipFace ariaLabel={t("dashboard.weeks.flipToSummary")} measureRef={back.ref}>
          {backContent}
        </FlipFace>
      </Flip.Back>
    </Flip>
  );
}
