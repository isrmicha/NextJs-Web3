import Home from "@/components/Home";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function Page() {
  const findMany = async (walletId) => {
    "use server";
    return await prisma.task.findMany({
      where: {
        owner: walletId,
      },
    });
  };
  const create = async (data) => {
    "use server";

    return await prisma.task.create({
      data,
    });
  };

  return <Home findMany={findMany} create={create} />;
}
