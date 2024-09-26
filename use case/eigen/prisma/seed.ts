import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Members
  const members = await prisma.member.createMany({
    data: [
      { username: 'member1', penaltyExpires: null },
      { username: 'member2', penaltyExpires: null },
      { username: 'member3', penaltyExpires: null },
      { username: 'member4', penaltyExpires: new Date('2024-09-30') },
      { username: 'member5', penaltyExpires: null },
    ],
  });

  console.log(`Created ${members.count} members`);

  // Seed Books
  const books = await prisma.book.createMany({
    data: [
      { title: 'Book One', author: 'Author A', stock: 5 },
      { title: 'Book Two', author: 'Author B', stock: 3 },
      { title: 'Book Three', author: 'Author C', stock: 8 },
      { title: 'Book Four', author: 'Author D', stock: 2 },
      { title: 'Book Five', author: 'Author E', stock: 10 },
    ],
  });

  console.log(`Created ${books.count} books`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
