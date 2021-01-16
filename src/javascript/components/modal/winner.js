import { showModal } from "./modal";
import {createFighterImage} from '../fighterPreview'

export function showWinnerModal(fighter) {
  let modalData = {
    title: `Winner is ${fighter.name} !🥳🥳🥳`,
    bodyElement: createFighterImage(fighter),
  }
  showModal(modalData);
}
