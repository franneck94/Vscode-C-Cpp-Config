# C/C++ Config Change Log

## Version 2.6.3: May 23, 2022

- **Info**: Updated compiler args in properties file

## Version 2.6.2: May 17, 2022

- **Info**: Fixed false settings name

## Version 2.6.1: April 26, 2022

- **Info**: Updated error logic

## Version 2.6.0: March 22, 2022

- **Info**: Updated settings

## Version 2.5.0: January 19, 2022

- **Info**: Updated clang-format

## Version 2.4.3: January 14, 2022

- **Info**: Improved compiler search

## Version 2.4.2: January 13, 2022

- **Info**: Improved compiler search

## Version 2.4.1: January 11, 2022

- **Bugfix**: Added try/catch for issues with creating .vscode folder

## Version 2.4.0: December 15, 2021

- **Info**: n/a

## Version 2.3.1: December 2, 2021

- **Info**:Updated clang-tidy
- **Info**: Bumped vcscode version

## Version 2.3.0: November 30, 2021

- **Info**: Added markdown render mode

## Version 2.2.0: November 24, 2021

- **Info**: Fixed user issues ;)

## Version 2.1.0: November 23, 2021

- **Info**: Added error message when running the incorrect command

## Version 2.0.0: November 17, 2021

- **Info**: Added settings for the compiler tools
- **Info**: Added lldb debugger extension as a dependency
- **Improvement**: Added check for Apple M1 to use the lldb debugger extension

## Version 1.2.0: November 14, 2021

- **Info**: Added own clang-tidy template for C projects

## Version 1.1.3: November 12, 2021

- **Info**: Fixed issue with extension commands

## Version 1.1.2: November 10, 2021

- **Info**: For Windows users the paths to the compiler tools are now stored with single slashed "/" instead of double back slashes "\\" due to issues with the properties handler of Microsoft's C/C++ extension

## Version 1.1.1: November 10, 2021

- **Info**: Fixed issue in clang-tidy template

## Version 1.1.0: November 7, 2021

- **Info**: Dumped full clang-format config (no changes)
- **Info**: Now clangFormat is default C/C++ formatter (installed by Microsoft's C/C++ extension)

## Version 1.0.0: November 6, 2021

- **Bugfix**: Clang-tidy was not created
- **Info**: Re-triggering the command will now overwrite exisiting config files

## Version 0.8.0: November 4, 2021

- **Info**: Added clang tidy, updated clang-format

## Version 0.7.0: November 2, 2021

- **Info**: Corrected C++ Config Tasks

## Version 0.6.2: October 25, 2021

- **Info**: Updated Mac launch config

## Version 0.6.1: October 23, 2021

- **Info**: Set StopAtEntry to true for Mac

## Version 0.6.0: October 19, 2021

- **Info**: When no compiler installation was found, default paths are now used
- **Bugfix**: Fixed problem in mac launch.json file

## Version 0.5.0: October 6, 2021

- **Info**: Instead of shwoing an error message when no compiler is found, it is now a information message and the extension does not abort

## Version 0.4.0: September 26, 2021

- **Improvement**: Added **.gitattributes** and **.gitingore**

## Version 0.3.0: September 26, 2021

- **Improvement**: Added targets for minimal projects (no Makefile, tasks.json and launch.json)

## Version 0.2.0: September 25, 2021

- **Improvement**: Added generation of **.clang-format** and **.editorconfig**
- **Info**: If files are yet present, they won't be overridden

## Version 0.1.2: September 22, 2021

- **Bugfix**: Directory name fixed

## Version 0.1.1: September 22, 2021

- **Bugfix**: Filepath bugfix

## Version 0.1.0: September 20, 2021

- **Info**: First release
