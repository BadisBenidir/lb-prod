import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        const el = document.getElementById('app-scroll');
        if (el) {
            el.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    }, [pathname, search]);

    return null;
}