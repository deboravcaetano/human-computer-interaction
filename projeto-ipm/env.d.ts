/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module '@/services/api' {
  export function getCountries(): Promise<any[]>
  export function getCountryById(countryId: string): Promise<any>
  export function getCountryDetail(countryId: string): Promise<any>
  export function getCountryDetails(): Promise<any[]>
  export function getIndicators(): Promise<any[]>
  export function getCountryIndicators(countryId: string): Promise<any>
  export function getFaqs(): Promise<any[]>
  export function getReviews(): Promise<any[]>
  export function getPillars(): Promise<any[]>
  export function getCountryPillars(countryId: string): Promise<any>
  export function getSummary(): Promise<any>
  export function getTopCountries(): Promise<any[]>
  export function getLatestNews(): Promise<any[]>
  export function getDisbursementsByCountry(countryId: string): Promise<any>
  export function getMetasMarcos(): Promise<any[]>
}

declare module '@/services/exporter' {
  export function exportData(options: any): void
}
