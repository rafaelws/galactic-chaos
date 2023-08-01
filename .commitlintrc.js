export default {
  "extends": [
    "@commitlint/config-conventional"
  ],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "chore",
        "wip",
        "feat",
        "fix",
        "docs",
        "style",
        "refac",
        "test",
        "revert",
        "build",
        "ci",
        "perf",
      ]
    ]
  }
}