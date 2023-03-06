module.exports = {
	"extends": [
		"eslint:all"
		, "plugin:@typescript-eslint/recommended"
		, "plugin:@typescript-eslint/recommended-requiring-type-checking"
	]
	, "parser": "@typescript-eslint/parser"
	, "plugins": ["@typescript-eslint"]
	, "parserOptions": {
		"ecmaVersion": 2022
		, "sourceType": "module"
		, "tsconfigRootDir": __dirname
		, "project": "tsconfig.eslint.json"
	}
	, "ignorePatterns": ["js", "*.js", "dist", "bin"]
	, "env": {
		"browser": true
		, "es6": true
	}
	, "rules": {
		"@typescript-eslint/quotes": ["error", "double"]
		, "@typescript-eslint/no-inferrable-types": ["error", {"ignoreParameters": true}]
		, "linebreak-style": "off"
		, "indent": [1, "tab"]
		, "no-tabs": 0
		, "no-continue": "off"
		, "camelcase": ["error", {"properties": "never"}]
		, "comma-style": [1, "first"]
		, "one-var": ["error", {"separateRequires": true, "var": "always"}]
		, "func-names": ["error", "always", {"generators": "as-needed"}]
		, "function-call-argument-newline": ["error", "consistent"]
		, "padded-blocks": ["error", "never"]
		, "quotes": ["error", "double", {"avoidEscape": true}]
		, "no-trailing-spaces": ["error", {"ignoreComments": true}]
		, "space-before-function-paren": ["error", "never"]
		, "no-irregular-whitespace": [
			"error"
			, {"skipStrings": true, "skipComments": true, "skipTemplates": true}
		]
		, "no-underscore-dangle": ["error", {"allowAfterThis": true}]
		, "max-params": ["error", 5]
		, "max-len": [
			"error", {
				"code": 120
				, "ignoreComments": true
				, "ignoreUrls": true
				, "ignoreStrings": true
				, "ignoreTemplateLiterals": true
				, "ignoreRegExpLiterals": true
			}
		]
		, "max-statements": "off"
		, "max-lines": ["error", {"max": 500, "skipComments": true, "skipBlankLines": true}]
		, "max-lines-per-function": ["error", {"max": 100, "skipComments": true, "skipBlankLines": true}]
		, "no-magic-numbers": "off"
		, "no-bitwise": "off"
		, "no-ternary": "off"
		, "no-warning-comments": ["warn", {"terms": ["todo", "fixme", "xxx"], "location": "start"}]
		, "multiline-ternary": ["error", "always-multiline"]
		, "yoda": ["error", "never", {"onlyEquality": true}]
		, "id-length": ["error", {"exceptionPatterns": ["[i-k]", "[x-z]"]}]
		, "dot-location": ["error", "property"]
		, "arrow-body-style": "off"
		, "array-element-newline": ["error", "consistent"]
		, "object-property-newline": ["error", {"allowAllPropertiesOnSameLine": true}]
		, "no-unused-vars": ["error", {"argsIgnorePattern": "^_"}]
		, "@typescript-eslint/no-unused-vars": ["error", {"argsIgnorePattern": "^_"}]
		, "no-extra-parens": "off"
		, "@typescript-eslint/no-extra-parens": "warn"
		, "prefer-destructuring": ["error", {"object": true, "array": false}]
		, "lines-around-comment": ["error", {"beforeBlockComment": true, "allowBlockStart": true}]
		, "no-inline-comments": "off"
		, "line-comment-position": "off"
		, "lines-between-class-members": ["error", "always", {"exceptAfterSingleLine": true}]
		, "multiline-comment-style": "off"
		, "capitalized-comments": "off"
		, "sort-keys": "off"
		, "sort-imports": "off"
		, "operator-linebreak": ["error", "before"]

		, "no-console": "off"
		, "no-alert": "error"
	}
};
