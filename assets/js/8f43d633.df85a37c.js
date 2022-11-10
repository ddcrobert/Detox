"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3652],{4806:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"/2022/11/10/detox-20-is-out","metadata":{"permalink":"/Detox/blog/2022/11/10/detox-20-is-out","editUrl":"https://github.com/wix/Detox/edit/next/website/blog/2022-11-10-detox-20-is-out.md","source":"@site/blog/2022-11-10-detox-20-is-out.md","title":"Detox 20 is out","description":"This is a draft post about a future release.","date":"2022-11-10T00:00:00.000Z","formattedDate":"November 10, 2022","tags":[{"label":"major-release","permalink":"/Detox/blog/tags/major-release"},{"label":"genymotion","permalink":"/Detox/blog/tags/genymotion"}],"readingTime":9.81,"hasTruncateMarker":false,"authors":[{"name":"Yaroslav Serhieiev","title":"Detox Core Contributor","url":"https://github.com/noomorph","imageURL":"https://github.com/noomorph.png","key":"noomorph"}],"frontMatter":{"authors":["noomorph"],"tags":["major-release","genymotion"]}},"content":":::caution\\n\\nThis is a draft post about a future release.\\nCongrats if you found it earlier than we announced it.\\n\\n:::\\n\\nToday we\'re proud to announce the new major release, **Detox 20** (codename \\"Ash\xe1n\\"), which brings:\\n\\n* official support for Genymotion SaaS\\n* improved integration with test runners\\n* configurable logging subsystem\\n* headless mode for iOS via configs and CLI\\n* reversing TCP ports via Android app configs\\n* and more optimizations to land in the next minor versions.\\n\\n## Genymotion SaaS\\n\\n**Highlights**: [`Using Genymotion SaaS`].\\n\\nTwo years ago we [added elementary support][Genymotion PR] for cloud-based Android emulators provided by [Genymotion SaaS] and started a beta testing phase across mobile projects at Wix.\\n\\nPreviously our mobile infrastructure engineers had been maintaining Android virtual devices on CI build agents on their own, so switching to cloud devices cleared up their time for more productive tasks. Another improvement was particularly noticeable for teams with a vast number of tests. We could reduce the duration of their CI pipelines almost by half after they scaled up from 2 parallel devices to 6[^1].\\n\\n[^1]: The mentioned threshold is not a hard limit, but rather a point where the return value of scaling up the number of devices starts dramatically diminishing in our case \u2013 not only the tests themselves, but installing NPM dependencies and building the projects also takes time.\\n\\nThis positive impact encouraged us to adopt [Genymotion SaaS] for CI as quickly as possible, ignoring some unresolved issues in the initial pull request. For the most part, those were minor problems in global lifecycle management. Yet that made us feel uncertain about releasing it as-is, so we decided to take time and gain more production experience before taking any direction.\\n\\nThe further experience was surprisingly smooth and rarely presented issues, spare for a few minor [glitches](https://github.com/wix/Detox/issues/3573) in advanced scenarios. Admittedly, revamping the [Detox lifecycle][`Internals API`] took us longer than expected, which is all the more reason for us to celebrate today.\\n\\nWe\'re looking forward to providing our users with more opportunities for testing in the cloud, and this step is only the first of many to come. We hope you\'ll utilize this new feature to your delight.\\n\\n## Integration with test runners\\n\\n**Highlights**: [`Config file > Test runner`], [`Internals API`], [`Dropping Mocha support`].\\n\\nIt took about a few months of work to formalize the contract between Detox and a test runner. While there\'s still a lot of place for improvement, the new Detox release refines their interaction and lays the groundwork for third-party integrations.\\n\\n[Mocha] was our first supported test runner, but unfortunately, it could not keep up with our scaling requirements as the number of end-to-end tests grew. [By the time][Mocha 8] it acquired the ability to run tests in parallel, we already had [to place bets][Jest PR] on another horse, and that was [Jest].\\n\\nWe attempted to keep compatibility with both Jest and Mocha, but the farther we went, the more obvious it was that we couldn\'t have it both ways. As it turned out, Jest wasn\'t easy to get along with \u2013 our first integration with it was too simplistic. Over a couple of years of use in production, we kept discovering various issues that forced us to rewrite our \\"glue\\" code from scratch twice, and this isn\'t over yet. All combined didn\'t leave much time and energy for tinkering with Mocha anymore.\\n\\nIn this release, we discontinued Mocha support to focus on the attunement of Jest with the new runner-independent [test runner config][`Config file > Test runner`] and [Internals API][`Internals API`]. If there\'s enough demand, now it is up to the open-source community to build a new integration between Detox and Mocha.\\n\\n## Configurable logger\\n\\n**Highlights**: [`Config file > Logger`], [`Logger API`].\\n\\nThe rigidity of the logging subsystem has always been showing itself [since its very creation][Logger rewrite] in the summer of 2019.\\nDue to time constraints and existing tech debts, it was impossible to do it right the first time, so we lived about three years with a proof-of-concept rather than a full-fledged feature.\\n\\nThe inconveniences weren\'t fatal but quite noticeable, nevertheless. Here are a few syndromes you could have spotted if you have ever used Detox timeline and log artifacts, especially when running tests in parallel:\\n\\n* an uncanny file array: `detox_pid_7505.log`, `detox_pid_7505.log.json`, `detox_pid_7506.log`;\\n* a relatively shallow `detox.trace.json`: test suites, test functions, and some user-defined segments.\\n\\nThe good news is that the new Detox release condenses all those numerous logs into two files:\\n\\n* the plain, human-readable `detox.log`;\\n* the raw, machine-readable `detox.trace.json` for `chrome://trace`, [Perfetto] and other utilities.\\n\\n![A screenshot of timeline view generated by Perfetto](/img/blog/v20-perfetto-example.png)\\n\\nWith the help of the new [Logger API][`Logger API`], you can add custom duration events to the timeline, too, e.g.:\\n\\n```js\\nawait detox.log.trace.complete(\'Login\', async () => {\\n  await element(by.id(\'email\')).typeText(\'john@example.com\');\\n  await element(by.id(\'password\')).typeText(\'123456\');\\n\\n  detox.log.info(\'Trying to log in...\');\\n  await element(by.id(\'submit\')).tap();\\n});\\n```\\n\\nBesides, it is possible now to customize the console output of Detox via the new [logger config][`Config file > Logger`], e.g.:\\n\\n```js title=\\"detox.config.js\\"\\n/** @type {Detox.DetoxConfig} */\\nmodule.exports = {\\n  // ...\\n  logger: {\\n    options: {\\n      showDate: false,\\n      showLoggerName: false,\\n      showPid: false,\\n      prefixers: {\\n        ph: null,\\n      },\\n    },\\n  },\\n};\\n```\\n\\nIn the example above, we minimize all the metadata around the log messages \u2013 see the screenshot below:\\n\\n![Terser logs after applying the override](/img/blog/v20-logger-options.png)\\n\\n## Minor features\\n\\n### Headless iOS\\n\\nOne of Detox known issues was always booting iOS simulators in a hidden mode. You could see tests running on your local simulator only if you had manually opened the Simulator app beforehand. So, we unified the `headless` property for both iOS and Android, and now both the platforms visibly boot a device unless you configure it otherwise, e.g.:\\n\\n```js\\n/* @type {Detox.DetoxConfig} */\\nmodule.exports = {\\n  devices: {\\n    iphone: {\\n      type: \'ios.simulator\',\\n      // highlight-next-line\\n      headless: process.env.CI ? true : undefined,\\n      device: {\\n        type: \'iPhone 14\'\\n      },\\n      /* ... */\\n    }\\n  },\\n};\\n```\\n\\nor, via CLI:\\n\\n```bash\\ndetox test -c ios.sim.release --headless\\n```\\n\\n### Reverse ports\\n\\nYour apps might try to access some `localhost:*` addresses (e.g., mock servers), but this is a bit more problematic in the case of Android. The Android emulators are separate virtual devices with their own loopback network interface. In such cases, you must set up reverse port forwarding via `adb reverse`.\\n\\nLocal servers are quite a common prerequisite for apps in debug mode \u2013 one could recall React Native bundler on port 8081, Storybook server on 9009, etc. That\'s why we decided to add an optional config property for Android apps, `reversePorts`:\\n\\n```js\\n/** @type {Detox.DetoxConfig} */\\nmodule.exports = {\\n  // ...\\n  apps: {\\n    \'android.debug\': {\\n      type: \'android.apk\',\\n      binaryPath: \'...\',\\n      reversePorts: [8081, 3000],\\n    },\\n  },\\n};\\n```\\n\\nIn other words, this is a convenience API that tells Detox to run `device.reverseTcpPort(portNumber)` after installing the app. It should be helpful for anyone who prefers to keep such things as configs rather than as code.\\n\\n### Read-only emulators by default\\n\\nThe `-read-only` flag appeared in [Android emulator 28.0.16](https://developer.android.com/studio/releases/emulator#concurrent-avd). Detox promptly adopted it since the read-only mode allowed it to run multiple instances of a single Android virtual device (AVD) concurrently. This feature helped us to implement parallel test execution support for Android back then.\\n\\nBeing overcautious, we implemented that partially, only for cases when the user starts multiple concurrent workers. This decision created a moderately annoying UX issue. Imagine you run tests sequentially first, using one worker only. That provides you with a regular AVD instance, i.e., not a read-only one. After that, you switch to multiple workers only to get an error from the Android emulator, complaining about mixing regular and read-only instances.\\n\\nWhile the fix itself has always been straightforward \u2013 close the running AVD and try again \u2013 this entire overcaution brought more issues than solving them. That\'s why, from now on, Android emulators will always be starting in `-read-only` mode unless you configure `readonly: false` in your [device config][`Config file > Device`].\\n\\n### Reset lock file\\n\\nThis release adds a small CLI tool, [`detox reset-lock-file`][reset-lock-file], to help users with one specific use scenario.\\n\\nImagine you want to run tests for multiple Detox configurations at once, e.g.:\\n\\n```bash\\ndetox test -c iphoneSE2020.release e2e/ui.test.js\\ndetox test -c iphone14ProMax.release e2e/ui.test.js\\n```\\n\\nThe problem is that Detox uses a file-locking mechanism to avoid situations when parallel test workers would take control of the same device. The `detox test` command, upon start, erases that file contents, creating a race condition risk.\\n\\nTo eliminate that risk, use a combination of `detox reset-lock-file` and `--keepLockFile` like this:\\n\\n```bash\\ndetox reset-lock-file & \\\\\\ndetox test --keepLockFile -c iphoneSE2020.release e2e/ui.test.js & \\\\\\ndetox test --keepLockFile -c iphone14ProMax.release e2e/ui.test.js & \\\\\\nwait\\n```\\n\\nIn the future, we plan to minimize using lock files so that you don\'t have to think about this low-level implementation detail.\\nSo, this tool adds some convenience until we provide a next-gen solution.\\n\\n## Deprecations\\n\\nDetox 20 executes many pending deprecations, so make sure to check out our [Migration Guide] before upgrading:\\n\\n* JS: minimum supported Node.js version is `14.x`;\\n* JS: minimum supported Jest version is `27.2.5`;\\n* JS: Mocha test runner is no longer supported;\\n* JS: discontinued old adapters for Jest (`jest-jasmine`, first generation of `jest-circus` adapter);\\n* JS: discontinued `{ permanent: true }` option in `device.appLaunchArgs.*` methods ([#3360](https://github.com/wix/Detox/pull/3360));\\n* CLI: dropped `-w, --workers` and `-o, --runner-config` args \u2013 see a [dedicated section][Updating command-line scripts] in the migration guide;\\n* CLI: dropped deprecated `--device-launch-args` ([#3665](https://github.com/wix/Detox/pull/3665));\\n* Config: discontinued kebab-case properties: `test-runner`, `runner-config` ([#3371](https://github.com/wix/Detox/pull/3371))\\n* Config: discontinued `skipLegacyWorkersInjections` property ([(#3286)](https://github.com/wix/Detox/pull/3286))\\n* Config: deprecated `specs` and `runnerConfig` properties\\n* Config: changed [semantics][`Config file > Test runner`] of `testRunner` property\\n* Config: dropped support for all-in-one configurations ([#3386](https://github.com/wix/Detox/pull/3386));\\n* Android: remove deprecated native IdlePolicyConfig ([#3332](https://github.com/wix/Detox/pull/3332/files))\\n* iOS: discontinued `ios.none` device type \u2013 see the new way to [debug native code][Debugging Native] ([#3361](https://github.com/wix/Detox/pull/3361))\\n\\n## Afterword\\n\\nOver the last year and a half, we have established a centralized configuration system for more than 50 projects using Detox at Wix. While it never seemed to be a cakewalk, the entire experience of troubleshooting over a hundred issues across the organization did not leave us unchanged.\\n\\nWe see numerous things to improve in Detox, but most of them boil down to the same thing \u2013 **scaling**. Surprisingly, \\"scaling\\" makes an excellent umbrella term for nearly every challenge we\'ve been encountering lately:\\n\\n* _scaling up the number of users_ requires us to improve the onboarding and troubleshooting experience;\\n* _scaling up the number of projects_ forces us to centralize scattered configs into flexible organization presets;\\n* _scaling up the number of tests_ prompts us to optimize the codebase and incline it towards cloud and remote execution.\\n\\nOur core team has been facing challenges of limited human resource constraints and growing scaling needs for a long time. In many ways, that has shaped a specific mindset within the team. We evaluate every discussed feature by asking a simple question: _will it save other people and us time to focus on more important things?_ Teaching a man to fish is better than giving fish, so our success at preventing support issues matters more than our success at solving them ourselves.\\n\\nThat\'s why we\'ll be making subsequent efforts in these three areas, hoping to get back to you soon with even more exciting updates.\\n\\nEnjoy your drive with Detox 20!\\n\\nCheers! :wave:\\n\\n[`Using Genymotion SaaS`]: /docs/next/guide/genymotion-saas\\n[`Config file > Test runner`]: /docs/next/config/testRunner\\n[`Internals API`]: /docs/next/api/internals\\n[`Dropping Mocha support`]: https://github.com/wix/Detox/issues/3193\\n[`Config file > Device`]: /docs/next/config/devices\\n[`Config file > Logger`]: /docs/next/config/logger\\n[`Config file > Test runner`]: /docs/next/config/testRunner\\n[`Logger API`]: /docs/next/api/logger\\n[reset-lock-file]: /docs/next/cli/reset-lock-file\\n[Jest]: https://jestjs.io\\n[Mocha]: https://mochajs.org\\n[Mocha 8]: https://github.com/mochajs/mocha/releases/tag/v8.0.0\\n[Jest PR]: https://github.com/wix/Detox/pull/609\\n[Logger rewrite]: https://github.com/wix/Detox/pull/835\\n[Genymotion PR]: https://github.com/wix/Detox/pull/2446\\n[Genymotion SaaS]: https://cloud.geny.io\\n[Genymotion issues]: https://github.com/wix/Detox/issues/3573\\n[Perfetto]: https://ui.perfetto.dev/\\n[Migration Guide]: /docs/next/guide/migration#200\\n[Updating command-line scripts]: /docs/next/guide/migration#updating-command-line-scripts\\n[Debugging Native]: /docs/next/introduction/debugging#native-application-code\\n[typings]: https://github.com/wix/Detox/blob/next/detox/index.d.ts"}]}')}}]);