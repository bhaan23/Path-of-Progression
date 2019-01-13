import { eventTriggers } from "./eventTriggers.js";

// Those quests which map to null have no definite trigger for their ending.
const questCompletionTriggers = {
	"Enemy at the Gate": eventTriggers.level["1"],
	"Mercy Mission": null,
	"Breaking Some Eggs": eventTriggers.entered.act1["The Submerged Passage"],
	"A Dirty Job": eventTriggers.other["0 monsters remain"],
	"The Dweller of the Deep": null,
	"Prisoner of Fate": null,
	"The Caged Brute": eventTriggers.entered.act1["Prisoner's Gate"],
	"The Marooned Mariner": null,
	"The Siren's Cadence": eventTriggers.entered.act2["The Southern Forest"],
	"The Way Forward": null,
	"The Lord's Labyrinth": null,
	"The Great White Beast": null,
	"Intruders in Black": null,
	"Through Sacred Ground": null,
	"Sharp and Cruel": 
	"The Root of the Problem"
	"Deal with the Bandits"
	"The Bandit Lord Alira"
	"The Bandit Lord Kraityn"
	"The Bandit Lord Oak"
	"Safe and Sound"
	"Shadow of the Vaal"
	"The Lord's Labyrinth"
	"Lost in Love"
	"Victario's Secrets"
	"Sever the Right Hand"
	"Fiery Dust"
	"The Gemling Queen"
	"The Ribbon Spool"
	"A Swig of Hope"
	"A Fixture of Fate"
	"Piety's Pets"
	"Sceptre of God"
	"The Shaper"
	"The Lord's Labyrinth"
	"Breaking the Seal"
	"Niko's Fuel"
	"Niko's Mine"
	"Niko's Explosives"
	"An Indomitable Spirit"
	"The King of Fury"
	"The King of Desire"
	"Corpus Malachus"
	"The Eternal Nightmare"
	"Return to Oriath"
	"The Key to Freedom"
	"In Service to Science"
	"Death to Purity"
	"The King's Feast"
	"Kitava's Torments"
	"The Ravenous God"
	"Fallen from Grace"
	"Bestel's Epic"
	"The Father of War"
	"Essence of Umbra"
	"The Cloven One"
	"The Puppet Mistress"
	"The Brine King"
	"The Silver Locket"
	"Essence of the Artist"
	"No Time like the Present"
	"Web of Secrets"
	"The Master of a Million Faces"
	"In Memory of Greust"
	"Queen of Despair"
	"Kishara's Star"
	"Lighting the Way"
	"The Mother of Spiders"
	"Essence of the Hag"
	"Love is Dead"
	"The Gemling Legion"
	"Reflection of Terror"
	"The Wings of Vastiri"
	"Lunar Eclipse"
	"Solar Eclipse"
	"The Storm Blade"
	"Fastis Fortuna"
	"The Ruler of Highgate"
	"Queen of the Sands"
	"Recurring Nightmare"
	"Safe Passage"
	"Map to Tsoatha"
	"No Love for Old Ghosts"
	"Vilenta's Vengeance"
	"Death and Rebirth"
	"An End to Hunger"
	"From Nightmare into Dream"
	"Brave New Worlds"
	"The Hidden Architect"
	"The Memory Eater"
	"Sanity's Requiem"
	"The Eldritch Decay"
}

export default questCompletionTriggers;