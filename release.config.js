export default {
  branches: ["master"],
  repositoryUrl: "https://x-access-token:${process.env.GH_TOKEN}@github.com/upstars-global/cardona-core-service",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [ "@semantic-release/git", {
      assets: ["package.json", "CHANGELOG.md"],
      message: "chore(release): ${nextRelease.version} [skip ci]",
    } ],
  ],
};
