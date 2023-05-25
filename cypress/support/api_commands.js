
Cypress.Commands.add('getDeviceList_api', () => {
  // Call the API and save the data in an object
  cy.request('GET', Cypress.env('apiUrl') + 'devices').then(response => {
    // Check if API response contains list of devices
    if (response && response.body && Array.isArray(response.body)) {
      var devicesObj = {}
      var devicesArray = []

      // Loop through each device in the API response
      response.body.forEach(deviceData => {
        // Extract device information
        var name = deviceData.system_name
        var type = deviceData.type
        var capacity = deviceData.hdd_capacity

        // Add the information to the object
        devicesObj[name] = { name, type, capacity }
      })

      // Creating a new array with device objects containing the same information
      for (const deviceKey in devicesObj) {
        if (devicesObj.hasOwnProperty(deviceKey)) {
          const device = devicesObj[deviceKey]
          const { name, type, capacity } = device
          devicesArray.push({ name, type, capacity })
        }
      }
      
      // Ordering of the new array based on storage
      devicesArray.sort((deviceA, deviceB) => {
        const storageA = deviceA.capacity
        const storageB = deviceB.capacity

        return storageA - storageB
      })

      // Return the array wrapped in a Cypress promise
      return cy.wrap(devicesArray)
    }
  })
})

Cypress.Commands.add('compareDeviceLists', () => {
  // Call getDeviceList_api custom command
  cy.getDeviceList_api().then(devicesArray => {
    const apiDeviceCount = devicesArray.length

    // Call getDeviceList_ui custom command
    cy.getDeviceList_ui().then(devicesWebArray => {
      const webDeviceCount = devicesWebArray.length

      // Check if array sizes are equal
      expect(apiDeviceCount).to.equal(webDeviceCount)

      // Compare device values at each array position
      for (let i = 0; i < apiDeviceCount; i++) {
        const apiDevice = devicesArray[i]
        const webDevice = devicesWebArray[i]

        // Compare attributes (name, type, capacity) of each device
        expect(apiDevice.name).to.equal(webDevice.name)
        expect(apiDevice.type).to.equal(webDevice.type)
        expect(webDevice.capacity).to.include(apiDevice.capacity)
      }
    })
  })
})

Cypress.Commands.add('createDeviceByApi', () => {
  return cy.fixture('newDevices-data').then((device) => {
    return cy.request('POST', Cypress.env('apiUrl') + 'devices', device)
      .then(response => {
        expect(response.status).to.equal(200)
        return response.body.id
      })
  })
})

Cypress.Commands.add('getLastId', () => {
  return cy.request('GET', Cypress.env('apiUrl') + 'devices')
    .then(response => {
      const devices = response.body
      return devices[devices.length - 1].id
    })
})

Cypress.Commands.add('deleteById', (id) => {
  return cy.request('DELETE', `${Cypress.env('apiUrl')}devices/${id}`)
    .then(response => {
      expect(response.status).to.equal(200)
    })
})
