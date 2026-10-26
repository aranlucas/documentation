import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import ClipBoard from "../../src/components/ClipBoard"
import copyToClipboard from "../../src/components/utils/copyClipBoard"
import generic from "../../src/data/generic"

const originalExecCommand = Object.getOwnPropertyDescriptor(
  document,
  "execCommand"
)

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  if (originalExecCommand) {
    Object.defineProperty(document, "execCommand", originalExecCommand)
  } else {
    Reflect.deleteProperty(document, "execCommand")
  }
})

test("uses the clipboard API and propagates permission failures", async () => {
  const writeText = vi
    .fn()
    .mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(new Error("Denied"))
  vi.stubGlobal("navigator", { clipboard: { writeText } })

  await expect(copyToClipboard("const value = 1")).resolves.toBeUndefined()
  expect(writeText).toHaveBeenCalledWith("const value = 1")
  await expect(copyToClipboard("second attempt")).rejects.toThrow("Denied")
  expect(document.querySelector("textarea")).toBeNull()
})

test.each(["success", "refused", "throws"])(
  "fallback cleans up after %s",
  async (outcome) => {
    vi.stubGlobal("navigator", { clipboard: undefined })
    const execCommand = vi.fn(() => {
      const textarea = document.querySelector("textarea")
      expect(textarea?.value).toBe("copied text")
      expect(textarea?.selectionStart).toBe(0)
      expect(textarea?.selectionEnd).toBe(11)
      if (outcome === "throws") {
        throw new Error("Unavailable")
      }
      return outcome === "success"
    })
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    })

    const result = copyToClipboard("copied text")
    if (outcome === "success") {
      await expect(result).resolves.toBeUndefined()
    } else {
      await expect(result).rejects.toThrow()
    }
    expect(execCommand).toHaveBeenCalledWith("copy")
    expect(document.querySelector("textarea")).toBeNull()
  }
)

test("copy success waits for the operation and prevents duplicate clicks", async () => {
  let finish!: () => void
  const pending = new Promise<void>((resolve) => {
    finish = resolve
  })
  const onClick = vi.fn(() => pending)
  render(<ClipBoard onClick={onClick} />)
  const button = screen.getByRole("button", { name: generic.copied })
  expect(button.getAttribute("type")).toBe("button")

  fireEvent.click(button)
  expect(button.textContent).toBe(generic.copy)
  expect(button.hasAttribute("disabled")).toBe(true)
  fireEvent.click(button)
  expect(onClick).toHaveBeenCalledTimes(1)
  await act(async () => {
    finish()
    await pending
  })
  expect(button.textContent).toBe(generic.codeCopied)
  expect(button.hasAttribute("disabled")).toBe(false)
})

test("copy failures are visible and can be retried", async () => {
  const onClick = vi
    .fn()
    .mockRejectedValueOnce(new Error("Denied"))
    .mockResolvedValueOnce(undefined)
  render(<ClipBoard onClick={onClick} />)
  fireEvent.click(screen.getByRole("button", { name: generic.copied }))
  const failed = await screen.findByRole("button", {
    name: "Copy failed. Try again.",
  })
  expect(failed.textContent).toBe("Copy failed")
  expect(failed.hasAttribute("disabled")).toBe(false)

  fireEvent.click(failed)
  await waitFor(() => expect(failed.textContent).toBe(generic.codeCopied))
  expect(onClick).toHaveBeenCalledTimes(2)
})
