/* Markdown-it content script: replaces ```net+ fenced blocks (or the older ```netplus-fast-track) with a mount point.
   Output follows Joplin's "joplin-editable" convention (same as Mermaid/KaTeX): the hidden
   .joplin-source element holds the original Markdown, so the Rich Text editor writes the
   fenced block back unchanged instead of converting the rendered tool into Markdown.
   No whitespace between the wrapper and its children (Joplin's turndown requires this). */
module.exports = {
  default: function (context) {
    return {
      plugin: function (markdownIt) {
        const fallback = markdownIt.renderer.rules.fence || function (tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options); };
        markdownIt.renderer.rules.fence = function (tokens, idx, options, env, self) {
          const token = tokens[idx];
          const info = String(token.info || '').trim().toLowerCase();
          if (info !== 'net+' && info !== 'netplus-fast-track') return fallback(tokens, idx, options, env, self);
          const lang = info; // write back exactly what the note used
          const id = String((context && context.contentScriptId) || '').replace(/[^\w.-]/g, '');
          const src = markdownIt.utils.escapeHtml(String(token.content || '').replace(/\n$/, ''));
          return '<div class="joplin-editable nft-wrap">' +
            '<pre class="joplin-source" hidden data-joplin-language="' + lang + '" data-joplin-source-open="```' + lang + '&#10;" data-joplin-source-close="&#10;```&#10;">' + src + '</pre>' +
            '<div class="nft joplin-rendered" data-nft-root data-cs="' + id + '"><div class="nft-loading">Loading Network+ Readiness Lab…</div></div>' +
            '</div>\n';
        };
      },
      assets: function () {
        return [{ name: 'nft.css' }, { name: 'nft.js' }];
      }
    };
  }
};
