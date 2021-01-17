import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  let winner = null;
  let keysPressed = new Map();
  let fighterOne = Object.assign(firstFighter, { ...firstFighter, "block": false, "indicatorId": 'left-fighter-indicator', "currentHealth": firstFighter.health, "lastComboHit": 0 });
  let fighterTwo = Object.assign(secondFighter, { ...secondFighter, "block": false, "indicatorId": 'right-fighter-indicator', "currentHealth": secondFighter.health, "lastComboHit": 0 });

  window.addEventListener('keyup', handleKeyUp);

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
        if (keysPressed.has(controls.PlayerOneCriticalHitCombination[0]) &&
          keysPressed.has(controls.PlayerOneCriticalHitCombination[1]) &&
          keysPressed.has(controls.PlayerOneCriticalHitCombination[2])) {
          playerCriticalAttack(fighterOne, fighterTwo)
        }
        else if(keysPressed.has(controls.PlayerTwoCriticalHitCombination[0]) &&
        keysPressed.has(controls.PlayerTwoCriticalHitCombination[1]) &&
        keysPressed.has(controls.PlayerTwoCriticalHitCombination[2])){
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

  return new Promise((resolve) => {
    window.addEventListener('keydown', (event) => {
      handleKeyDown(event);

      if(fighterOne.currentHealth <= 0){
        winner = fighterTwo;
      } else if(fighterTwo.currentHealth <= 0){
        winner = fighterOne;
      }

      if(winner != null) {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp);
        resolve(winner);
      }
    });
  });
}

function isOutOfLimitCritical(attacker) {
  const date = (new Date()).getTime();
  let result = (date - attacker.lastComboHit) > 10000;

  if (result) {
    attacker.lastComboHit = date;
  }

  return result;
}

function playerSetBlock(fighter) {
  fighter.block = true;
}

function playerUnSetBlock(fighter) {
  fighter.block = false;
}

function changeIndicator(fighter) {
  let indicatorElement = document.getElementById(fighter.indicatorId);
  let indicatorWidth = 100 * (fighter.currentHealth / fighter.health) + '%';
  indicatorElement.style.width = indicatorWidth;
}

function playerAttack(attacker, defender) {
  if(defender.block) return;
  if (!attacker.block) {
    let damage = getDamage(attacker, defender);
    defender.currentHealth -= damage;

    changeIndicator(defender);
  }
}

function playerCriticalAttack(attacker, defender) {
  if (!attacker.block && isOutOfLimitCritical(attacker)) {
    let damage = getCriticalDamage(attacker, defender);
    defender.currentHealth -= damage;
    changeIndicator(defender);
  }
}

function getCriticalDamage(attacker) {
  let damage = getCriticalHitPower(attacker);

  return damage;
}

export function getDamage(attacker, defender) {
  let damage = getHitPower(attacker) - getBlockPower(defender);

  if (damage < 0) {
    damage = 0;
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