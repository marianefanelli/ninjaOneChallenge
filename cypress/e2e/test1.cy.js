describe('Test 1', () => {

  it('Validate devices registered in the UI using data obtained by the API', () => {
    cy.getDeviceList_api()
    cy.getDeviceList_ui()
    cy.compareDeviceLists()
  })

  it('Verify that all devices contain the edit and delete buttons', () => {
    cy.verifyDeviceButtons()
  })
})
