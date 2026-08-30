import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.PORT || 5000;
const COOKIE_NAME = process.env.COOKIE_NAME || 'conference_book_cookie';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ConferenceBook API',
      version: '1.0.0',
      description: 'OpenAPI (Swagger) dokumentacija za ConferenceBook backend.',
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Local' }],

    tags: [
      { name: 'Health', description: 'Health check endpoint' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Buildings', description: 'Buildings endpoints' },
      { name: 'RoomTypes', description: 'Room types endpoints' },
      { name: 'Rooms', description: 'Rooms endpoints' },
      { name: 'Reservations', description: 'Reservations endpoints' },
      { name: 'Admin', description: 'Admin analytics endpoints' },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: COOKIE_NAME,
        },
      },

      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Server error.' },
          },
        },

        // ---------- AUTH ----------
        RegisterRequest: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            fullName: { type: 'string', example: 'Nikola Raičević' },
            email: {
              type: 'string',
              format: 'email',
              example: 'test@mail.com',
            },
            password: { type: 'string', example: 'StrongPass123!' },
          },
        },

        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'test@mail.com',
            },
            password: { type: 'string', example: 'StrongPass123!' },
          },
        },

        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            fullName: { type: 'string', example: 'Nikola Raičević' },
            email: {
              type: 'string',
              format: 'email',
              example: 'test@mail.com',
            },
            role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- BUILDINGS ----------
        Building: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Main Building' },
            address: { type: 'string', example: 'Zemun, Beograd' },
            description: {
              type: 'string',
              nullable: true,
              example: 'Conference venue',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        CreateBuildingRequest: {
          type: 'object',
          required: ['name', 'address'],
          properties: {
            name: { type: 'string', example: 'Main Building' },
            address: { type: 'string', example: 'Zemun, Beograd' },
            description: {
              type: 'string',
              nullable: true,
              example: 'Conference venue',
            },
          },
        },

        UpdateBuildingRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated Building Name' },
            address: { type: 'string', example: 'Updated address' },
            description: {
              type: 'string',
              nullable: true,
              example: 'Updated description',
            },
          },
        },

        // ---------- ROOM TYPES ----------
        RoomType: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Lecture Hall' },
            description: {
              type: 'string',
              nullable: true,
              example: 'Big hall for lectures',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        CreateRoomTypeRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Lecture Hall' },
            description: {
              type: 'string',
              nullable: true,
              example: 'Big hall for lectures',
            },
          },
        },

        UpdateRoomTypeRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated type' },
            description: {
              type: 'string',
              nullable: true,
              example: 'Updated description',
            },
          },
        },

        // ---------- ROOMS ----------
        Room: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 10 },
            name: { type: 'string', example: 'Room A1' },
            capacity: { type: 'integer', example: 30 },
            buildingId: { type: 'integer', example: 1 },
            roomTypeId: { type: 'integer', example: 2 },
            workingHoursStart: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-23T08:00:00.000Z',
            },
            workingHoursEnd: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-23T16:00:00.000Z',
            },
            building: { $ref: '#/components/schemas/Building' },
            roomType: { $ref: '#/components/schemas/RoomType' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        CreateRoomRequest: {
          type: 'object',
          required: [
            'name',
            'capacity',
            'buildingId',
            'roomTypeId',
            'workingHoursStart',
            'workingHoursEnd',
          ],
          properties: {
            name: { type: 'string', example: 'Room A1' },
            capacity: { type: 'integer', example: 30 },
            buildingId: { type: 'integer', example: 1 },
            roomTypeId: { type: 'integer', example: 2 },
            workingHoursStart: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-23T08:00:00.000Z',
            },
            workingHoursEnd: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-23T16:00:00.000Z',
            },
          },
        },

        UpdateRoomRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated room name' },
            capacity: { type: 'integer', example: 40 },
            buildingId: { type: 'integer', example: 1 },
            roomTypeId: { type: 'integer', example: 2 },
            workingHoursStart: { type: 'string', format: 'date-time' },
            workingHoursEnd: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- RESERVATIONS ----------
        ReservationUser: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            fullName: { type: 'string', example: 'Nikola Raičević' },
            email: {
              type: 'string',
              format: 'email',
              example: 'test@mail.com',
            },
            role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
          },
        },

        ReservationRoomLite: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 10 },
            name: { type: 'string', example: 'Room A1' },
            capacity: { type: 'integer', example: 30 },
            buildingId: { type: 'integer', example: 1 },
            roomTypeId: { type: 'integer', example: 2 },
          },
        },

        Reservation: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 100 },
            userId: { type: 'integer', example: 1 },
            roomId: { type: 'integer', example: 10 },
            startTime: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-23T09:00:00.000Z',
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-23T09:30:00.000Z',
            },
            user: { $ref: '#/components/schemas/ReservationUser' },
            room: { $ref: '#/components/schemas/ReservationRoomLite' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        CreateReservationRequest: {
          type: 'object',
          required: ['roomId', 'startTime', 'endTime'],
          properties: {
            roomId: { type: 'integer', example: 10 },
            startTime: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-23T09:00:00.000Z',
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-23T09:30:00.000Z',
            },
          },
        },

        UpdateReservationRequest: {
          type: 'object',
          required: ['startTime', 'endTime'],
          properties: {
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- ADMIN STATS ----------
        AdminStatsResponse: {
          type: 'object',
          properties: {
            kpis: {
              type: 'object',
              properties: {
                usersCount: { type: 'integer', example: 20 },
                adminsCount: { type: 'integer', example: 2 },
                buildingsCount: { type: 'integer', example: 3 },
                roomTypesCount: { type: 'integer', example: 4 },
                roomsCount: { type: 'integer', example: 15 },
                reservationsCount: { type: 'integer', example: 120 },
                reservationsTodayCount: { type: 'integer', example: 5 },
                reservationsNext7DaysCount: { type: 'integer', example: 30 },
              },
            },
            charts: {
              type: 'object',
              properties: {
                reservationsPerDay: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      date: { type: 'string', example: '2026-02-23' },
                      count: { type: 'integer', example: 3 },
                    },
                  },
                },
                reservationsByBuilding: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      buildingId: { type: 'integer', example: 1 },
                      buildingName: {
                        type: 'string',
                        example: 'Main Building',
                      },
                      count: { type: 'integer', example: 50 },
                    },
                  },
                },
                reservationsByRoomType: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      roomTypeId: { type: 'integer', example: 2 },
                      roomTypeName: { type: 'string', example: 'Lecture Hall' },
                      count: { type: 'integer', example: 40 },
                    },
                  },
                },
                topRooms: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      roomId: { type: 'integer', example: 10 },
                      roomName: { type: 'string', example: 'Room A1' },
                      buildingName: {
                        type: 'string',
                        example: 'Main Building',
                      },
                      roomTypeName: { type: 'string', example: 'Lecture Hall' },
                      count: { type: 'integer', example: 18 },
                    },
                  },
                },
              },
            },
            meta: {
              type: 'object',
              properties: {
                days: { type: 'integer', example: 30 },
                generatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  },

  apis: ['./routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
