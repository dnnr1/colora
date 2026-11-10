import Button from '#/components/Button'
import ColorGenerator from '#/components/ColorGenerator'
import type { ColorGeneratorHandle } from '#/components/ColorGenerator/ColorGenerator'
import Header from '#/components/Header'
import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const generatorRef = useRef<ColorGeneratorHandle>(null)
  return (
    <>
      <Header />
      <div className="flex h-screen justify-center mt-20">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl mb-2">Create Color Palettes</h1>
          <Button
            text="Generate"
            onClick={() => generatorRef.current?.generate()}
          />
          <ColorGenerator ref={generatorRef} />
        </div>
      </div>
    </>
  )
}
