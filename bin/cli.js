#!/usr/bin/env node

'use strict'

const program = require('commander')
const pkgJson = require('../package.json')
const Bumper = require('../lib/bumper')
const Cli = require('../lib/cli')
const cli = new Cli()

program
  .version(pkgJson.version)
  .option('-s, --skip-comments', 'disable PR comments even if enabled via .pr-bumper.json')
  .option('-p, --packages-info <packages>', 'packages info in json format.')
  .arguments('<cmd> ')
  .action((cmd, program) => {
    cli
      .run(cmd, program.skipComments, program.packagesInfo)
      .then(result => {
        if (result) {
          console.log(result)
        }
      })
      .catch((error) => {
        const msg = (error.message) ? error.message : error
        console.log(`${pkgJson.name}: ERROR: ${msg}`)
        if (error instanceof Bumper.Cancel) {
          process.exit(0)
        }
        process.exit(1)
      })
  })
  .on('--help', () => {
    console.log('  Options:')
    console.log('')
    console.log(
      '    --skip-comments - disable PR comments even if enabled via .pr-bumper.json\n' +
      '                      Useful particularly when running check-coverage manually\n' +
      '    --packages-info - packages info in json format (useful only for prepend-changelog)\n' +
      '                      Example: ' +
      '[{"name":"repo-package","version":"0.0.0","private":false,location":"/packages/repo-package"}'
    )
    console.log('')
    console.log('  Commands:')
    console.log('')
    console.log('    check - verify an open PR has a version-bump comment')
    console.log('    check-coverage - compare current code coverage against baseline from package.json')
    console.log('    bump - actually bump the version based on the merged PR')
    console.log('    prependChangelog - Prepend changelogs of all packages. Useful for mono-repos.')
    console.log('                       Must provide the packages info as json. (--packages-info <packages>)')
    console.log('    get-merged-pr-scope - get the merged pr scope')
    console.log('    get-last-merge-commit-hash - get the last merge commit hash')
    console.log('')
  })
  .parse(process.argv)
