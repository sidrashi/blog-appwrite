import { useEffect } from "react";
import service from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { setAllPostsNeedsRefresh, setAllPosts } from "../store/postSlice";

function AllPost() {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts.allPosts)
  const needsRefresh = useSelector((state) => state.posts.allPostsNeedsRefresh)
  
  useEffect(() => {
    if (posts.length === 0 || needsRefresh) {
      service.getPosts([]).then((posts) => {
        if (posts) {
          dispatch(setAllPosts(posts.rows))
          dispatch(setAllPostsNeedsRefresh(false))
        }
      });
    }
  }, []);
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4" >
            <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPost;
