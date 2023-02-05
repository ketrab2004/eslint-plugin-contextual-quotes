# Contextual Quotes
[![npm](https://img.shields.io/npm/v/eslint-plugin-contextual-quotes?style=plastic)](https://www.npmjs.com/package/eslint-plugin-contextual-quotes)
[![Tests](https://github.com/ketrab2004/eslint-plugin-contextual-quotes/actions/workflows/node.js.yml/badge.svg)](https://github.com/ketrab2004/eslint-plugin-contextual-quotes/actions/workflows/node.js.yml)

Enforce the use of specific quotes based on the content of the string.

* `'` for empty strings and strings of only a single character
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
**Note**: If you have installed ESLint globally then you must also install this globally.

## Usage
Add `contextual-quotes` to the plugins section of your configuration file.
```json
// .eslintrc
{
    "plugins": [
        "contextual-quotes"
    ],
    ...
}
```

Then setup the actual rule under rules in the same configuration file.
```json
// .eslintrc
{
    ...
    "rules": {
        ...
        "contextual-quotes/contextual-quotes": "error"
    }
}
```

## Options
* `"applyFix": "never"` Whether to apply fixes
    * `"never"` Only give suggestions
    * `"always"` Always give a fix along with the suggestions
* `"expressionBlockEscapes": ["\\"]` What strings should be allowed to escape `${}` in regular strings. The first string in the list is used for the corresponding suggestion
* `"emoijAsSingleCharacter": "never"` Whether to treat emoijs and other special characters as a single character (allow to be wrapped in just `'`)
    * `"never"` Count string length in utf-16 units
    * `"always"` Count string length in visual characters

```json
// .eslintrc
{
    ...
    "rules": {
        ...
        "contextual-quotes/contextual-quotes": ["error", {
            "applyFix": "always",
            "expressionBlockEscapes": ["custom_escape", "\\"],
            "emoijAsSingleCharacter": "always"
        }]
    }
}
```
