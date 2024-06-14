// Adicione este import no topo do seu arquivo, junto aos outros imports
import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'

// Adicione este componente próximo ao componente ModeToggle no seu JSX
export function ClearMessagesButton({ onClear }: { onClear: () => void }) {
  return (
    <Button variant="outline" size="icon" onClick={onClear}>
      <Trash2 className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Clear messages</span>
    </Button>
  )
}
