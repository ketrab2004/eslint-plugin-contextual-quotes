"use strict";

const { RuleTester } = require("eslint")
const contextualQuotes = require("../../../lib/rules/contextual-quotes.js")
const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015
    }
})

ruleTester.run("contextual-quotes", contextualQuotes, {
    valid: [
        { code: "const a = 'a'" },
        { code: "const a = \"word\""},
        { code: "const a = `something ${a}`" },

        {
            code: "const a = '😎'",
            options: [{
                emoijAsSingleCharacter: "always"
            }]
        }
    ],
    invalid: [
        { code: "const a = \"a\"", errors: [{ messageId: "character" }] },
        { code: "const a = `a`", errors: [{ messageId: "character" }] },

        { code: "const a = \"\"", errors: [{ messageId: "empty" }] },
        { code: "const a = ``", errors: [{ messageId: "empty" }] },

        { code: "const a = 'aaa'", errors: [{ messageId: "string" }] },
        { code: "const a = `aaa`", errors: [{ messageId: "string" }] },
        { code: "const a = '😎'", errors: [{ messageId: "string" }] }

        // { code: "const  = ", errors: [{ messageId: "" }] }
    ]
});