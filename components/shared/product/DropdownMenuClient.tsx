'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DropdownMenuClient({
  onSelect,
}: {
  // eslint-disable-next-line no-unused-vars
  onSelect: (type: string) => void
}) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Sort By</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onSelect('latest')}>
            Latest Products
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSelect('expensive')}>
            Expensive Products
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSelect('highlyRated')}>
            Highly Rated Products
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
