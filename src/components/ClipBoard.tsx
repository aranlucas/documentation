import { useEffect, useState } from "react"
import generic from "../data/generic"

const ClipBoard = ({
  className,
  onClick,
}: {
  onClick: () => Promise<void>
  className?: string
}) => {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    if (!copiedCode) {
      return
    }

    const timerId = setTimeout(() => {
      setCopiedCode(false)
    }, 3000)

    return () => {
      clearTimeout(timerId)
    }
  }, [copiedCode])

  const copy = async () => {
    setCopying(true)
    setCopiedCode(false)
    setCopyFailed(false)
    try {
      await onClick()
      setCopiedCode(true)
    } catch {
      setCopyFailed(true)
    } finally {
      setCopying(false)
    }
  }

  return (
    <button
      className={className}
      type="button"
      disabled={copying}
      onClick={() => {
        void copy()
      }}
      aria-label={copyFailed ? "Copy failed. Try again." : generic.copied}
      aria-live="polite"
    >
      {copyFailed
        ? "Copy failed"
        : copiedCode
          ? generic.codeCopied
          : generic.copy}
    </button>
  )
}

export default ClipBoard
