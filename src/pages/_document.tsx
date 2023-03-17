import { Html, Head, Main, NextScript } from 'next/document';

// Note: Application-wide reactions cannot go here
function Document() {
  return (
    <Html>
      <Head />
      <body className="bg-gray-800 text-gray-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
