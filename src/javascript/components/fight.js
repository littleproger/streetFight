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
      orderToCriticalHit:false,
      critTimer:"10"
    },
    secondFighter:{
      fighterObj:secondFighter,
      player:"2",
      healthIndicator:document.getElementById("right-fighter-indicator"),
      health:secondFighter.health,
      block:false,
      orderToAttack:true,
      orderToCriticalHit:false,
      critTimer:"10"
    }
  }
  var critIndecators = createElement({
    tagName:'div',
    className: 'fight-critIndicators'
  })
  var critIndecatorFirst = createElement({
    tagName:'div',
    className: 'fight-critIndicator_first fight-critIndicator',
    attributes:{id:"critIndicator_first"}
  })
  var critIndecatorSecond = createElement({
    tagName:'div',
    className: 'fight-critIndicator_second fight-critIndicator',
    attributes:{id:"critIndicator_second"}
  })
  var root=document.getElementById('root')

  critIndecators.appendChild(critIndecatorFirst)
  critIndecators.appendChild(critIndecatorSecond)
  root.appendChild(critIndecators)

  const firstIndicator = document.getElementById("critIndicator_first")
  const secondIndicator = document.getElementById("critIndicator_second")
  // const leftFighter = 
  const rightFighter = document.getElementsByClassName("arena___right-fighter")
  
  function changeCritTime(fighter,indicator){
    setTimeout(function tick() {
      if(!fighter.orderToCriticalHit){
        fighter.critTimer-=1
        indicator.innerHTML=fighter.critTimer
        setTimeout(tick, 1000);
      }else{
        fighter.critTimer="10"
        indicator.innerHTML= "READY"
      }
    }, 1000);
  }
  function attackMove(fighter,movpxf,movpxs){
    let elem = document.getElementsByClassName(`arena___${fighter}-fighter`)[0]
    elem.style.transform = `translateX(${movpxf}px)`;
    setTimeout(()=>{
      elem.style.transform = `translateX(${movpxs}px)`;
    },200)
  }
  function critMove(fighter){
    let elem = document.getElementsByClassName(`arena___${fighter}-fighter`)[0]
    elem.classList.add(`move-${fighter}`);
    setTimeout(()=>{
      elem.classList.remove(`move-${fighter}`);
    },300)
  }
  function attackBlockMove(attacker,defender,movpxf,movpxs){
    let attackerElem = document.getElementsByClassName(`arena___${attacker}-fighter`)[0]
    let defenderElem = document.getElementsByClassName(`arena___${defender}-fighter`)[0]
    attackerElem.style.transform = `translateX(${movpxf}px)`;
    defenderElem.style.transform = `translateX(${movpxs}px)`;
    setTimeout(()=>{
      attackerElem.style.transform = `translateX(${0}px)`;
      defenderElem.style.transform = `translateX(${0}px)`;
    },200)
  }

  changeCritTime(fightInfo.firstFighter,firstIndicator)
  changeCritTime(fightInfo.secondFighter,secondIndicator)
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
        attackBlockMove("right","left",-350,-100)
        console.log("1 Blocked")
      }
      if(pressed.has(controls.PlayerTwoBlock) && pressed.has(controls.PlayerOneAttack)){
        blockedAttack(fightInfo.firstFighter,fightInfo.secondFighter)
        pressed.delete(controls.PlayerOneAttack)
        attackBlockMove("left","right",350,100)
        console.log("2 Blocked")
      }
      //CriticalHits
      if(checkPressed(pressed, ...controls.PlayerOneCriticalHitCombination) && fightInfo.firstFighter.orderToCriticalHit){
        critHit(fightInfo.firstFighter,fightInfo.secondFighter)
        changeCritTime(fightInfo.firstFighter,firstIndicator)
        critMove("left")
        console.log("1 crit")
      }
      if(checkPressed(pressed, ...controls.PlayerTwoCriticalHitCombination) && fightInfo.secondFighter.orderToCriticalHit){
        critHit(fightInfo.secondFighter, fightInfo.firstFighter)
        changeCritTime(fightInfo.secondFighter,secondIndicator)
        critMove("right")
        console.log("2 crit")
      }
      //Attaks
      if(checkAttackOrder(fightInfo.firstFighter) && checkPressed(pressed,controls.PlayerOneAttack)){
        attack(fightInfo.firstFighter,fightInfo.secondFighter);
        pressed.delete(controls.PlayerOneAttack)
        attackMove("left",350,0)
        console.log("1 attack")
      }
      if(checkAttackOrder(fightInfo.secondFighter) && checkPressed(pressed,controls.PlayerTwoAttack)){
        attack(fightInfo.secondFighter,fightInfo.firstFighter)
        pressed.delete(controls.PlayerTwoAttack)
        attackMove("right",-350,0)
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



