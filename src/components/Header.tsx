import type { JSX } from "react";

import LexicalLogo from "./LexicalLogo";
import ThemeToggle from "./ThemeToggle";

export default function Header(): JSX.Element {
  return (
    <header className="app-header">
      <div className="app-header-brand">
        <LexicalLogo />
        <div className="app-header-text">
          <h1>Lexical Example</h1>
          <p>Note: this is an experimental build of Lexical</p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
