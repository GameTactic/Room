import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

if (process.env.NODE_ENV === 'prod') {
  Sentry.init({
    dsn: 'https://c3f95c26bdc540f2b9770306cbfec571@sentry.xn--gran-8qa.fi/2',
    integrations: [new Integrations.Vue({
      Vue,
      attachProps: true,
      logErrors: true
    })]
  })
}
