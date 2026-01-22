import React { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

export default function ScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        const el = document.getElementById('app-scroll');
        if (el) {
            el.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    }, [pathname]);

    return null;
}