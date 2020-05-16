const main = [
  {
    header: 'Example App',
    content:
      'Generates something {italic very} important. This is a rather long, but ultimately inconsequential description intended solely to demonstrate description appearance. ',
  },
  {
    header: 'Synopsis',
    content: '$ app <options> <command>',
  },
  {
    header: 'Command List',
    content: [
      { name: 'help', summary: 'Display help information about Git.' },
      { name: 'commit', summary: 'Record changes to the repository.' },
      { name: 'Version', summary: 'Print the version.' },
      { name: 'etc', summary: 'Etc.' },
    ],
  },
];

const coolCommand = [
  {
    header: 'A typical cool command',
    content:
      'Generates something {italic very} important. This is a rather long, but ultimately inconsequential description intended solely to demonstrate description appearance. ',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'help',
        description: 'Display this usage guide.',
        alias: 'h',
        type: Boolean,
      },
      {
        name: 'src',
        description:
          'The input files to process. This is some additional text existing solely to demonstrate word-wrapping, nothing more, nothing less. And nothing in between.',
        type: String,
        multiple: true,
        defaultOption: true,
        typeLabel: '{underline file} ...',
      },
      {
        name: 'timeout',
        description: 'Timeout value in ms.',
        alias: 't',
        type: Number,
        typeLabel: '{underline ms}',
      },
    ],
  },
  {
    content: 'Project home: {underline https://github.com/me/example}',
  },
];

module.exports = {
  commands: {
    main: main,
    cool: coolCommand,
  },
};
