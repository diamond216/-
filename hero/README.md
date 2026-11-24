# Hamster Nest hero + header

A standalone page with only the Hamster Nest header (logo, Browse / About / Contact, sound switch, language switch, Sign in) and the hero (slide carousel with background video, the RE//SLASH slide, dots, pause, arrows). Thai and English, with the reduced-motion behaviour of the full site.

## Open it

The page loads an ES module and video, so serve the folder over HTTP (opening `index.html` from disk will not work):

```
cd hero
npx serve .
```

or `python -m http.server 8000`, then open the printed address.

## Notes

- Browse, About, Contact, Sign in and the "Explore projects" buttons are inert placeholders (`#...-page` anchors): the pages they pointed to are not part of this page.
- Sound is off by default; the choice is kept in `localStorage` (`hamster-nest-sound`). Language is kept in `hamster-nest-lang`. `?auth=in` shows the profile icon instead of Sign in.
- With reduced motion the video stays on its poster until you press play.
- Font: IBM Plex Sans Thai Looped (SIL OFL, `assets/fonts/OFL.txt`). Popover polyfill: `@oddbird/popover-polyfill` 0.7.3 (BSD-3-Clause, `assets/vendor/popover-polyfill.LICENSE.txt`), loaded only where the browser lacks the Popover API.
