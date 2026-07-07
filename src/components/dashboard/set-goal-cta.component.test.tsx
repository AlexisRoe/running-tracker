import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SetGoalCta } from "@/components/dashboard/set-goal-cta.component";
import { renderWithProviders } from "@/test/render-with-providers";

describe("SetGoalCta", () => {
  it("invokes onSetGoal when the button is clicked", async () => {
    const user = userEvent.setup();
    const onSetGoal = vi.fn();
    renderWithProviders(<SetGoalCta onSetGoal={onSetGoal} />);

    await user.click(screen.getByRole("button", { name: "Set a goal" }));

    expect(onSetGoal).toHaveBeenCalledOnce();
  });
});
