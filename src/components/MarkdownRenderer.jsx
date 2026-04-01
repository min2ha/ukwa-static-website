import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function LinkRenderer({ href = '', children, ...props }) {
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: LinkRenderer }}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
