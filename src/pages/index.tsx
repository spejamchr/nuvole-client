import Link from 'next/link';

const Home: React.FC<{}> = () => (
  <main className="prose prose-invert px-8 py-4">
    <title>Nuvole</title>
    <h1>Nuvole</h1>
    <p>Keep a Private & Shareable Journal</p>
    <p>
      Nuvole is a free end-to-end encrypted journaling app with the ability to share specific
      entries or whole journals with other users—without your journals ever being readable by the
      Nuvole servers.
    </p>
    <p>
      Your journal entries are yours. You can export your journals & entries in several convenient
      formats, including plain text, markdown, and html.
    </p>
    <p>
      Our client is completely open source, and we encourage others to implement their own clients.
    </p>
    <p>
      <Link href="/app">Login here</Link>
    </p>
  </main>
);

export default Home;
