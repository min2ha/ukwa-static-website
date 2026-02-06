import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content, theme }) {
  const proseClass = theme === 'dark' ? 'prose-dark' : 'prose-light';

  return (
    <div className={`${proseClass} max-w-none`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
