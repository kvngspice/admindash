import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the admin dashboard. Use the navigation menu to manage your application.</p>
      
      <div className="row mt-3">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5>Recent Activity</h5>
              <p>No recent activity to display.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
