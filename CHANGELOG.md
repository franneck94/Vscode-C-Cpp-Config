# C/C++ Config Change Log

## Version 5.12.0: Feb 04, 2024

- **Info**: Updated settings and gitignore

## Version 5.11.0: Nov 30, 2023

- **Info**: Added missing settings for C/C++ Runner

## Version 5.10.0: Nov 27, 2023

- **Info**: Some internal changes

## Version 5.9.0: Nov 17, 2023

- **Info**: New CMake Settings for the status bar

## Version 5.8.1: Oct 19, 2023

- **Info**: Settings Fix

## Version 5.8.0: Sep 05, 2023

- **Info**: Updated doc

## Version 5.7.0: May 24, 2023

- **Info**: Updated clang tidy

## Version 5.6.0: May 23, 2023

- **Info**: Some settings updates

## Version 5.5.0: Jul 19, 2023

- **Info**: Updated C/C++ Runner Default Settings

## Version 5.4.0: May 23, 2023

- **Info**: Some updates in settings and clang tidy

## Version 5.3.0: May 22, 2023

- **Info**: Update for CMake projects

## Version 5.2.1: May 11, 2023

- **Info**: Bugfix for CMake projects

## Version 5.2.0: May 10, 2023

- **Info**: Added error message when the user wants to generate the config files without having any folder opened (500iq move)

## Version 5.1.0: May 08, 2023

- **Info**: For CMake Projects:
  - Removed CodeQL
  - Updated pre-commit
  - Added Makefile

## Version 5.0.0: April 24, 2023

- **Info**: Added new config files for CMake projects
  - Whenever there is a CMakeLists.txt file in the root dir, these will be created:
    - .pre-commit-config.yaml
    - .cmake-format.yaml
    - tools/iwyu_tool.py
    - tools/run-clang-format.py
    - tools/run-clang-tidy.py
    - .github/workflows/codeql.yaml
    - .github/workflows/documentation.yaml
    - .github/workflows/macos.yaml
    - .github/workflows/pre-commit.yaml
    - .github/workflows/ubuntu.yaml
    - .github/workflows/windows.yaml

For Versions before 5.0.0 see [here](CHANGELOG_OLD.md)..
