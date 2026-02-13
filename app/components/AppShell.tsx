'use client';

import { ReactNode } from "react";
import { SideNavigation } from "./SideNavigation";
import styles from "./AppShell.module.css";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <SideNavigation />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
