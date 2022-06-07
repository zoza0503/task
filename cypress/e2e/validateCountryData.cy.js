import { elements } from '../testData/elementsData';
import { Labels } from '../support/labels/labels';

describe('Challenge: REST Country API - Validate information about countries on Wikipedia ', () => {

  it('Fetch countries from REST Country API and provide a list of names for the first 10 countries', () => {
    cy.request(Labels.REQUEST_TYPE, Labels.ALL_COUNTRIES).then(response => {
      for(let i=0; i<9; i++) {
        cy.log(response.body[i].name.common);
      }
    });
  });

  it('Fetch Country data And Validate info on Wikipedia', () => {
    cy.log('Pick random country')
    cy.request(Labels.REQUEST_TYPE, Labels.ALL_COUNTRIES).then(response => {
      cy.wrap(response.body[[Math.floor(Math.random() * response.body.length)]].name.common).as('selectedCountryName');
    });

    cy.get('@selectedCountryName').then(selectedCountryName => {
      cy.log(`Given country name: ${selectedCountryName}`);

      cy.log('Fetch country data from the REST Country API');
      cy.request(Labels.REQUEST_TYPE, `${Labels.CHOSEN_COUNTRY_BASE_URL}${selectedCountryName}`).then(response => {
        cy.wrap(response.body[[Math.floor(Math.random() * response.body.length)]]).as('countryData');
      });

      cy.log('Navigate to Google and find GIVEN country Wikipedia page');
      cy.visit(Labels.VISIT_GOOGLE);
      cy.get(elements.inputData).type(`${selectedCountryName}{enter}`);
      cy.get(`${elements.wikipediaBaseURL}${selectedCountryName.split(' ').join('_')}"]`)
        .find(elements.title)
        .contains(`${selectedCountryName}`)
        .click();
  
      cy.get('@countryData').then(countryData => {
        cy.log('Validate country data');
        cy.get(elements.firstTitle).should('have.text', countryData.name.common);
        cy.get(elements.countryName).should('have.text', countryData.name.official);
      })
    })
  })
})
