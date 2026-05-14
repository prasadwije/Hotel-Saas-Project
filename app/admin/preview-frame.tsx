import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
    children: ReactNode;
    className?: string;
    title?: string;
};

/**
 * Renders children inside an <iframe> via React portal so the iframe's own
 * viewport width drives Tailwind media queries (`md:`, `lg:` etc.).
 * Parent document <style> and <link rel="stylesheet"> tags are mirrored into
 * the iframe head, and new ones (Vite HMR injects styles dynamically) are
 * picked up via MutationObserver. State updates flow normally through the
 * React tree because the portal keeps the same fiber root.
 */
export function PreviewFrame({ children, className, title = "Preview" }: Props) {
    const ref = useRef<HTMLIFrameElement>(null);
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const iframe = ref.current;
        if (!iframe) return;

        let cancelled = false;
        let observer: MutationObserver | null = null;
        const cloned = new WeakSet<Node>();

        const setup = () => {
            const doc = iframe.contentDocument;
            const win = iframe.contentWindow;
            if (!doc || !win || cancelled) return;

            // Reset doc shell.
            doc.open();
            doc.write(
                '<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body></body></html>',
            );
            doc.close();

            const head = doc.head;
            const body = doc.body;
            body.style.margin = "0";
            body.style.background = "#fff";

            const mirror = (node: Node) => {
                if (cloned.has(node)) return;
                if (node.nodeType !== 1) return;
                const el = node as HTMLElement;
                const tag = el.tagName;
                if (tag !== "STYLE" && !(tag === "LINK" && el.getAttribute("rel") === "stylesheet")) return;
                const clone = el.cloneNode(true) as HTMLElement;
                head.appendChild(clone);
                cloned.add(node);
            };

            // Initial copy
            Array.from(document.head.childNodes).forEach(mirror);

            // Watch for newly injected styles (Vite HMR / dynamic CSS)
            observer = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    m.addedNodes.forEach(mirror);
                }
            });
            observer.observe(document.head, { childList: true, subtree: true });

            setMountNode(body);
        };

        // contentDocument may exist already (about:blank); still wait one tick.
        setup();

        return () => {
            cancelled = true;
            observer?.disconnect();
            setMountNode(null);
        };
    }, []);

    return (
        <>
            <iframe ref={ref} title={title} className={className} />
            {mountNode && createPortal(children, mountNode)}
        </>
    );
}