import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Props = { children: React.ReactNode };

export default function ScrollToTop({ children }: Props) {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname, search]);

    return <>{children}</>;
}