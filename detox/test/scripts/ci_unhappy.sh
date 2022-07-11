#!/usr/bin/env bash

set -e

export DISABLE_JUNIT_REPORTER=1

platform=$1

copy_coverage_to() {
    if [ -n "$CI" ]; then
      cp coverage/lcov.info "$1"
    fi
}

echo "Running e2e test for timeout handling..."
node scripts/assert_timeout.js npm run "e2e:$platform" -- --config e2e-unhappy/detox-init-timeout/jest.config.js e2e-unhappy
copy_coverage_to "../../coverage/e2e-$platform-timeout-ci.lcov"

echo "Running early syntax error test..."
node scripts/assert_timeout.js npm run "e2e:$platform" -- e2e-unhappy/early-syntax-error.test.js
copy_coverage_to "../../coverage/e2e-early-syntax-error-$platform-ci.lcov"

echo "Running e2e stack trace mangling test..."
runnerOutput="$(npm run "e2e:$platform" -- -H e2e-unhappy/failing-matcher.test.js 2>&1 | tee /dev/stdout)"

if grep -q "await.*element.*supercalifragilisticexpialidocious" <<< "$runnerOutput" ;
then
    echo "Stack trace mangling for Client.js passed OK."
    copy_coverage_to "../../coverage/e2e-$platform-error-stack-client-js.lcov"
else
    echo "Stack trace mangling for Client.js test has failed"
    echo "$runnerOutput"
    exit 1
fi

echo "Running e2e stack trace mangling test (Device.js.js)..."
runnerOutput="$(npm run "e2e:$platform" -- e2e-unhappy/failing-device-method.test.js 2>&1 | tee /dev/stdout)"

if grep -q "await.*device.*selectApp" <<< "$runnerOutput" ;
then
    echo "Stack trace mangling for Device.js has passed OK."
    copy_coverage_to "../../coverage/e2e-$platform-error-stack-device-js.lcov"
else
    echo "Stack trace mangling for Device.js test has failed"
    echo "$runnerOutput"
    exit 1
fi
