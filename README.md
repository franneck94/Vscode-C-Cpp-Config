# VSCode C/C++ Config

Creates config files for C/C++ projects.  

If the **non-minimal** command is used, the following files will be created in the local .vscode folder:

- settings.json: Best default settings for C/C++, CMake etc. extensions
- c_cpp_properties.json: Best default settings for the compiler
- tasks.json: Tasks to compile single C/C++ files or all C/C++ files in a folder
- launch.json: Debug configs to debug C/C++ programs that were compiled by the tasks
- Makefile: Makefile targets that are used in launch.json and tasks.json

if the **minimal** command is used, the following files will be created in the local .vscode folder:

- settings.json: Best default settings for C/C++, CMake etc. extensions
- c_cpp_properties.json: Best default settings for the compiler

Following files will be created in the root directory for all commands:

- .clang-format: Configuration for the formatting tool
- .clang-tidy: Configuration for the static linting tool
- .editorconfig: Standard editor settings (line-feed, insert new-line, etc.)
- .gitattributes: Gives attributes to pathnames
- .gitingore: Specifies intentionally untracked files to ignore

**Note**: If one of these files already exists, they won't be overridden.

## Software Requirements

- 🔧 Windows:
  - Alternative 1: gcc/g++/gdb/make with **Cygwin**
  - Alternative 2: clang/clang++/ldb/make with **LLVM**
- 🔧 Linux:
  - Alternative 1: gcc/g++/gdb/make
  - Alternative 2: clang/clang++/ldb/make
- 🔧 MacOS:
  - Alternative 1: clang/clang++/lldb/make
  - Alternative 2: gcc/g++/gdb/make

## How to use

Just run the command:

- 'Generate C Config Files'
- 'Generate C++ Config Files'
- 'Generate C Config Files Minimal'
- 'Generate C++ Config Files Minimal'

in VSCode's command palette (F1).

## Important Notes

The generated tasks won't work whenever there are whitespaces or non-ASCII characters in the file paths and directory names.

## Release Notes

Refer to the [CHANGELOG](CHANGELOG.md).

## License

Copyright (C) 2022 Jan Schaffranek.  
Licensed under the [MIT License](LICENSE).
