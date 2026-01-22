import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Props = { children: React.ReactNode };

export default function ScrollToTop({ children }: { children: React.ReactNode}) {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

        const el = document.getElementById('app-scroll');
        el?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname]);

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    return <>{children}</>;
}