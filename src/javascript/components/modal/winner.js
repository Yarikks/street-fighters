import { showModal } from "./modal";
import { createFighterPreview} from '../fighterPreview';
import App from '../../app';

export function showWinnerModal(fighter) {
  const root = document.getElementById('root');
  let modalData = {
    title: `Winner is ${fighter.name} !🥳🥳🥳`,
    bodyElement: createFighterPreview(fighter, 'right'),
    onClose: () => {
      root.innerHTML = "";
      new App();
    }
  }
  showModal(modalData);
}
