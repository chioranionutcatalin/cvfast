import { SideNavigation } from "./components/SideNavigation";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <SideNavigation />
      <main className={styles.main}>
        <h1>Welcome to FastCV</h1>
        <p>Select a section to start building your CV.</p>
      </main>
    </div>
  );
}
