const API_URL = 'http://localhost:3000'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, options)

  if (!response.ok) {
    throw new Error(`Erro ao carregar ${endpoint}`)
  }

  return response.json()
}

export function getCountries() {
  return request('/countries')
}

export async function getCountryById(countryId) {
  const countries = await request(`/countries?id=${countryId}`)
  return countries[0] ?? null
}

export async function getCountryDetail(countryId) {
  const details = await request(`/countryDetails?countryId=${countryId}`)
  return details[0] ?? null
}

export function getIndicators() {
  return request('/indicators')
}

export function getFaqs() {
  return request('/faqs')
}

export function getReviews() {
  return request('/reviews')
}

export function getPillars() {
  return request('/pillars')
}

export function getSummary() {
  return request('/summary')
}

export function getTopCountries() {
  return request('/topCountries')
}
