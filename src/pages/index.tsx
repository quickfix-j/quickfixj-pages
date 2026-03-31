import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

function HeroBanner() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Enterprise FIX Engine</div>
          <ThemedImage
            className={styles.heroLogo}
            alt="QuickFIX/J Logo"
            sources={{
              light: useBaseUrl('/img/logo.png'),
              dark: useBaseUrl('/img/logo-dark.png'),
            }}
          />
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroSubtitle}>  
            {siteConfig.tagline}
          </p>
          <p className={styles.heroDescription}>  
            The premier open-source Java implementation of the FIX Protocol. Connect to exchanges, route orders, and process high-frequency market data with confidence.
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.heroPrimary} to="/docs/overview">
              Get Started →
            </Link>
            <Link className={styles.heroSecondary} to="/docs/tutorials">
              View Tutorials
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

const protocolFeatures = [
  {
    badge: 'FIX 4.x – FIXLatest',
    color: '#2563eb',
    title: 'FIX 4.x · 5.x · FIXLatest & FIXT',
    description:
      'Comprehensive coverage from FIX 4.0 through FIX 5.0 SP2, FIXLatest, and FIXT 1.1. Robust session management, sequence tracking, message recovery, and fully customizable DataDictionaries across every major protocol version.',
  },
  {
    badge: 'Orchestra',
    color: '#10b981',
    title: 'Orchestra Code Generation',
    description:
      'Generate type-safe Java message and field classes directly from FIX Orchestra specification files. Build QuickFIX/J message libraries from any Orchestra-compliant protocol definition.',
  },
  {
    badge: 'MINA',
    color: '#f59e0b',
    title: 'NIO via Apache MINA',
    description:
      'High-throughput asynchronous networking capable of managing thousands of concurrent FIX sessions with minimal thread overhead.',
  },
  {
    badge: 'JMX',
    color: '#8b5cf6',
    title: 'JMX Monitoring',
    description:
      'Real-time introspection. Monitor session states, sequence numbers, and trigger manual logons/logouts without JVM restarts.',
  },
];

const coreFeatures = [
  {
    icon: '⚡',
    title: 'High Performance',
    description:
      'Engineered for high-throughput, resilient environments. Fully compatible with modern JVMs and optimized for multi-threading to handle massive FIX message volumes.',
  },
  {
    icon: '🏦',
    title: 'Enterprise Grade',
    description:
      'A battle-tested engine used by major financial institutions, exchanges, and trading firms worldwide. Provides extensive logging, persistence, and monitoring hooks.',
  },
  {
    icon: '🧩',
    title: 'Pluggable Architecture',
    description:
      'Customize message stores (File, JDBC, Memory), logging (File, SLF4J, Screen), and threading models to suit your specific architectural requirements.',
  },
  {
    icon: '☕',
    title: '100% Java',
    description:
      'Built entirely in Java, leveraging the power and portability of the JVM. No native libraries or complex JNI dependencies required.',
  },
  {
    icon: '🛠️',
    title: 'Message Cracker',
    description:
      'Avoid tedious string parsing. QuickFIX/J provides type-safe message handlers to route incoming messages directly to business logic components.',
  },
  {
    icon: '📖',
    title: 'Custom Dictionaries',
    description:
      'Exchanges rarely follow standard FIX perfectly. Easily inject custom XML DataDictionaries to support proprietary tags and message types.',
  },
];

const techStack = [
  { name: 'Java', desc: 'Core Language' },
  { name: 'Apache MINA', desc: 'NIO Transport' },
  { name: 'SLF4J', desc: 'Logging Facade' },
  { name: 'JMX', desc: 'Management' },
  { name: 'Maven / Gradle', desc: 'Build Systems' },
];

function ProtocolSection() {
  return (
    <section className={styles.protocols}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Comprehensive FIX Coverage</h2>
          <p>Support for every major version of the protocol with robust networking</p>
        </div>
        <div className={styles.protocolGrid}>
          {protocolFeatures.map((item, idx) => (
            <div key={idx} className={styles.protocolCard}>
              <span className={styles.protocolBadge} style={{ backgroundColor: item.color }}>
                {item.badge}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Built for Trading Systems</h2>
          <p>Enterprise capabilities for mission-critical order routing and market data</p>
        </div>
        <div className={styles.featuresGrid}>
          {coreFeatures.map((item, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className={styles.architecture}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Engine Architecture</h2>
          <p>Clean separation of concerns with extensibility at every layer</p>
        </div>
        <div className={styles.archDiagram}>
          <div className={styles.archLayer} data-layer="4">
            <div className={styles.archLabel}>Application Layer</div>
            <div className={styles.archClasses}>  
              quickfix.Application · MessageCracker · Business Logic
            </div>
          </div>
          <div className={styles.archLayer} data-layer="3">
            <div className={styles.archLabel}>Session Management</div>
            <div className={styles.archClasses}>
              quickfix.Session · State Tracking · Message Recovery
            </div>
          </div>
          <div className={styles.archLayer} data-layer="2">
            <div className={styles.archLabel}>Persistence & Logging</div>
            <div className={styles.archClasses}>
              MessageStore (File, JDBC, Memory) · Log (SLF4J, File, Screen)
            </div>
          </div>
          <div className={styles.archLayer} data-layer="1">
            <div className={styles.archLabel}>Transport Layer</div>
            <div className={styles.archClasses}>
              SocketInitiator / SocketAcceptor · Apache MINA (NIO)
            </div>
          </div>
        </div>
        <div className={styles.archCta}>
          <Link to="/docs/architecture">Explore Full Architecture →</Link>
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section className={styles.techStack}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Technology Stack</h2>
          <p>Modern, battle-tested libraries for enterprise reliability</p>
        </div>
        <div className={styles.techGrid}>
          {techStack.map((item, idx) => (
            <div key={idx} className={styles.techPill}>
              <span className={styles.techName}>{item.name}</span>
              <span className={styles.techDesc}>{item.desc}</span>
            </div>
          ))}
        </div>
        <div className={styles.archCta}>
          <Link to="/docs/deep-tech-reference">Deep Tech Reference →</Link>
        </div>
      </div>
    </section>
  );
}

function QuickStartSection() {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Quick Start</h2>
          <p>Add QuickFIX/J to your project</p>
        </div>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`<!-- Add to your pom.xml -->
<dependency>
    <groupId>org.quickfixj</groupId>
    <artifactId>quickfixj-core</artifactId>
    <version>3.0.0</version>
</dependency>
<dependency>
    <groupId>org.quickfixj</groupId>
    <artifactId>quickfixj-messages-fix44</artifactId>
    <version>3.0.0</version>
</dependency>`}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="QuickFIX/J — The Open Source FIX Protocol Engine for Java."
    >
      <HeroBanner />
      <main>
        <ProtocolSection />
        <ArchitectureSection />
        <FeaturesSection />
        <TechStackSection />
        <QuickStartSection />
      </main>
    </Layout>
  );
}