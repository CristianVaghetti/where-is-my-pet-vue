import axios from "@axios"

export const getCep = cep => {
  if (cep !== null && cep.length === 9) {
    return axios.get('https://viacep.com.br/ws/' + cep + '/json')
  }
}

export const getStates = () => { return axios.get('/states') }

export const getCities = uf => { return axios.get('/cities/' + uf) }

