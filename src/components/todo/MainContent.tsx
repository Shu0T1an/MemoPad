import "./MainContent.css";

interface MainContentProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function MainContent({ title, actions, children }: MainContentProps) {
  return (
    <main className="main">
      <header className="main-header">
        <h1>{title}</h1>
        {actions && <div className="header-actions">{actions}</div>}
      </header>
      <div className="main-content">{children}</div>
    </main>
  );
}
