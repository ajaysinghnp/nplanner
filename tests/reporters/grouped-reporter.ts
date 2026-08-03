import type { Reporter, TestCase, TestModule, TestSuite } from "vitest/node";

import path from "node:path";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
} as const;

type DisplayState = "failed" | "passed" | "skipped" | "pending" | undefined;

type TestSummary = {
  failed: number;
  passed: number;
  pending: number;
  skipped: number;
  total: number;
};

type FileSummary = {
  failed: number;
  passed: number;
  pending: number;
  skipped: number;
  total: number;
};

function getStatusSymbol(state: DisplayState): string {
  switch (state) {
    case "passed":
      return "✓";

    case "failed":
      return "✗";

    case "skipped":
      return "○";

    case "pending":
      return "◌";

    default:
      return "•";
  }
}

function colorize(text: string, state: DisplayState): string {
  switch (state) {
    case "passed":
      return `${colors.green}${text}${colors.reset}`;

    case "failed":
      return `${colors.red}${text}${colors.reset}`;

    case "skipped":
      return `${colors.yellow}${text}${colors.reset}`;

    case "pending":
      return `${colors.cyan}${text}${colors.reset}`;

    default:
      return `${colors.gray}${text}${colors.reset}`;
  }
}

function getTestState(test: TestCase): DisplayState {
  const state = test.result().state;

  if (state === "passed" || state === "failed" || state === "skipped" || state === "pending") {
    return state;
  }

  return undefined;
}

function getSuiteState(suite: TestSuite): DisplayState {
  const tests = [...suite.children.allTests()];

  if (tests.some((test) => getTestState(test) === "failed")) {
    return "failed";
  }

  if (tests.some((test) => getTestState(test) === "passed")) {
    return "passed";
  }

  if (tests.length > 0 && tests.every((test) => getTestState(test) === "skipped")) {
    return "skipped";
  }

  if (tests.length > 0 && tests.every((test) => getTestState(test) === "pending")) {
    return "pending";
  }

  return undefined;
}

function getModuleState(testModule: TestModule): DisplayState {
  const tests = [...testModule.children.allTests()];

  if (tests.some((test) => getTestState(test) === "failed")) {
    return "failed";
  }

  if (tests.some((test) => getTestState(test) === "passed")) {
    return "passed";
  }

  if (tests.length > 0 && tests.every((test) => getTestState(test) === "skipped")) {
    return "skipped";
  }

  if (tests.length > 0 && tests.every((test) => getTestState(test) === "pending")) {
    return "pending";
  }

  return undefined;
}

function createEmptyTestSummary(): TestSummary {
  return {
    failed: 0,
    passed: 0,
    pending: 0,
    skipped: 0,
    total: 0,
  };
}

function createEmptyFileSummary(): FileSummary {
  return {
    failed: 0,
    passed: 0,
    pending: 0,
    skipped: 0,
    total: 0,
  };
}

function getTestSummary(testModules: ReadonlyArray<TestModule>): TestSummary {
  const summary = createEmptyTestSummary();

  for (const testModule of testModules) {
    const tests = [...testModule.children.allTests()];

    for (const test of tests) {
      const state = getTestState(test);

      summary.total += 1;

      switch (state) {
        case "passed":
          summary.passed += 1;
          break;

        case "failed":
          summary.failed += 1;
          break;

        case "skipped":
          summary.skipped += 1;
          break;

        case "pending":
          summary.pending += 1;
          break;

        default:
          break;
      }
    }
  }

  return summary;
}

function getFileSummary(testModules: ReadonlyArray<TestModule>): FileSummary {
  const summary = createEmptyFileSummary();

  for (const testModule of testModules) {
    const state = getModuleState(testModule);

    summary.total += 1;

    switch (state) {
      case "passed":
        summary.passed += 1;
        break;

      case "failed":
        summary.failed += 1;
        break;

      case "skipped":
        summary.skipped += 1;
        break;

      case "pending":
        summary.pending += 1;
        break;

      default:
        break;
    }
  }

  return summary;
}

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

function formatFileSummary(summary: FileSummary): string {
  const parts: string[] = [];

  if (summary.failed > 0) {
    parts.push(`${summary.failed} ${pluralize(summary.failed, "failed")}`);
  }

  if (summary.passed > 0) {
    parts.push(`${summary.passed} ${pluralize(summary.passed, "passed")}`);
  }

  if (summary.skipped > 0) {
    parts.push(`${summary.skipped} ${pluralize(summary.skipped, "skipped")}`);
  }

  if (summary.pending > 0) {
    parts.push(`${summary.pending} ${pluralize(summary.pending, "pending")}`);
  }

  return `${parts.join(" | ")} (${summary.total})`;
}

function formatTestSummary(summary: TestSummary): string {
  const parts: string[] = [];

  if (summary.failed > 0) {
    parts.push(`${summary.failed} ${pluralize(summary.failed, "failed")}`);
  }

  if (summary.passed > 0) {
    parts.push(`${summary.passed} ${pluralize(summary.passed, "passed")}`);
  }

  if (summary.skipped > 0) {
    parts.push(`${summary.skipped} ${pluralize(summary.skipped, "skipped")}`);
  }

  if (summary.pending > 0) {
    parts.push(`${summary.pending} ${pluralize(summary.pending, "pending")}`);
  }

  return `${parts.join(" | ")} (${summary.total})`;
}

function getSummaryState(
  failed: number,
  passed: number,
  skipped: number,
  pending: number
): DisplayState {
  if (failed > 0) {
    return "failed";
  }

  if (passed > 0) {
    return "passed";
  }

  if (skipped > 0) {
    return "skipped";
  }

  if (pending > 0) {
    return "pending";
  }

  return undefined;
}

function formatDuration(durationInMilliseconds: number): string {
  if (durationInMilliseconds < 1000) {
    return `${Math.round(durationInMilliseconds)}ms`;
  }

  const seconds = durationInMilliseconds / 1000;

  return `${seconds.toFixed(2)}s`;
}

function formatStartTime(startTime: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    second: "2-digit",
  }).format(startTime);
}

function printSuite(suite: TestSuite, depth: number): void {
  const indentation = "  ".repeat(depth);
  const state = getSuiteState(suite);
  const symbol = getStatusSymbol(state);

  console.log(colorize(`${indentation}${symbol} ${suite.name}`, state));

  for (const child of suite.children) {
    if (child.type === "suite") {
      printSuite(child, depth + 1);
      continue;
    }

    const childIndentation = "  ".repeat(depth + 1);
    const childState = getTestState(child);
    const childSymbol = getStatusSymbol(childState);

    console.log(colorize(`${childIndentation}${childSymbol} ${child.name}`, childState));
  }
}

export default class GroupedReporter implements Reporter {
  private readonly startTime = new Date();

  onTestRunEnd(testModules: ReadonlyArray<TestModule>): void {
    const endTime = new Date();
    const duration = endTime.getTime() - this.startTime.getTime();

    console.log("");

    const sortedModules = [...testModules].sort((first, second) =>
      first.moduleId.localeCompare(second.moduleId)
    );

    for (const testModule of sortedModules) {
      const fileName = path.basename(testModule.moduleId);
      const moduleState = getModuleState(testModule);
      const moduleSymbol = getStatusSymbol(moduleState);

      console.log(colorize(`${moduleSymbol} ${fileName}`, moduleState));

      for (const child of testModule.children) {
        if (child.type === "suite") {
          /*
           * Each current test file has one outer service wrapper:
           *
           * describe("organization.service", ...)
           *
           * Hide that wrapper and print its nested describe groups.
           */
          for (const nestedChild of child.children) {
            if (nestedChild.type === "suite") {
              printSuite(nestedChild, 1);
              continue;
            }

            const nestedState = getTestState(nestedChild);
            const nestedSymbol = getStatusSymbol(nestedState);

            console.log(colorize(`  ${nestedSymbol} ${nestedChild.name}`, nestedState));
          }

          continue;
        }

        const state = getTestState(child);
        const symbol = getStatusSymbol(state);

        console.log(colorize(`  ${symbol} ${child.name}`, state));
      }

      console.log("");
    }

    const fileSummary = getFileSummary(testModules);
    const testSummary = getTestSummary(testModules);

    const fileSummaryState = getSummaryState(
      fileSummary.failed,
      fileSummary.passed,
      fileSummary.skipped,
      fileSummary.pending
    );

    const testSummaryState = getSummaryState(
      testSummary.failed,
      testSummary.passed,
      testSummary.skipped,
      testSummary.pending
    );

    console.log(colorize(` Test Files  ${formatFileSummary(fileSummary)}`, fileSummaryState));

    console.log(colorize(`      Tests  ${formatTestSummary(testSummary)}`, testSummaryState));

    console.log(`${colors.gray}   Start at  ${formatStartTime(this.startTime)}${colors.reset}`);

    console.log(`${colors.gray}   Duration  ${formatDuration(duration)}${colors.reset}`);

    console.log("");
  }
}
