import type { Draw, Person } from "@prisma/client";
import { prisma } from "~/db.server";

export function getDraw({ year }: Pick<Draw, "year">) {
  return prisma.draw.findUnique({
    where: {
      year,
    },
    select: {
      year: true,
      players: {
        select: {
          person: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          assigned: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}

export function getPersons() {
  return prisma.person.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
}

export function createDraw({ year }: Pick<Draw, "year">) {
  return prisma.draw.create({ data: { year } });
}

export function deleteDraw({ year }: Pick<Draw, "year">) {
  return prisma.draw.delete({ where: { year } });
}

export async function addPerson({
  year,
  id,
}: Pick<Draw, "year"> & Pick<Person, "id">) {
  const draw = await getDraw({ year });

  if (!draw) {
    return;
  }

  await prisma.player.create({
    data: {
      drawYear: year,
      personId: id,
    },
  });
}
