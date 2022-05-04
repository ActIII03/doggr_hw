#Fresh Setup
- Clone this repository
- Change CLI directory to doggr/nexpress
- `npm install` -> to install packages from package.json
- `npm run dev` -> Run concurrently compilation + serving
- `curl localhost:9000` -> Make a basic Get request for testing

# VSCode Setup
- Install the following extensions:
  - Javascript and TypeScript Nightly (Microsoft)
  - Live Share (Microsoft)
  - npm  (Microsoft)
  - EsLint (Microsoft)
- Inside of File > Settings, search for "Lens" and "Inlay", enable your preferences
- Open the VSCode command bar (Ctrl Shift P)
- look for "Preferences: Open Settings (JSON)"
- Add the following to that settings file if you'd like your code to auto format on save according to the .eslintrc file
``` "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
      },
```

- Optional Install Victor Mono Italic (ONLY Italic) if you want cheesy cursive hints
- Change Inlay Hint font family in Settings to "Victor Mono"