# VSCode C/C++ Config

Creates config files with pre-defined settings for modern C/C++ projects.  

![ExampleGif](./media/CCPPConfig.gif?raw=true)

The following file will be created in the local .vscode folder:

- settings.json: Best default settings for C/C++, CMake etc. extensions

The following files will be created in the root directory for all commands:

- .clang-format: Configuration for the formatting tool
- .clang-tidy: Configuration for the static linting tool
- .editorconfig: Standard editor settings (line-feed, insert new-line, etc.)
- .gitattributes: Gives attributes to pathnames
- .gitingore: Specifies intentionally untracked files to ignore

The following files will be created when the root dir contains a CMakeLists.txt:

- .pre-commit-config.yaml
- .cmake-format.yaml
- tools/run-clang-format.py
- tools/run-clang-tidy.py
- .github/workflows/documentation.yml
- .github/workflows/macos.yml
- .github/workflows/pre-commit.yml
- .github/workflows/ubuntu.yml
- .github/workflows/windows.yml

**Note**: If one of these files already exists, they are overridden. However, since you most likely have a git repository, you can then see the fil diff.

## How to use

Just run the command:

- 'Generate C Config Files'
- 'Generate C++ Config Files'

in VSCode's command palette (F1).

## Settings

- ⚙️ Line Length: Max. line length for the clang format tool (defaults to 120, Global Setting)
- ⚙️ Aggressive Settings: If auto formatting should be turned on (defaults to false, Global Setting)

## Release Notes

Refer to the [CHANGELOG](CHANGELOG.md).

## License

Copyright (C) 2022-2023 Jan Schaffranek.  
Licensed under the [MIT License](LICENSE).
