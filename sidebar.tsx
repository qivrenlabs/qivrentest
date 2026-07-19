@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: "Inter";
}

* {
  box-sizing: border-box;
}

html,
body {
  min-height: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  margin: 0;
  font-family: var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

::selection {
  background: rgba(139, 92, 246, 0.25);
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.38) transparent;
}

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 999px;
  background: rgba(100, 116, 139, 0.38);
  background-clip: padding-box;
}

.qivren-markdown > :first-child {
  margin-top: 0;
}

.qivren-markdown > :last-child {
  margin-bottom: 0;
}

.qivren-markdown p,
.qivren-markdown ul,
.qivren-markdown ol,
.qivren-markdown blockquote {
  margin: 0.8rem 0;
}

.qivren-markdown h1,
.qivren-markdown h2,
.qivren-markdown h3,
.qivren-markdown h4 {
  margin: 1.35rem 0 0.65rem;
  color: rgb(15 23 42);
  font-weight: 800;
  line-height: 1.3;
}

.dark .qivren-markdown h1,
.dark .qivren-markdown h2,
.dark .qivren-markdown h3,
.dark .qivren-markdown h4 {
  color: white;
}

.qivren-markdown h1 { font-size: 1.45rem; }
.qivren-markdown h2 { font-size: 1.25rem; }
.qivren-markdown h3 { font-size: 1.08rem; }

.qivren-markdown ul,
.qivren-markdown ol {
  padding-left: 1.35rem;
}

.qivren-markdown ul { list-style: disc; }
.qivren-markdown ol { list-style: decimal; }
.qivren-markdown li { margin: 0.3rem 0; }

.qivren-markdown blockquote {
  border-left: 3px solid rgb(139 92 246);
  padding: 0.35rem 0 0.35rem 1rem;
  color: rgb(100 116 139);
}

.dark .qivren-markdown blockquote {
  color: rgb(148 163 184);
}

.qivren-markdown hr {
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid rgb(226 232 240);
}

.dark .qivren-markdown hr {
  border-color: rgba(255, 255, 255, 0.1);
}

.qivren-markdown strong {
  color: rgb(15 23 42);
  font-weight: 750;
}

.dark .qivren-markdown strong {
  color: white;
}

.hljs {
  color: #d6deeb;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
