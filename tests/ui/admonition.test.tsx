import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"

import { Admonition } from "../../src/components/Admonition"

test("admonition displays its title and content", () => {
  render(
    <Admonition type="warning" title="Check this">
      Your email address is invalid.
    </Admonition>
  )

  expect(screen.getByText("CHECK THIS")).toBeDefined()
  expect(screen.getByText("Your email address is invalid.")).toBeDefined()
})
