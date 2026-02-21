import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateText } from "@/lib/translationService";

const AutoTranslator = () => {
    const { currentLanguage } = useLanguage();
    const observerRef = useRef<MutationObserver | null>(null);

    // Track original text for each node to allow switching back to English
    const originalTextMap = useRef<Map<Node, string>>(new Map());

    const shouldShield = (text: string) => {
        const protectedPatterns = [
            /GoNepal/gi,
            /Go\s+Nepal/gi,
            /Go-Nepal/gi,
            /Rs\.?\s?\d+/i,        // Rs. 500
            /NPR\.?\s?\d+/i,       // NPR 1000
            /\$\d+/g,              // $50
            /\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}/gi, // 20 Feb 2026
            /\d{4}-\d{2}-\d{2}/g,  // 2026-02-20
        ];
        return protectedPatterns.some(pattern => pattern.test(text.trim()));
    };

    const shouldTranslate = (node: Node) => {
        if (!node.textContent || node.textContent.trim().length < 2) return false;

        // Prevent translation if the node or its parent has data-no-translate
        const parent = node.parentElement;
        if (parent?.dataset.noTranslate === "true") return false;

        if (shouldShield(node.textContent)) return false;

        // Ignore script, style, and icon tags
        if (parent) {
            const tag = parent.tagName.toLowerCase();
            if (["script", "style", "noscript", "svg", "path"].includes(tag)) return false;
            // Also ignore elements that have already been translated
            if (parent.dataset.translated === "true" && currentLanguage.code !== "en") return false;
        }

        return true;
    };

    const translateNode = async (node: Node) => {
        if (!shouldTranslate(node)) return;

        // Save original text if not already saved
        if (!originalTextMap.current.has(node)) {
            originalTextMap.current.set(node, node.textContent || "");
        }

        const originalText = originalTextMap.current.get(node);
        if (!originalText) return;

        if (currentLanguage.code === "en") {
            node.textContent = originalText;
            if (node.parentElement) delete node.parentElement.dataset.translated;
            return;
        }

        try {
            const translated = await translateText(originalText, "en", currentLanguage.code);
            if (translated && translated !== originalText) {
                node.textContent = translated;
                if (node.parentElement) node.parentElement.dataset.translated = "true";
            }
        } catch (error) {
            console.error("Auto-translation error for node:", error);
        }
    };

    const processNodes = (root: Node) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        let node;
        while ((node = walker.nextNode())) {
            translateNode(node);
        }
    };

    useEffect(() => {
        // Initial translation of the whole page
        processNodes(document.body);

        // Setup mutation observer for dynamic content
        observerRef.current = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        translateNode(node);
                    } else {
                        processNodes(node);
                    }
                });
            });
        });

        observerRef.current.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [currentLanguage.code]);

    return null; // This component doesn't render anything
};

export default AutoTranslator;
