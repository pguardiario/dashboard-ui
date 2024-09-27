import { Layout } from "@/components/layout/layout";
import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>
    {children}
    <Toaster/>
  </Layout>;
}
