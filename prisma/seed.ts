import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      role: 'ADMIN',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      role: 'USER',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie Davis',
      role: 'USER',
    },
  });

  console.log('✅ Created users:', { alice: alice.id, bob: bob.id, charlie: charlie.id });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Next.js 15',
      content: 'This is a comprehensive guide to Next.js 15 and its new features.',
      status: 'PUBLISHED',
      published: true,
      authorId: alice.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Introduction to Prisma',
      content: 'Learn how to use Prisma ORM with PostgreSQL.',
      status: 'PUBLISHED',
      published: true,
      authorId: bob.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'TypeScript Best Practices',
      content: 'A collection of TypeScript patterns and best practices.',
      status: 'DRAFT',
      published: false,
      authorId: charlie.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Building Accessible UIs',
      content: 'How to create accessible user interfaces with Base UI.',
      status: 'PUBLISHED',
      published: true,
      authorId: alice.id,
    },
  });

  console.log('✅ Created posts:', {
    post1: post1.id,
    post2: post2.id,
    post3: post3.id,
    post4: post4.id,
  });

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
