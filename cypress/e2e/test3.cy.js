const originalData = {
    system_name: 'DESKTOP-SMART',
    type: "WINDOWS",
    hdd_capacity: "10",
    id: null
}

describe('Test 3', () => {
    it('Renaming the name of the first device in the list', () => {
        //rename by API
        cy.request('GET', Cypress.env('apiUrl') + 'devices')
            .then(response => {
                // Access the first item in the list
                const firstItem = response.body[0]
                originalData.id = firstItem.id

                // Add the new value
                firstItem.system_name = 'Renamed Device'

                // PUT request to update the item in the API
                cy.request('PUT', Cypress.env('apiUrl')+`devices/${firstItem.id}`, firstItem)
                    .then(response => {
                        expect(response.status).to.equal(200)
                })
            })

        cy.visit(Cypress.env('webUrl'))
        // Locate device based on device name and validate the values
        cy.validateDataByName('Renamed Device', originalData.type, originalData.hdd_capacity)
    })

    // reset to original value 
    afterEach(() => {
        cy.request('PUT', Cypress.env('apiUrl')+`devices/${originalData.id}`, originalData)
            .then(response => {
                expect(response.status).to.equal(200)
        })
    })
})
