import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // --------------------------------------------------
  // USERS
  // --------------------------------------------------

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@example.com',
    },
    update: {
      fullName: 'Administrator',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
    create: {
      fullName: 'Administrator',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: {
      email: 'user@example.com',
    },
    update: {
      fullName: 'Test User',
      passwordHash: userPassword,
      role: 'USER',
    },
    create: {
      fullName: 'Test User',
      email: 'user@example.com',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  // --------------------------------------------------
  // ROOM TYPES
  // --------------------------------------------------

  const classroom = await prisma.roomType.upsert({
    where: {
      name: 'Classroom',
    },
    update: {},
    create: {
      name: 'Classroom',
      description: 'Standard classroom for lectures and exercises.',
    },
  });

  const amphitheater = await prisma.roomType.upsert({
    where: {
      name: 'Amphitheater',
    },
    update: {},
    create: {
      name: 'Amphitheater',
      description: 'Large room suitable for lectures and presentations.',
    },
  });

  const meetingRoom = await prisma.roomType.upsert({
    where: {
      name: 'Meeting Room',
    },
    update: {},
    create: {
      name: 'Meeting Room',
      description: 'Smaller room suitable for meetings.',
    },
  });

  const computerLab = await prisma.roomType.upsert({
    where: {
      name: 'Computer Lab',
    },
    update: {},
    create: {
      name: 'Computer Lab',
      description: 'Computer-equipped room for practical exercises.',
    },
  });

  // --------------------------------------------------
  // BUILDINGS
  // --------------------------------------------------

  const building1 = await prisma.building.create({
    data: {
      name: 'Main Building',
      address: 'Bulevar oslobođenja 1',
      description: 'Main university building.',
    },
  });

  const building2 = await prisma.building.create({
    data: {
      name: 'Science Building',
      address: 'Univerzitetski trg 2',
      description: 'Building dedicated to science and education.',
    },
  });

  const building3 = await prisma.building.create({
    data: {
      name: 'Conference Center',
      address: 'Studentska 10',
      description: 'Modern conference and meeting center.',
    },
  });

  // --------------------------------------------------
  // WORKING HOURS
  // --------------------------------------------------
  // Date is irrelevant for the application;
  // only the time portion is used.
  // We use the same arbitrary date for all rooms.

  const workingHoursStart = new Date('1970-01-01T08:00:00');
  const workingHoursEnd = new Date('1970-01-01T20:00:00');

  // --------------------------------------------------
  // ROOMS - MAIN BUILDING
  // --------------------------------------------------

  const room101 = await prisma.room.create({
    data: {
      name: 'Room 101',
      capacity: 30,
      buildingId: building1.id,
      roomTypeId: classroom.id,
      workingHoursStart,
      workingHoursEnd,
    },
  });

  const room102 = await prisma.room.create({
    data: {
      name: 'Room 102',
      capacity: 25,
      buildingId: building1.id,
      roomTypeId: classroom.id,
      workingHoursStart,
      workingHoursEnd,
    },
  });

  const mainAmphitheater = await prisma.room.create({
    data: {
      name: 'Main Amphitheater',
      capacity: 150,
      buildingId: building1.id,
      roomTypeId: amphitheater.id,
      workingHoursStart,
      workingHoursEnd,
    },
  });

  // --------------------------------------------------
  // ROOMS - SCIENCE BUILDING
  // --------------------------------------------------

  const computerLab1 = await prisma.room.create({
    data: {
      name: 'Computer Lab 1',
      capacity: 35,
      buildingId: building2.id,
      roomTypeId: computerLab.id,
      workingHoursStart,
      workingHoursEnd,
    },
  });

  const computerLab2 = await prisma.room.create({
    data: {
      name: 'Computer Lab 2',
      capacity: 30,
      buildingId: building2.id,
      roomTypeId: computerLab.id,
      workingHoursStart,
      workingHoursEnd,
    },
  });

  const scienceClassroom = await prisma.room.create({
    data: {
      name: 'Science Classroom',
      capacity: 40,
      buildingId: building2.id,
      roomTypeId: classroom.id,
      workingHoursStart,
      workingHoursEnd,
    },
  });

  // --------------------------------------------------
  // ROOMS - CONFERENCE CENTER
  // --------------------------------------------------

  const conferenceHall = await prisma.room.create({
    data: {
      name: 'Conference Hall',
      capacity: 200,
      buildingId: building3.id,
      roomTypeId: amphitheater.id,
      workingHoursStart,
      workingHoursEnd,
    },
  });

  const meetingRoom1 = await prisma.room.create({
    data: {
      name: 'Meeting Room A',
      capacity: 12,
      buildingId: building3.id,
      roomTypeId: meetingRoom.id,
      workingHoursStart,
      workingHoursEnd,
    },
  });

  const meetingRoom2 = await prisma.room.create({
    data: {
      name: 'Meeting Room B',
      capacity: 10,
      buildingId: building3.id,
      roomTypeId: meetingRoom.id,
      workingHoursStart,
      workingHoursEnd,
    },
  });

  console.log('');
  console.log('Database seeded successfully!');
  console.log('');
  console.log('Users:');
  console.log(`  ADMIN: ${admin.email} / admin123`);
  console.log(`  USER:  ${user.email} / user123`);
  console.log('');
  console.log('Buildings: 3');
  console.log('Rooms: 9');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });