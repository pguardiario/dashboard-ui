import prisma from "@/src/db";
import Wrapper from "@/components/common/Wrapper";
import CustomersTable from "@/components/customers/CustomersTable"

const Page = async () => {
  const customers = await prisma.customers.findMany({
    // where: { status: {not: "deleted"} },
    orderBy:[
      {
        // date: "desc"
      }
    ],
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      address: true,

    }
    // take: 50
  })
  let balances = await prisma.$queryRaw`select "customerId", sum("amountDue") as balance from invoices group by "customerId"`

  for(let row of customers){
    row.balance = balances.find(b => b.customerId === row.id)?.balance || 0
    switch(true){
      case row.balance > 0: row.status = "hasBalance"; break
      case !!row.isCompany || row.isCompany === "Y": row.status = "isCompany"; break
      case !row.isCompany || row.isCompany === "N": row.status = "individualsOnly"; break
    }
  }
  return <Wrapper>
    <CustomersTable initRows={customers}/>

  </Wrapper>
};


export default Page;
