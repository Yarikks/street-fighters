import { createFighters } from './components/fightersView';
import { fighterService } from './services/fightersService';

class App {
  constructor() {
    this.startApp();
  }

  static rootElement = document.getElementById('root');
  static loadingElement = document.getElementById('loading-overlay');

  async startApp() {
    if(App.loadingElement && App.rootElement) {
      try {
        App.loadingElement.style.visibility = 'visible';
  
        const fighters = await fighterService.getFighters();
        const fightersElement = createFighters(fighters as FighterInfo[]);
  
        App.rootElement.appendChild(fightersElement);
      } catch (error) {
        console.warn(error);
        App.rootElement.innerText = 'Failed to load data';
      } finally {
        App.loadingElement.style.visibility = 'hidden';
      }   
    }
  }
}

export default App;
