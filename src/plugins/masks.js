export const maskUpper = reactive({
  mask: 'Z',
  tokens: {
    Z: { pattern: /[\W\w\s]/, transform: chr => chr.toUpperCase(), repeated: true },
  },
})

export const maskNumber = reactive({
  mask: 'Z',
  tokens: {
    Z: { pattern: /[0-9\s]/, repeated: true },
  },
})

export const maskMoney = reactive({
  mask: 'Z.ZZ#,##',
  tokens: {
    Z: { pattern: '[0-9]', repeated: true },
  },
  reversed: true,
})

export const maskCellPhone = reactive({
  mask: '(##) # ####-####',
})

export const maskPhone = reactive({
  mask: '(##) ####-####',
})

export const maskCEP = reactive({
  mask: '#####-###',
})