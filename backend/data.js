// Mock data for Netflix-like titles
const TITLES = [
  { 
    id: 1, 
    name: "Stranger Things", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg" 
  },
  { 
    id: 2, 
    name: "The Witcher", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/zrPpUlehQaBf8YX2NrVrKK8IEpf.jpg" 
  },
  { 
    id: 3, 
    name: "Wednesday", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/9PFonBhy4cQy7Jz20NpMygczOkv.jpg" 
  },
  { 
    id: 4, 
    name: "Money Heist", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg" 
  },
  { 
    id: 5, 
    name: "Squid Game", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg" 
  },
  { 
    id: 6, 
    name: "Breaking Bad", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg" 
  },
  { 
    id: 7, 
    name: "Dark", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/56v2KjBlU4XaOv9rVYEQypROD7P.jpg" 
  },
  { 
    id: 8, 
    name: "The Crown", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/1M876KPjulVwppEpldhdc8V4o68.jpg" 
  },
  { 
    id: 9, 
    name: "Bridgerton", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg" 
  },
  { 
    id: 10, 
    name: "The Umbrella Academy", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/qhcwrnnCpuek4qCJbhz7qVl7CYY.jpg" 
  },
  { 
    id: 11, 
    name: "Extraction", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/wlfDxbGEsW58vGhFljKkcR5IxDj.jpg" 
  },
  { 
    id: 12, 
    name: "The Irishman", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg" 
  },
  { 
    id: 13, 
    name: "Don't Look Up", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/th4E1yqsE8DGpAseLiUrI60Hf8V.jpg" 
  },
  { 
    id: 14, 
    name: "Red Notice", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/lAXONuqg41NwUMuzMiFvicDET9q.jpg" 
  },
  { 
    id: 15, 
    name: "Glass Onion", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg" 
  },
  { 
    id: 16, 
    name: "The Gray Man", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/5mzr6JZbrqnqD8rCEvPhuCE5Fw2.jpg" 
  },
  { 
    id: 17, 
    name: "Enola Holmes", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/riYInlsq2kf1AWoGm80JQW5dLKp.jpg" 
  },
  { 
    id: 18, 
    name: "Army of the Dead", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/z8CExJekGrEThbpMXAmCFvvgoJR.jpg" 
  },
  { 
    id: 19, 
    name: "Black Mirror", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/5UaYsGZOFhjFDwQix4SvpL02xdl.jpg" 
  },
  { 
    id: 20, 
    name: "Narcos", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/rTmal9fDbwh5F0waol2hq35U4ah.jpg" 
  },
  { 
    id: 21, 
    name: "Ozark", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/6p8HCjccLdQOlhVVTJEVWkGQ2L5.jpg" 
  },
  { 
    id: 22, 
    name: "Lupin", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/sgxawbFB5Vi5OkPWmvLP9iAIKx8.jpg" 
  },
  { 
    id: 23, 
    name: "The Queen's Gambit", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg" 
  },
  { 
    id: 24, 
    name: "Sweet Tooth", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/1hP8ZODhWaJP0Pq33f0t0w9N7lG.jpg" 
  },
  { 
    id: 25, 
    name: "You", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/7bEYwjUvlJW7GerM8GYmqwl4oS3.jpg" 
  },
  { 
    id: 26, 
    name: "Emily in Paris", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/qeUYj5CuD3ALZ0r3jPPO7gLuM7e.jpg" 
  },
  { 
    id: 27, 
    name: "All of Us Are Dead", 
    type: "series", 
    image: "https://image.tmdb.org/t/p/w200/pTmBaVrfhKCWE5FbJJBZVLhZn5U.jpg" 
  },
  { 
    id: 28, 
    name: "The Platform", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/8ZX18L5m6rH5viSYpRnTSbb9eXh.jpg" 
  },
  { 
    id: 29, 
    name: "Bird Box", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/rGfGfgL2pEPCfhIvqHXieXFn7gp.jpg" 
  },
  { 
    id: 30, 
    name: "The Adam Project", 
    type: "movie", 
    image: "https://image.tmdb.org/t/p/w200/wFjboE0aFZNbVOF05fzrka9Fqyx.jpg" 
  }
];

module.exports = { TITLES };
