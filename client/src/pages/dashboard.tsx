import { Dashboard as DashboardComponent } from "@/components/inventory/dashboard";
import { Helmet } from "react-helmet";

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard | InvenTrack</title>
        <meta name="description" content="Overview of your inventory with key metrics, low stock alerts, and recent activities" />
      </Helmet>
      <DashboardComponent />
    </>
  );
}
