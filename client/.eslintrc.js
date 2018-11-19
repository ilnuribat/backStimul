module.exports = {
  "env": {
      "browser": true,
      "commonjs": true,
      "es6": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "jsx": true,
          "modules": true,
      },
      "sourceType": "module"
  },
  "plugins": [
      "react"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  "rules": {
      "indent": [
          "error",
          2
      ],
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "react/no-array-index-key": [0],
      "linebreak-style":0,
      "max-len": ["warn", 200],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "react/no-deprecated": ["off"],
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "*", "next": "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]}
      ],
  }
};
