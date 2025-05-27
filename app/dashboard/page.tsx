import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminDashboardDynamic } from "@/components/admin-dashboard-dynamic";
import { SupabaseAdminProvider } from "@/contexts/supabase-admin-context";



export default function Dashboard() {


    return (
        <SupabaseAdminProvider>

            <AdminDashboardDynamic/>
        </SupabaseAdminProvider>
    );
}