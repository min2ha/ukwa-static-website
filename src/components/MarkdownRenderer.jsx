import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function extractText(children) {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && children.props) return extractText(children.props.children);
  return '';
}

export default function MarkdownRenderer({ content, theme, afterParagraph, insertNode }) {
  const proseClass = theme === 'dark' ? 'prose-dark' : 'prose-light';

  const components = afterParagraph && insertNode
    ? {
        p({ children }) {
          const text = extractText(children).trim();
          if (text === afterParagraph.trim()) {
            return (
              <>
                <p>{children}</p>
                {insertNode}
              </>
            );
          }
          return <p>{children}</p>;
        },
      }
    : {};

  return (
    <div className={`${proseClass} max-w-none`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
