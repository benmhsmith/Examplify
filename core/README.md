# Provo core (planned)

This folder will hold the parts every Provo exam tool shares:

- the module and stage layout, progress saving, and the Reset and Prestige flow
- module ranks (Beginner to Grandmaster), badges, and the mastery rules
- the question engine (multiple choice, timers, mini-exams, PBQ framework)
- the Joplin plugin wrapper and the build and release scripts
- the theme, fonts, and the Desktop/Mobile layout switch

Right now all of that lives inside the Network+ tool (`certs/network-plus/src/provo-network-plus.html`). It will move here when work starts on the second exam, so that the second exam shows which parts truly need to be shared. Until then, `certs/network-plus/` is the reference implementation.
