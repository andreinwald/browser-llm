import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export function CodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  return (
    <SyntaxHighlighter
      language={language || 'text'}
      style={vscDarkPlus}
      PreTag="div"
    >
      {code}
    </SyntaxHighlighter>
  )
}
