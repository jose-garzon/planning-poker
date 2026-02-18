import JoinPage from '@/modules/join/join.page';

interface JoinRouteProps {
  params: Promise<{ id: string }>;
}

export default async function JoinRoute({ params }: JoinRouteProps) {
  const { id } = await params;
  return <JoinPage id={id} />;
}
