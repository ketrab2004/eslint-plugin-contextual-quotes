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
		"const a = 'a'",
		"const a = \"word\"",
		"const a = `something ${a}`",
		"const a = \"something \\${a}\"",
		"const a = wow`no expression`",

		{
			code: "const a = '๐'",
			options: [{
				emoijAsSingleCharacter: "always"
			}]
		},
		{
			code: "const a = '๐ณ๐ฑ'",
			options: [{
				emoijAsSingleCharacter: "always"
			}]
		},
		{
			code: "const a = '๐จโ๐ฉโ๐งโ๐ฆ'",
			options: [{
				emoijAsSingleCharacter: "always"
			}]
		},
		{
			code: "const a = '๐ฉโ๐ป'",
			options: [{
				emoijAsSingleCharacter: "always"
			}]
		},

		{
			code: "const a = \"custom_escape${wowie}\"",
			options: [{
				expressionBlockEscapes: ['\\', "custom_escape"]
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
		{ code: "const a = '๐'", errors: [{ messageId: "string" }] },

		{ code: "const a = 'a ${\"aa\"}'", errors: [{ messageId: "templateLiteral" }] },
		{ code: "const a = \"a ${'a'}\"", errors: [{ messageId: "templateLiteral" }] },

		{
			code: "const a = \"wowie ${something} \\${wowie}\"",
			options: [{
				expressionBlockEscapes: ["custom_escape", '\\']
			}],
			errors: [{
				messageId: "templateLiteral",
				suggestions: [
					{ messageId: "replace" },
					{
						messageId: "escape",
						output: "const a = \"wowie custom_escape${something} \\${wowie}\""
					}
				]
			}]
		}

		// { code: "const a = ", errors: [{ messageId: "" }] }
	]
});