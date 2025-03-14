import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ai uni - free ai university",
	description: "real-world examples for building ai products",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<header className="border-b">
						<div className="container mx-auto p-4 flex justify-between items-center">
							<div>
								<h1 className="text-2xl font-bold">ai uni</h1>
								<p className="text-sm text-muted-foreground">
									free ai university with real-world examples
								</p>
							</div>
							<ThemeToggle />
						</div>
					</header>
					<main className="container mx-auto p-4">{children}</main>
					<footer className="border-t mt-8">
						<div className="container mx-auto p-4 text-center text-sm text-muted-foreground">
							<p>ai uni - open source and free for everyone</p>
						</div>
					</footer>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
