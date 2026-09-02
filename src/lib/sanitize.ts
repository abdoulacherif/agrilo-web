import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(raw: string): string {
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      "p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em",
      "a", "img", "blockquote", "code", "pre", "br",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title"],
  });
}