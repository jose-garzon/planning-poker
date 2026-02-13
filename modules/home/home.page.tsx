import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        <h1 className="mb-4 text-4xl font-bold">Next.js 15 Interview Scaffold</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Production-ready template demonstrating modern full-stack development best practices
        </p>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <Link href="/users">
            <Button variant="primary" size="lg">
              View Users
            </Button>
          </Link>
          <a href="/api/health" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              API Health Check
            </Button>
          </a>
        </div>

        <div className="grid gap-8 text-left md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-xl font-semibold">Tech Stack</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Next.js 15 with App Router</li>
              <li>• TypeScript (strict mode)</li>
              <li>• Tailwind CSS + Base UI</li>
              <li>• Prisma ORM + PostgreSQL</li>
              <li>• Zod validation</li>
              <li>• Vitest + Playwright</li>
              <li>• Biome (linting/formatting)</li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-xl font-semibold">Key Features</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Strict type safety everywhere</li>
              <li>• Comprehensive testing suite</li>
              <li>• Production-grade error handling</li>
              <li>• Security headers configured</li>
              <li>• Accessible UI components</li>
              <li>• Format on save with Biome</li>
              <li>• API response standardization</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
