import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import {
	checkCompilersLinux,
	checkCompilersMac,
	checkCompilersWindows,
} from './compilers';
import {
	removeFullEntries,
	replaceLanguageLaunch,
	replaceLanguageTasks,
	replaceLaunch,
	replaceProperties,
	replaceSettings,
	setMacDebuggerType,
	updateSetting,
} from './replacer';
import {
	mkdirRecursive,
	pathExists,
	readJsonFile,
	writeJsonFile,
} from './utils/fileUtils';
import { getOperatingSystem } from './utils/systemUtils';
import { OperatingSystems } from './utils/types';
import { disposeItem } from './utils/vscodeUtils';

let generateCCommandDisposable: vscode.Disposable | undefined;
let generateCppCommandDisposable: vscode.Disposable | undefined;
let generateCMinimalCommandDisposable: vscode.Disposable | undefined;
let generateCppMinimalCommandDisposable: vscode.Disposable | undefined;
let extensionPath: string | undefined;

const VSCODE_DIR_FILES = [
  'launch.json',
  'tasks.json',
  'settings.json',
  'c_cpp_properties.json',
  'Makefile',
];
const VSCODE_DIR_MINIMAL_FILES = ['settings.json', 'c_cpp_properties.json'];
const ROOT_DIR_FILES = [
  '.clang-format',
  '.clang-tidy',
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
];

export const EXTENSION_NAME = 'C_Cpp_Config';
export let WORKSPACE_FOLDER: string | undefined;
export let C_COMPILER_PATH: string = 'gcc';
export let CPP_COMPILER_PATH: string = 'g++';
export let DEBUGGER_PATH: string = 'gdb';
export let MAKE_PATH: string = 'make';
export let OPERATING_SYSTEM: OperatingSystems | undefined;

export function activate(context: vscode.ExtensionContext) {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length !== 1 ||
    !vscode.workspace.workspaceFolders[0] ||
    !vscode.workspace.workspaceFolders[0].uri
  ) {
    return;
  }

  WORKSPACE_FOLDER = vscode.workspace.workspaceFolders[0].uri.fsPath;
  extensionPath = context.extensionPath;
  OPERATING_SYSTEM = getOperatingSystem();

  initGenerateCCommandDisposable(context);
  initGenerateCppCommandDisposable(context);
  initGenerateCMinimalCommandDisposable(context);
  initGenerateCppMinimalCommandDisposable(context);
}

export function deactivate() {
  disposeItem(generateCCommandDisposable);
}

export function checkCompilers() {
  if (!OPERATING_SYSTEM) return;

  let compilerPaths: {
    c_compiler_path: string;
    cpp_compiler_path: string;
    debugger_path: string;
    make_path: string;
  };

  if (OPERATING_SYSTEM === OperatingSystems.windows) {
    compilerPaths = checkCompilersWindows();
  } else if (OPERATING_SYSTEM === OperatingSystems.linux) {
    compilerPaths = checkCompilersLinux();
  } else {
    compilerPaths = checkCompilersMac();
  }

  C_COMPILER_PATH = compilerPaths.c_compiler_path;
  CPP_COMPILER_PATH = compilerPaths.cpp_compiler_path;
  DEBUGGER_PATH = compilerPaths.debugger_path;
  MAKE_PATH = compilerPaths.make_path;

  updateSetting();
}

function isCCourse(currentFolder: string) {
  return (
    currentFolder.toLowerCase().includes('udemyc') &&
    !currentFolder.toLowerCase().includes('udemycpp')
  );
}

function isCppCourse(currentFolder: string) {
  return currentFolder.toLowerCase().includes('udemycpp');
}

function initGenerateCCommandDisposable(context: vscode.ExtensionContext) {
  if (generateCCommandDisposable) return;

  const CommanddName = `${EXTENSION_NAME}.generateConfigC`;
  generateCCommandDisposable = vscode.commands.registerCommand(
    CommanddName,
    () => {
      const currentFolder = WORKSPACE_FOLDER?.toLowerCase();

      if (currentFolder && isCppCourse(currentFolder)) {
        writeFiles(true); // C command, called in Cpp course
        return;
      }

      writeFiles(false); // C command, correctly called
    },
  );

  context?.subscriptions.push(generateCCommandDisposable);
}

function initGenerateCppCommandDisposable(context: vscode.ExtensionContext) {
  if (generateCppCommandDisposable) return;

  const CommanddName = `${EXTENSION_NAME}.generateConfigCpp`;
  generateCppCommandDisposable = vscode.commands.registerCommand(
    CommanddName,
    () => {
      const currentFolder = WORKSPACE_FOLDER?.toLowerCase();

      if (currentFolder && isCCourse(currentFolder)) {
        writeFiles(false); // Cpp command, called in C course
        return;
      }

      writeFiles(true); // Cpp command, correctly called
    },
  );

  context?.subscriptions.push(generateCppCommandDisposable);
}

function initGenerateCMinimalCommandDisposable(
  context: vscode.ExtensionContext,
) {
  if (generateCMinimalCommandDisposable) return;

  const CommanddName = `${EXTENSION_NAME}.generateConfigCMinimal`;
  generateCMinimalCommandDisposable = vscode.commands.registerCommand(
    CommanddName,
    () => {
      const currentFolder = WORKSPACE_FOLDER?.toLowerCase();

      if (currentFolder && isCppCourse(currentFolder)) {
        writeMinimalFiles(true); // C command, called in Cpp course
        return;
      }

      writeMinimalFiles(false); // C command, correctly called
    },
  );

  context?.subscriptions.push(generateCMinimalCommandDisposable);
}

function initGenerateCppMinimalCommandDisposable(
  context: vscode.ExtensionContext,
) {
  if (generateCppMinimalCommandDisposable) return;

  const CommanddName = `${EXTENSION_NAME}.generateConfigCppMinimal`;
  generateCppMinimalCommandDisposable = vscode.commands.registerCommand(
    CommanddName,
    () => {
      const currentFolder = WORKSPACE_FOLDER?.toLowerCase();

      if (currentFolder && isCCourse(currentFolder)) {
        writeMinimalFiles(false); // C command, called in Cpp course
        return;
      }

      writeMinimalFiles(true); // Cpp command, correctly called
    },
  );

  context?.subscriptions.push(generateCppMinimalCommandDisposable);
}

function getFilepaths() {
  if (!extensionPath || !WORKSPACE_FOLDER || !OPERATING_SYSTEM) {
    return {};
  }

  const templateOsPath = path.join(
    extensionPath,
    'templates',
    OPERATING_SYSTEM,
  );
  const templatePath = path.join(extensionPath, 'templates');
  const vscodePath = path.join(WORKSPACE_FOLDER, '.vscode');

  return { templateOsPath, templatePath, vscodePath };
}

function writeFiles(isCppCommand: boolean) {
  const { templateOsPath, templatePath, vscodePath } = getFilepaths();
  if (!templateOsPath || !templatePath || !vscodePath) return;

  checkCompilers();

  if (!pathExists(vscodePath)) mkdirRecursive(vscodePath);

  // Still not exist due to somewhat mkdir error
  if (!pathExists(vscodePath)) {
    const message = 'Error: .vscode folder could not be generated.';
    vscode.window.showErrorMessage(message);
    return;
  } else {
    VSCODE_DIR_FILES.forEach((filename) => {
      const targetFilename = path.join(vscodePath, filename);
      const templateFilename = path.join(templatePath, filename);
      const templateOsFilename = path.join(templateOsPath, filename);

      if (filename === 'launch.json') {
        let templateData: { [key: string]: string } = readJsonFile(
          templateOsFilename,
        );
        if (isCppCommand) templateData = replaceLanguageLaunch(templateData);
        if (
          OPERATING_SYSTEM !== undefined &&
          OPERATING_SYSTEM !== OperatingSystems.mac
        ) {
          templateData = replaceLaunch(templateData);
        }
        if (OPERATING_SYSTEM === OperatingSystems.mac) {
          setMacDebuggerType(templateData);
        }
        writeJsonFile(targetFilename, templateData);
      } else if (filename === 'c_cpp_properties.json') {
        let templateData: { [key: string]: string } = readJsonFile(
          templateOsFilename,
        );
        templateData = replaceProperties(templateData);
        writeJsonFile(targetFilename, templateData);
      } else if (filename === 'settings.json') {
        let templateData: { [key: string]: string } = readJsonFile(
          templateOsFilename,
        );
        templateData = replaceSettings(templateData);
        writeJsonFile(targetFilename, templateData);
      } else if (filename === 'tasks.json') {
        let templateData: { [key: string]: string } = readJsonFile(
          templateFilename,
        );
        if (isCppCommand) templateData = replaceLanguageTasks(templateData);
        writeJsonFile(targetFilename, templateData);
      } else {
        try {
          // Makefile
          const templateData = fs.readFileSync(templateFilename);
          fs.writeFileSync(targetFilename, templateData);
        } catch (err) {
          vscode.window.showErrorMessage(
            `Could not create file: ${targetFilename}`,
          );
          return;
        }
      }
    });
  }

  writeRootDirFiles(templatePath, isCppCommand);
}

function writeMinimalFiles(isCppProject: boolean) {
  const { templateOsPath, templatePath, vscodePath } = getFilepaths();
  if (!templateOsPath || !templatePath || !vscodePath) return;

  checkCompilers();

  if (!pathExists(vscodePath)) mkdirRecursive(vscodePath);

  // Still not exist due to somewhat mkdir error
  if (!pathExists(vscodePath)) {
    const message = 'Error: .vscode folder could not be generated.';
    vscode.window.showErrorMessage(message);
    return;
  } else {
    writeLocalVscodeDirMinimalFiles(vscodePath, templateOsPath);
  }

  writeRootDirFiles(templatePath, isCppProject);
}

function writeRootDirFiles(templatePath: string, isCppProject: boolean) {
  ROOT_DIR_FILES.forEach((filename) => {
    if (!WORKSPACE_FOLDER) return;

    const targetFilename = path.join(WORKSPACE_FOLDER, filename);
    let templateFilename = path.join(templatePath, filename);

    if (filename === '.clang-tidy' && !isCppProject) {
      templateFilename = templateFilename.replace(
        '.clang-tidy',
        '.clang-tidy_c',
      );
    }

    try {
      const templateData = fs.readFileSync(templateFilename);
      fs.writeFileSync(targetFilename, templateData);
    } catch (err) {
      vscode.window.showErrorMessage(
        `Could not create file: ${targetFilename}`,
      );
      return;
    }
  });
}

function writeLocalVscodeDirMinimalFiles(
  vscodePath: string,
  templateOsPath: string,
) {
  VSCODE_DIR_MINIMAL_FILES.forEach((filename) => {
    const targetFilename = path.join(vscodePath, filename);
    const templateOsFilename = path.join(templateOsPath, filename);

    let templateData: { [key: string]: any } = readJsonFile(templateOsFilename);
    templateData = removeFullEntries(templateData);
    writeJsonFile(targetFilename, templateData);
  });
}
