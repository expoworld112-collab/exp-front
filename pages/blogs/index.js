import Head from 'next/head';
import { withRouter } from 'next/router';
import Layout from '@/components/Layout';
import { listBlogsWithCategoriesAndTags } from '../../actions/blog';
import Card from '../../components/blog/Card';
import { DOMAIN, APP_NAME } from '../../config';
import styles from "../../styles/blogs.module.css";
import { useState } from 'react';

const Blogs = ({ blogs, router }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const head = () => (
    <Head>
      <title>{`Blogs - ${APP_NAME}`}</title>
      <meta name="description" content="Programming blogs and tutorials on React, Node, Next, Vue, PHP, Laravel, and web development" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta property="og:title" content={`Latest web development tutorials | ${APP_NAME}`} />
      <meta property="og:description" content="Programming blogs and tutorials on React, Node, Next, Vue, PHP, Laravel, and web development" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
    </Head>
  );

  const showAllBlogs = () => {
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    return blogs.slice(startIndex, endIndex).map((blog, i) => (
      <article key={i} className={styles.box}>
        <Card blog={blog} />
      </article>
    ));
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(blogs.length / blogsPerPage);
    const pageLinks = [];

    let startPage = Math.max(currentPage - 4, 1);
    let endPage = Math.min(startPage + 9, totalPages);

    if (endPage - startPage < 9) startPage = Math.max(endPage - 9, 1);

    for (let i = startPage; i <= endPage; i++) {
      pageLinks.push(
        <li key={i} className={currentPage === i ? styles.activePage : ''}>
          <button onClick={() => setCurrentPage(i)}>{i}</button>
        </li>
      );
    }

    return (
      <ul className={styles.pagination}>
        <li>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        </li>
        {pageLinks}
        <li>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </li>
      </ul>
    );
  };

  return (
    <>
      {head()}
      <Layout>
        <main className={styles.backImg}>
          <div className={styles.mtop}></div>
          <h1 style={{ textAlign: "center", color: "white" }}>All Blogs</h1>
          {renderPagination()}
          <div className={styles.grid}>{showAllBlogs()}</div>
          <br /><br />
        </main>
      </Layout>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const data = await listBlogsWithCategoriesAndTags();
    if (data.error) return { props: { blogs: [] } };

    const formattedBlogs = data.blogs.map(blog => ({
      ...blog,
      formattedDate: new Date(blog.date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
    }));

    return { props: { blogs: formattedBlogs } };
  } catch (err) {
    console.error(err);
    return { props: { blogs: [] } };
  }
}

export default withRouter(Blogs);
