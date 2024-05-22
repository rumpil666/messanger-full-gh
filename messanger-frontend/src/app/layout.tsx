import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "../styles/globals.scss";
import "../styles/reset.scss";
import "../styles/variables.scss";
import { ModalСonfirmation } from "@/components/ModalСonfirmation/ModalСonfirmation";
import { ModalInfo } from "@/components/ModalInfo/ModalInfo";

const jost = Jost({ subsets: ["latin"], variable: '--var-jost' });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(1);
  return (
    <html lang="ru">
      <body className={jost.variable}>
          <AntdRegistry>
            {children}
          </AntdRegistry>
          <ModalСonfirmation />
          <ModalInfo />
      </body>
    </html>
  );
}
