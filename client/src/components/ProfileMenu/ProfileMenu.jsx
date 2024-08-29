import React from 'react';
import { Avatar, Menu } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ user, logout }) => {
  const navigate = useNavigate();

  const ALLOWED_EMAILS = ["mpairwelauben375@gmail.com", "admin123@gmail.com"];

  return (
    <Menu>
      <Menu.Target>
        <Avatar src={user?.picture} alt="user image" radius={"xl"} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => navigate("./favourites", { replace: true })}>
          Favourites
        </Menu.Item>

        <Menu.Item onClick={() => navigate("./managedProperties", { replace: true })}>
          Managed Properties
        </Menu.Item>

        {ALLOWED_EMAILS.includes(user?.email) && (
          <Menu.Item onClick={() => navigate("./admin", { replace: true })}>
            DashBoard
          </Menu.Item>
        )}

        <Menu.Item
          onClick={() => {
            localStorage.clear();
            logout();
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
