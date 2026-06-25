import axios from 'axios'

const baseURL =
  typeof window === 'undefined'
    ? (process.env.STRAPI_INTERNAL_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337')
    : (process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337')

const strapiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default strapiClient
