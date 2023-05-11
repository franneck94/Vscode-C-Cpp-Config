import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import {
  filesInDir,
  mkdirRecursive,
  pathExists,
  readJsonFile,
  writeJsonFile,
} from './utils/fileUtils';
import { getGlobalSetting } from './utils/settings';
import { getOperatingSystem } from './utils/systemUtils';
import { LanguageMode, OperatingSystems } from './utils/types';
import { disposeItem } from './utils/vscodeUtils';

let generateCCommandDisposable: vscode.Disposable | undefined;
let generateCppCommandDisposable: vscode.Disposable | undefined;
let extensionPath: string | undefined;

const VSCODE_DIR_FILES = ['settings.json'];
const ROOT_DIR_FILES = [
  '.clang-format',
  '.clang-tidy',
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
];

const ROOT_DIR_CMAKE_PROJECT_FILES = [
  '.pre-commit-config.yaml',
  '.cmake-format.yaml',
  'Makefile',
];

const TOOLS_DIR_CMAKE_PROJECT_FILES = [
  'iwyu_tool.py',
  'run-clang-format.py',
  'run-clang-tidy.py',
];

const GITHUB_DIR_CMAKE_PROJECT_FILES = [
  'codeql.yml',
  'documentation.yml',
  'macos.yml',
  'pre-commit.yml',
  'ubuntu.yml',
  'windows.yml',
];

export const EXTENSION_NAME = 'C_Cpp_Config';
export let WORKSPACE_FOLDER: string | undefined;
export let OPERATING_SYSTEM: OperatingSystems | undefined;

let LINE_LENGTH: number = 120;
let IS_AGGRESSIVE: boolean = false;
let IS_CMAKE_PROJECT: boolean = false;

function getCurrentGlobalSettings() {
  IS_AGGRESSIVE = getGlobalSetting(EXTENSION_NAME, 'aggressiveSettings', false);
  LINE_LENGTH = getGlobalSetting(EXTENSION_NAME, 'lineLength', 120);

  if (!WORKSPACE_FOLDER) return;
  const rootFiles = filesInDir(WORKSPACE_FOLDER);

  IS_CMAKE_PROJECT = rootFiles.some(
    (file: string) => path.basename(file) === 'CMakeLists.txt',
  );
}

export function activate(context: vscode.ExtensionContext) {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length !== 1 ||
    !vscode.workspace.workspaceFolders[0] ||
    !vscode.workspace.workspaceFolders[0].uri
  ) {
    WORKSPACE_FOLDER = '';
  } else {
    WORKSPACE_FOLDER = vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  extensionPath = context.extensionPath;
  OPERATING_SYSTEM = getOperatingSystem();

  initGenerateCCommandDisposable(context);
  initGenerateCppCommandDisposable(context);
}

export function deactivate() {
  disposeItem(generateCCommandDisposable);
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
      if (!WORKSPACE_FOLDER) {
        vscode.window.showErrorMessage('No workspace opened!');
        return;
      }

      const currentFolder = WORKSPACE_FOLDER?.toLowerCase();
      if (!WORKSPACE_FOLDER || WORKSPACE_FOLDER === undefined) return;

      getCurrentGlobalSettings();

      if (currentFolder && isCppCourse(currentFolder)) {
        writeFiles(LanguageMode.CPP); // C command, called in Cpp course
        return;
      }

      writeFiles(LanguageMode.C); // C command, correctly called
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
      if (!WORKSPACE_FOLDER) {
        vscode.window.showErrorMessage('No workspace opened!');
        return;
      }

      const currentFolder = WORKSPACE_FOLDER?.toLowerCase();
      if (!WORKSPACE_FOLDER || WORKSPACE_FOLDER === undefined) return;

      getCurrentGlobalSettings();

      if (currentFolder && isCCourse(currentFolder)) {
        writeFiles(LanguageMode.C); // Cpp command, called in C course
        return;
      }

      writeFiles(LanguageMode.CPP); // Cpp command, correctly called
    },
  );

  context?.subscriptions.push(generateCppCommandDisposable);
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

function safeMkdir(path: string) {
  if (!pathExists(path)) mkdirRecursive(path);

  if (!pathExists(path)) {
    const message = 'Error: .vscode folder could not be generated.';
    vscode.window.showErrorMessage(message);
    return false;
  }

  return true;
}

function writeFiles(languageMode: LanguageMode) {
  const { templateOsPath, templatePath, vscodePath } = getFilepaths();
  if (!templateOsPath || !templatePath || !vscodePath) return;

  if (!safeMkdir(vscodePath)) return;

  VSCODE_DIR_FILES.forEach((filename) => {
    const targetFilename = path.join(vscodePath, filename);
    const templateOsFilename = path.join(templateOsPath, filename);

    if (filename === 'settings.json') {
      const templateData: {
        [key: string]: string | any[] | boolean | number | any;
      } = readJsonFile(templateOsFilename);

      if (LINE_LENGTH >= 80) {
        templateData['editor.rulers'] = [LINE_LENGTH];
      }
      if (IS_AGGRESSIVE) {
        templateData['[c]']['editor.formatOnSave'] = true;
        templateData['[cpp]']['editor.formatOnSave'] = true;
        templateData['errorLens.enabled'] = true;
      }

      writeJsonFile(targetFilename, templateData);
    }
  });

  writeRootDirFiles(templatePath, languageMode);
  if (IS_CMAKE_PROJECT) writeRootDirCmakeFiles(templatePath);
  if (IS_CMAKE_PROJECT) writeToolsDirCmakeFiles(templatePath);
  if (IS_CMAKE_PROJECT) writeGithubDirCmakeFiles(templatePath);
}

function writeRootDirFiles(templatePath: string, languageMode: LanguageMode) {
  ROOT_DIR_FILES.forEach((filename) => {
    if (!WORKSPACE_FOLDER) return;

    const targetFilename = path.join(WORKSPACE_FOLDER, filename);
    let templateFilename = path.join(templatePath, filename);

    if (filename === '.clang-tidy' && languageMode === LanguageMode.C) {
      templateFilename = templateFilename.replace(
        '.clang-tidy',
        '.clang-tidy_c',
      );
    }

    try {
      let templateData = fs.readFileSync(templateFilename);

      if (filename === '.clang-format') {
        const data = templateData.toString().split('\n');
        const modifiedData = data.map((line: string) => {
          if (line.includes('ColumnLimit')) {
            return `ColumnLimit:     ${LINE_LENGTH}`;
          } else {
            return line;
          }
        });
        templateData = Buffer.from(modifiedData.join('\r\n'), 'utf8');
      }

      fs.writeFileSync(targetFilename, templateData);
    } catch (err) {
      vscode.window.showErrorMessage(
        `Could not create file: ${targetFilename}`,
      );
      return;
    }
  });
}

function writeRootDirCmakeFiles(templatePath: string) {
  ROOT_DIR_CMAKE_PROJECT_FILES.forEach((filename) => {
    if (!WORKSPACE_FOLDER) return;

    const targetFilename = path.join(WORKSPACE_FOLDER, filename);
    const templateFilename = path.join(templatePath, filename);

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

function writeToolsDirCmakeFiles(templatePath: string) {
  if (!WORKSPACE_FOLDER) return;
  if (!safeMkdir(path.join(WORKSPACE_FOLDER, 'tools'))) return;

  TOOLS_DIR_CMAKE_PROJECT_FILES.forEach((filename) => {
    if (!WORKSPACE_FOLDER) return;
    const targetFilename = path.join(WORKSPACE_FOLDER, 'tools', filename);
    const templateFilename = path.join(templatePath, 'tools', filename);

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

function writeGithubDirCmakeFiles(templatePath: string) {
  if (!WORKSPACE_FOLDER) return;
  if (!safeMkdir(path.join(WORKSPACE_FOLDER, '.github', 'workflows'))) return;

  GITHUB_DIR_CMAKE_PROJECT_FILES.forEach((filename) => {
    if (!WORKSPACE_FOLDER) return;
    const targetFilename = path.join(
      WORKSPACE_FOLDER,
      '.github',
      'workflows',
      filename,
    );
    const templateFilename = path.join(
      templatePath,
      '.github',
      'workflows',
      filename,
    );

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
