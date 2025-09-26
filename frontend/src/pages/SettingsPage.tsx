import React, { useState } from 'react';
import { NotificationsSettings } from '../features/settings/NotificationsSettings';

type SettingsTab = 'profile' | 'notifications';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return <NotificationsSettings />;
      case 'profile':
        return (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Perfil</h5>
              <p>Esta sección está en construcción.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Configuración</h2>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notificaciones
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Perfil
          </button>
        </li>
      </ul>
      <div>{renderContent()}</div>
    </div>
  );
};

export default SettingsPage;
