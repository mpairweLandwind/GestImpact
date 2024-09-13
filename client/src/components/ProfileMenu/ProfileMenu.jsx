
import { Avatar, Menu } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfileMenu = ({ user, logout }) => {
  const { t } = useTranslation("profileMenu");
  const navigate = useNavigate();

  const ALLOWED_EMAILS = ["mpairwelauben375@gmail.com", "admin123@gmail.com","bgbs@hotmail.fr"];

  return (
    <Menu>
      <Menu.Target>
        <Avatar src={user?.picture || user.image } alt="user image" radius={"xl"} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => navigate("./favourites", { replace: true })}>
          {t('profileMenu.favourites')}
        </Menu.Item>

        <Menu.Item onClick={() => navigate("./managedProperties", { replace: true })}>
          {t('profileMenu.managedProperties')}
        </Menu.Item>

        {ALLOWED_EMAILS.includes(user?.email) && (
          <Menu.Item onClick={() => navigate("./admin/*", { replace: true })}>
            {t('profileMenu.adminDashboard')}
          </Menu.Item>
        )}

        <Menu.Item
          onClick={() => {
            localStorage.clear();
            logout();
          }}
        >
          {t('profileMenu.logout')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
