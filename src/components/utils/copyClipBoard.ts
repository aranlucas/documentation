export default async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  document.body.append(textarea)

  try {
    textarea.select()
    if (!document.execCommand("copy")) {
      throw new Error("Copying to the clipboard was refused.")
    }
  } finally {
    textarea.remove()
  }
}
