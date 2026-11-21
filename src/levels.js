export const WORLDS = [
 ['Sunny Meadow','A warm breeze has scattered the meadow nectar. Bibi must restore the first blooms.'],
 ['Cherry Blossom','The cherry trees have forgotten spring. Find their pink dew drops.'],
 ['Crystal Garden','A crystal storm scattered the prism nectar across the caves.'],
 ['Rainbow Valley','The rainbow bridge has faded. Gather its seven-colour pollen.'],
 ['Midnight Garden','Moonflowers only open beneath the stars. Follow their glow.'],
 ['Autumn Forest','The woodland friends need honey before the first frost.'],
 ['Frozen Kingdom','A chilly spell trapped the flowers in sparkling ice.'],
 ['Candy Garden','A sweet-toothed beetle has hidden the sugar blossoms.'],
 ['Cloud Kingdom','Floating gardens drift above the clouds. Mind the wind!'],
 ['Enchanted Forest','A sleepy spell has covered the ancient trees.'],
 ['Tropical Paradise','A storm scattered the island pollen. Help the toucans.'],
 ['Desert Oasis','The oasis is drying. Find the rare water-lily nectar.'],
 ['Mushroom Village','The tiny mushroom folk lost their lantern spores.'],
 ['Starlight Garden','Fallen stars have taken root as glowing flowers.'],
 ['Underwater Dream','A bubble garden needs its coral blossoms returned.'],
 ['Clockwork Garden','The garden clock stopped. Collect cogs and golden nectar.'],
 ['Dragon Valley','A gentle dragon guards the warmest flowers. Earn its trust.'],
 ['Ancient Kingdom','Discover the first hive and the story of the old queen.'],
 ['Celestial Garden','The celestial flowers are fading from the night sky.'],
 ['Eternal Bloom','Bring every garden together for the final bloom festival.']
];
const names=['First Bloom','Pollen Patrol','The Winding Path','Windy Petals','Home to the Hive'];
export function getLevel(n){
 const world=Math.floor((n-1)/5), local=(n-1)%5, difficulty=1+Math.floor((n-1)/5);
 return {id:n,world:world+1,worldName:WORLDS[world][0],title:local===0?names[0]:`${names[local]} · ${n}`,story:WORLDS[world][1],difficulty,flowers:5+Math.min(5,Math.floor((n-1)/12)),platforms:5+Math.min(7,Math.floor((n-1)/10)),enemyCount:Math.min(4,Math.floor((n-1)/18)),timeLimit:0,theme:world};
}
export const LEVEL_COUNT=100;
