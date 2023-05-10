import Layout from "@/components/layout";
import Head from "next/head";
import { getAllPostIDs, getPostData } from "@/lib/posts";
import Date from "@/components/date";
import utilStyles from "@/styles/utils.module.css";

// this function will render a post page
export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      {/* <article> */}
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

// export an async function called getStaticPaths from this page.
// and in this function we need to return a list of possible values for id

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostIDs();
  return {
    paths,
    fallback: false,
  };
}

// lastly, we need to export an async function called getStaticProps to fetch data for the blog post with a given id
export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
