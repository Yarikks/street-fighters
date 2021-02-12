import { showModal } from "./modal";
import { createFighterPreview} from '../fighterPreview';

export function showWinnerModal(fighter: FighterInfo) {
  const modalData = {
    title: `Winner is ${fighter.name} !🥳🥳🥳`,
    bodyElement: createFighterPreview(fighter, 'right'),
    onClose: () => {
      location.reload();
      return false;
    }
  }
  showModal(modalData);
}
