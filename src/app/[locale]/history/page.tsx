import { redirect } from 'next/navigation';

const HistoryPage = () => {
  const isAuthenticated = false; // get from supabase/firebase

  if (!isAuthenticated) {
    redirect('/');
  }
  return <div>History Page</div>;
};

export default HistoryPage;
