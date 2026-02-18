import { Button } from '@/shared/components/ui/button/button';
import Link from 'next/link';

export default function UsersPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link href="/">
          <Button variant="ghost">Back Home</Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          User management interface coming soon. Check the API endpoints at{' '}
          <code className="rounded bg-muted px-2 py-1">/api/users</code> for CRUD operations.
        </p>
      </div>
    </div>
  );
}
