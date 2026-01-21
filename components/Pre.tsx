'use client'

import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

export default function Pre({ children }: { children: ReactNode }) {
  const textInput = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const onEnter = () => {
    setHovered(true)
  }

  const onExit = () => {
    setHovered(false)
    setCopied(false)
  }

  const onCopy = () => {
    if (!textInput.current?.textContent) {
      return
    }

    setCopied(true)
    navigator.clipboard.writeText(textInput.current.textContent)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <div ref={textInput} onMouseEnter={onEnter} onMouseLeave={onExit} className="relative">
      <button
        type="button"
        aria-label={collapsed ? 'Expand code block' : 'Collapse code block'}
        aria-expanded={!collapsed}
        onClick={toggleCollapsed}
        className="absolute top-2 right-12 z-10 rounded border border-gray-300 bg-gray-700 px-2 py-1 text-xs text-gray-200 dark:bg-gray-800"
      >
        {collapsed ? 'Expand' : 'Collapse'}
      </button>
      {hovered && (
        <button
          type="button"
          aria-label="Copy code"
          className={`absolute top-2 right-2 z-10 h-8 w-8 rounded border-2 bg-gray-700 p-1 dark:bg-gray-800 ${
            copied
              ? 'border-green-400 focus:border-green-400 focus:outline-none'
              : 'border-gray-300'
          }`}
          onClick={onCopy}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            className={copied ? 'text-green-400' : 'text-gray-300'}
          >
            {copied ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            )}
          </svg>
        </button>
      )}
      <pre className={`overflow-x-auto ${collapsed ? 'max-h-64 overflow-y-hidden' : ''}`}>
        {children}
      </pre>
    </div>
  )
}
