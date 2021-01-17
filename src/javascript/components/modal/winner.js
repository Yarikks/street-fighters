import { showModal } from "./modal";
import { createFighterPreview} from '../fighterPreview'

export function showWinnerModal(fighter) {
  let modalData = {
    title: `Winner is ${fighter.name} !🥳🥳🥳`,
    bodyElement: createFighterPreview(fighter, 'right'),
  }
  showModal(modalData);
}
