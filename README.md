# Contextual Quotes
[![npm](https://img.shields.io/npm/v/eslint-plugin-contextual-quotes?style=plastic)](https://www.npmjs.com/package/eslint-plugin-contextual-quotes)
[![Tests](https://github.com/ketrab2004/eslint-plugin-contextual-quotes/actions/workflows/node.js.yml/badge.svg)](https://github.com/ketrab2004/eslint-plugin-contextual-quotes/actions/workflows/node.js.yml)

Enforce the use of specific quotes based on the content of the string.

* `'` for empty strings and strings with only a single character
* `"` for regular strings
* `` ` `` for strings that use string interpolation

## Installation
You'll first need to install [ESLint](https://eslint.org/):
```cmd
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-contextual-quotes`:
```cmd
$ npm install eslint-plugin-contextual-quotes --save-dev
```
**Note**: If you installed ESLint globally (using the -g flag) then you must also install `eslint-plugin-contextual-quotes` globally.

## Usage
Add `contextual-quotes` to the plugins section of your `.eslintrc` file.
```json
{
    "plugins": [
        "contextual-quotes"
    ],
    ...
}
```

Then setup the actual rule under rules in your `.eslintrc` file.
```json
{
    ...
    "rules": {
        ...
        "contextual-quotes/contextual-quotes": "error"
    }
}
```

## Options
* `"applyFix": "never"` Whether to apply fixes or give suggestions
    * `"never"` Always give a suggestions
    * `"always"` Always give a fix
* `"emoijAsSingleCharacter": "never"` Whether to treat emoijs and other special characters as a single character (allow to be wrapped in just a `'`)
    * `"never"` Count string length in utf-16 units
    * `"always"` Count string length in visual characters

```json
{
    ...
    "rules": {
        ...
        "contextual-quotes/contextual-quotes": ["error", { "applyFix": "always", "emoijAsSingleCharacter": "always" }]
    }
}
```

## Limitations
1. Won't give an error to convert a string like `"wow ${a}"` to use `` ` ``
