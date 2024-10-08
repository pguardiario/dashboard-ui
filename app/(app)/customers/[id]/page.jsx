import prisma from "@/src/db";
import Customer from "@/components/customers/Customer"
import Wrapper from "@/components/common/Wrapper"

const Page = async ({ params }) => {
  let id = Number(params.id)
  let customer = await prisma.customers.findFirst({where: {id}})
  let invoices = await prisma.invoices.findMany({where: {customerId: customer.id}})
  let vehicles = await prisma.vehicles.findMany({where: {customerId: customer.id}})
  return <Wrapper>
    <Customer data={customer} invoices={invoices} vehicles={vehicles}/>
  </Wrapper>
};


export default Page;

// [...el.querySelectorAll('[ng-model]')].map(x => x.getAttribute('ng-model'))

// [
//   "customer.name",
//   "customer.isCompany",
//   "customer.isnsurer",
//   "customer.abn",
//   "customer.tax_registration_number",
//   "customer.email",
//   "customer.mobile",
//   "customer.phone",
//   "customer.fax",
//   "customer.address",
//   "customer.street_address",
//   "customer.contact_name",
//   "customer.price_level",
//   "customer.payment_term",
//   "customer.discount_percentage",
//   "customer.business_source_id",
//   "business_source",
//   "customer.insurer_id",
//   "customer.third_party_account_number",
//   "customer.loyalty_auto_club",
//   "customer.loyalty_account_number",
//   "customer.credit_limit",
//   "customer.special_account_number",
//   "customer.driver_license",
//   "customer.payment_instruction",
//   "customer.require_order_number",
//   "customer.no_rounding",
//   "customer.disable_booking_reminder",
//   "customer.disable_service_reminder",
//   "customer.unsubscribed",
//   "customer.send_communications_to_driver"
// ]