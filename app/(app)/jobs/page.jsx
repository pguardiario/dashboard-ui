import prisma from "@/src/db";
import Jobs from "@/components/jobs/Jobs"

const Page = async () => {
  const jobs = await prisma.jobs.findMany({
    where: { status: {not: "deleted"} },
    orderBy:[
      {
        createdAt: "desc"
      }
    ]
  })
  return <Jobs initData={jobs}/>
};


export default Page;
