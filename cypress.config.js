const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    env: {
      webUrl: 'http://localhost:3001/',
      apiUrl: 'http://localhost:3000/'
    },
  },
  fixturesFolder: false
})
