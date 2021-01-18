import { controls } from '../../constants/controls';
import {createElement} from "../helpers/domHelper";

export async function fight(firstFighter, secondFighter) {
  let fightInfo ={
    firstFighter:{
      fighterObj:firstFighter,
      player:'1',
      healthIndicator:document.getElementById("left-fighter-indicator"),
      health:firstFighter.health,
      block:false,
      orderToAttack:true,
      orderToCriticalHit:false
    },
    secondFighter:{
      fighterObj:secondFighter,
      player:"2",
      healthIndicator:document.getElementById("right-fighter-indicator"),
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
        fightInfo.firstFighter.healthIndicator.style.width = `0%`;
        resolve(secondFighter);
      } else if (healthSecond <= 0) {
        fightInfo.secondFighter.healthIndicator.style.width = `0%`;
        resolve(firstFighter);
      }
    }

    function changeHealthIndicator(indicator, health, fighter) {
      indicator.style.width = `${health / fighter.health * 100}%`
    }

    function checkPressed(buttons, ...mustBePrsessed) {
      for (let code of mustBePrsessed) {
        if (!buttons.has(code)) {
          return 0;
        }
      }
      return true;
    }
    function checkAttackOrder(fighter) {
      if (fighter.block){
        return false
      }else{
        return true;
      }
    }

    function critHit(attacker,defender){
      attacker.orderToCriticalHit=false;
      defender.health -= attacker.fighterObj.attack * 2;
      changeHealthIndicator(defender.healthIndicator, defender.health, defender.fighterObj)
      setTimeout(()=>{attacker.orderToCriticalHit=true},10000)
    }

    function attack(attacker,defender){
      defender.health -= getHitPower(attacker.fighterObj);
      changeHealthIndicator(defender.healthIndicator, defender.health, defender.fighterObj)
    }

    function blockedAttack(attacker,defender){
      defender.health -= getDamage(attacker.fighterObj, defender.fighterObj);
      changeHealthIndicator(defender.healthIndicator, defender.health, defender.fighterObj)
    }

    let pressed = new Set();
    document.addEventListener('keydown', function (event) {
      pressed.add(event.code);
      if (pressed.has(controls.PlayerOneBlock)){
          fightInfo.firstFighter.block = true;
        }else{
          fightInfo.firstFighter.block = false;
        }
      if (pressed.has(controls.PlayerTwoBlock)) {
          fightInfo.secondFighter.block = true;
        }else{
          fightInfo.secondFighter.block = false;
        }
      //Blocked attacks
      if (pressed.has(controls.PlayerOneBlock) && pressed.has(controls.PlayerTwoAttack)){
        blockedAttack(fightInfo.secondFighter,fightInfo.firstFighter)
        pressed.delete(controls.PlayerTwoAttack)
        console.log("1 Blocked")
      }
      if(pressed.has(controls.PlayerTwoBlock) && pressed.has(controls.PlayerOneAttack)){
        blockedAttack(fightInfo.firstFighter,fightInfo.secondFighter)
        pressed.delete(controls.PlayerOneAttack)
        console.log("2 Blocked")
      }
      //CriticalHits
      if(checkPressed(pressed, ...controls.PlayerOneCriticalHitCombination) && fightInfo.firstFighter.orderToCriticalHit){
        critHit(fightInfo.firstFighter,fightInfo.secondFighter)
        console.log("1 crit")
      }
      if(checkPressed(pressed, ...controls.PlayerTwoCriticalHitCombination) && fightInfo.secondFighter.orderToCriticalHit){
        critHit(fightInfo.secondFighter, fightInfo.firstFighter)
        console.log("2 crit")
      }
      //Attaks
      if(checkAttackOrder(fightInfo.firstFighter) && checkPressed(pressed,controls.PlayerOneAttack)){
        attack(fightInfo.firstFighter,fightInfo.secondFighter);
        pressed.delete(controls.PlayerOneAttack)
        console.log("1 attack")
      }
      if(checkAttackOrder(fightInfo.secondFighter) && checkPressed(pressed,controls.PlayerTwoAttack)){
        attack(fightInfo.secondFighter,fightInfo.firstFighter)
        pressed.delete(controls.PlayerTwoAttack)
        console.log("2 attack")
      }
      checkHealth(fightInfo.firstFighter.health, fightInfo.secondFighter.health)
      });
      document.addEventListener('keyup', function (event) {
        pressed.delete(event.code);
      });
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