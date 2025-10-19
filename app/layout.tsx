import { ClarityScript } from "@/components/clarity-script";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale: (await params).locale, namespace: "Common" });

    return {
        title: t("title") || "Screen Share - Share Your Screen Instantly",
        description: t("description") || "Share your screen instantly with anyone using a simple room code. No downloads or sign-ups required.",
        keywords: ["screen sharing", "webrtc", "online screen share", "browser screen sharing", "free screen sharing", "share your screen", "share screen", "screen share"],
        other: {
            "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ""
        }
    };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    const t = await getTranslations({ locale, namespace: "Common" });

    return (
        <html lang={locale}>
            <body className={inter.className}>
                <main className="from-background to-muted flex min-h-screen flex-col justify-between bg-linear-to-b">
                    <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
                    <footer className="text-muted-foreground px-4 py-8 text-center text-sm">
                        {t.rich("footer", {
                            author: (chunks) => (
                                <Link href="https://tonghohin.vercel.app" className="underline" target="_blank">
                                    {chunks}
                                </Link>
                            ),
                            link: (chunks) => (
                                <Link href="https://github.com/tonghohin/screen-sharing" className="underline" target="_blank">
                                    {chunks}
                                </Link>
                            )
                        })}
                    </footer>
                </main>
                <ClarityScript />
                <Toaster richColors />
            </body>
        </html>
    );
}
