import { readFileSync } from "node:fs";
// eslint-disable-next-line n/no-sync
const commitPartial = readFileSync("./changelog-template-commit.hbs", { encoding: "utf-8" });

function finalizeContext (context) {
  for (const commitGroup of context.commitGroups) {
    for (const commit of commitGroup.commits) {
      commit.bodyLines = commit.body?.split("\n").filter((line) => line !== "") ?? [];
    }
  }

  return context;
}

export default {
  branches: [ "master" ],
  preset: "conventionalcommits",
  repositoryUrl: "https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/upstars-global/cardona-core-service",
  plugins: [
    [ "@semantic-release/commit-analyzer", {
      releaseRules: [
        { type: "fix", release: "patch" },
        { type: "perf", release: "patch" },
        { type: "feat", release: "minor" },
        { type: "minor", release: "minor" },
        { type: "refactor", release: "minor" },
        { type: "style", release: "minor" },
        { type: "docs", release: "minor" },
        { type: "test", release: "minor" },
        { type: "chore", release: "minor" },
        { breaking: true, release: "major" },
        { type: "BREAKING CHANGE", release: "major" },
      ],
    } ],
    [ "@semantic-release/release-notes-generator", {
      preset: "conventionalcommits",
      parserOpts: {
        noteKeywords: [ "BREAKING CHANGE", "BREAKING CHANGES" ],
      },
      writerOpts: {
        commitPartial,
        finalizeContext,
      },
      presetConfig: {
        types: [
          { type: "fix", section: "🐛 Bug Fixes", hidden: false },
          { type: "feat", section: "🚀 Features", hidden: false },
          { type: "chore", section: "🔧 Maintenance", hidden: false },
          { type: "docs", section: "📖 Documentation", hidden: false },
          { type: "style", section: "💅 Code Style", hidden: false },
          { type: "refactor", section: "🔨 Refactoring", hidden: false },
          { type: "perf", section: "⚡ Performance", hidden: false },
          { type: "test", section: "🧪 Testing", hidden: false },
          { type: "breaking", section: "⚠ Breaking Changes", hidden: false },
          { type: "other", section: "📌 Other Changes", hidden: false },
        ],
      },
    } ],
    "@semantic-release/changelog",
    [ "@semantic-release/exec", {
      // eslint-disable-next-line @stylistic/js/max-len
      prepareCmd: "node -e \"let pkg=require('./package.json'); pkg.version='${nextRelease.version}'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));\"",
      successCmd: "node send-slack-notification.js \"${nextRelease.version}\" \"${process.env.REPO_URL}\"",
    } ],
    [ "@semantic-release/git", {
      assets: [ "package.json", "CHANGELOG.md" ],
      message: "chore(release): ${nextRelease.version} [skip ci]",
    } ],
  ],
};
