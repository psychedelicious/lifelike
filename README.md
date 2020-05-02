# Lifelike

**Online at [https://lifelike.psychedelicio.us](https://lifelike.psychedelicio.us)**

Lifelike is a cellular automata toy that can model the late John Conway's famous [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), as well as any ["Life-like" cellular automaton](https://en.wikipedia.org/wiki/Life-like_cellular_automaton).

The app is built using React with Chakra UI and uses HTML Canvas to render the grid. It's the CA browser toy I've always wanted.

- [Features](#features)
- [Guide](#guide)
  - [Main Controls](#main-controls)
  - [Rule & Neighborhood](#rule---neighborhood)
  - [Drawing](#drawing)
  - [Bookmarks](#bookmarks)
  - [Grid & Cell Size](#grid---cell-size)
  - [Options](#options)
  - [Image & Video Recording](#image---video-recording)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tips](#tips)
  - [Some interesting rules](#some-interesting-rules)
- [Roadmap](#roadmap)
- [Design Decisions](#design-decisions)

## Features

- Supports any [totalistic rule](https://www.conwaylife.com/wiki/Totalistic_Life-like_cellular_automaton)
- [Moore, von Neumann and hexagonal neighborhoods](https://www.conwaylife.com/wiki/Cellular_automaton#Common_dimensions_and_neighborhoods)
- Basic drawing functionality
- Edge-wrapping (or not)
- Play with most options while the automaton is running (except grid and cell size)
- Save automaton state as image or record video of automaton
- Bookmark automaton states for safe experimentation
- Save bookmarks between reloads
- Mobile-friendly

## Guide

### Main Controls

Just below the header are the main controls for the automaton:

- Start/stop automaton
- Tick/iterate once
- Speed up and slow down the automaton (via the delay between iterations):
  - Minimum speed = delay of 1 second
  - Maximum speed = no delay => as fast as your computer can go, limited by CPU and browser framerate - usually maxing at 60fps
  - Chromium browsers and Safari seem to do run noticeably faster than Firefox and manage garbage collection better, reducing stutters.

There is a toggle button for Translate mode:

- In translate mode, can click and drag the grid totranslate it. You can translate while the automatonis running.
- When wrapping is enabled, the grid wraps aroundthe edges as you'd expect.
- **When wrapping is not enabled, the grid iscropped!**
- Translate mode over-rides drawing mode.
- Use the arrow keys to move one cell at a time, or hold shift and use arrow keys to move 10 cells at a time.

And one for Drawing mode (see Drawing section below).

### Rule & Neighborhood

These controls do what you'd expect. You can change them while the automaton is running.

- Set born rule (if a cell is dead and has X neighbors, it will be born)
- Set survive rule (if a cell is alive and _doesn't have_ X neighbors, it will die)
- Set neighborhood

### Drawing

In draw mode, click / drag to draw on the canvas.

Hold Alt or Option while drawing to erase (or draw if in erase mode).

Hold Shift while clicking to draw (or erase) a line using the current brush, from the last place you clicked to where you just clicked.

- Change brush shape
- Change brush fill type
  - Spray randomizes each time the radius is changed
- Change brush radius
- Toggle erase mode
- Toggle crosshairs (helps with exact drawing)

### Bookmarks

- A bookmark is a snapshot of the current automaton's state, including the rule, neighborhood, cells, grid size, etc.
- Loading a bookmark will overwrite the current state.
- Bookmarks can be renamed.
- Bookmarks are saved between app reloads. They use localstorage, so they will only last for 7 days on Safari, but should last forever (?) on Chrome & FF.

### Grid & Cell Size

Changes to the grid width and height (measured in cells) occur from the top left corner. So, if you increase the width or height, it will expand toward the right or downwards.

Changes to cell size (measured in pixels) does not change the width and height.

When you fit the grid to window...

- ...if grid is smaller than the available space, it will expand to fill the available space.
- ...if grid is larger than the available space, it will be **cropped** to fit, from upper-left corner.

### Options

- Gridlines are included in saved images, but not saved videos
- Edge wrapping means opposite edges of the grid behave as if they are connected, like a torus.
- Toggle HUD (info overlay)
- Toggle pause on stable state
  - If the current state is identical to the previous, pauses the automaton
- Draw only changed cells
  - Alternate algorithm and drawing method. May be faster in some specific situations, worth trying if the app is running slowly.

### Image & Video Recording

You can save an image of the current grid at any time by clicking the image icon at the top of the page. Images include the gridlines if they are enabled.

Video recording can be started and stopped by clicking the video camera icon at the top of the page. It will turn into a red circle while recording. Whatever you do or see will be recorded in real time, but you won't get the gridlines or see the drawing/HUD overlays.

When you click the red circle to stop, a recording will be immediately downloaded in webm format.

You will not be able to seek in the webm file but can convert it to mp4 using ffmpeg to fix this:

`ffmpeg -i lifelike_ti2cn9wiz.webm -c:v libx264 lifelike_ti2cn9wiz.mp4`

Note that if your grid has an odd width or height _in pixels_, the encoding to mp4 will fail. You can use a different pixel format to get around this:

`ffmpeg -i lifelike_vrmf5aach.webm -c:v libx264 -pix_fmt yuv444p lifelike_vrmf5aach.mp4`

However, the resultant file will not be as compatible with media players as the default pixel format (which is yuv420p). Best to ensure you set up the grid to result in even pixel dimensions for best compatibility.

You can start and stop recording at any time.

You'll get the best quality on Chrome as it supports the VP9 codec (maybe Brave and new Edge also support it?). Firefox only supports the older VP8 codec and quality is not quite as great, but it still works. Video recording is not available on Safari at all.

## Keyboard Shortcuts

|                   key | action                                                                              |
| --------------------: | ----------------------------------------------------------------------------------- |
|              spacebar | run/stop the automaton                                                              |
|                 right | tick automaton once                                                                 |
|                     c | clear all cells                                                                     |
|                     r | randomize all cells                                                                 |
|                     f | fit cells to window                                                                 |
|              up, down | speed up/down                                                                       |
|                     m | set neighborhood to moore                                                           |
|                     n | set neighborhood to von neumann                                                     |
|                     b | set neighborhood to hexagonal                                                       |
|                     w | toggle edge wrapping                                                                |
|                     g | toggle gridlines                                                                    |
|                     h | toggle HUD                                                                          |
|                     d | toggle draw mode                                                                    |
|                     t | toggle translate mode                                                               |
| up, down, left, right | translate grid by 1 cell (translate mode only, hold shift to translate by 10 cells) |

## Tips

- Some rules look uninterestingly chaotic when starting from a random initial state. Try clearing the grid, drawing something less random (like a square) and then let the automaton run.
- To get some cool symmetry going without drawing anything:
  - Clear the grid
  - Disable edge-wrapping
  - Set the rule to born 0 and at least:
    - for Moore: survive 3, 5 or 8
    - for von Neumann: survive 2, 3 or 4
    - for Hexagonal: survive 3, 4 or 6
  - Because cells beyond the edges are counted as dead, you get interesting growth from the outer edges/corners growing inwards.
- Sometimes a pattern becomes chaotic because the grid height or width is even or odd or perhaps not a multiple of a certain number. Try rule B1/S1, starting with a single living cell, with wrapping, with any neighborhood. Try with width and height even and odd to see how this can affect the automaton.
- Changing the rule and neighborhood while the automaton is running can lead to some really cool effects, but it is easy to destroy an otherwise interesting grid. Save a bookmark before experimenting!

### Some interesting rules

- Hexagonal B0/S1235
  - From a clear grid, with edge wrapping off, crystals grow inward.
  - From a grid with a single cell or symmetrical drawing in the center of the grid, very orderly crystals grow outward.
- von Neumann B24/S23
  - Tries to stabilize as morphing rectangles
  - Try from a random grid, from clear grid while drawing, or from a single square
- von Neumann B24/S234
  - Similar to the above rule, but less morph-y and more fill-y

## Roadmap

- Better drawing
  - Limited undo
  - More brushes (e.g. glider brush)
- Share grid states via link (depends on if I can compress the grid state to something reasonable)
- Add pause and resume to video recording controls
- Experiment with other algorithms, rendering techniques, and parallel processing via webworkers or something like GPU.js
- Hexagonal grid
- Non-totalistic rules
- Mirror mode (grid is mirrored horizontally / vertically, mirrored drawing)

## Design Decisions

This is my first venture outside the React tutorial world, and my second non-trivial javascript app. If you take the time to review the code, I would love to hear critical feedback.

### React, Chakra UI and Canvas

I want to learn React and JSX makes sense to me. I tried Vue, but couldn't really wrap my head around it. I hope to eventually be employed as a front-end developer, and React is a good place to start for that.

Chakra UI's components are aesthetically pleasing and accessible out of the box. Really nice styling via styled-system, kinda like TailwindCSS utility classes.

Canvas (without a library) because I wanted the best performance possible without coding everything in a WebGL shader - that's still black magic to me.

### Design

#### State management

The automaton's state is a 2D array of 1's and 0's - one int for each cell. The grid can be fairly large, containing 1 million+ cells! The algorithm in use currently is naive and checks each cell's 8 neighbors. This means 8 array reads per cell per iteration. The numbers get big really quickly.

There are other algorithms that I plan to explore that need fewer array reads, like Tony Finch's ListLife. I will explore those in the future.

I explored simple React state with `useState()`, `useReducer()`, `useReducer()` bundled up with Context, the new Redux Toolkit, and finally plain Redux.

`useState()` and `useReducer()` were performant but made handling multiple user inputs from several components affecting the automaton's cells very tricky. I couldn't figure out a way to do it without having performance issues and incredibly ugly code.

Redux Toolkit was really nice to use but its use of immer behind the scenes made it too slow to read and write potentially 1 million+ cells each iteration. Performance was unacceptable.

Plain Redux solved all of these issues. It is fast and allowed for the various user inputs to modify state far more simply.

#### Drawing to canvas

Immediately, I ran into some difficulties making React work well with Canvas, perhaps due to my inexperience. I played with PIXI.js and Fabric but ultimately they were too slow to handle the hundreds of thousands of calls to `fillRect()` 60 times per second. Using canvas directly was noticeably faster. The extra microseconds related to the abstraction of these libraries added up.

The cells are iterated using `requestAnimationFrame()` and then `useEffect()` handles the drawing. Amazingly, this works quite well.

I briefly explored using typed arrays, Canvas direct drawing methods and scaling to draw the grid, but didn't get any signficant improvements, and it made my brain hurt, so I reverted to using `fillRect()`.

To improve performance, the gridlines are drawn to a separate transparent Canvas element, as is the drawing overlay.

#### Reducing re-renders

Because every re-render's performance hit is multiplied by the framerate during animation, I memoized all components and used `useCallback()` very often.

#### Other challenges

The drawing features needed _aliased_ shapes. I had trouble creating my own algorithms to generate circles and arbitrary lines that were a single pixel thick. I ended up porting some algorithms from stackoverflow to javascript to draw things prettily. Geometry becomes more difficult when you are working in the pixel-y world and not the ideal math world.

I wasn't sure how to deploy the site, but had heard that Netlify was a joy to use so I gave it a whirl. Wow. Closest thing to real magic I have experience in some time. Needless to say, the app is deployed on Netlify now.

As nice as Chakra UI is, I had some challenges with theming things due to the lack of an included way to change themes and colors. I ended up with a hacky way to provide the Chakra `ThemeProvider` component with my own colors and such on the fly. It works fine but feels wrong.

Redux made implementing bookmarks a total breeze, and redux-persist made implementing persistance literally a 15 minute job.
