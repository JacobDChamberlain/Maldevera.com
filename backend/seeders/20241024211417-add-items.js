'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('items', [
      {
        "id": 1,
        "name": "Blue Jeff - S",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "S",
        "stock": 3,
        "price_id": "price_1QXEJ3AEeG2ky4mQynRx2Ycm",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 2,
        "name": "Blue Jeff - M",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "M",
        "stock": 3,
        "price_id": "price_1QXEJOAEeG2ky4mQCAA2fLGg",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 3,
        "name": "Blue Jeff - L",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "L",
        "stock": 5,
        "price_id": "price_1QXEKPAEeG2ky4mQVCtCg1Gj",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 4,
        "name": "Blue Jeff - XL",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "XL",
        "stock": 4,
        "price_id": "price_1QXEKkAEeG2ky4mQd9EJ4ZCP",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 5,
        "name": "Blue Jeff - XXL",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "XXL",
        "stock": 4,
        "price_id": "price_1QXEL8AEeG2ky4mQtPKgeuZ5",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 6,
        "name": "Blue Jeff - XXXL",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/BLUE-JEFF.png"
        ],
        "description": "A wild BLUE JEFF appears...",
        "price": 19.99,
        "size": "XXXL",
        "stock": 2,
        "price_id": "price_1QXELZAEeG2ky4mQPlRsKctH",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 7,
        "name": "Mouthful Of Concrete - S",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/MOUTHFUL-OF-CONCRETE.png"
        ],
        "description": "Jeff does a curbstomp",
        "price": 24.99,
        "size": "S",
        "stock": 1,
        "price_id": "price_1QXENLAEeG2ky4mQCPRRyHOI",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 8,
        "name": "Mouthful Of Concrete - M",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/MOUTHFUL-OF-CONCRETE.png"
        ],
        "description": "Jeff does a curbstomp",
        "price": 24.99,
        "size": "M",
        "stock": 1,
        "price_id": "price_1QXEQPAEeG2ky4mQdTBOtHDl",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 9,
        "name": "From Man To Mist (CD)",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/CD-FM2M.png"
        ],
        "description": "Maldevera's debut album, \" From Man To Mist\", on CD",
        "price": 6.99,
        "size": null,
        "stock": 51,
        "price_id": "price_1QXESlAEeG2ky4mQeen3rjR6",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 10,
        "name": "LIVE @ Haltom Theater (CD)",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/CD-LiveAtHaltomTheater.png"
        ],
        "description": "Blistering live recording of Maldevera's performance at Haltom Theater with fill-in drummer, Stephan the Relentless, 2024",
        "price": 4.99,
        "size": null,
        "stock": 48,
        "price_id": "price_1QXETaAEeG2ky4mQhCJzEgh4",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 11,
        "name": "From Man To Mist (Cassette)",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/CASSETTE-FM2M.png"
        ],
        "description": "Maldevera's debut album, \" From Man To Mist\", on analog tape",
        "price": 6.99,
        "size": null,
        "stock": 13,
        "price_id": "price_1QXEWhAEeG2ky4mQ7i00S45E",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 12,
        "name": "Mouthful Of Concrete Single (Floppy)",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/FLOPPY-MouthfulSingle.png"
        ],
        "description": "Mouthful of Concrete in retro floppy format",
        "price": 4.99,
        "size": null,
        "stock": 20,
        "price_id": "price_1QXEZDAEeG2ky4mQ3b7HnQBJ",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "id": 13,
        "name": "Maldevera Logo Patch",
        "images": [
          "https://pub-66308e1fd62346cc9ef2c3cfc4134db4.r2.dev/PATCH-logo-redwhite.png"
        ],
        "description": "Official Maldevera logo patch for your battle jacket",
        "price": 6.99,
        "size": null,
        "stock": 198,
        "price_id": "price_1QXEZgAEeG2ky4mQIW9GAMYS",
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('items', null, {});
  }
};
