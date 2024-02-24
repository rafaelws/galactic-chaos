const base = import.meta.env.BASE_URL;

export const audio = {
  menu: {
    main: `${base}audio/main-menu.ogg`,
    pause: `${base}audio/pause.ogg`,
    gameOver: `${base}audio/game-over.ogg`,
    // gameEnd: "",
  },
  levels: [
    {
      theme: `${base}audio/level1/theme.ogg`,
      boss: `${base}audio/level1/boss.ogg`,
    },
  ],
} as const;
