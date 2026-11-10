type ButtonProps = {
  text: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function Button({ text = 'Click on me', onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-fit rounded-4xl bg-simple-purple px-4 py-2 text-white text-2xl"
    >
      {text}
    </button>
  )
}
