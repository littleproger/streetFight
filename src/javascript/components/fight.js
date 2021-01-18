import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  let fightInfo ={
    firstFighter:{
      healthIndicatorFirst:document.getElementById("left-fighter-indicator"),
      health:firstFighter.health,
      block:false,
      orderToAttack:true,
      orderToCriticalHit:false
    },
    secondFighter:{
      healthIndicatorSecond:document.getElementById("right-fighter-indicator"),
      health:secondFighter.health,
      block:false,
      orderToAttack:true,
      orderToCriticalHit:false
    }
  }

  return new Promise((resolve) => {

    setTimeout(() => {
      fightInfo.firstFighter.orderToCriticalHit = true;
      fightInfo.secondFighter.orderToCriticalHit = true; }, 10000)
    alert("FIGHT");

    function checkHealth(healthFirst, healthSecond) {
      if (healthFirst <= 0) {
        fightInfo.firstFighter.healthIndicatorFirst.style.width = `0%`;
        resolve(secondFighter);
      } else if (healthSecond <= 0) {
        fightInfo.secondFighter.healthIndicatorSecond.style.width = `0%`;
        resolve(firstFighter);
      }
    }

    function changeHealthIndicator(indicator, health, fighter) {
      indicator.style.width = `${health / fighter.health * 100}%`
    }

    function presedKeys(func, type,fightersInfo, ...codes) {
      let pressed = new Set();
      document.addEventListener('keydown', function (event) {
        pressed.add(event.code);
        for (let code of codes) {
          if (!pressed.has(code) || pressed.size !== codes.length) {
            return;
          }
        }
        if (pressed.has(controls.PlayerOneBlock)){
          fightersInfo.firstFighter.block = true;
        }else{
          fightersInfo.firstFighter.block = false;
        }
        if (pressed.has(controls.PlayerTwoBlock)) {
          fightersInfo.secondFighter.block = true;
        }else{
          fightersInfo.secondFighter.block = false;
        }
        pressed.clear();
        if (fightersInfo.firstFighter.orderToAttack && type === 'attack' && !fightersInfo.firstFighter.block) {
          fightersInfo.firstFighter.orderToAttack = false;
          func();
          setTimeout(() => { fightersInfo.firstFighter.orderToAttack = true }, 300)
        }
        if (fightersInfo.secondFighter.orderToAttack && type === 'attack' && !fightersInfo.secondFighter.block) {
          fightersInfo.secondFighter.orderToAttack = false;
          func();
          setTimeout(() => { fightersInfo.firstFighter.orderToAttack = true }, 300)
        }
        if (fightersInfo.firstFighter.orderToCriticalHit && type === "critHitFirst") {
          fightersInfo.firstFighter.orderToCriticalHit = false
          func();
          setTimeout(() => { fightersInfo.firstFighter.orderToCriticalHit = true }, 10000)
        }
        if (fightersInfo.secondFighter.orderToCriticalHit && type === "critHitSecond") {
          fightersInfo.secondFighter.orderToCriticalHit = false
          func();
          setTimeout(() => { fightersInfo.secondFighter.orderToCriticalHit = true }, 10000)
        }
        if (type === 'blockedAttack') { func() }
        checkHealth(fightersInfo.firstFighter.health, fightersInfo.secondFighter.health)
      });
      document.addEventListener('keyup', function (event) {
        pressed.delete(event.code);
      });

    }
    //Blocked attacks
    presedKeys(() => {
      fightInfo.firstFighter.health -= getDamage(secondFighter, firstFighter);
      changeHealthIndicator(fightInfo.firstFighter.healthIndicatorFirst, fightInfo.firstFighter.health, firstFighter)
    }, 'blockedAttack',fightInfo, controls.PlayerOneBlock, controls.PlayerTwoAttack)
    presedKeys(() => {
      fightInfo.secondFighter.health -= getDamage(firstFighter, secondFighter);
      changeHealthIndicator(fightInfo.secondFighter.healthIndicatorSecond, fightInfo.secondFighter.health, secondFighter)
    }, 'blockedAttack',fightInfo, controls.PlayerTwoBlock, controls.PlayerOneAttack)
    //CriticalHits
    presedKeys(() => {
      fightInfo.secondFighter.health -= firstFighter.attack * 2;
      changeHealthIndicator(fightInfo.secondFighter.healthIndicatorSecond, fightInfo.secondFighter.health, secondFighter)
    }, 'critHitFirst',fightInfo, ...controls.PlayerOneCriticalHitCombination)
    presedKeys(() => {
      fightInfo.firstFighter.health -= secondFighter.attack * 2;
      changeHealthIndicator(fightInfo.firstFighter.healthIndicatorFirst, fightInfo.firstFighter.health, firstFighter)
    }, 'critHitSecond',fightInfo, ...controls.PlayerTwoCriticalHitCombination)
    //Attaks
    presedKeys(() => {
      fightInfo.secondFighter.health -= getHitPower(firstFighter);
      changeHealthIndicator(fightInfo.secondFighter.healthIndicatorSecond, fightInfo.secondFighter.health, secondFighter)
    }, 'attack',fightInfo, controls.PlayerOneAttack)
    presedKeys(() => {
      fightInfo.firstFighter.health -= getHitPower(secondFighter);
      changeHealthIndicator(fightInfo.firstFighter.healthIndicatorFirst, fightInfo.firstFighter.health, firstFighter)
    }, 'attack',fightInfo, controls.PlayerTwoAttack)
    // resolve the promise with the winner when fight is over
  });
}

export function getDamage(attacker, defender) {
  let attack = getHitPower(attacker);
  let block = getBlockPower(defender);
  if (attack < block) {
    return 0
  } else {
    return attack - block
  }
  // return damage
}

export function getHitPower(fighter) {
  const criticalHitChance = (min, max) => {
    return Math.random() * (max - min) + min;
  }
  const power = fighter.attack * criticalHitChance(1, 2)
  return power
  // return hit power
}

export function getBlockPower(fighter) {
  const dodgeChance = (min, max) => {
    return Math.random() * (max - min) + min;
  }
  const power = fighter.defense * dodgeChance(1, 2)
  return power
  // return block power
}