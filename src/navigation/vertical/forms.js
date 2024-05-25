export default [
  { heading: 'Cadastros' },
  {
    title: 'Suplementares',
    icon: { icon: 'bx-copy' },
    children: [
      { title: 'Abrigos', to: 'apps-shelters-Shelters' },
      { title: 'Pets', to: 'apps-pets-Pets' },
    ],
  },
  { heading: 'Configurações' },
  {
    title: 'Cadastros',
    icon: { icon: 'bx-copy' },
    children: [
      { title: 'Usuários', to: 'apps-user-list-Users' },
      { title: 'Perfis de usuários', to: 'access-control' },
    ],
  },
]
