// Trainer-Inhalte sind mit den alten Räumen AP1/AP2/WISO beschriftet. Nach dem Umbau gibt es statt AP2 die Räume
// PB1 und PB2; was für AP2 gedacht war, gilt in beiden (die Stichpunkte entscheiden, wo ein Trainer erscheint).
export const istAp2 = (raum) => raum === 'AP2' || raum === 'PB1' || raum === 'PB2';
export const passtRaum = (liste, raum) => !liste || liste.includes(raum) || (istAp2(raum) && liste.includes('AP2'));
