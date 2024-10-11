import React, { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

export default function Notification() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getAllNotifications = async () => {
      try {
        const response = await axiosPrivate.get("/broadcast");
        console.log(response.data);
  
        let currentrole;
        if (auth.roles.length === 3) {
          currentrole = 'Head';
        } else if (auth.roles.length === 2) {
          currentrole = 'Staff';
        } else if (auth.roles.length === 1) {
          currentrole = 'User';
        } else {
          currentrole = 'Admin';
        }
  
        const allowedNotifications = response.data.broadcastMessages.filter((element) => {
          console.log(element.role);
          return element.role === currentrole; 
        });
  
        console.log(auth.roles);
        console.log(auth.userId);
        console.log(allowedNotifications);
  
        setNotifications(allowedNotifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
  
    getAllNotifications();
  }, [axiosPrivate, auth.roles]); 

  return (
    <div style={{ padding: '20px' }}>
      <div className='text-justify'>Notification List</div>
      {notifications.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr>
                <td>{notification.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No notifications available</div>
      )}
    </div>
  );
}
