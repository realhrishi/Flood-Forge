import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const DashboardLayout = () => {
  const [isPredicting, setIsPredicting] = useState(false);

  const handlePredict = async () => {
    setIsPredicting(true);
    // Simulate prediction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPredicting(false);
    toast({
      title: "Prediction Complete",
      description: "Risk assessment updated across all zones.",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onPredict={handlePredict} isPredicting={isPredicting} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet context={{ isPredicting }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
