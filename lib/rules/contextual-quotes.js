"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "layout",
		docs: {
			description: "Enforce use of specific quotes based on the content of the string.",
			recommended: true,
			url: "https://github.com/ketrab2004/eslint-plugin-contextual-quotes/blob/master/README.md"
		},

		messages: {
			replace: "Replace {{a}} with {{b}}",
			escape: "Escape ${} with {{escapes}}",

			empty: "An empty string should have single quotes.",
			character: "A string with only a single character should have single quotes.",
			string: "A regular string should have double quotes.",
			templateLiteral: "A template literal should have backticks, otherwise it doesn't even work."
		},

		fixable: "code",
		hasSuggestions: true,

		schema: [
			{
				type: "object",
				properties: {
					applyFix: {
						type: "string",
						enum: ["always", "never"],
						default: "never"
					},
					expressionBlockEscapes: {
						type: "array",
						items: {
							type: "string"
						},
						default: ['\\']
					},
					emoijAsSingleCharacter: {
						type: "string",
						enum: ["always", "never"],
						default: "never"
					}
				},
				additionalProperties: false
			}
		]
	},
	/**
	 * @param {import('eslint').Rule.RuleContext} context
	 */
	create(context) {
		const options = context.options[0] ?? {}
		/** @type {string[]} */
		const expressionBlockEscapes = options.expressionBlockEscapes ?? ['\\']
		/** @type {("never"|"always")} */
		const applyFix = options.applyFix ?? "never"
		/** @type {("never"|"always")} */
		const emoijAsSingleCharacter = options.emoijAsSingleCharacter ?? "never"


		const segmenter = new Intl.Segmenter()
		/**
		 * @param {string} string
		 * @returns {number}
		 */
		function getStringLength(string) {
			return emoijAsSingleCharacter == "always"
				? Array.from(segmenter.segment(string)).length // string length with each emoij counting as a single character (https://stackoverflow.com/a/54369605)
				: string.length // utf-16 unit string length
		}

		const escapesAsRegexList = expressionBlockEscapes.map(a => `(?:${a})`.replace('\\', "\\\\")).join('|') // ['\', 'whatever'] to (?:\\)|(?:whatever)
		const escapedExpressionRegex = new RegExp(`(?<!${escapesAsRegexList})\\\${(.*?)}`, 'g');
		/**
		 * @param {string} content
		 * @returns {boolean}
		 */
		function hasExpressionBlock(content) {
			return escapedExpressionRegex.test(content)
		}

		/**
		 * @param {string[]} list
		 * @param {string} word
		 * @returns {string}
		 */
		function listOfStringsToString(list, word = "or") {
			return list
				.join(", ")
				.replace(/(, )([^,]+)$/, ` ${word} $2`)
		}

		/**
		 * @param {{
		 * node: import('eslint').Rule.Node
		 * content: string
		 * oldQuote: string
		 * newQuote: string
		 * messageId: string
		 * additionalSolutions: (undefined|(import('eslint').Rule.ReportFixer)[])
		 * }} param0
		 */
		function report({node, content, oldQuote, newQuote, messageId, additionalSolutions}) {

			// escape {newQuote}s that are already in the {content}
			content = content.replace(new RegExp(newQuote, 'g'), `\\${newQuote}`)

			/** @type {import('eslint').Rule.ReportFixer} */
			const fix = (fixer) => fixer.replaceText(node, `${newQuote}${content}${newQuote}`)

			/** @type {import('eslint').Rule.ReportDescriptor} */
			const report = {
				node: node,
				messageId: messageId,
				suggest: [
					{
						fix,
						messageId: "replace",
						data: {
							a: oldQuote,
							b: newQuote
						}
					},
					...additionalSolutions ?? []
				]
			}

			if (applyFix == "always") {
				report.fix = fix
			}

			context.report(report)
		}



		return {
			Literal(node) {
				if (typeof node.value == "string") {
					/** @type {string} */
					const raw = node.raw

					/** @type {(null|RegExpMatchArray)} */
					const result = raw.match(/^(['"])(.*)\1$/)

					if (result == null || result == undefined) {
						// ???, something went wrong?

					} else {
						/** @type {[full: string, quote: ("'"|'"'), content: string]} */
						const [full, quote, content] = result

						const contentLength = getStringLength(content)

						switch (quote) {
							case '"':
								if (contentLength == 1 && content != "'") {
									report({
										node, content,
										oldQuote: '"',
										newQuote: "'",
										messageId: "character"
									})

								} else if (contentLength < 1) {
									report({
										node, content,
										oldQuote: '"',
										newQuote: "'",
										messageId: "empty"
									})
								} else if (contentLength > 1 && hasExpressionBlock(content)) {
									report({
										node, content,
										oldQuote: '"',
										newQuote: '`',
										messageId: "templateLiteral",
										additionalSolutions: expressionBlockEscapes.length > 0 ? [{ // only add addition solutions if there is atleast one expression block escape
											fix: (fixer) => fixer.replaceText(
												node,
												full.replace(escapedExpressionRegex, `${expressionBlockEscapes[0]}\${$1}`)
											),
											messageId: "escape",
											data: {
												escapes: listOfStringsToString(expressionBlockEscapes)
											}
										}] : undefined
									})
								}
								break

							case "'":
								if (contentLength > 1) {
									if (hasExpressionBlock(content)) {
										report({
											node, content,
											oldQuote: "'",
											newQuote: '`',
											messageId: "templateLiteral",
											additionalSolutions: expressionBlockEscapes.length > 0 ? [{ // only add addition solutions if there is atleast one expression block escape
												fix: (fixer) => fixer.replaceText(
													node,
													full.replace(escapedExpressionRegex, `${expressionBlockEscapes[0]}\${$1}`)
												),
												messageId: "escape",
												data: {
													escapes: listOfStringsToString(expressionBlockEscapes)
												}
											}] : undefined
										})

									} else {
										report({
											node, content,
											oldQuote: "'",
											newQuote: '"',
											messageId: "string"
										})
									}
								}
								break

							default:
								// ???, something went wrong? (should be impossible)
								break
						}
					}
				}
			},

			TemplateLiteral(node) {
				if (node.expressions.length <= 0) {
					// every quasis is a block
					// so for example in `a ${"wow"} b` the blocks are ["a ", "", " b"] with the literal "wow" as the only expression
					// no ${} (expressions) means that there must be only a single block
					const content = node.quasis[0].value.raw
					const contentLength = getStringLength(content)

					if (contentLength == 1) {
						if (content == "'") {
							report({
								node, content,
								oldQuote: '`',
								newQuote: '"',
								messageId: "character"
							})

						} else {
							report({
								node, content,
								oldQuote: '`',
								newQuote: "'",
								messageId: "character"
							})
						}

					} else if (contentLength < 1) {
						report({
							node, content,
							oldQuote: '`',
							newQuote: "'",
							messageId: "empty"
						})

					} else if (contentLength > 1) {
						report({
							node, content,
							oldQuote: '`',
							newQuote: '"',
							messageId: "string"
						})
					}
				}
			}
		}
	}
}