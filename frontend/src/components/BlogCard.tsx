import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import Circle from "./Circle";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
}

const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate
}: BlogCardProps) => {
  return <Link to={`/blog/${id}`}>
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
      <div className="flex">
        <Avatar name={authorName} />

        <div className="font-extralight pl-2 text-sm flex justify-center flex-col">
          {authorName}
        </div>
        <div className="flex justify-center flex-col pl-2">
          <Circle />
        </div>
        <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
          {publishedDate}
        </div>
      </div>
      <div className="text-xl font-semibold pt-2">{title}</div>
      <div className="text-md font-thin">
        {content.length > 100 ? content.substring(0, 100) + "..." : content}
      </div>
      <div className="text-slate-500 text-sm font-thin pt-4">
        {Math.ceil(content.length / 100)} min read
      </div>
    </div>
    </Link>
};

export default BlogCard;
