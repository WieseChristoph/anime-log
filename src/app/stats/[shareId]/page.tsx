import StatsPage from '@/app/stats-page';

export default async function SharedStatsRoute({ params }: { params: Promise<{ shareId: string }> }) {
    const { shareId } = await params;
    return <StatsPage shareId={shareId} />;
}
