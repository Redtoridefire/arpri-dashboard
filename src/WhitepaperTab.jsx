import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, Download } from 'lucide-react';

const WhitepaperTab = () => {
  const [content, setContent] = useState('');
  const [toc, setToc] = useState([]);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    fetch('/ARPRI-Whitepaper.md')
      .then(res => res.text())
      .then(text => {
        setContent(text);
        // Extract headings for TOC
        const headings = text.match(/^##\s.+$/gm) || [];
        setToc(headings.map(h => ({
          level: 2,
          text: h.replace(/^##\s/, ''),
          id: h.replace(/^##\s/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
        })));
      })
      .catch(err => console.error('Error loading whitepaper:', err));
  }, []);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ARPRI-Whitepaper.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-8">
      {/* TOC Sidebar */}
      <aside className="w-64 shrink-0 sticky top-24 h-fit hidden lg:block">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 text-cyan-400 mr-2" />
            <h3 className="text-white font-semibold">Contents</h3>
          </div>
          <nav className="space-y-2 max-h-[60vh] overflow-y-auto">
            {toc.map((heading, i) => (
              <a
                key={i}
                href={`#${heading.id}`}
                className="block text-sm text-gray-400 hover:text-cyan-400 transition-colors py-1"
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
        <button
          onClick={handleDownload}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/30 transition-all"
        >
          <Download className="w-4 h-4 mr-2" />
          Download .md
        </button>
      </aside>

      {/* Content */}
      <article className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-8 lg:p-10 whitepaper-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({children}) => {
              const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return <h1 id={id} className="text-4xl font-bold text-cyan-400 mb-6 mt-8 first:mt-0">{children}</h1>;
            },
            h2: ({children}) => {
              const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return <h2 id={id} className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-gray-800 pb-2">{children}</h2>;
            },
            h3: ({children}) => {
              const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return <h3 id={id} className="text-xl font-medium text-gray-200 mt-6 mb-3">{children}</h3>;
            },
            p: ({children}) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
            table: ({children}) => (
              <div className="overflow-x-auto my-6">
                <table className="w-full border-collapse">{children}</table>
              </div>
            ),
            thead: ({children}) => <thead className="bg-gray-800/50">{children}</thead>,
            th: ({children}) => <th className="text-cyan-400 p-3 text-left border border-gray-700 font-semibold">{children}</th>,
            td: ({children}) => <td className="border border-gray-800 p-3 text-gray-300">{children}</td>,
            code: ({inline, children}) => inline
              ? <code className="bg-gray-800 px-2 py-1 rounded text-cyan-300 font-mono text-sm">{children}</code>
              : <code className="text-cyan-300">{children}</code>,
            pre: ({children}) => <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-x-auto my-4 font-mono text-sm">{children}</pre>,
            ul: ({children}) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1 ml-4">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1 ml-4">{children}</ol>,
            li: ({children}) => <li className="text-gray-300 leading-relaxed">{children}</li>,
            blockquote: ({children}) => <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-400 my-4 bg-gray-800/30 py-2">{children}</blockquote>,
            hr: () => <hr className="border-gray-800 my-8" />,
            strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
            em: ({children}) => <em className="text-gray-200 italic">{children}</em>,
            a: ({href, children}) => (
              <a
                href={href}
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default WhitepaperTab;
