// src/config/pictureHuntConfig.js

export const PICTURE_HUNT_CONFIG = {
  "M1": {
    0: {
      image:
        "/PictureHunt.png", // 👈 PUT IMAGE URL HERE (GDrive thumbnail or CDN)

      timeLimit: 45, // seconds

      hhotspots: [
        // CCTV
        // { x: 8,  y: 20, radius: 8, correct: true },

        // Smart fridge
        { x: 38, y: 28, radius: 10, correct: true },

        // Robot vacuum
        { x: 86, y: 18, radius: 9, correct: true },

        // Photoshop / AI editing
        { x: 20, y: 45, radius: 9, correct: true },

        // Robot toy
        // { x: 55, y: 45, radius: 8, correct: true },

        // Smart speaker
        { x: 12, y: 70, radius: 9, correct: true },

        // Face recognition tablet
        { x: 55, y: 72, radius: 8, correct: true },

        // YouTube
        { x: 88, y: 72, radius: 9, correct: true }
      ]
    },
  },
};
