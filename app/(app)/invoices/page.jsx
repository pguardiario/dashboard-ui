import prisma from "@/src/db";
import Wrapper from "@/components/common/Wrapper";
import InvoicesTable from "@/components/invoices/InvoicesTable"

const Page = async () => {
  const invoices = await prisma.invoices.findMany({
    // where: { status: {not: "deleted"} },
    orderBy:[
      {
        date: "desc"
      }
    ],
    take: 50
  })
  return <Wrapper>
    <InvoicesTable initRows={invoices}/>

  </Wrapper>
};


export default Page;
