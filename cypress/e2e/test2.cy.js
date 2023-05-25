const device = require('../fixtures/newDevices-data')

describe('Test 2', () => {
    it('Create a new device by UI', () => {
        cy.createDeviceThroughUI()
        cy.validateDataByName(device.system_name, device.type, device.capacity)
    })    

    // clear data 
    afterEach(() => {
        cy.deleteDeviceByName(device.system_name)
    })
})