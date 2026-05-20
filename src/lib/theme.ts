export const colors = {
  parchment: '#E8D5B7',
  parchmentDark: '#D4B896',
  ink: '#3A2818',
  inkDark: '#2C1810',
  gold: '#B8860B',
  goldLight: '#C9A96E',
  seal: '#8B0000',
  sealLight: '#A0312F',
} as const;

export const tagColors: Record<string, string> = {
  苦痛: '#7A2C2C',
  違和感: '#B89968',
  欲求: '#A0522D',
  気づき: '#4A5D3A',
  閃き: '#B8860B',
  兆し: '#4B2C5E',
  夢: '#2C3E5C',
};

export const tagPortraits: Record<string, string> = {
  苦痛: '/assets/portraits/01_edison.png',
  違和感: '/assets/portraits/02_copernicus.png',
  欲求: '/assets/portraits/03_wright_bros.png',
  気づき: '/assets/portraits/04_newton.png',
  閃き: '/assets/portraits/05_archimedes.png',
  兆し: '/assets/portraits/06_da_vinci.png',
  夢: '/assets/portraits/07_einstein.png',
};

export const tagQuotes: Record<string, { text: string; author: string }> = {
  苦痛: {
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: 'Thomas Edison',
  },
  違和感: {
    text: 'To know that we know what we know...',
    author: 'Nicolaus Copernicus',
  },
  欲求: {
    text: 'Flight is possible to man.',
    author: 'Wright Brothers',
  },
  気づき: {
    text: 'If I have seen further it is by standing on the shoulders of Giants.',
    author: 'Isaac Newton',
  },
  閃き: {
    text: 'Eureka!',
    author: 'Archimedes',
  },
  兆し: {
    text: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci',
  },
  夢: {
    text: 'Imagination is more important than knowledge.',
    author: 'Albert Einstein',
  },
};

export const ALL_TAGS = ['苦痛', '違和感', '欲求', '気づき', '閃き', '兆し', '夢'] as const;
