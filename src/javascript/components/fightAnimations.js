import { createElement } from '../helpers/domHelper';

export function missedAttackAnimation(position) {
    let fighterBlock = document.getElementsByClassName(`arena___fighter arena___${position}-fighter`)[0];
    const missedElement = createElement({
        tagName: 'div',
        className: 'missed-attack'
    });
    missedElement.innerText = 'Missed';
    missedElement.animate([
        { opacity: '0.5' },
        { opacity: '1' },
        { opacity: '0.5' },
    ],
        {
            duration: 300,
            iteration: 1,
        });

    fighterBlock.prepend(missedElement);

    setTimeout(() => {
        fighterBlock.removeChild(missedElement);
    }, 300);
}