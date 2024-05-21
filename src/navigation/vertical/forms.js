export default [
  { heading: 'Cadastros' },
  {
    title: 'Suplementares',
    icon: { icon: 'bx-copy' },
    children: [
      { title: 'Tipos de despesa', to: 'apps-expenses-ExpenseType' },
      { title: 'Despesas fixas', to: 'apps-expenses-FixedExpenses' },
    ],
  },

  {
    title: 'Cadastrar despesa',
    icon: { icon: 'bx-copy' },
    to: 'apps-expenses-Expense',
  },
]
