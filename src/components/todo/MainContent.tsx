import "./MainContent.css";

interface MainContentProps {
  title?: string;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function MainContent({ title, header, actions, children }: MainContentProps) {
  return (
    <main className="main">
      {header || (
        <header className="main-header">
          {title && <h1>{title}</h1>}
          {actions && <div className="header-actions">{actions}</div>}
        </header>
      )}
      <div className="main-content">{children}</div>
    </main>
  );
}
