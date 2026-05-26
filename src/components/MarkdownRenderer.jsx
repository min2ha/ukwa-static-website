import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function extractText(children) {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && children.props) return extractText(children.props.children);
  return '';
}

function splitAtFirstH1(content) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/^#\s+\S/.test(lines[i])) {
      return {
        before: lines.slice(0, i + 1).join('\n'),
        after: lines.slice(i + 1).join('\n'),
      };
    }
  }
  return null;
}

export default function MarkdownRenderer({ content, theme, afterParagraph, afterFirstHeading, insertNode }) {
  const proseClass = theme === 'dark' ? 'prose-dark' : 'prose-light';

  if (insertNode && afterFirstHeading) {
    const parts = splitAtFirstH1(content);
    if (parts) {
      return (
        <div className={`${proseClass} max-w-none`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{parts.before}</ReactMarkdown>
          {insertNode}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{parts.after}</ReactMarkdown>
        </div>
      );
    }
  }

  const components = {};

  if (insertNode && afterParagraph) {
    components.p = function P({ children }) {
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
    };
  }

  return (
    <div className={`${proseClass} max-w-none`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
