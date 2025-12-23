export type AnalyticsPayload = Record<string, unknown>

const pushToDataLayer = (eventName: string, payload?: AnalyticsPayload) => {
  try {
    // If a GTM/dataLayer is present, push there
    const dl = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer
    if (Array.isArray(dl)) {
      dl.push({ event: eventName, ...payload })
      return
    }
  } catch {
    // ignore
  }

  console.info('[analytics]', eventName, payload ?? {})
}

export function trackEvent(eventName: string, payload?: AnalyticsPayload) {
  pushToDataLayer(eventName, payload)
}

export default trackEvent
