Cypress.Commands.add('getDeviceList_ui', () => {
  cy.visit(Cypress.env('webUrl'))
  // Use the "get" command to find all elements with the desired class
  cy.get("div.device-info").then(devices => {
    // Create a promise to perform device information extraction
    const extractInfoPromise = new Cypress.Promise((resolve, reject) => {
    const devicesWeb = []
  
    // Iterate over the found elements
    devices.each((index, device) => {
      // Extract device information
      const name = Cypress.$(device).find(".device-name").text()
      const type = Cypress.$(device).find(".device-type").text()
      const capacity = Cypress.$(device).find(".device-capacity").text()
  
      // Create an object with the extracted information
      const deviceObjWeb = { name, type, capacity }
  
        // Add device to array
        devicesWeb.push(deviceObjWeb)
      })
  
      // Resolve promise with extracted device array
      resolve(devicesWeb)
    })
  
    cy.wrap(extractInfoPromise).then(devicesWeb => {

      return cy.wrap(devicesWeb)
    })
  })
})

Cypress.Commands.add('verifyDeviceButtons', () => {
  // Call getDeviceList_ui custom command
  cy.getDeviceList_ui().then(devicesWebArray => {
    // Iterate over the elements
    devicesWebArray.forEach(deviceWeb => {
      const deviceName = deviceWeb.name

      // Find specific device by name
      cy.contains('.device-info', deviceName).closest('.device-main-box').within(() => {
        cy.get('.device-options').within(() => {
          // Check if edit button is present
          cy.contains('a', 'Edit').should('exist')
          // Check if the delete button is present
          cy.contains('button', 'Remove').should('exist')
        })
      })
    })
  })
})

Cypress.Commands.add('createDeviceThroughUI', () => {
  cy.visit(Cypress.env('webUrl'))
  cy.get('a.submitButton').click()
  cy.get('input#system_name').type('Mariane')
  cy.get('select#type').select('MAC')
  cy.get('input#hdd_capacity').type('250')
  cy.get('button.submitButton').click()

  // Locate device based on device name
  cy.contains('div.device-info', 'Mariane').each((device) => {
    cy.wrap(device).within(() => {
      cy.get('span.device-name').should('contain.text', 'Mariane')
      cy.get('span.device-type').should('contain.text', 'MAC')
      cy.get('span.device-capacity').should('contain.text', '250')
    })
  })

  // Clear data
  cy.contains('.device-info', 'Mariane').closest('.device-main-box').within(() => {
    cy.get('.device-options').within(() => {
      cy.contains('button', 'Remove').click()
    })
  })
})