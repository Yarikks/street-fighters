import { controls } from '../../constants/controls';

var fighterOne, fighterTwo;
var winner = null;
var keysPressed = new Map();

export async function fight(firstFighter, secondFighter) {
  fighterOne = Object.assign(firstFighter, { ...firstFighter, "block": false, "indicatorId": 'left-fighter-indicator', "currentHealth": firstFighter.health, "lastHit": 0, "lastComboHit": 0 });
  fighterTwo = Object.assign(secondFighter, { ...secondFighter, "block": false, "indicatorId": 'right-fighter-indicator', "currentHealth": secondFighter.health, "lastHit": 0, "lastComboHit": 0 });

  window.addEventListener('keyup', handleKeyUp);

  return new Promise((resolve) => {
    window.addEventListener('keydown', (event) => {
      handleKeyDown(event);
      if (winner != null) {
        resolve(winner);
      }
    });
  });
}

function handleKeyDown(event) {
  keysPressed.set(event.code, true);

  switch (event.code) {
    case controls.PlayerOneAttack:
      playerAttack(fighterOne, fighterTwo);
      break;
    case controls.PlayerTwoAttack:
      playerAttack(fighterTwo, fighterOne);
      break;
    case controls.PlayerOneBlock:
      playerSetBlock(fighterOne);
      break;
    case controls.PlayerTwoBlock:
      playerSetBlock(fighterTwo);
      break;
    default:
      console.log(keysPressed);
      if (keysPressed.get(controls.PlayerOneCriticalHitCombination[0]) &&
        keysPressed.get(controls.PlayerOneCriticalHitCombination[1]) &&
        keysPressed.get(controls.PlayerOneCriticalHitCombination[2])) {
        playerCriticalAttack(fighterOne, fighterTwo)
      }
      else if(keysPressed.get(controls.PlayerTwoCriticalHitCombination[0]) &&
      keysPressed.get(controls.PlayerTwoCriticalHitCombination[1]) &&
      keysPressed.get(controls.PlayerTwoCriticalHitCombination[2])){
        playerCriticalAttack(fighterTwo, fighterOne);
      }
  }
}

function handleKeyUp(event) {
  keysPressed.delete(event.code);

  switch (event.code) {
    case controls.PlayerOneBlock:
      playerUnSetBlock(fighterOne);
      break;
    case controls.PlayerTwoBlock:
      playerUnSetBlock(fighterTwo);
      break;
  }
}

function changeIndicator(fighter) {
  let indicatorElement = document.getElementById(fighter.indicatorId);
  let indicatorWidth = 100 * (fighter.currentHealth / fighter.health) + '%';
  indicatorElement.style.width = indicatorWidth;
}

function playerAttack(attacker, defender) {
  if (!attacker.block && isLimitedHit(attacker)) {
    let damage = getDamage(attacker, defender);
    defender.currentHealth -= damage;

    if (defender.currentHealth <= 0) {
      winner = attacker;
    }
    changeIndicator(defender);
  }
}

function isLimitedCritical(attacker) {
  const date = (new Date()).getTime();
  let result = (date - attacker.lastComboHit) > 10000;

  if (result) {
    attacker.lastComboHit = date;
  }

  return result;
}

function isLimitedHit(attacker) {
  const date = (new Date()).getTime();
  let result = (date - attacker.lastHit) > 500;

  if (result) {
    attacker.lastHit = date;
  }

  return result;
}

function playerCriticalAttack(attacker, defender) {
  if (!attacker.block && isLimitedCritical(attacker)) {
    let damage = getCriticalDamage(attacker, defender);
    defender.currentHealth -= damage;
    changeIndicator(defender);
  }
}

function playerSetBlock(fighter) {
  fighter.block = true;
}

function playerUnSetBlock(fighter) {
  fighter.block = false;
}

function getCriticalDamage(attacker, defender) {
  let damage = getCriticalHitPower(attacker) - getBlockPower(defender);

  if (damage < 0) {
    damage = 0;
  }
  if(!defender.block){
    damage = getCriticalHitPower(attacker);
  }

  return damage;
}

export function getDamage(attacker, defender) {
  let damage = getHitPower(attacker) - getBlockPower(defender);

  if (damage < 0) {
    damage = 0;
  }

  if(!defender.block){
    damage = getHitPower(attacker);
  }

  return damage;
}

export function getHitPower(fighter) {
  let criticalHitChance = getRandomNumber(1, 2);
  let hitPower = fighter.attack * criticalHitChance;

  return hitPower;
}

export function getBlockPower(fighter) {
  const { defense } = fighter;
  let dodgeChance = getRandomNumber(1, 2);
  let blockPower = defense * dodgeChance;

  return blockPower;
}

function getCriticalHitPower(fighter) {
  return 2 * fighter.attack;
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}