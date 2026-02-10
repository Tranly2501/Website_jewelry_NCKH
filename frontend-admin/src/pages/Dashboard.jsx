import React from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-welcome-text">
        <p>
          From your account dashboard you can view your <a href="#">recent orders</a>, 
          manage your <a href="#">shipping and billing addresses</a>, and 
          <a href="#"> edit your password and account details</a>.
        </p>
      </div>
      
      {/* Bạn có thể thêm các Widget thống kê ở dưới nếu muốn */}
    </DashboardLayout>
  );
};

export default Dashboard;