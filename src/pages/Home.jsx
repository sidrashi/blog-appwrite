import { useEffect } from "react";
import service from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { setActivePosts, setActivePostsNeedsRefresh } from "../store/postSlice";

function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.activePosts);
  const needsRefresh = useSelector((state) => state.posts.activePostsNeedsRefresh)

  useEffect(() => {
    if (posts.length === 0 || needsRefresh) {
      service.getPosts().then((posts) => {
        if (posts) {
          dispatch(setActivePosts(posts.rows));
          dispatch(setActivePostsNeedsRefresh(false))
        }
      });
    }
  }, []);

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                No posts to show, please login or add post
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div className="p-2 w-1/4" key={post.$id}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
