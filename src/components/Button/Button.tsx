type ButtonProps = {
  text: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function Button({ text = 'Click on me', onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-4 text-sm font-medium text-page transition-opacity hover:opacity-85 active:opacity-75"
    >
      {text}
    </button>
  )
}
