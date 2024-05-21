export const maskUpper = reactive({
  mask: 'Z',
  tokens: {
    Z: { pattern: /[\W\w]/, transform: chr => chr.toUpperCase(), repeated: true },
  },
})

export const maskMoney = reactive({
  mask: 'Z.ZZ#,##',
  tokens: {
    Z: { pattern: '[0-9]', repeated: true },
  },
  reversed: true,
})
