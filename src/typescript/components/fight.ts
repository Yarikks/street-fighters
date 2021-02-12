import { controls } from '../../constants/controls';
import { missedAttackAnimation } from './fightAnimations';

export async function fight(firstFighter: FighterInfo, secondFighter: FighterInfo): Promise<FighterInfo> {
  let winner: FighterInfo;
  const keysPressed = new Map();
  const fighterOne = Object.assign(firstFighter, { ...firstFighter, "block": false, "indicatorId": 'left-fighter-indicator', "currentHealth": firstFighter.health, "lastComboHit": 0, "position": 'left' });
  const fighterTwo = Object.assign(secondFighter, { ...secondFighter, "block": false, "indicatorId": 'right-fighter-indicator', "currentHealth": secondFighter.health, "lastComboHit": 0, "position": 'right' });

  window.addEventListener('keyup', handleKeyUp);

  function handleKeyDown(event: KeyboardEvent) {
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
        else if (keysPressed.has(controls.PlayerTwoCriticalHitCombination[0]) &&
          keysPressed.has(controls.PlayerTwoCriticalHitCombination[1]) &&
          keysPressed.has(controls.PlayerTwoCriticalHitCombination[2])) {
          playerCriticalAttack(fighterTwo, fighterOne);
        }
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
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

      if (fighterOne.currentHealth <= 0) {
        winner = fighterTwo;
      } else if (fighterTwo.currentHealth <= 0) {
        winner = fighterOne;
      }

      if (winner != null) {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp);
        resolve(winner);
      }
    });
  });
}

function isOutOfLimitCritical(attacker: ExtendedFighterInfo) {
  const date = (new Date()).getTime();
  const result = (date - attacker.lastComboHit) > 10000;

  if (result) {
    attacker.lastComboHit = date;
  }

  return result;
}

function playerSetBlock(fighter: ExtendedFighterInfo) {
  fighter.block = true;
}

function playerUnSetBlock(fighter: ExtendedFighterInfo) {
  fighter.block = false;
}

function changeIndicator(fighter: ExtendedFighterInfo) {
  const indicatorElement = document.getElementById(fighter.indicatorId);
  const indicatorWidth = 100 * (fighter.currentHealth / fighter.health) + '%';
  if(indicatorElement)
    indicatorElement.style.width = indicatorWidth;
}

function playerAttack(attacker: ExtendedFighterInfo, defender: ExtendedFighterInfo) {
  if (defender.block) return;
  if (!attacker.block) {
    const damage = getDamage(attacker, defender);
    defender.currentHealth -= damage;

    changeIndicator(defender);
  }
}

function playerCriticalAttack(attacker: ExtendedFighterInfo, defender: ExtendedFighterInfo) {
  if (!attacker.block && isOutOfLimitCritical(attacker)) {
    const damage = getCriticalDamage(attacker);
    defender.currentHealth -= damage;
    changeIndicator(defender);
  }
}

function getCriticalDamage(attacker: ExtendedFighterInfo) {
  const damage = getCriticalHitPower(attacker);

  return damage;
}

export function getDamage(attacker: ExtendedFighterInfo, defender: ExtendedFighterInfo) {
  let damage = getHitPower(attacker) - getBlockPower(defender);

  if (damage < 0) {
    missedAttackAnimation(attacker.position);
    damage = 0;
  }

  return damage;
}

export function getHitPower(fighter: ExtendedFighterInfo) {
  const criticalHitChance = getRandomNumber(1, 2);
  const hitPower = fighter.attack * criticalHitChance;

  return hitPower;
}

export function getBlockPower(fighter: ExtendedFighterInfo) {
  const { defense } = fighter;
  const dodgeChance = getRandomNumber(1, 2);
  const blockPower = defense * dodgeChance;

  return blockPower;
}

function getCriticalHitPower(fighter: ExtendedFighterInfo) {
  return 2 * fighter.attack;
}

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}