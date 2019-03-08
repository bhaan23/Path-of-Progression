# Path of Progression

NOTE: This will not be my focus during the beginning of the Synthesis league. However, after a month or so, I will return to this project.

A tool for Path of Exile used to aid the leveling process by tracking which zones to go to next and what gear you can equip at certain points within the leveling process.

Download the latest release at https://github.com/bhaan23/Path-of-Progression/releases/latest

Report bugs at https://github.com/bhaan23/Path-of-Progression/issues

## Table of Contents

- [Install and Setup](https://imgur.com/a/XhqyBam)
- [No trust from Windows](#no-trust-from-windows)
- [How it runs](#how-it-runs)
- [FAQs](#faqs)
- [Help us out](#help-us-out)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Install and Setup

https://imgur.com/a/XhqyBam

## No trust from Windows

We do not own a certificate to sign the application. This means that when you first download the setup .exe you will get a message saying that the app is not trusted. To bypass this simply click "More info" -> "Run anyway" and you will not see this warning again.

## How it runs

Currently the app runs with [Electron](https://electronjs.org) which lets us convert a web application to a runnable .exe

The app then takes in a progression .json file with an array of [progression nodes](https://github.com/bhaan23/Path-of-Progression/blob/master/progression.md) which will queue off of log events and items equipped to show you what to do next.

## FAQs

Q: I equipped an item, but the node isn't dissapearing. Why?
- A: To not spam GGG's servers, I have set a timeout on the call to collect character data. That timeout is 1 minute. If the issue persists it is possible the trigger to complete the node is incorrect. If not, report a bug.

Q: Why don't the lab trials in the included progression dissapear?
- A: Unfortunately, do to how GGG does their logging, things such as lab trials are not entered in log at all. You can simply know which area they are in. I included them as it is useful information while leveling on a first character in a league. But you will have to manually close out each of the nodes when you complete the trials.

## Help us out

If you would like to assist in the development you are certainly welcome. To setup the project make sure you have [npm](https://www.npmjs.com/get-npm) installed. Then in the root of the directory just run the following commands:

```
npm install
npm build
npm start
```

If you have any questions or have an idea for a new feature, contact us on our discord: https://discord.gg/Ex83XK3 and we'll be happy to help.

## Contact

Interact with us in our Discord https://discord.gg/Ex83XK3

Report bugs at https://github.com/bhaan23/Path-of-Progression/issues

## Acknowledgements

- https://github.com/klayveR for providing a log monitor to track events in the Client.txt file. It works amazingly.
- https://github.com/viktorgullmark for developing a great app in [Exilence](https://github.com/viktorgullmark/exilence). It is also built on Electron and it made things so much easier having something to go off of for all of the odd problems we ran into while in development
- GGG for making a fantastic game and allowing users to develop tools around it to help the community
