import type React from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";

export const BrowserRouter = ({ children }: { children: React.ReactNode }) =>
  children;

export const Routes = ({ children }: { children: React.ReactNode }) => children;

export const Route = () => null;

export function useNavigate() {
  const router = useRouter();

  return useCallback(
    (to: string | number) => {
      if (typeof to === "number") {
        if (to === -1) {
          router.back();
        }

        return;
      }

      void router.push(to);
    },
    [router],
  );
}

export function useLocation() {
  const router = useRouter();

  return useMemo(
    () => ({
      pathname: router.pathname,
      search: typeof window !== "undefined" ? window.location.search : "",
      hash: typeof window !== "undefined" ? window.location.hash : "",
    }),
    [router.pathname],
  );
}

export function useParams<
  T extends Record<string, string | string[] | undefined>,
>() {
  const router = useRouter();

  return router.query as T;
}

export function Navigate({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    void router.replace(to);
  }, [router, to]);

  return null;
}

export function RRLink({
  to,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={to} {...props}>
      {children}
    </Link>
  );
}

export { RRLink as Link };
