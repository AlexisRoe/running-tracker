import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";
import { SetGoalCta } from "./set-goal-cta.component";

describe("SetGoalCta", () => {
  it("invokes onSetGoal when the button is clicked", async () => {
    const user = userEvent.setup();
    const onSetGoal = vi.fn();
    renderWithProviders(<SetGoalCta onSetGoal={onSetGoal} />);

    await user.click(screen.getByRole("button", { name: "Set a goal" }));

    expect(onSetGoal).toHaveBeenCalledOnce();
  });
});
