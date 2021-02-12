import { createElement } from '../helpers/domHelper';
import { fight } from './fight';
import { createFighterImage } from './fighterPreview';
import { showWinnerModal } from './modal/winner';

export function renderArena(selectedFighters: FighterInfo[]) {
  const root = document.getElementById('root');
  const arena = createArena(selectedFighters);

  if(root){
    root.innerHTML = '';
    root.append(arena);
  }


  var fightResult = fight(selectedFighters[0], selectedFighters[1]);
  // - when fight is finished show winner
  fightResult.then(result => showWinnerModal(result));
}

function createArena(selectedFighters: FighterInfo[]) {
  const arena = createElement({ tagName: 'div', className: 'arena___root' });
  const healthIndicators = createHealthIndicators(selectedFighters[0], selectedFighters[1]);
  const fighters = createFighters(selectedFighters[0], selectedFighters[1]);

  arena.append(healthIndicators, fighters);
  return arena;
}

function createHealthIndicators(leftFighter: FighterInfo, rightFighter: FighterInfo) {
  const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
  const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
  const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
  const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

  healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
  return healthIndicators;
}

function createHealthIndicator(fighter: FighterInfo, position: string) {
  const { name } = fighter;
  const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
  const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
  const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
  const bar = createElement({ tagName: 'div', className: 'arena___health-bar', attributes: { id: `${position}-fighter-indicator` } });

  fighterName.innerText = name;
  indicator.append(bar);
  container.append(fighterName, indicator);

  return container;
}

function createFighters(firstFighter: FighterInfo, secondFighter: FighterInfo) {
  const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
  const firstFighterElement = createFighter(firstFighter, 'left');
  const secondFighterElement = createFighter(secondFighter, 'right');

  battleField.append(firstFighterElement, secondFighterElement);
  return battleField;
}

function createFighter(fighter: FighterInfo, position: string) {
  const imgElement = createFighterImage(fighter);
  const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
  const fighterElement = createElement({
    tagName: 'div',
    className: `arena___fighter ${positionClassName}`,
  });

  fighterElement.append(imgElement);
  return fighterElement;
}
