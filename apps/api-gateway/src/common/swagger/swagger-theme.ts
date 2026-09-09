export const SWAGGER_THEME_CSS = `
html[data-swagger-theme='light'] {
  color-scheme: light;
  --swagger-bg: #f6f8fa;
  --swagger-surface: #ffffff;
  --swagger-surface-raised: #f6f8fa;
  --swagger-border: #d0d7de;
  --swagger-text: #1f2328;
  --swagger-secondary: #57606a;
  --swagger-muted: #6e7781;
  --swagger-link: #0969da;
  --swagger-focus: #0969da;
  --swagger-code-bg: #f6f8fa;
  --swagger-input-border: #8c959f;
  --swagger-placeholder: #6e7781;
  --swagger-disabled: #8c959f;
  --swagger-overlay: rgba(31, 35, 40, 0.45);
}

html[data-swagger-theme='dark'] {
  color-scheme: dark;
  --swagger-bg: #0d1117;
  --swagger-surface: #161b22;
  --swagger-surface-raised: #21262d;
  --swagger-border: #30363d;
  --swagger-text: #f0f6fc;
  --swagger-secondary: #b1bac4;
  --swagger-muted: #8c959f;
  --swagger-link: #58a6ff;
  --swagger-focus: #79c0ff;
  --swagger-code-bg: #161b22;
  --swagger-input-border: #484f58;
  --swagger-placeholder: #8c959f;
  --swagger-disabled: #8c959f;
  --swagger-overlay: rgba(1, 4, 9, 0.72);
}

html[data-swagger-theme='dark'] .swagger-ui .authorization__btn svg,
html[data-swagger-theme='dark'] .swagger-ui .opblock-control-arrow .arrow {
  fill: var(--swagger-text);
}

html[data-swagger-theme] body,
html[data-swagger-theme] .swagger-ui,
html[data-swagger-theme] .swagger-ui .wrapper {
  background: var(--swagger-bg);
  color: var(--swagger-text);
}

html[data-swagger-theme] .swagger-ui .topbar,
html[data-swagger-theme] .swagger-ui .topbar-wrapper,
html[data-swagger-theme] .swagger-ui .scheme-container,
html[data-swagger-theme] .swagger-ui .info,
html[data-swagger-theme] .swagger-ui .opblock-tag-section,
html[data-swagger-theme] .swagger-ui .opblock .opblock-section-header,
html[data-swagger-theme] .swagger-ui .opblock-body,
html[data-swagger-theme] .swagger-ui .model-box,
html[data-swagger-theme] .swagger-ui .responses-inner,
html[data-swagger-theme] .swagger-ui .dialog-ux .modal-ux,
html[data-swagger-theme] .swagger-ui .auth-container {
  background: var(--swagger-surface);
  color: var(--swagger-text);
  border-color: var(--swagger-border);
  box-shadow: none;
}

html[data-swagger-theme] .swagger-ui .topbar {
  border-bottom: 1px solid var(--swagger-border);
}

html[data-swagger-theme] .swagger-ui,
html[data-swagger-theme] .swagger-ui .info,
html[data-swagger-theme] .swagger-ui .info .title,
html[data-swagger-theme] .swagger-ui .info li,
html[data-swagger-theme] .swagger-ui .info p,
html[data-swagger-theme] .swagger-ui .info table,
html[data-swagger-theme] .swagger-ui .opblock .opblock-summary-description,
html[data-swagger-theme] .swagger-ui .opblock-description-wrapper,
html[data-swagger-theme] .swagger-ui .opblock-description-wrapper p,
html[data-swagger-theme] .swagger-ui .opblock-external-docs-wrapper,
html[data-swagger-theme] .swagger-ui .opblock-title_normal,
html[data-swagger-theme] .swagger-ui .parameters-col_description,
html[data-swagger-theme] .swagger-ui .parameter__name,
html[data-swagger-theme] .swagger-ui .parameter__type,
html[data-swagger-theme] .swagger-ui .response-col_description,
html[data-swagger-theme] .swagger-ui .responses-inner,
html[data-swagger-theme] .swagger-ui .model,
html[data-swagger-theme] .swagger-ui .model-title,
html[data-swagger-theme] .swagger-ui .model-toggle,
html[data-swagger-theme] .swagger-ui .prop-type,
html[data-swagger-theme] .swagger-ui .markdown,
html[data-swagger-theme] .swagger-ui .renderedMarkdown,
html[data-swagger-theme] .swagger-ui label,
html[data-swagger-theme] .swagger-ui select,
html[data-swagger-theme] .swagger-ui input,
html[data-swagger-theme] .swagger-ui textarea,
html[data-swagger-theme] .swagger-ui pre,
html[data-swagger-theme] .swagger-ui code,
html[data-swagger-theme] .swagger-ui .tab li,
html[data-swagger-theme] .swagger-ui .dialog-ux .modal-ux-header h3 {
  color: var(--swagger-text);
}

html[data-swagger-theme] .swagger-ui .info h2,
html[data-swagger-theme] .swagger-ui .info h3,
html[data-swagger-theme] .swagger-ui .opblock-tag,
html[data-swagger-theme] .swagger-ui .opblock .opblock-summary-path,
html[data-swagger-theme] .swagger-ui .response-col_status,
html[data-swagger-theme] .swagger-ui .prop-name,
html[data-swagger-theme] .swagger-ui .opblock .opblock-section-header h4 {
  color: var(--swagger-text);
}

html[data-swagger-theme] .swagger-ui .info a,
html[data-swagger-theme] .swagger-ui a,
html[data-swagger-theme] .swagger-ui .btn.link,
html[data-swagger-theme] .swagger-ui .response-col_status {
  color: var(--swagger-link);
}

html[data-swagger-theme] .swagger-ui .info .base-url,
html[data-swagger-theme] .swagger-ui .parameter__in,
html[data-swagger-theme] .swagger-ui .parameter__deprecated,
html[data-swagger-theme] .swagger-ui .prop-format,
html[data-swagger-theme] .swagger-ui .model .property.primitive,
html[data-swagger-theme] .swagger-ui .model-toggle:after,
html[data-swagger-theme] .swagger-ui .response-col_links,
html[data-swagger-theme] .swagger-ui .authorization__scope,
html[data-swagger-theme] .swagger-ui .markdown p,
html[data-swagger-theme] .swagger-ui .renderedMarkdown p {
  color: var(--swagger-secondary);
}

html[data-swagger-theme] .swagger-ui .opblock-tag,
html[data-swagger-theme] .swagger-ui .responses-wrapper,
html[data-swagger-theme] .swagger-ui .responses-inner,
html[data-swagger-theme] .swagger-ui .opblock-section-request-body,
html[data-swagger-theme] .swagger-ui .dialog-ux .modal-ux-header {
  border-color: var(--swagger-border);
}

html[data-swagger-theme] .swagger-ui .opblock {
  background: var(--swagger-surface);
  border-color: var(--swagger-border);
  box-shadow: none;
}

html[data-swagger-theme] .swagger-ui .opblock.opblock-get { border-color: #58a6ff; }
html[data-swagger-theme] .swagger-ui .opblock.opblock-post { border-color: #3fb950; }
html[data-swagger-theme] .swagger-ui .opblock.opblock-patch { border-color: #d29922; }
html[data-swagger-theme] .swagger-ui .opblock.opblock-delete { border-color: #f85149; }
html[data-swagger-theme] .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #1f6feb; }
html[data-swagger-theme] .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #238636; }
html[data-swagger-theme] .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #9e6a03; }
html[data-swagger-theme] .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #da3633; }

html[data-swagger-theme] .swagger-ui input[type='text'],
html[data-swagger-theme] .swagger-ui input[type='password'],
html[data-swagger-theme] .swagger-ui input[type='search'],
html[data-swagger-theme] .swagger-ui input[type='email'],
html[data-swagger-theme] .swagger-ui input[type='file'],
html[data-swagger-theme] .swagger-ui textarea,
html[data-swagger-theme] .swagger-ui select,
html[data-swagger-theme] .swagger-ui .dialog-ux .modal-ux-content input {
  background: var(--swagger-bg);
  border-color: var(--swagger-input-border);
  color: var(--swagger-text);
}

html[data-swagger-theme] .swagger-ui select option {
  background: var(--swagger-surface-raised);
  color: var(--swagger-text);
}

html[data-swagger-theme] .swagger-ui input::placeholder,
html[data-swagger-theme] .swagger-ui textarea::placeholder {
  color: var(--swagger-placeholder);
  opacity: 1;
}

html[data-swagger-theme] .swagger-ui input:disabled,
html[data-swagger-theme] .swagger-ui textarea:disabled,
html[data-swagger-theme] .swagger-ui select:disabled,
html[data-swagger-theme] .swagger-ui input[readonly],
html[data-swagger-theme] .swagger-ui textarea[readonly],
html[data-swagger-theme] .swagger-ui .btn[disabled] {
  background: var(--swagger-surface-raised);
  color: var(--swagger-disabled);
  opacity: 0.8;
}

html[data-swagger-theme] .swagger-ui .btn,
html[data-swagger-theme] .swagger-ui .try-out__btn,
html[data-swagger-theme] .swagger-ui .authorization__btn {
  background: var(--swagger-surface-raised);
  border-color: var(--swagger-border);
  color: var(--swagger-text);
}

html[data-swagger-theme] .swagger-ui .btn.execute {
  background: #238636;
  border-color: #2ea043;
  color: #fff;
}

html[data-swagger-theme] .swagger-ui .btn.cancel,
html[data-swagger-theme] .swagger-ui .btn-clear {
  background: #da3633;
  border-color: #f85149;
  color: #fff;
}

html[data-swagger-theme] .swagger-ui .btn:hover,
html[data-swagger-theme] .swagger-ui .btn:focus-visible,
html[data-swagger-theme] .swagger-ui input:focus-visible,
html[data-swagger-theme] .swagger-ui textarea:focus-visible,
html[data-swagger-theme] .swagger-ui select:focus-visible,
html[data-swagger-theme] .swagger-ui a:focus-visible,
html[data-swagger-theme] #swagger-theme-toggle:focus-visible {
  outline: 2px solid var(--swagger-focus);
  outline-offset: 2px;
}

html[data-swagger-theme] .swagger-ui table,
html[data-swagger-theme] .swagger-ui table thead tr td,
html[data-swagger-theme] .swagger-ui table thead tr th,
html[data-swagger-theme] .swagger-ui table tbody tr td {
  background: var(--swagger-surface);
  border-color: var(--swagger-border);
  color: var(--swagger-text);
}

html[data-swagger-theme] .swagger-ui .highlight-code,
html[data-swagger-theme] .swagger-ui .microlight,
html[data-swagger-theme] .swagger-ui pre,
html[data-swagger-theme] .swagger-ui code,
html[data-swagger-theme] .swagger-ui .model-container,
html[data-swagger-theme] .swagger-ui .model-box-control:focus {
  background: var(--swagger-code-bg);
  color: var(--swagger-text);
}

html[data-swagger-theme] .swagger-ui .highlight-code .token.property,
html[data-swagger-theme] .swagger-ui .highlight-code .token.string,
html[data-swagger-theme] .swagger-ui .microlight .token.property,
html[data-swagger-theme] .swagger-ui .microlight .token.string { color: #79c0ff; }
html[data-swagger-theme] .swagger-ui .highlight-code .token.number,
html[data-swagger-theme] .swagger-ui .highlight-code .token.boolean,
html[data-swagger-theme] .swagger-ui .microlight .token.number,
html[data-swagger-theme] .swagger-ui .microlight .token.boolean { color: #d2a8ff; }

html[data-swagger-theme] .swagger-ui .dialog-ux .backdrop-ux {
  background: var(--swagger-overlay);
}

html[data-swagger-theme] .swagger-ui .authorization__value {
  background: var(--swagger-bg);
  border-color: var(--swagger-input-border);
  color: var(--swagger-text);
}

html[data-swagger-theme] #swagger-theme-toggle {
  position: fixed;
  z-index: 10001;
  top: 0.75rem;
  right: 0.75rem;
  min-height: 2.25rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--swagger-input-border);
  border-radius: 0.375rem;
  background: var(--swagger-surface-raised);
  color: var(--swagger-text);
  cursor: pointer;
  font: inherit;
}

html[data-swagger-theme] #swagger-theme-toggle:hover {
  border-color: var(--swagger-link);
  color: var(--swagger-link);
}

html[data-swagger-theme] .swagger-ui ::-webkit-scrollbar { width: 12px; height: 12px; }
html[data-swagger-theme] .swagger-ui ::-webkit-scrollbar-track { background: var(--swagger-bg); }
html[data-swagger-theme] .swagger-ui ::-webkit-scrollbar-thumb {
  background: #6e7781;
  border: 3px solid var(--swagger-bg);
  border-radius: 8px;
}
html[data-swagger-theme='dark'] .swagger-ui ::-webkit-scrollbar-thumb { background: #484f58; }
html[data-swagger-theme] .swagger-ui ::-webkit-scrollbar-thumb:hover { background: #8c959f; }
`;
