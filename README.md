# Chassis Design Tokens

Design tokens for the Chassis Design System, a robust foundation for enterprise-grade, multi-brand, multi-app, and multi-platform design systems.

This project includes token transformers, an asset manager, and an icon generator. It uses [Style Dictionary](https://amzn.github.io/style-dictionary/) and [Tokens Studio](https://tokens.studio) to bridge the gap between Figma and code repositories.

> [!NOTE]
> This project serves as a starting point. Clone it, set your own repository as the origin, then customize tokens, icons, and assets for your needs.

> [!WARNING]
> This project uses `pnpm` for package management. Ensure you have `pnpm` installed globally before running the commands below.

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

### Generate Design Tokens Only

```shell
pnpm tokens
```

Generates tokens to `dist/tokens/[platform]/[brand]-[app]` as specified in the configuration, tailored to each `platform`. References will also be transformed to match the platform-specific format whenever possible.

### Generate Icon Files Only

```shell
pnpm icons
```

Creates SVG sprite, CSS, and font files from the `icons/svgs` directory and places them into the `dist/icons` directory.

### Generate Assets Only

```shell
pnpm assets
```

Copies everything recursively from `assets/default/[app]` to `dist/assets/[platform]/[brand]-[app]` as specified in the configuration. If a file with the same name exists under `assets/[brand]`, it copies that file instead of the default file. Renames files according to Android specifications if the platform is `android`.

## Release

Update the version:

```shell
npm run release-version old_version new_version
```

Run `assets` & `icons`.

```shell
npm run release
```

Inspect package scripts for more commands.

## Figma Tokens

Tokens will be created as Figma variables in this structure:

| Collection | Mode 1 | Mode 2 |
| --- | --- | --- |
| Brand | chassis | test |
| Theme | light | dark |
| App | docs | test |

Check [Tokens Studio Documentation](https://docs.tokens.studio) and [Style Dictionary](https://style-dictionary-v4.netlify.app) for more information.

## Chassis Configuration

The `chassis` key in the `package.json` file defines the configuration for transforming design tokens and assets. It specifies which token sets will be transformed, their formats, and their target platforms. Below is a detailed explanation of the `chassis` key and its structure:

### Structure

```json
"chassis": {
  "defaults": {
    "brandFolder": "default",
    "tokensTheme": "light"
  },
  "build": {
    "brands": ["chassis", "test"],
    "themes": ["light", "dark"],
    "apps": {
      "docs": ["web"],
      "test": ["ios", "android"]
    }
  }
}
```

### Key Details

#### `defaults`
- **`brandFolder`**: Specifies the default folder for brand assets. Files in this folder will be used unless overridden by brand-specific files.
- **`tokensTheme`**: Defines the default theme for tokens. This is used to create common token files for platforms.

#### `build`
The `build` key defines the token collections and their transformations. It includes the following subkeys:

- **`brands`**: A list of brands for which tokens will be generated. Each brand corresponds to a mode under `brand` collection in Figma.
- **`themes`**: A list of themes for the tokens. Each theme corresponds to a mode under `theme` collection in Figma.
- **`apps`**: A mapping of apps to their target platforms. Each app corresponds to a mode under `app` collection in Figma. Chassis has predefined output formats for each platform.

### Platform Options

The supported platforms for token transformations are:
- **`web`**: Generates tokens for web applications as SCSS variables.
- **`ios`**: Generates tokens for iOS applications as Swift classes.
- **`android`**: Generates tokens for Android applications as XML resources.

**`web`** platform transforms dimension tokens with `rem` unit. **`web-px`** and **`web-vw`** platform options are also available (output directory will still be `web`).

### Behavior

This package only transforms the collections and sets defined under the `build` key. If a brand, theme, or app is not listed here, it will not be processed during the build.

### Example

If you run the `pnpm tokens` command, the following transformations will occur based on the above configuration:
- Tokens for the `chassis` and `test` brands will be generated.
- Each brand will have tokens for the `light` and `dark` themes.
- The `docs` app tokens will be generated for the `web` platform.
- The `test` app tokens will be generates for the `ios` and `android` platforms.

For more details on how to configure Figma tokens, refer to the [Figma Tokens Documentation](https://docs.tokens.studio) and [Style Dictionary](https://style-dictionary-v4.netlify.app).

## Exporting Assets as a Designer

If you are a designer in your project team and not familiar with the git workflow, we recommend using [Sourcetree](https://www.sourcetreeapp.com/), a free Git GUI client. Here are the steps to get started:

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

> Files under `assets/[DEFAULT_BRAND_FOLDER]` will be used for every brand unless overridden in `assets/[brand]`.

`DEFAULT_BRAND_FOLDER` can be set in `package.json`, default value is `default`.

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

