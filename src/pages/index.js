import React from 'react';
import Link from 'next/link';
import Posts from '@/components/Posts';
import Head from 'next/head';

const Home = () => {

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>
          Sagar Haldar's Project
        </title>
      </Head>
      <h1 className="text-2xl font-bold text-center mb-6">
        Welcome to the Social Media Content Analyzer
      </h1>
      <div className="flex justify-center space-x-4">
        <Link href="/upload" className="bg-green-600 text-white py-2 px-4 rounded-md">
            Click here to upload Pdf/Image from you local device to extract text from it.
        </Link>
      </div>
      <div>
        <Posts/>
      </div>
    </div>
  );
};

export default Home;
