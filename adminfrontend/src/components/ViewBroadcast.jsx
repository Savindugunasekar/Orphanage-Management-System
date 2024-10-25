import React, { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const ROLES = {
  User: 1010,
  Head: 1910,
  Staff: 5528,
  SocialWorker: 2525,
  Admin: 7788,
};

export default function ViewBroadcast({ showBroadcastModal, setShowBroadcastModal }) {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getAllNotifications = async () => {
      try {
        const response = await axiosPrivate.get("/broadcast");
        
        let currentRole;
        if (auth.roles.includes(ROLES.Admin)) {
          currentRole = 'Admin';
        } else if (auth.roles.includes(ROLES.Head)) {
          currentRole = 'Head';
        } else if (auth.roles.includes(ROLES.Staff)) {  
          currentRole = 'Staff';
        } else if (auth.roles.includes(ROLES.SocialWorker)) {  
          currentRole = 'SocialWorker';
        } else {
          currentRole = 'User';
        }

        const allowedNotifications = response.data.broadcastMessages.filter(
          (element) => element.role === currentRole
        );
        setNotifications(allowedNotifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    getAllNotifications();
  }, [axiosPrivate, auth.roles]); 

  return (
    showBroadcastModal && (
      <div className="fixed z-50 bg-white border shadow-xl top-20 right-5 rounded-2xl w-72">
        <div className="p-4">
          <h4 className="text-xl font-semibold text-gray-800">Broadcast</h4>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index} className="mt-2 text-sm text-gray-600">
                  • {notification.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-center text-gray-600">
              No Broadcasts available.
            </p>
          )}
          <button
            onClick={() => setShowBroadcastModal(false)}
            className="px-4 py-2 mt-4 text-gray-700 bg-gray-200 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
}
