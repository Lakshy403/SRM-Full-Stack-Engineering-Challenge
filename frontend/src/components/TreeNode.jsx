import { useState } from "react";

function CaretIcon({ isOpen }) {
  return (
    <svg className={`caret-icon ${isOpen ? "open" : ""}`} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5 3.5L10.5 8L5 12.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="node-icon folder-node-icon" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M2.5 6.5a2 2 0 0 1 2-2h3l1.3 1.8h6.7a2 2 0 0 1 2 2v6.2a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2V6.5z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="node-icon file-node-icon" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M6 2.8h5.5l3 3V16a1.8 1.8 0 0 1-1.8 1.8H6A1.8 1.8 0 0 1 4.2 16V4.6A1.8 1.8 0 0 1 6 2.8z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M11.5 2.8V6h3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function TreeNode({ node, isRoot = true }) {
  const hasChildren = node.children && node.children.length > 0;
  const [isOpen, setIsOpen] = useState(isRoot);

  return (
    <li className={`tree-node ${isRoot ? "tree-node-root" : ""}`}>
      <button
        type="button"
        className={`tree-label-wrapper ${hasChildren ? "clickable" : "leaf-node"}`}
        onClick={() => hasChildren && setIsOpen((current) => !current)}
      >
        <span className="tree-caret-slot">
          {hasChildren ? <CaretIcon isOpen={isOpen} /> : <span className="caret-placeholder" />}
        </span>
        <span className="tree-icon-wrapper">
          {hasChildren ? <FolderIcon /> : <FileIcon />}
        </span>
        <span className="tree-label-text">{node.name}</span>
      </button>

      {hasChildren && isOpen && (
        <ul className="tree-children">
          {node.children.map((child) => (
            <TreeNode key={`${node.name}-${child.name}`} node={child} isRoot={false} />
          ))}
        </ul>
      )}
    </li>
  );
}
