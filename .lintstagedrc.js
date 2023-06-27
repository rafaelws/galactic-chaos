export default {
  "*.ts": [
    "npm run tscheck",
    "npm run eslint:fix",
    "npm run test:staged"
  ]
}