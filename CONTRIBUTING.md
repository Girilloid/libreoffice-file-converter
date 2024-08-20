# Contributing

The recommended workflow for making a contribution to the project is documented below.

## Instructions

### 1. Fork the Repository to your own Github Account

Optionally add this repository as an additional remote in case you want to incorporate upstream changes into your version of the code

### 2. Reference an Issue

Code and changelogs work better when work references an actual tracking item that helps to understand why it happened. For this reason changes should only be made if they're referencing a documented issue.

Feel free to reference an existing open issue or create a new one with a brief title and/or description

## #3. Check out a new branch that references the issue

Pick a good branch name. Try something that summarizes what you're doing in a descriptive way. Optionally include the issue number:

- `feature/{number}-my-new-thing`
- `docs/improve-readme`
- `fix/{number}some-bug`

### 4. Install Dependencies

Make sure that before you start writing code you run `mise` or `asdf` at the root of the repo in order to make sure that all tools are installed. Alternatively use any Bun version. Run `bun install --frozen-lockfile` at the root of the repo to ensure that all githooks are registered and packages are installed.

### 5. Make your change

Write your code that addresses issue, feature request and etc. Write tests covering new functionality and/or fix.

### 6. Generate your commit

Follow [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/#specification) when writing your commit message.

Be sure to include a reference to the issue number using `#{number}` syntax.

### 7. Open a Pull Request against the Upstream Master Branch

Your contribution will be reviewed and if accepted will be incorporated into the next logical release cycle for the tool.
