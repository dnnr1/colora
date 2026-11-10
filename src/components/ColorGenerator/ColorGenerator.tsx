import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'

type ColorGeneratorHandle = {
  generate: () => void
}

const ColorGenerator = forwardRef<ColorGeneratorHandle>((_, ref) => {
  const [colors, setColors] = useState<string[]>([])

  function generate() {
    const palette = Array.from({ length: 5 }, () => {
      return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`
    })

    setColors(palette)
  }

  useEffect(() => {
    generate()
  }, [])

  useImperativeHandle(ref, () => ({
    generate,
  }))

  return (
    <div className="flex h-50 w-125 overflow-hidden rounded-3xl">
      {colors.map((color, index) => (
        <div
          key={`${color}-${index}`}
          className="flex-1"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
})

export default ColorGenerator
export type { ColorGeneratorHandle }
