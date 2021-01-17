import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  
  return new Promise((resolve) => {
    const healthIndicatorFirst = document.getElementById("left-fighter-indicator")
    const healthIndicatorSecond = document.getElementById("right-fighter-indicator")
    let healthFirstFighter = firstFighter.health
    let healthSecondFighter = secondFighter.health
    let orderToAttack = true
    let orderToCriticalHitFirst = false
    let orderToCriticalHitSecond = false

    setTimeout(()=>{orderToCriticalHitFirst=true;orderToCriticalHitSecond=true},10000)
    alert("FIGHT");

    function checkHealth(healthFirst,healthSecond){
      if (healthFirst<0){
        healthIndicatorFirst.style.width=`0%`;
        resolve(secondFighter);
      }else if(healthSecond<0){
        healthIndicatorSecond.style.width=`0%`;
        resolve(firstFighter);
      }
    }

    function changeHealthIndicator(indicator,health,fighter){
      indicator.style.width=`${health/fighter.health*100}%`
    }

    function presedKeys(func,type, ...codes) {
      let pressed = new Set();
      document.addEventListener('keydown', function(event) {
        pressed.add(event.code);
        for (let code of codes) {
          if (!pressed.has(code) || pressed.size!==codes.length) {
            return;
          }
        }
        if(pressed.has(controls.PlayerOneBlock) && pressed.has(controls.PlayerOneAttack)){
          return;
        }
        if(pressed.has(controls.PlayerTwoAttack) && pressed.has(controls.PlayerTwoBlock)){
          return;
        }
        pressed.clear();
        if (orderToAttack && type==='attack'){
          orderToAttack=false
          func();
          setTimeout(()=>{orderToAttack=true},300)
        }
        if (orderToCriticalHitFirst && type==="critHitFirst"){
          orderToCriticalHitFirst=false
          func();
          setTimeout(()=>{orderToCriticalHitFirst=true},10000)
        }
        if (orderToCriticalHitSecond && type==="critHitSecond"){
          orderToCriticalHitSecond=false
          func();
          setTimeout(()=>{orderToCriticalHitSecond=true},10000)
        }
        if (type==='blockedAttack'){func()}
        checkHealth(healthFirstFighter,healthSecondFighter)
      });
      document.addEventListener('keyup', function(event) {
        pressed.delete(event.code);
      });

    }
  //Blocked attacs
    presedKeys(()=>{
      healthFirstFighter -= getDamage(secondFighter,firstFighter);
      changeHealthIndicator(healthIndicatorFirst,healthFirstFighter,firstFighter)
    },'blockedAttack',controls.PlayerOneBlock, controls.PlayerTwoAttack)
    presedKeys(()=>{
      healthSecondFighter -= getDamage(firstFighter,secondFighter);
      changeHealthIndicator(healthIndicatorSecond,healthSecondFighter,secondFighter)
    },'blockedAttack',controls.PlayerTwoBlock, controls.PlayerOneAttack)
  //CriticalHits
    presedKeys(()=>{
      healthSecondFighter -= firstFighter.attack * 2;
      changeHealthIndicator(healthIndicatorSecond,healthSecondFighter,secondFighter)
    },'critHitFirst', ...controls.PlayerOneCriticalHitCombination)
    presedKeys(()=>{
      healthFirstFighter -= secondFighter.attack * 2;
      changeHealthIndicator(healthIndicatorFirst,healthFirstFighter,firstFighter)
    },'critHitSecond', ...controls.PlayerTwoCriticalHitCombination)
  //Attaks
    presedKeys(()=>{
      healthSecondFighter -= getHitPower(firstFighter);
      changeHealthIndicator(healthIndicatorSecond,healthSecondFighter,secondFighter)
    },'attack',controls.PlayerOneAttack)
    presedKeys(()=>{
      healthFirstFighter -= getHitPower(secondFighter);
      changeHealthIndicator(healthIndicatorFirst,healthFirstFighter,firstFighter)
    },'attack',controls.PlayerTwoAttack)
    // resolve the promise with the winner when fight is over
  });
}

export function getDamage(attacker, defender) {
    let attack = getHitPower(attacker);
    let block = getBlockPower(defender);
    if(attack<block){
      return 0
    }else{
      return attack - block
    }
  // return damage
}

export function getHitPower(fighter) {
  const criticalHitChance = (min, max) => {
    return Math.random() * (max - min) + min;
  }
  const power = fighter.attack * criticalHitChance(1,2)
  return power
  // return hit power
}

export function getBlockPower(fighter) {
  const dodgeChance = (min, max) => {
    return Math.random() * (max - min) + min;
  }
  const power = fighter.attack * dodgeChance(1,2)
  return power
  // return block power
}
