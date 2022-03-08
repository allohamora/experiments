# smooth-scroll experiment 31.07.21, 08.03.22

## goals:

1. [x] create smooth-scroll
2. [x] check scroll-behavior: smooth
3. [x] check window.scrollTo({ behavior: 'smooth' })
4. [x] check window.scrollTo({ behavior: 'smooth' }) polyfill
5. [x] stop scroll on wheel and touchstart

## my smooth-scroll

1. [x] vertical scroll
2. [x] horizontal scroll
3. [x] vertical + horizontal scroll
4. [x] easy function support

## scroll-behavior: smooth

1. body { scroll-behavior: smooth; } doesn't work
2. html { scroll-behavior: smooth; } sometimes doesn't work (stop near start or near end) opera 77(chromium) in pc and dev tools mobile mode

## window.scrollTo({ behavior: 'smooth' })

1. in chrome dev tools mobile y scroll doesn't work
2. in pc mode issues doesn't found

## window.scrollTo({ behavior: 'smooth' }) polyfill

1. in chrome dev tools mobile horizontal scroll may be wrong (doesn't scroll to offsetLeft element)

## bugs

chrome devtools in mobile simulation mode (Dimensions: IPhone XR) can't x scroll. window.scrollTo, element.scrollLeft doesn't have any feedback, for fix that need switch mobile simulation mode to Dimensions: Responsive with the same mobile properties.
