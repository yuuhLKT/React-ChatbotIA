import { ReactNode, useState } from 'react'

interface ClipboardCopyProps {
  children: ReactNode
}

const ClipboardCopy = ({ children }: ClipboardCopyProps) => {
  const [buttonText, setButtonText] = useState('Copy')

  const handleCopy = () => {
    navigator.clipboard
      .writeText(String(children).replace(/\n$/, ''))
      .then(() => {
        setButtonText('Copied')
        setTimeout(() => setButtonText('Copy'), 1000)
      })
      .catch((err) => {
        console.error('Error copying text: ', err)
      })
  }

  return (
    <button
      className="absolute top-0 right-0 m-2 text-xs p-1 bg-zinc-200 rounded"
      onClick={handleCopy}
    >
      {buttonText}
    </button>
  )
}

export default ClipboardCopy
