import { useState, useEffect } from 'react';

export function useSidebarCollapse(
    storageKey: string,
    collapsedWidth: number,
    expandedWidth: number
) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(storageKey) === 'true';
        }
        return false;
    });

    useEffect(() => {
        // Sync jika tab lain mengubah localStorage
        const storageHandler = () => {
            setCollapsed(localStorage.getItem(storageKey) === 'true');
        };

        // Sync saat halaman yang sama emit event (navigasi dalam app)
        const customHandler = (e: CustomEvent) => {
            if (e.detail?.storageKey === storageKey) {
                setCollapsed(e.detail?.collapsed ?? false);
            }
        };

        window.addEventListener('storage', storageHandler);
        window.addEventListener('sidebarToggle', customHandler as EventListener);

        return () => {
            window.removeEventListener('storage', storageHandler);
            window.removeEventListener('sidebarToggle', customHandler as EventListener);
        };
    }, [storageKey]);

    return {
        collapsed,
        width: collapsed ? collapsedWidth : expandedWidth,
    };
}