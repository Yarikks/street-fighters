import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // done: show fighter info (image, name, health, etc.)
  if(fighter != undefined){
    const fighterImgElement = createFighterImage(fighter);
    const fighterInfoElement = createFighterInfo(fighter);

    if(position === 'right'){
      fighterElement.append(fighterImgElement);
      fighterElement.append(fighterInfoElement);
    }
    else{
      fighterElement.append(fighterInfoElement);
      fighterElement.append(fighterImgElement);
    }
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };

  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}

export function createFighterInfo(fighter) {
  const { name, health, attack, defense } = fighter;

  const infoBlockElement = createElement({
    tagName: 'div',
    className: 'fighter-info__block',
  });

  const nameElement = createElement({
    tagName: 'div',
    className: 'fighter-info__name',
  });
  nameElement.append(`Name: ${name}`);

  const healthElement = createElement({
    tagName: 'div',
    className: 'fighter-info__health',
  });
  healthElement.append(`Health: ${health} ❤️`);

  const attackElement = createElement({
    tagName: 'div',
    className: 'fighter-info__attack',
  });
  attackElement.append(`Attack: ${attack} ⚔️`);

  const defenseElement = createElement({
    tagName: 'div',
    className: 'fighter-info__defense',
  });
  defenseElement.append(`Defense: ${defense} 🛡️`);

  infoBlockElement.append(nameElement, healthElement, attackElement, defenseElement);

  return infoBlockElement;
}