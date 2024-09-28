import prisma from "@/src/db";
import Diary from "@/components/diary/Diary"
const data = require("@/src/x.json")

const Page = async () => {
  const notes = await prisma.notes.findMany()
  return <Diary initData={{data, notes}}/>
};


export default Page;
