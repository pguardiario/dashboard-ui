// import prisma from "@/src/db";
import Diary from "@/components/Diary"
const data = require("@/src/x.json")

const Page = async () => {
  // const suppliers = await prisma.accounts.findMany()
  return <Diary data={data}/>
};


export default Page;
