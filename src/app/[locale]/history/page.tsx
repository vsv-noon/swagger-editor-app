import dynamic from 'next/dynamic';

const HistoryAndAnalytics = dynamic(
  () => import('@/components/HistoryAndAnalytics/HistoryAndAnalytics')
);

const HistoryPage = async () => {
  return <HistoryAndAnalytics />;
};

export default HistoryPage;
