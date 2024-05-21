export default [
  { heading: 'Cadastros' },
  {
    title: 'Suplementares',
    icon: { icon: 'bx-copy' },
    children: [
      { title: 'Abrigos', to: 'apps-shelters-Shelters' },
      { title: 'Pets', to: 'apps-expenses-FixedExpenses' },
    ],
  },
  { heading: 'Configurações' },
  {
    title: 'Cadastros',
    icon: { icon: 'bx-copy' },
    children: [
      { title: 'Usuários', to: 'apps-expenses-ExpenseType' },
      { title: 'Perfis de usuários', to: 'apps-expenses-FixedExpenses' },
    ],
  },
]
