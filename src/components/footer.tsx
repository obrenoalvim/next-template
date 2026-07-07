export function Footer() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex h-14 max-w-5xl items-center justify-between px-4 text-sm">
        <span>© {new Date().getFullYear()} next-template</span>
        <a
          href="https://github.com/obrenoalvim/next-template"
          className="hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
