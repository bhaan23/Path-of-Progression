import { eventTriggers } from "./eventTriggers.js";

const bossKillTriggers = {
	"Hillock": eventTriggers.level["2"],
	"Brutus": eventTriggers.entered.act1["Prisoner's Gate"],
	"Merveil, the Siren": eventTriggers.entered.act2["The Southern Forest"],
	"Vaal Oversoul": eventTriggers.entered.act3["The City of Sarn"],
	"Dominus": eventTriggers.entered.act4["The Aqueduct"],
	"Malachai, The Nightmare": eventTriggers.entered.act4["The Ascent"],
	"High Templar Avarius": eventTriggers.entered.act5["The Torched Courts"],
	"Kitava, the Insatiable (Act 5)": eventTriggers.entered.act6["Lioneye's Watch"],
	"Tsoagoth, The Brine King": eventTriggers.entered.act7["The Bridge Encampment"],
	"Arakaali, Spinner of Shadows": eventTriggers.entered.act8["The Sarn Ramparts"],
	"Solaris, Eternal Sun and Lunaris Eternal Moon": eventTriggers.entered.act9["The Blood Aqueduct"],
	"The Depraved Trinity": eventTriggers.entered.act10["Oriath Docks"],
	"Kitava, the Insatiable (Act 10)": eventTriggers.entered.epilogue["Oriath"]
}

export default bossKillTriggers;