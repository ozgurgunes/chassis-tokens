# Chassis Design Tokens

Design tokens for the Chassis Design System. This project includes token transformers, an asset manager, and an icon generator. It uses [Style Dictionary](https://amzn.github.io/style-dictionary/) and [Tokens Studio](https://tokens.studio) to bridge the gap between Figma and code repositories.

> **Note:** This project uses `pnpm` for package management. Ensure you have `pnpm` installed globally before running the commands below.

## Install

```shell
git clone git@github.com:ozgurgunes/chassis-tokens.git
pnpm install
```

## Generate Dist Folder

```shell
pnpm dist
```

Runs `tokens`, `assets`, and `icons` commands in parallel to create a complete `dist` folder with all necessary files.

## Generate Design Tokens

```shell
pnpm tokens
```

Generates tokens for each `brand`, `app`, and `theme` combination, tailored to each `platform`. Tokens will be created in the `brand_app_theme` naming pattern under the `dist/tokens/[platform]` directory. References will also be transformed to match the platform-specific format whenever possible.

## Generate Icon Files

```shell
pnpm icons
```

Creates SVG sprite, CSS, and font files from the `icons/svgs` directory and places them into the `dist/icons` directory.

## Generate Assets

```shell
pnpm assets
```

Copies everything recursively from `assets/default/[app]` to `dist/assets/[brand]/[app]-[platform]` as specified in the configuration. If a file with the same name exists under `assets/[brand]`, it copies that file instead of the default file. Renames files according to Android specifications if the platform is `android`.

### Release

Update the version:

```shell
npm run release-version old_version new_version
```

Run `assets` & `icons` then create a tarball.

```shell
npm run release
```

Inspect package scripts for more commands.

## Figma Tokens

Tokens will be created as Figma variables in this structure:

| Collection | Mode 1 | Mode 2 |
| --- | --- | --- |
| Brand | default | chassis |
| Theme | light | dark |
| App | appA | appB |

Check [Tokens Studio Documentation](https://docs.tokens.studio) and [Style Dictionary](https://style-dictionary-v4.netlify.app) for more information.

## For Designers

If you are a designer and not familiar with the git workflow, we recommend using [Sourcetree](https://www.sourcetreeapp.com/), a free Git GUI client. Here are the steps to get started:

### Install Sourcetree

Download and install Sourcetree from [here](https://www.sourcetreeapp.com/).

### Clone the Repository

Follow these steps to clone the repository:

- Open Sourcetree.
- Click on "Clone/New".
- Enter the repository URL: `git@github.com:ozgurgunes/chassis-tokens.git`.
- Choose the destination path on your local machine.
- Click "Clone".

### Create a Work Branch

Before making any changes, create a new branch to keep your work organized and separate from the main branch.

1. In Sourcetree, click on the "Branch" button.
2. Enter a name for your new branch (e.g., `design/new-feature`).
3. Click "Create Branch".

### Install Dependencies

Open the terminal in Sourcetree by clicking on the terminal icon. Run the following command to install dependencies:

```shell
pnpm install
```

### Adding Assets

Export assets to the appropriate locations:

- Glyph icons: `icons/svgs`
- Fonts: `assets/[brand]/[app]/fonts` (rename as in font tokens, e.g., `text-normal.ttf`)
- Bitmap images, SVG illustrations, and colored icons: `assets/[brand]/[app]/images`

> Files under `assets/default` will be used for every brand unless overridden in `assets/[brand]`.

### Verify File Distribution

To see if the files are distributed correctly across brands and apps:

```shell
pnpm assets
```

Then, check the `dist/assets` folder to confirm the files are correctly distributed.

### Stage, Commit & Push Changes

After you are done with your work:

- In Sourcetree, go to the "File Status" tab.
- You will see a list of modified files. Select the files you want to stage.
- Enter a brief description of your changes in the "Commit Message" box.
- Click the "Commit" button.
- Finally, click the "Push" button to upload your changes to the remote repository.

