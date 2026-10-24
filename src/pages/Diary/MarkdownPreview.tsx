import type { ReactNode } from 'react';
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2,-2)}</strong> : part);
}
export default function MarkdownPreview({ body }: { body: string }) {
  const lines = body.split('\n'); const nodes: ReactNode[] = []; let list: string[] = [];
  const flush = () => { if (list.length) { nodes.push(<ul key={`list-${nodes.length}`}>{list.map((line,index)=><li key={index}>{inline(line)}</li>)}</ul>); list = []; } };
  lines.forEach((line,index) => {
    if (line.startsWith('- ')) { list.push(line.slice(2)); return; } flush();
    if (line.startsWith('## ')) nodes.push(<h2 key={index}>{inline(line.slice(3))}</h2>);
    else if (line.startsWith('> ')) nodes.push(<blockquote key={index}>{inline(line.slice(2))}</blockquote>);
    else nodes.push(<p key={index}>{line ? inline(line) : <br/>}</p>);
  }); flush();
  return <div className="diary-markdown">{nodes}</div>;
}
