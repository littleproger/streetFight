import {showModal} from './modal'
import {createFighterImage} from '../fighterPreview'
import {createElement} from '../../helpers/domHelper'
export function showWinnerModal(fighter) {
  const title = `Winner: ${fighter.name}`
  const bodyElement = createElement({
    tagName:'div',
    className: 'modal-body'
  })
  const img = createFighterImage(fighter)
  bodyElement.append(img)
  showModal({title,bodyElement})
  // call showModal function 
}
