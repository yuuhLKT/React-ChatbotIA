import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { requestToGroqAI } from './api/groq/groq-api'
import { ClearMessagesButton } from './components/clear-all'
import { ModeToggle } from './components/mode-toggle'
import { ThemeProvider } from './components/theme-provider'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { Button } from './components/ui/button'
import { Skeleton } from './components/ui/skeleton'

type FormData = {
  message: string
}

type Message = {
  text: string
  isBot: boolean
}

function App() {
  const { register, handleSubmit, watch, setValue } = useForm<FormData>()
  const [messages, setMessages] = useState<Message[]>([])
  const [isSending, setIsSending] = useState<boolean>(false)
  const messageValue = watch('message', '')

  const handleClearMessages = () => {
    setMessages([])
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.message.trim()) return
    setIsSending(true)
    const userMessage = { text: data.message, isBot: false }
    setMessages((prevMessages) => [...prevMessages, userMessage])

    try {
      const response = await requestToGroqAI(data.message)
      if (response) {
        const botMessage = { text: response, isBot: true }
        setMessages((prevMessages) => [...prevMessages, botMessage])
      } else {
        console.log('Received null response from Groq AI')
      }
    } catch (error) {
      console.error('Error sending message to Groq AI:', error)
    } finally {
      setIsSending(false)
      setValue('message', '', { shouldValidate: false })
    }
  }

  useEffect(() => {
    const messageBox = document.getElementById('message-box')
    if (messageBox) {
      messageBox.scrollTo({
        top: messageBox.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <ThemeProvider>
        <div className="flex flex-col justify-center items-center h-full w-full space-y-4">
          <div className="w-full max-w-2xl px-4 flex justify-between">
            <ModeToggle />
            <ClearMessagesButton onClear={handleClearMessages} />
          </div>
          <div
            id="message-box"
            className="w-full max-w-2xl px-4 py-6 bg-zinc-100 shadow rounded-lg overflow-hidden flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-center ${message.isBot ? 'space-x-2 p-3 justify-start mr-2' : 'space-x-reverse space-x-2 p-3 justify-end mr-2'}`}
              >
                {message.isBot ? (
                  <>
                    <Avatar>
                      <AvatarImage src="data:image/jpeg;base64,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" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="p-3 bg-white rounded-lg shadow text-black flex justify-between items-center">
                      {message.text}
                    </div>
                    <button
                      onClick={() =>
                        setMessages((prevMessages) =>
                          prevMessages.filter(
                            (_, msgIndex) => msgIndex !== index
                          )
                        )
                      }
                    >
                      <Trash2 className="w-3 h-3 text-red-500 mr-2" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setMessages((prevMessages) =>
                          prevMessages.filter(
                            (_, msgIndex) => msgIndex !== index
                          )
                        )
                      }
                    >
                      <Trash2 className="w-3 h-3 text-red-500 mr-2" />
                    </button>
                    <div className="p-3 bg-white rounded-lg shadow text-black flex justify-between items-center">
                      {message.text}
                    </div>
                    <Avatar>
                      <AvatarImage src="data:image/jpeg;base64,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" />
                      <AvatarFallback>USER</AvatarFallback>
                    </Avatar>
                  </>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex items-center space-x-2 p-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="flex-1 h-10 bg-white rounded-lg" />
              </div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center gap-2 w-full sticky bottom-0 bg-white p-5 rounded-lg shadow-md"
            >
              <div className="relative flex-1">
                <textarea
                  placeholder="Input your message"
                  {...register('message', {
                    maxLength: 350
                  })}
                  className="text-sm text-black h-9 max-w-full max-h-full overflow-hidden resize-none word-wrap break-words w-full p-2 pr-5 border border-zinc-300 rounded-md custom-scrollbar sticky top-0 z-10"
                  rows={1}
                  onInput={(e) => {
                    e.currentTarget.style.height = 'auto'
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
                    e.currentTarget.style.overflowY =
                      e.currentTarget.scrollHeight > 40 ? 'auto' : 'hidden'
                  }}
                  onKeyPress={handleKeyPress}
                />
                <div
                  className={`absolute -bottom-6 right-5 text-sm pb-2 ${
                    messageValue.length > 350 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {messageValue.length}/350
                </div>
              </div>
              <Button
                type="submit"
                disabled={
                  isSending || !messageValue.trim() || messageValue.length > 350
                }
                className="bg-zinc-800 text-white h-9 mb-1"
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}

export default App
