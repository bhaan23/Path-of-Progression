const eventTriggers = {
	'area': {
		'Act 1': {
			"the twilight strand": "The Twilight Strand",
			"lioneye's watch": "Lioneye's Watch",
			"the coast": "The Coast",
			"the tidal island": "The Tidal Island",
			"the mud flats": "The Mud Flats",
			"the fetid pool": "The Fetid Pool",
			"the submerged passage": "The Submerged Passage",
			"the flooded depths": "The Flooded Depths",
			"the ledge": "The Ledge",
			"the climb": "The Climb",
			"the lower prison": "The Lower Prison",
			"the upper prison": "The Upper Prison",
			"prisoner's gate": "Prisoner's Gate",
			"the ship graveyard": "The Ship Graveyard",
			"the ship graveyard cave": "The Ship Graveyard Cave",
			"the cavern of wrath": "The Cavern of Wrath",
			"the cavern of anger": "The Cavern of Anger",
		},
		'Act 2': {
			"the southern forest": "The Southern Forest",
			"the forest encampment": "The Forest Encampment",
			"the old fields": "The Old Fields",
			"the den": "The Den",
			"the riverways": "The Riverways",
			"the crossroads": "The Crossroads",
			"the broken bridge": "The Broken Bridge",
			"the chamber of sins level 1": "The Chamber of Sins Level 1",
			"the chamber of sins level 2": "The Chamber of Sins Level 2",
			"the fellshrine ruins": "The Fellshrine Ruins",
			"the crypt level 1": "The Crypt Level 1",
			"the crypt level 2": "The Crypt Level 2",
			"the western forest": "The Western Forest",
			"the weaver's chambers": "The Weaver's Chambers",
			"the wetlands": "The Wetlands",
			"the vaal ruins": "The Vaal Ruins",
			"northern forest": "Northern Forest",
			"the dread thicket": "The Dread Thicket",
			"the caverns": "The Caverns",
			"the ancient pyramid": "The Ancient Pyramid",
		},
		'Act 3': {
			"the city of sarn": "The City of Sarn",
			"the sarn encampment": "The Sarn Encampment",
			"the slums": "The Slums",
			"the crematorium": "The Crematorium",
			"the sewers": "The Sewers",
			"the marketplace": "The Marketplace",
			"the ebony barracks": "The Ebony Barracks",
			"the catacombs": "The Catacombs",
			"the battlefront": "The Battlefront",
			"the lunaris temple level 1": "The Lunaris Temple Level 1",
			"the lunaris temple level 2": "The Lunaris Temple Level 2",
			"the solaris temple level 1": "The Solaris Temple Level 1",
			"the solaris temple level 2": "The Solaris Temple Level 2",
			"the docks": "The Docks",
			"the imperial gardens": "The Imperial Gardens",
			"the library": "The Library",
			"the archives": "The Archives",
			"the sceptre of god": "The Sceptre of God",
			"the upper sceptre of god": "The Upper Sceptre of God",
		},
		'Act 4': {
			"the aqueduct": "The Aqueduct",
			"highgate": "Highgate",
			"the dried lake": "The Dried Lake",
			"the mines level 1": "The Mines Level 1",
			"the mines level 2": "The Mines Level 2",
			"the crystal veins": "The Crystal Veins",
			"daresso's dream": "Daresso's Dream",
			"kaom's dream": "Kaom's Dream",
			"the grand arena": "The Grand Arena",
			"kaom's stronghold": "Kaom's Stronghold",
			"the belly of the beast level 1": "The Belly of the Beast Level 1",
			"the belly of the beast level 2": "The Belly of the Beast Level 2",
			"the harvest": "The Harvest",
			"the ascent": "The Ascent",
		},
		'Act 5': {
			"the slave pens": "The Slave Pens",
			"overseer's tower": "Overseer's Tower",
			"the control blocks": "The Control Blocks",
			"oriath square": "Oriath Square",
			"the templar courts": "The Templar Courts",
			"the chamber of innocence": "The Chamber of Innocence",
			"the torched courts": "The Torched Courts",
			"the ruined square": "The Ruined Square",
			"the cathedral rooftop": "The Cathedral Rooftop",
			"the reliquary": "The Reliquary",
			"the ossuary": "The Ossuary",
		},
		'Act 6': {
			"the twilight strand": "The Twilight Strand",
			"lioneye's watch": "Lioneye's Watch",
			"the coast": "The Coast",
			"the tidal island": "The Tidal Island",
			"the mud flats": "The Mud Flats",
			"the karui fortress": "The Karui Fortress",
			"the ridge": "The Ridge",
			"the lower prison": "The Lower Prison",
			"shavronne's tower": "Shavronne's Tower",
			"prisoner's gate": "Prisoner's Gate",
			"the western forest": "The Western Forest",
			"the riverways": "The Riverways",
			"the wetlands": "The Wetlands",
			"the southern forest": "The Southern Forest",
			"the cavern of anger": "The Cavern of Anger",
			"the beacon": "The Beacon",
			"the brine king's reef": "The Brine King's Reef",
		},
		'Act 7': {
			"the bridge encampment": "The Bridge Encampment",
			"the broken bridge": "The Broken Bridge",
			"the crossroads": "The Crossroads",
			"the fellshrine ruins": "The Fellshrine Ruins",
			"the crypt": "The Crypt",
			"the chamber of sins level 1": "The Chamber of Sins Level 1",
			"maligaro's sanctum": "Maligaro's Sanctum",
			"the chamber of sins level 2": "The Chamber of Sins Level 2",
			"the den": "The Den",
			"the ashen fields": "The Ashen Fields",
			"the northern forest": "The Northern Forest",
			"the dread thicket": "The Dread Thicket",
			"the causeway": "The Causeway",
			"the vaal city": "The Vaal City",
			"the temple of decay level 1": "The Temple of Decay Level 1",
			"the temple of decay level 2": "The Temple of Decay Level 2",
		},
		'Act 8': {
			"the sarn ramparts": "The Sarn Ramparts",
			"the sarn encampment": "The Sarn Encampment",
			"the toxic conduits": "The Toxic Conduits",
			"doedre's cesspool": "Doedre's Cesspool",
			"the grand promenade": "The Grand Promenade",
			"the quay": "The Quay",
			"the grain gate": "The Grain Gate",
			"the bath house": "The Bath House",
			"the high gardens": "The High Gardens",
			"the imperial fields": "The Imperial Fields",
			"the lunaris concourse": "The Lunaris Concourse",
			"the solaris temple level 1": "The Solaris Temple Level 1",
			"the solaris temple level 2": "The Solaris Temple Level 2",
			"the solaris concourse": "The Solaris Concourse",
			"the lunaris temple level 1": "The Lunaris Temple Level 1",
			"the lunaris temple level 2": "The Lunaris Temple Level 2",
			"the harbour bridge": "The Harbour Bridge",
		},
		'Act 9': {
			"the blood aqueduct": "The Blood Aqueduct",
			"highgate": "Highgate",
			"the descent": "The Descent",
			"the vastiri desert": "The Vastiri Desert",
			"the oasis": "The Oasis",
			"the foothills": "The Foothills",
			"the boiling lake": "The Boiling Lake",
			"the tunnel": "The Tunnel",
			"the quarry": "The Quarry",
			"the refinery": "The Refinery",
			"the belly of the beast": "The Belly of the Beast",
			"the rotting core": "The Rotting Core",
		},
		'Act 10': {
			"oriath docks": "Oriath Docks",
			"the cathedral rooftop": "The Cathedral Rooftop",
			"the ravaged square": "The Ravaged Square",
			"the ossuary": "The Ossuary",
			"the torched courts": "The Torched Courts",
			"the desecrated chambers": "The Desecrated Chambers",
			"the reliquary": "The Reliquary",
			"the control blocks": "The Control Blocks",
			"the canals": "The Canals",
			"the feeding trough": "The Feeding Trough",
		},
		'Epilogue': {
			"oriath": "Oriath",
			"the templar laboratory": "The Templar Laboratory",
		}
	},
	'level': {
		"2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", "10": "10",
		"11": "11", "12": "12", "13": "13", "14": "14", "15": "15", "16": "16", "17": "17", "18": "18", "19": "19", "20": "20",
		"21": "21", "22": "22", "23": "23", "24": "24", "25": "25", "26": "26", "27": "27", "28": "28", "29": "29", "30": "30",
		"31": "31", "32": "32", "33": "33", "34": "34", "35": "35", "36": "36", "37": "37", "38": "38", "39": "39", "40": "40",
		"41": "41", "42": "42", "43": "43", "44": "44", "45": "45", "46": "46", "47": "47", "48": "48", "49": "49", "50": "50",
		"51": "51", "52": "52", "53": "53", "54": "54", "55": "55", "56": "56", "57": "57", "58": "58", "59": "59", "60": "60",
		"61": "61", "62": "62", "63": "63", "64": "64", "65": "65", "66": "66", "67": "67", "68": "68", "69": "69", "70": "70",
		"71": "71", "72": "72", "73": "73", "74": "74", "75": "75", "76": "76", "77": "77", "78": "78", "79": "79", "80": "80",
		"81": "81", "82": "82", "83": "83", "84": "84", "85": "85", "86": "86", "87": "87", "88": "88", "89": "89", "90": "90",
		"91": "91", "92": "92", "93": "93", "94": "94", "95": "95", "96": "96", "97": "97", "98": "98", "99": "99", "100": "100"
	},
	// 'kill': {
	// 	'Kitava': {
	// 		'act5': "You have been permanently weakened by Kitava's cruel affliction. You now have -30% to all Resistances",
	// 		'act10': "You have been permanently weakened by Kitava's merciless affliction. You now have a total of -60% to all Resistances.",
	// 	}
	// },
	'gems': {
		'Active Skill Gems': {
			"abyssal cry": "Abyssal Cry",
			"ancestral protector": "Ancestral Protector",
			"ancestral warchief": "Ancestral Warchief",
			"anger": "Anger",
			"animate guardian": "Animate Guardian",
			"animate weapon": "Animate Weapon",
			"arc": "Arc",
			"arctic armour": "Arctic Armour",
			"arctic breath": "Arctic Breath",
			"armageddon brand": "Armageddon Brand",
			"assassin's mark": "Assassin's Mark",
			"ball lightning": "Ball Lightning",
			"barrage": "Barrage",
			"bear trap": "Bear Trap",
			"blade flurry": "Blade Flurry",
			"blade vortex": "Blade Vortex",
			"bladefall": "Bladefall",
			"blast rain": "Blast Rain",
			"blight": "Blight",
			"blink arrow": "Blink Arrow",
			"blood rage": "Blood Rage",
			"bodyswap": "Bodyswap",
			"bone offering": "Bone Offering",
			"brand recall": "Brand Recall",
			"burning arrow": "Burning Arrow",
			"caustic arrow": "Caustic Arrow",
			"charged dash": "Charged Dash",
			"clarity": "Clarity",
			"cleave": "Cleave",
			"cold snap": "Cold Snap",
			"conductivity": "Conductivity",
			"consecrated path": "Consecrated Path",
			"contagion": "Contagion",
			"conversion trap": "Conversion Trap",
			"convocation": "Convocation",
			"cremation": "Cremation",
			"cyclone": "Cyclone",
			"dark pact": "Dark Pact",
			"decoy totem": "Decoy Totem",
			"desecrate": "Desecrate",
			"despair": "Despair",
			"determination": "Determination",
			"detonate dead": "Detonate Dead",
			"detonate mines": "Detonate Mines",
			"devouring totem": "Devouring Totem",
			"discharge": "Discharge",
			"discipline": "Discipline",
			"dominating blow": "Dominating Blow",
			"double strike": "Double Strike",
			"dread banner": "Dread Banner",
			"dual strike": "Dual Strike",
			"earthquake": "Earthquake",
			"elemental hit": "Elemental Hit",
			"elemental weakness": "Elemental Weakness",
			"enduring cry": "Enduring Cry",
			"enfeeble": "Enfeeble",
			"essence drain": "Essence Drain",
			"ethereal knives": "Ethereal Knives",
			"explosive arrow": "Explosive Arrow",
			"explosive trap": "Explosive Trap",
			"fire nova mine": "Fire Nova Mine",
			"fire trap": "Fire Trap",
			"fireball": "Fireball",
			"firestorm": "Firestorm",
			"flame dash": "Flame Dash",
			"flame surge": "Flame Surge",
			"flame totem": "Flame Totem",
			"flameblast": "Flameblast",
			"flamethrower trap": "Flamethrower Trap",
			"flammability": "Flammability",
			"flesh offering": "Flesh Offering",
			"flicker strike": "Flicker Strike",
			"freeze mine": "Freeze Mine",
			"frenzy": "Frenzy",
			"frost blades": "Frost Blades",
			"frost bomb": "Frost Bomb",
			"frostbite": "Frostbite",
			"frostbolt": "Frostbolt",
			"glacial cascade": "Glacial Cascade",
			"glacial hammer": "Glacial Hammer",
			"grace": "Grace",
			"ground slam": "Ground Slam",
			"haste": "Haste",
			"hatred": "Hatred",
			"heavy strike": "Heavy Strike",
			"herald of agony": "Herald of Agony",
			"herald of ash": "Herald of Ash",
			"herald of ice": "Herald of Ice",
			"herald of purity": "Herald of Purity",
			"herald of thunder": "Herald of Thunder",
			"ice crash": "Ice Crash",
			"ice nova": "Ice Nova",
			"ice shot": "Ice Shot",
			"ice spear": "Ice Spear",
			"ice trap": "Ice Trap",
			"immortal call": "Immortal Call",
			"incinerate": "Incinerate",
			"infernal blow": "Infernal Blow",
			"kinetic blast": "Kinetic Blast",
			"lacerate": "Lacerate",
			"lancing steel": "Lancing Steel",
			"leap slam": "Leap Slam",
			"lightning arrow": "Lightning Arrow",
			"lightning spire trap": "Lightning Spire Trap",
			"lightning strike": "Lightning Strike",
			"lightning tendrils": "Lightning Tendrils",
			"lightning trap": "Lightning Trap",
			"lightning warp": "Lightning Warp",
			"magma orb": "Magma Orb",
			"mirror arrow": "Mirror Arrow",
			"molten shell": "Molten Shell",
			"molten strike": "Molten Strike",
			"orb of storms": "Orb of Storms",
			"poacher's mark": "Poacher's Mark",
			"portal": "Portal",
			"power siphon": "Power Siphon",
			"projectile weakness": "Projectile Weakness",
			"puncture": "Puncture",
			"punishment": "Punishment",
			"purity of elements": "Purity of Elements",
			"purity of fire": "Purity of Fire",
			"purity of ice": "Purity of Ice",
			"purity of lightning": "Purity of Lightning",
			"rain of arrows": "Rain of Arrows",
			"raise spectre": "Raise Spectre",
			"raise zombie": "Raise Zombie",
			"rallying cry": "Rallying Cry",
			"reave": "Reave",
			"reckoning": "Reckoning",
			"rejuvenation totem": "Rejuvenation Totem",
			"righteous fire": "Righteous Fire",
			"riposte": "Riposte",
			"scorching ray": "Scorching Ray",
			"scourge arrow": "Scourge Arrow",
			"searing bond": "Searing Bond",
			"seismic trap": "Seismic Trap",
			"shattering steel": "Shattering Steel",
			"shield charge": "Shield Charge",
			"shockwave totem": "Shockwave Totem",
			"shrapnel shot": "Shrapnel Shot",
			"siege ballista": "Siege Ballista",
			"siphoning trap": "Siphoning Trap",
			"smite": "Smite",
			"smoke mine": "Smoke Mine",
			"spark": "Spark",
			"spectral shield throw": "Spectral Shield Throw",
			"spectral throw": "Spectral Throw",
			"spirit offering": "Spirit Offering",
			"split arrow": "Split Arrow",
			"static strike": "Static Strike",
			"storm brand": "Storm Brand",
			"storm burst": "Storm Burst",
			"storm call": "Storm Call",
			"summon chaos golem": "Summon Chaos Golem",
			"summon flame golem": "Summon Flame Golem",
			"summon holy relic": "Summon Holy Relic",
			"summon ice golem": "Summon Ice Golem",
			"summon lightning golem": "Summon Lightning Golem",
			"summon raging spirit": "Summon Raging Spirit",
			"summon skeleton": "Summon Skeleton",
			"summon stone golem": "Summon Stone Golem",
			"sunder": "Sunder",
			"sweep": "Sweep",
			"tectonic slam": "Tectonic Slam",
			"tempest shield": "Tempest Shield",
			"temporal chains": "Temporal Chains",
			"tornado shot": "Tornado Shot",
			"toxic rain": "Toxic Rain",
			"unearth": "Unearth",
			"vengeance": "Vengeance",
			"vigilant strike": "Vigilant Strike",
			"vitality": "Vitality",
			"volatile dead": "Volatile Dead",
			"vortex": "Vortex",
			"vulnerability": "Vulnerability",
			"war banner": "War Banner",
			"warlord's mark": "Warlord's Mark",
			"whirling blades": "Whirling Blades",
			"wild strike": "Wild Strike",
			"winter orb": "Winter Orb",
			"wither": "Wither",
			"wrath": "Wrath",
		},
		'Support Skill Gems': {
			"added chaos damage support": "Added Chaos Damage Support",
			"added cold damage support": "Added Cold Damage Support",
			"added fire damage support": "Added Fire Damage Support",
			"added lightning damage support": "Added Lightning Damage Support",
			"additional accuracy support": "Additional Accuracy Support",
			"advanced traps support": "Advanced Traps Support",
			"ancestral call support": "Ancestral Call Support",
			"arcane surge support": "Arcane Surge Support",
			"blasphemy support": "Blasphemy Support",
			"blind support": "Blind Support",
			"block chance reduction support": "Block Chance Reduction Support",
			"blood magic support": "Blood Magic Support",
			"bloodlust support": "Bloodlust Support",
			"bonechill support": "Bonechill Support",
			"brutality support": "Brutality Support",
			"burning damage support": "Burning Damage Support",
			"cast on critical strike support": "Cast On Critical Strike Support",
			"cast on death support": "Cast on Death Support",
			"cast on melee kill support": "Cast on Melee Kill Support",
			"cast when damage taken support": "Cast when Damage Taken Support",
			"cast when stunned support": "Cast when Stunned Support",
			"cast while channelling support": "Cast while Channelling Support",
			"chain support": "Chain Support",
			"chance to bleed support": "Chance to Bleed Support",
			"chance to flee support": "Chance to Flee Support",
			"charged traps support": "Charged Traps Support",
			"cluster traps support": "Cluster Traps Support",
			"cold penetration support": "Cold Penetration Support",
			"cold to fire support": "Cold to Fire Support",
			"combustion support": "Combustion Support",
			"concentrated effect support": "Concentrated Effect Support",
			"controlled destruction support": "Controlled Destruction Support",
			"culling strike support": "Culling Strike Support",
			"curse on hit support": "Curse On Hit Support",
			"damage on full life support": "Damage on Full Life Support",
			"deadly ailments support": "Deadly Ailments Support",
			"decay support": "Decay Support",
			"efficacy support": "Efficacy Support",
			"elemental damage with attacks support": "Elemental Damage with Attacks Support",
			"elemental focus support": "Elemental Focus Support",
			"elemental proliferation support": "Elemental Proliferation Support",
			"empower support": "Empower Support",
			"endurance charge on melee stun support": "Endurance Charge on Melee Stun Support",
			"enhance support": "Enhance Support",
			"enlighten support": "Enlighten Support",
			"faster attacks support": "Faster Attacks Support",
			"faster casting support": "Faster Casting Support",
			"faster projectiles support": "Faster Projectiles Support",
			"fire penetration support": "Fire Penetration Support",
			"fork support": "Fork Support",
			"fortify support": "Fortify Support",
			"generosity support": "Generosity Support",
			"greater multiple projectiles support": "Greater Multiple Projectiles Support",
			"hypothermia support": "Hypothermia Support",
			"ice bite support": "Ice Bite Support",
			"ignite proliferation support": "Ignite Proliferation Support",
			"immolate support": "Immolate Support",
			"increased area of effect support": "Increased Area of Effect Support",
			"increased critical damage support": "Increased Critical Damage Support",
			"increased critical strikes support": "Increased Critical Strikes Support",
			"increased duration support": "Increased Duration Support",
			"innervate support": "Innervate Support",
			"iron grip support": "Iron Grip Support",
			"iron will support": "Iron Will Support",
			"item rarity support": "Item Rarity Support",
			"knockback support": "Knockback Support",
			"less duration support": "Less Duration Support",
			"lesser multiple projectiles support": "Lesser Multiple Projectiles Support",
			"lesser poison support": "Lesser Poison Support",
			"life gain on hit support": "Life Gain on Hit Support",
			"life leech support": "Life Leech Support",
			"lightning penetration support": "Lightning Penetration Support",
			"maim support": "Maim Support",
			"mana leech support": "Mana Leech Support",
			"melee physical damage support": "Melee Physical Damage Support",
			"melee splash support": "Melee Splash Support",
			"minefield support": "Minefield Support",
			"minion and totem elemental resistance support": "Minion and Totem Elemental Resistance Support",
			"minion damage support": "Minion Damage Support",
			"minion life support": "Minion Life Support",
			"minion speed support": "Minion Speed Support",
			"mirage archer support": "Mirage Archer Support",
			"multiple totems support": "Multiple Totems Support",
			"multiple traps support": "Multiple Traps Support",
			"multistrike support": "Multistrike Support",
			"onslaught support": "Onslaught Support",
			"physical to lightning support": "Physical to Lightning Support",
			"pierce support": "Pierce Support",
			"point blank support": "Point Blank Support",
			"poison support": "Poison Support",
			"power charge on critical support": "Power Charge On Critical Support",
			"ranged attack totem support": "Ranged Attack Totem Support",
			"reduced mana support": "Reduced Mana Support",
			"remote mine support": "Remote Mine Support",
			"ruthless support": "Ruthless Support",
			"slower projectiles support": "Slower Projectiles Support",
			"spell cascade support": "Spell Cascade Support",
			"spell echo support": "Spell Echo Support",
			"spell totem support": "Spell Totem Support",
			"storm barrier support": "Storm Barrier Support",
			"stun support": "Stun Support",
			"summon phantasm on kill support": "Summon Phantasm on Kill Support",
			"swift affliction support": "Swift Affliction Support",
			"trap and mine damage support": "Trap and Mine Damage Support",
			"trap support": "Trap Support",
			"unbound ailments support": "Unbound Ailments Support",
			"vicious projectiles support": "Vicious Projectiles Support",
			"vile toxins support": "Vile Toxins Support",
			"void manipulation support": "Void Manipulation Support",
			"volley support": "Volley Support",
			"withering touch support": "Withering Touch Support",
		}
	},
	'item': {
		'amulet': 'Amulet',
		'belt': 'Belt',
		'bodyArmour': 'Body Armour',
		'boots': 'Boots',
		'flask': 'Flask',
		'gloves': 'Gloves',
		'helm': 'Helm',
		'ring': 'Ring',
		'weapon': 'Weapon',
		'offhand': 'Offhand'
	}
};

export default eventTriggers;