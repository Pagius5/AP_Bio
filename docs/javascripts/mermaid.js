document$.subscribe(() => {
  if (!window.mermaid) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose"
  });

  const codeBlocks = document.querySelectorAll("pre code.language-mermaid");
  codeBlocks.forEach((code, index) => {
    const pre = code.parentElement;
    if (!pre || pre.dataset.mermaidProcessed === "true") return;

    const container = document.createElement("div");
    container.className = "mermaid";
    container.textContent = code.textContent || "";
    pre.replaceWith(container);
    container.dataset.mermaidRendered = "true";
    container.id = `mermaid-${index}-${Date.now()}`;
  });

  const nodes = document.querySelectorAll("div.mermaid");
  nodes.forEach((node, index) => {
    if (node.dataset.mermaidRendered === "true") return;

    node.dataset.mermaidRendered = "true";
    node.id = node.id || `mermaid-${index}-${Date.now()}`;
  });

  mermaid.run({
    querySelector: ".mermaid"
  });
});
