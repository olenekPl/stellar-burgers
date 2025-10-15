import * as orderFixture from '../fixtures/order.json';

const dataCyBun = '[data-cy="bun"]';
const dataCyBunFirst = '[data-cy="bun"]:first-of-type';
const dataCyOrder = '[data-cy-order]';
const modals = '#modals';

describe('Тест бургерной', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  it('test', () => {
    cy.visit('/');
  });

  it('Проверка ингридиентов', () => {
    cy.get(dataCyBun).as('buns');
    cy.get('[data-cy="main"], [data-cy="sauce"]').as('otherIngredients');
    
    cy.get('@buns').should('have.length.at.least', 1);
    cy.get('@otherIngredients').should('have.length.at.least', 1);
  });

  describe('Тест добавление ингредиентов в конструктор', () => {
    it('Проверка совпадения названий ингредиентов после добавления', () => {
      cy.get('[data-cy="bun"]:first-of-type').as('firstBun');
      cy.get('[data-cy="main"]:first-of-type').as('firstMain');
      cy.get('[data-cy="sauce"]:first-of-type').as('firstSauce');

      cy.get('@firstBun')
        .find('p.text_type_main-default')
        .invoke('text')
        .then((bunName) => {
          cy.get('@firstBun').find('button').click();
          
          cy.get('div.constructor-element_pos_top').as('topBunConstructor');
          cy.get('@topBunConstructor')
            .find('.constructor-element__text')
            .should('contain.text', bunName.trim());
        });

      cy.get('@firstMain')
        .find('p.text_type_main-default')
        .invoke('text')
        .then((mainName) => {
          cy.get('@firstMain').find('button').click();
          
          cy.get('span.constructor-element__row').eq(1).as('mainConstructor');
          cy.get('@mainConstructor')
            .find('.constructor-element__text')
            .should('contain.text', mainName.trim());
        });

      cy.get('@firstSauce')
        .find('p.text_type_main-default')
        .invoke('text')
        .then((sauceName) => {
          cy.get('@firstSauce').find('button').click();
          
          cy.get('span.constructor-element__row').eq(2).as('sauceConstructor');
          cy.get('@sauceConstructor')
            .find('.constructor-element__text')
            .should('contain.text', sauceName.trim());
        });
    });
  });

  describe('Тест модальных окон', () => {
    describe('Открытие модального окна', () => {
      beforeEach(() => {
        cy.get(dataCyBunFirst).as('firstBun');
        cy.get(modals).as('modalContainer');
      });

      it('Соответствие ингредиента', () => {
        cy.get('@firstBun')
          .find('p.text_type_main-default')
          .first()
          .invoke('text')
          .then((ingredientName) => {
            cy.get('@firstBun').click();
            cy.get('@modalContainer').children().should('have.length', 2);
            cy.get('@modalContainer')
              .find('h3')
              .eq(1)
              .invoke('text')
              .then((modalIngredientName) => {
                expect(modalIngredientName.trim()).to.contain(ingredientName.trim());
              });
          });
      });

      it('Открытие карточки ингредиента', () => {
        cy.get('@firstBun').click();
        cy.get('@modalContainer').children().should('have.length', 2);
      });

      it('Открытие модального окна после перезагрузки', () => {
        cy.get('@firstBun').click();
        cy.reload(true);
        cy.get('@modalContainer').children().should('have.length', 2);
      });
    });

    describe('Тест закрытия модального окна', () => {
      beforeEach(() => {
        cy.get(dataCyBunFirst).as('firstBun');
        cy.get(modals).as('modalContainer');
      });

      it('Нажимаем крест', () => {
        cy.get('@firstBun').click();
        cy.get('@modalContainer').find('button:first-of-type').click();
        cy.wait(1000);
        cy.get('@modalContainer').children().should('have.length', 0);
      });

      it('Нажимаем оверлэй', () => {
        cy.get('@firstBun').click();
        cy.get('@modalContainer').find('>div:nth-of-type(2)').click({ force: true });
        cy.wait(1000);
        cy.get('@modalContainer').children().should('have.length', 0);
      });
    });
  });

  describe('Оформления заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
      cy.visit('/');
      
      cy.get(dataCyOrder).as('orderButton');
      cy.get(dataCyBunFirst).as('firstBun');
      cy.get('[data-cy="main"]:first-of-type').as('firstMain');
      cy.get(modals).as('modalContainer');
    });

    it('Оформление', () => {
      cy.get('@orderButton').should('be.disabled');
      cy.get('@firstBun').find('button').click();
      cy.get('@orderButton').should('be.disabled');
      cy.get('@firstMain').find('button').click();
      cy.get('@orderButton').should('be.enabled');
      cy.get('@orderButton').click();
      cy.get('@modalContainer').children().should('have.length', 2);
      cy.get('@modalContainer')
        .find('h2:first-of-type')
        .should('have.text', orderFixture.order.number);
      cy.get('@modalContainer').find('button:first-of-type').click();
      cy.get('@orderButton').children().should('have.length', 0);
      cy.get('@orderButton').should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});