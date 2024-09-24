import prisma from "@/src/db";
import SuppliersTable from "@/components/SuppliersTable"

const suppliers = async () => {
  const suppliers = await prisma.accounts.findMany()
  return <SuppliersTable rows={suppliers}/>
};


export default suppliers;
