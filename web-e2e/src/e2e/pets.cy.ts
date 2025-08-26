describe('Pets page', () => {
  const API_BASE = 'https://my-json-server.typicode.com/Feverup/fever_pets_data';

  beforeEach(() => {
    cy.intercept('GET', `${API_BASE}/pets*`, (req) => {
      req.reply({ fixture: 'pets.json' });
    }).as('getPets');
  });

  it('redirects from / to /pets and shows cards', () => {
    cy.visit('/');
    cy.url().should('match', /\/pets$/);
    cy.wait('@getPets');
    cy.get('ui-pet-card').should('have.length.at.least', 1);
  });

  it('changes sorting to weight asc and calls API with _sort and _order', () => {
    cy.visit('/pets');
    cy.wait('@getPets');

    cy.contains('label', 'Sort by').find('select').select('Weight');
    cy.contains('label', 'Order').find('select').select('Ascending');

    cy.wait('@getPets').its('request.url').then((url: string) => {
      expect(url).to.include('_sort=weight');
      expect(url).to.include('_order=asc');
    });
  });

  it('when Sort by = Kind, shows Kind dropdown and hides Order; applies kind filter', () => {
    cy.visit('/pets');
    cy.wait('@getPets');

    cy.get('label').contains('Sort by').find('select').select('Kind');

    cy.wait('@getPets');

    cy.get('label').children().contains('select','Dog').select('Dog');


    cy.wait('@getPets').its('request.url').then((url: string) => {
      expect(url).to.include('kind=dog');
      expect(url).not.to.include('_sort');
      expect(url).not.to.include('_order');
    });




  });

  it('updates page size and next stays disabled if fewer items than limit', () => {
    cy.visit('/pets');
    cy.wait('@getPets');

    cy.contains('label', 'Page size').find('select').select('6');
    cy.wait('@getPets').its('request.url').should('include', '_limit=6');

    cy.contains('button', /^Next$/).should('be.disabled');
  });
});
