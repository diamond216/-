import type { Metadata } from "next";
import { PostPageView } from "@/components/post/PostPageView";
import { en } from "@/services/i18n/en";
import "./post.css";

export const metadata: Metadata = {
  title: en["page.post.title"],
  description: en["post.body"],
};

export default function Page() {
  return <PostPageView />;
}
