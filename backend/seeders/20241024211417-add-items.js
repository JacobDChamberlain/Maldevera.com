'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('items', [
      {
        "id": 1,
        "name": "Blue Jeff - XS",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "XS",
        "stock": 0,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 2,
        "name": "Blue Jeff - S",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "S",
        "stock": 3,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 3,
        "name": "Blue Jeff - M",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "M",
        "stock": 3,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 4,
        "name": "Blue Jeff - L",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "L",
        "stock": 5,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 5,
        "name": "Blue Jeff - XL",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "XL",
        "stock": 4,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 6,
        "name": "Blue Jeff - XXL",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "XXL",
        "stock": 4,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 7,
        "name": "Blue Jeff - XXXL",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "XXXL",
        "stock": 2,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 8,
        "name": "Mouthful Of Concrete - S",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/MOUTHFUL-OF-CONCRETE.png"
        ],
        "description": "Jeff does a curbstomp",
        "price": 19.99,
        "size": "S",
        "stock": 1,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 9,
        "name": "Mouthful Of Concrete - M",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/MOUTHFUL-OF-CONCRETE.png"
        ],
        "description": "Jeff does a curbstomp",
        "price": 19.99,
        "size": "M",
        "stock": 1,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 10,
        "name": "From Man To Mist (CD)",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/CD-FM2M.png"
        ],
        "description": "Maldevera's debut album, \" From Man To Mist\", on CD",
        "price": 6.99,
        "size": null,
        "stock": 51,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 11,
        "name": "LIVE @ Haltom Theater (CD)",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/CD-LiveAtHaltomTheater.png"
        ],
        "description": "Blistering live recording of Maldevera's performance at Haltom Theater with fill-in drummer, Stephan the Relentless, 2024",
        "price": 4.99,
        "size": null,
        "stock": 48,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 12,
        "name": "From Man To Mist (Cassette)",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/CASSETTE-FM2M.png"
        ],
        "description": "Maldevera's debut album, \" From Man To Mist\", on analog tape",
        "price": 6.99,
        "size": null,
        "stock": 13,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 13,
        "name": "Mouthful Of Concrete Single (Floppy)",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/FLOPPY-MouthfulSingle.png"
        ],
        "description": "Mouthful of Concrete in retro floppy format",
        "price": 4.99,
        "size": null,
        "stock": 20,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 14,
        "name": "Maldevera Logo Patch",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/PATCH-logo-redwhite.png"
        ],
        "description": "Official Maldevera logo patch for your battle jacket",
        "price": 6.99,
        "size": null,
        "stock": 198,
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('items', null, {});
  }
};
