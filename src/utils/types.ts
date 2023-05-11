export enum OperatingSystems {
  windows = 'windows',
  linux = 'linux',
  mac = 'macos',
  unknown = 'unk',
}

export interface JsonSettings {
  [name: string]: string;
}

export enum LanguageMode {
  C = 'c',
  CPP = 'cpp',
}
