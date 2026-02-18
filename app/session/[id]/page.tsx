import SessionPage from '@/modules/poker-session/session.page';

interface SessionRouteProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ state?: string }>;
}

export default async function SessionRoute({ params, searchParams }: SessionRouteProps) {
  const { id } = await params;
  const { state } = await searchParams;
  return <SessionPage id={id} state={state} />;
}
