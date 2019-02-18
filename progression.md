# Progression Node Object
---

- `id: String`
    - The ID of the progression node used internally. This must currently be a number.
- `title: String`
    - The title of the progression node. This is what is displayed in large text at the top of each node when viewing.
- `completed: Boolean`
	- Whether or not the node is completed or not. This will update to true if you save a progression after completing nodes in the app.
- `hidden: Boolean`
	- Whether or not to hide the node when viewing the progression. This is useful for *secret* nodes such as gem or item level requirements that you don't care for seeing on the screen.
- `description: String`
	- The description of the progression node. This is what is displayed under the title in smaller text when viewing.
- `nodesNeeded: Array[String]`
	- The node ids that must be completed before **this** node can be completed.
- `completionTrigger: String`
	- The event the node waits for to be completed. This is a '|' delimeted string and has several types to choose from, [see below](#completion-triggers) for a description of each.

## Completion Triggers
- [Enter area](#enter-area)
- [Equip item](#equip-item)
- [level](#level)
- [Link gem](#link-gem)

### Enter area
Syntax: `"area|areaName"` where `areaName` is the zone name. Note that this is based on what zones are available in the Client.txt log which does not include some smaller zones that are within larger ones. If you want to confirm which zones exist, you can search for the zone name in your Client.txt file.

### Equip items
Syntax: `item|inventorySlot|modList` where `modList` is a the list of mods you are looking for, separated by commas `','` and `inventorySlot` can be any of the following:
- `amulet`
- `belt`
- `bodyArmour`
- `boots`
- `flask`
- `gloves`
- `helm`
- `ring`
- `weapon` - This is your main hand, left slotted weapon in either weapon switch
- `offhand` - This is your off hand, left slotted weapon in either weapon switch

### Level
Syntax: `level|num` where `num` is the level. Note that this cannot be `1` as there is no event for hitting level 1 in the logs.

### Link gem
Syntax: `gem|gemNames` where `gemNames` is a list of gems you want to be linked separated by commas `','`. Note that if you have one of these triggers present in your progression, you will see the gem icons as well as the gem names in the preview.