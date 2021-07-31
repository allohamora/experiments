# smooth-scroll experiment

## goals:
1. [x] create smooth-scroll
2. [x] check scroll-behavior: smooth.
3. [x] check window.scrollTo({ behavior: 'smooth' }).

## my smooth-scroll
1. [x] vertical scroll
2. [x] horizontal scroll
3. [x] easy function support
* Maybe on mobile this doesn't work, because chrome dev tools in mobile mode shows window.pageYOffset and analogs === 0 in any state. And chrome dev tools shows torn fps when click on anchor tag.

## scroll-behavior: smooth
1. body { scroll-behavior: smooth; } doesn't work
2. html { scroll-behavior: smooth; } sometimes doesn't work (stop near start or near end) 31.07.21 opera 77(chromium) in pc and dev tools mobile mode

## window.scrollTo({ behavior: 'smooth' })
1. in chrome dev tools mobile y scroll doesn't work.
2. in pc mode issues doesn't found