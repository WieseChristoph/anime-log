import LogPage from '@/app/log-page';

export default async function SharedLogPage({ params }: { params: Promise<{ shareId: string }> }) {
    const { shareId } = await params;

    return <LogPage shareId={shareId} />;
}
