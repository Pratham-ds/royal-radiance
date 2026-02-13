import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen luxury-gradient">
      <AdminSidebar />
      <main className="ml-60 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
