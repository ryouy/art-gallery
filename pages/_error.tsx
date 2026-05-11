import type { NextPageContext } from "next";
import Link from "next/link";

type ErrorProps = {
  statusCode?: number;
};

export default function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f5f0",
        color: "#23211d",
        fontFamily:
          '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif',
        padding: "40px 20px"
      }}
    >
      <div style={{ maxWidth: 640 }}>
        <p style={{ color: "#706b61", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          {statusCode ?? "Error"}
        </p>
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", "Yu Mincho", "Hiragino Mincho ProN", serif',
            fontSize: "clamp(40px, 8vw, 72px)",
            fontWeight: 500,
            lineHeight: 1.05,
            margin: "16px 0 24px"
          }}
        >
          Something went wrong
        </h1>
        <Link href="/" style={{ color: "#23211d", textDecoration: "underline" }}>
          Back home
        </Link>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;

  return { statusCode };
};
