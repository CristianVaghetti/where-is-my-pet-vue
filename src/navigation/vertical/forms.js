export default [
  { heading: 'Cadastros' },
  {
    title: 'Suplementares',
    icon: { icon: 'bx-copy' },
    action: 'list',
    subject: 'main_panel',
    children: [
      { 
        title: 'Abrigos', 
        to: 'apps-shelters-Shelters' ,
        action: 'list',
        subject: 'shelters',
      },
      { 
        title: 'Pets', 
        to: 'apps-pets-Pets',
        action: 'list',
        subject: 'pets',
      },
    ],
  },
  { heading: 'Configurações' },
  {
    title: 'Cadastros',
    icon: { icon: 'bx-copy' },
    action: 'list',
    subject: 'settings',
    children: [
      { 
        title: 'Usuários', 
        to: 'apps-user-list-Users',
        action: 'list',
        subject: 'users',
      },
      { title: 'Perfis de usuários', 
        to: 'access-control',
        action: 'list',
        subject: 'profiles',
      },
    ],
  },
]
