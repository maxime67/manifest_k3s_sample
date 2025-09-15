import clsx from 'clsx';
// import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// import HomepageFeatures from '@site/src/components/HomepageFeatures';

// import Heading from '@theme/Heading';
import styles from './index.module.css';
import {useEffect} from "react";
import {useHistory} from "@docusaurus/router";

export default function Home() {
    const history = useHistory();

    useEffect(() => {
        // Redirection immédiate vers la page nginx
        history.replace('Basics/nginx');
    }, [history]);

    // On peut retourner null ou un loader pendant la redirection
    return null;
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">

      </div>
    </header>
  );
}

// export default function Home() {
//   const {siteConfig} = useDocusaurusContext();
//   return (""
//     // <Layout
//     //   title={`Hello from ${siteConfig.title}`}
//     //   description="Description will go into a meta tag in <head />">
//     //   <HomepageHeader />
//     //   <main>
//     //     <HomepageFeatures />
//     //   </main>
//     // </Layout>
//   );
// }
