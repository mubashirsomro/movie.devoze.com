import { useEffect, useRef } from 'react';

interface AdContainerProps {
    code?: string;
    className?: string;
    label?: string;
}

const AdContainer = ({ code, className = '', label }: AdContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!code || !containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create a temporary container to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = code;

        // Move nodes to the actual container, executing scripts manually
        Array.from(tempDiv.childNodes).forEach((node) => {
            if (node.nodeName === 'SCRIPT') {
                const script = document.createElement('script');
                const nodeScript = node as HTMLScriptElement;

                // Copy attributes
                Array.from(nodeScript.attributes).forEach((attr) => {
                    script.setAttribute(attr.name, attr.value);
                });

                // Copy content
                if (nodeScript.innerHTML) {
                    script.innerHTML = nodeScript.innerHTML;
                }

                containerRef.current?.appendChild(script);
            } else {
                containerRef.current?.appendChild(node.cloneNode(true));
            }
        });
    }, [code]);

    if (!code) return null;

    return (
        <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
            {label && <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider opacity-50">{label}</span>}
            <div ref={containerRef} className="max-w-full overflow-hidden" />
        </div>
    );
};

export default AdContainer;
