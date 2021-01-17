import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });
  const infoBlock = createElement({
    tagName:'div',
    className: 'fighter-preview-info__root'
  });
  const infoList =createElement({
    tagName:'ul',
    className: 'fighter-preview-info__list'
  });
  const placeForImg =createElement({
    tagName:'div',
    className: 'fighter-preview-info_imgPlace'
  });
  const selectedInfo=["Name","Health","Attack","Defense"]
  try{
    placeForImg.append(createFighterImage(fighter));
    fighterElement.append(placeForImg)
    selectedInfo.forEach(param =>{
      const info =createElement({
        tagName:'li',
        className: 'fighter-preview-info__elem'
      });

      info.innerHTML=param+": "+fighter[param.toLowerCase()];
      infoList.appendChild(info);
    });
    infoBlock.append(infoList);
    fighterElement.append(infoBlock);
  }catch{
    null
  }
  // todo: show fighter info (image, name, health, etc.)

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
