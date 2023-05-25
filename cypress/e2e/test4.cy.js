describe('Test 4', () => {
  let newDeviceId
  let lastDeviceId
  
  before(() => {
    // Create a new device by API
    cy.createDeviceByApi().then((id) => {
      newDeviceId = id
    })
  })
  
  it('Delete the last device by API and verify deletion on the web page', () => {
    // Get the ID of the last device in the lista
    cy.getLastId().then((id) => {
      lastDeviceId = id
      expect(newDeviceId).to.equal(lastDeviceId)
      return cy.deleteById(lastDeviceId)
    })
    .then(() => {
      // Verify that the device has been removed
      cy.visit(Cypress.env('webUrl'))
      cy.get('div.device-main-box')
        .last()
        .should('not.contain', 'Mariane')
    })
  })
})
  