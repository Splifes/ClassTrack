import React from 'react';

const ContactList: React.FC = () => {
  // Lista de ejemplo
  const conversations = [
    { id: '1', name: 'Profesor Smith' },
    { id: '2', name: 'Grupo de Proyecto' },
  ];

  return (
    <div style={{ width: '300px', borderRight: '1px solid #ccc' }}>
      <h2>Conversaciones</h2>
      <ul>
        {conversations.map((conv) => (
          <li key={conv.id} style={{ padding: '10px', cursor: 'pointer' }}>
            {conv.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
