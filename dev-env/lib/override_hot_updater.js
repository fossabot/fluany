import path from 'path'
import fs from 'fs'
import clc from 'cli-color'

export default function () {

  const originalJsonpMainTemplatePath = require.resolve(path.join(__dirname, '../../node_modules/webpack/lib/JsonpMainTemplate.runtime.js'))
  const overridenJsonpMainTemplatePath = require.resolve(path.join(__dirname, '../override/JsonpMainTemplate.runtime.js'))
  const overridenJsonpMainTemplate = fs.readFileSync(overridenJsonpMainTemplatePath, {encoding: 'utf8'})

  console.log(clc.green("Overriding 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'"))

  fs.writeFileSync(originalJsonpMainTemplatePath, overridenJsonpMainTemplate)

  const originalLogApplyResultPath = require.resolve(path.join(__dirname, '../../node_modules/webpack/hot/log-apply-result.js'))
  const overridenLogApplyResultPath = require.resolve(path.join(__dirname, '../override/log-apply-results.js'))
  const overridenLogApplyResult = fs.readFileSync(overridenLogApplyResultPath, {encoding: 'utf8'})

  console.log(clc.green("Overriding 'node_modules/webpack/hot/log-apply-result.js'"))

  fs.writeFileSync(originalLogApplyResultPath, overridenLogApplyResult)
}
